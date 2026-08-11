// 首页（仪表盘）页面逻辑
const DashboardPage = {
  PHOTO_DB_NAME: 'computer-room-dashboard-photos',
  PHOTO_STORE_NAME: 'photos',
  MAX_PHOTO_SIZE: 10 * 1024 * 1024,
  images: [],
  current: 0,
  dbPromise: null,
  loadVersion: 0,

  init() {
    this.releaseImageUrls();
    this.current = 0;
    this.loadImages();
    this.bindEvents();
    this.renderCurrentUser();
    this.loadSummary();
    this.loadActivities();
  },

  async loadSummary() {
    const res = await Utils.get('/api/dashboard/summary');
    if (!res) return;

    this.setText('dashboard-user-count', res.data.userCount);
    this.setText('dashboard-equipment-quantity', res.data.equipmentQuantity);
    this.setText('dashboard-attendance-count', res.data.todayAttendanceCount);
    this.setText('dashboard-low-stock-count', res.data.lowStockCount);
  },

  setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  },

  async loadActivities() {
    const res = await Utils.get('/api/dashboard/activities', { limit: 10 });
    if (!res) return;

    const container = document.getElementById('dashboard-activities');
    if (!container) return;
    const activities = Array.isArray(res.data) ? res.data : [];
    if (activities.length === 0) {
      container.innerHTML = '<li class="activity-item text-muted">暂无最近动态</li>';
      return;
    }

    container.innerHTML = activities.map(item => `
      <li class="activity-item">
        <span class="activity-dot ${this.activityDotClass(item)}"></span>
        ${Utils.escapeHTML(item.description)}
        <span class="activity-time">${Utils.escapeHTML(this.formatActivityTime(item.createdAt))}</span>
      </li>
    `).join('');
  },

  activityDotClass(item) {
    if (item.action === 'OUT') return 'activity-dot--red';
    if (item.module === 'goods') return 'activity-dot--orange';
    if (item.module === 'equipment') return 'activity-dot--blue';
    return 'activity-dot--green';
  },

  formatActivityTime(value) {
    return value ? String(value).replace('T', ' ').slice(0, 16) : '';
  },

  renderCurrentUser() {
    const user = Utils.storage.get('login-user', {});
    const container = document.getElementById('dashboard-current-user');
    if (container) container.textContent = user.name || user.username || '未登录';
  },

  openPhotoDb() {
    if (!window.indexedDB) {
      return Promise.reject(new Error('当前浏览器不支持照片存储'));
    }
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.PHOTO_DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.PHOTO_STORE_NAME)) {
          db.createObjectStore(this.PHOTO_STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('照片存储打开失败'));
    }).catch(error => {
      this.dbPromise = null;
      throw error;
    });
    return this.dbPromise;
  },

  async loadImages(preferredIndex = 0) {
    const version = ++this.loadVersion;
    this.releaseImageUrls();

    try {
      const db = await this.openPhotoDb();
      const records = await new Promise((resolve, reject) => {
        const request = db.transaction(this.PHOTO_STORE_NAME, 'readonly')
          .objectStore(this.PHOTO_STORE_NAME)
          .getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error || new Error('照片读取失败'));
      });
      if (version !== this.loadVersion) return;

      this.images = records
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
        .map(item => ({ ...item, url: URL.createObjectURL(item.blob) }));
      this.current = Math.min(
        Math.max(preferredIndex, 0),
        Math.max(this.images.length - 1, 0)
      );
    } catch (error) {
      console.error('[Dashboard photos]', error);
      this.images = [];
      this.current = 0;
    }
    this.render();
  },

  releaseImageUrls() {
    this.images.forEach(item => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    this.images = [];
  },

  async savePhotos(files) {
    const db = await this.openPhotoDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(this.PHOTO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.PHOTO_STORE_NAME);
      const timestamp = Date.now();

      files.forEach((file, index) => {
        store.add({
          name: file.name,
          type: file.type,
          blob: file,
          createdAt: timestamp + index
        });
      });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('照片保存失败'));
      transaction.onabort = () => reject(transaction.error || new Error('照片保存失败'));
    });
  },

  async deletePhoto(id) {
    const db = await this.openPhotoDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(this.PHOTO_STORE_NAME, 'readwrite');
      transaction.objectStore(this.PHOTO_STORE_NAME).delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('照片删除失败'));
      transaction.onabort = () => reject(transaction.error || new Error('照片删除失败'));
    });
  },

  render() {
    const placeholder = document.getElementById('photoPlaceholder');
    const main = document.getElementById('photoMain');
    const nav = document.getElementById('photoNav');
    const counter = document.getElementById('photoCounter');
    const deleteBtn = document.getElementById('photoDeleteBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!this.images.length) {
      if (placeholder) placeholder.style.display = '';
      if (main) main.style.display = 'none';
      if (nav) nav.style.display = 'none';
      if (counter) counter.textContent = '';
      if (deleteBtn) deleteBtn.disabled = true;
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    if (placeholder) placeholder.style.display = 'none';
    if (main) main.style.display = '';
    if (nav) nav.style.display = '';
    if (deleteBtn) deleteBtn.disabled = false;
    if (prevBtn) prevBtn.disabled = this.images.length < 2;
    if (nextBtn) nextBtn.disabled = this.images.length < 2;
    this.renderThumbs();
    this.show(this.current);
  },

  renderThumbs() {
    const thumbs = document.getElementById('photoThumbs');
    if (!thumbs) return;
    thumbs.innerHTML = '';

    this.images.forEach((item, index) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'photo-thumb';
      thumb.title = item.name || `照片 ${index + 1}`;

      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.name || `照片 ${index + 1}`;
      thumb.appendChild(img);
      thumb.addEventListener('click', () => this.show(index));
      thumbs.appendChild(thumb);
    });
  },

  show(index) {
    const length = this.images.length;
    if (!length) return;
    this.current = (index + length) % length;

    const imageEl = document.getElementById('photoImage');
    const counter = document.getElementById('photoCounter');
    if (!imageEl || !counter) return;

    const item = this.images[this.current];
    imageEl.src = item.url;
    imageEl.alt = item.name || `机房照片 ${this.current + 1}`;
    counter.textContent = `${this.current + 1} / ${length}`;

    document.querySelectorAll('.photo-thumb').forEach((thumb, thumbIndex) => {
      thumb.classList.toggle('active', thumbIndex === this.current);
    });
  },

  bindEvents() {
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    const imageEl = document.getElementById('photoImage');
    const uploadBtn = document.getElementById('photoUploadBtn');
    const deleteBtn = document.getElementById('photoDeleteBtn');
    const fileInput = document.getElementById('photoFileInput');

    if (prev) prev.addEventListener('click', () => this.show(this.current - 1));
    if (next) next.addEventListener('click', () => this.show(this.current + 1));
    if (imageEl) imageEl.addEventListener('contextmenu', event => this.showContextMenu(event));
    if (uploadBtn && fileInput) uploadBtn.addEventListener('click', () => fileInput.click());
    if (fileInput) fileInput.addEventListener('change', () => this.handleUpload(fileInput));
    if (deleteBtn) deleteBtn.addEventListener('click', () => this.handleDelete());

    if (!this._bound) {
      this._bound = true;
      document.addEventListener('click', () => this.hideContextMenu());
    }
  },

  async handleUpload(fileInput) {
    const selected = Array.from(fileInput.files || []);
    fileInput.value = '';
    if (!selected.length) return;

    const invalidType = selected.find(file => !file.type.startsWith('image/'));
    if (invalidType) {
      alert(`“${invalidType.name}”不是图片文件`);
      return;
    }
    const oversized = selected.find(file => file.size > this.MAX_PHOTO_SIZE);
    if (oversized) {
      alert(`“${oversized.name}”超过 10MB，无法上传`);
      return;
    }

    const startIndex = this.images.length;
    try {
      await this.savePhotos(selected);
      await this.loadImages(startIndex);
    } catch (error) {
      console.error('[Dashboard photos]', error);
      alert('照片保存失败，请检查浏览器存储空间');
    }
  },

  async handleDelete() {
    const item = this.images[this.current];
    if (!item || !confirm(`确定删除“${item.name || '当前照片'}”吗？`)) return;

    const nextIndex = Math.min(this.current, this.images.length - 2);
    try {
      await this.deletePhoto(item.id);
      await this.loadImages(Math.max(nextIndex, 0));
    } catch (error) {
      console.error('[Dashboard photos]', error);
      alert('照片删除失败，请稍后重试');
    }
  },

  showContextMenu(event) {
    event.preventDefault();
    this.hideContextMenu();
    const item = this.images[this.current];
    if (!item) return;

    const menu = document.createElement('div');
    menu.className = 'photo-contextmenu';
    menu.style.left = event.clientX + 'px';
    menu.style.top = event.clientY + 'px';

    const viewItem = document.createElement('div');
    viewItem.className = 'photo-menu-item';
    viewItem.textContent = '查看照片';
    viewItem.addEventListener('click', () => window.open(item.url, '_blank'));

    const saveItem = document.createElement('div');
    saveItem.className = 'photo-menu-item';
    saveItem.textContent = '保存照片';
    saveItem.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.name || '机房照片';
      link.click();
    });

    menu.appendChild(viewItem);
    menu.appendChild(saveItem);
    document.body.appendChild(menu);
  },

  hideContextMenu() {
    document.querySelectorAll('.photo-contextmenu').forEach(menu => menu.remove());
  }
};

window.DashboardPage = DashboardPage;
