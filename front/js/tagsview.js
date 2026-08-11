const TagsView = {
  visitedViews: [],           // 已打开的标签列表
  currentPath: null,          // 当前激活路径
  contextMenuPath: null,      // 右键菜单操作的标签路径

  init() {
    this.wrapper = document.getElementById('tags-view-wrapper');
    this.wrapper.innerHTML = '';   // 清掉 HTML 里的静态占位标签
    this.bindEvents();
  },

  // 添加标签（由 AppRouter.navigate 调用）
  addView(route) {
    if (!this.visitedViews.some(v => v.path === route.path)) {
      this.visitedViews.push({
        path: route.path,
        name: route.name || '',
        title: route.title,
        icon: route.icon || '',
        affix: route.affix || false
      });
    }
    this.currentPath = route.path;
    this.render();
  },

  // 关闭单个标签
  closeView(path) {
    const idx = this.visitedViews.findIndex(v => v.path === path);
    if (idx === -1 || this.visitedViews[idx].affix) return;   // 固定标签不可关闭

    this.visitedViews.splice(idx, 1);

    // 关闭的是当前标签 → 激活相邻标签
    if (path === this.currentPath) {
      const next = this.visitedViews[Math.min(idx, this.visitedViews.length - 1)];
      this.activate(next ? next.path : AppRouter.HOME_PATH);
    } else {
      this.render();
    }
  },

  closeOthers(path) {
    this.visitedViews = this.visitedViews.filter(v => v.path === path || v.affix);
    this.activate(path);
  },

  closeLeft(path) {
    const idx = this.visitedViews.findIndex(v => v.path === path);
    this.visitedViews = this.visitedViews.filter((v, i) => i >= idx || v.affix);
    this.activate(path);
  },

  closeRight(path) {
    const idx = this.visitedViews.findIndex(v => v.path === path);
    this.visitedViews = this.visitedViews.filter((v, i) => i <= idx || v.affix);
    this.activate(path);
  },

  // 关闭全部（保留 affix 首页）
  closeAll() {
    this.visitedViews = this.visitedViews.filter(v => v.affix);
    this.activate(this.visitedViews[0]?.path || AppRouter.HOME_PATH);
  },

  // 切换到某个标签：交给路由，由它统一更新菜单/面包屑/内容
  activate(path) {
    this.render();
    AppRouter.navigate(path);
  },

  // 重画所有标签
  render() {
    this.wrapper.innerHTML = this.visitedViews.map(v => {
      const title = Utils.escapeHTML(v.title);
      return `
      <span class="tags-view-item${v.path === this.currentPath ? ' active' : ''}${v.affix ? ' affix' : ''}"
            data-path="${v.path}"
            title="${title}">
        ${title}
        ${!v.affix ? '<i class="fa fa-times tag-close"></i>' : ''}
      </span>`;
    }).join('');
    this.scrollToActive();
  },

  // 滚动标签区，让激活标签可见
  scrollToActive() {
    const activeEl = this.wrapper.querySelector('.tags-view-item.active');
    if (!activeEl) {
      this.updateArrowState();
      return;
    }

    const wrapperRect = this.wrapper.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    if (activeRect.left < wrapperRect.left) {
      this.wrapper.scrollLeft -= (wrapperRect.left - activeRect.left + 10);
    } else if (activeRect.right > wrapperRect.right) {
      this.wrapper.scrollLeft += (activeRect.right - wrapperRect.right + 10);
    }
    this.updateArrowState();
  },

  // 更新左右箭头可用状态
  updateArrowState() {
    const canLeft = this.wrapper.scrollLeft > 0;
    const canRight = this.wrapper.scrollLeft <
      (this.wrapper.scrollWidth - this.wrapper.clientWidth - 1);

    document.getElementById('tags-scroll-left').classList.toggle('disabled', !canLeft);
    document.getElementById('tags-scroll-right').classList.toggle('disabled', !canRight);
  },

  // 显示右键菜单
  showContextMenu(x, y) {
    this.closeContextMenu();

    const idx = this.visitedViews.findIndex(v => v.path === this.contextMenuPath);
    if (idx === -1) return;
    const tag = this.visitedViews[idx];

    // 首页固定在最左，它右边那个才算"第一个可关闭的"
    const firstClosable = this.visitedViews[0]?.affix ? 1 : 0;
    const isFirst = idx <= firstClosable;
    const isLast = idx === this.visitedViews.length - 1;

    const items = [
      ...(tag.affix ? [] : [{ text: '关闭当前', icon: 'fa-times', action: () => this.closeView(tag.path) }]),
      { text: '关闭其他', icon: 'fa-circle-o', action: () => this.closeOthers(tag.path) },
      ...(isFirst ? [] : [{ text: '关闭左侧', icon: 'fa-arrow-left', action: () => this.closeLeft(tag.path) }]),
      ...(isLast ? [] : [{ text: '关闭右侧', icon: 'fa-arrow-right', action: () => this.closeRight(tag.path) }]),
      { text: '全部关闭', icon: 'fa-times-circle', action: () => this.closeAll() }
    ];

    const menu = document.createElement('ul');
    menu.className = 'contextmenu';
    menu.innerHTML = items.map(item =>
      `<li><i class="fa ${item.icon}"></i> ${item.text}</li>`
    ).join('');

    menu.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      items[[...menu.children].indexOf(li)].action();
      this.closeContextMenu();
    });

    document.body.appendChild(menu);

    // 贴边时翻转位置，避免菜单溢出视口
    const { width, height } = menu.getBoundingClientRect();
    menu.style.left = Math.min(x, window.innerWidth - width - 5) + 'px';
    menu.style.top = (y + height > window.innerHeight ? y - height : y) + 'px';

    this.contextMenu = menu;
  },

  closeContextMenu() {
    this.contextMenu?.remove();
    this.contextMenu = null;
  },

  bindEvents() {
    // 事件委托：标签由 render() 重建，委托到容器上就不用每次重新绑定
    this.wrapper.addEventListener('click', (e) => {
      const el = e.target.closest('.tags-view-item');
      if (!el) return;
      if (e.target.classList.contains('tag-close')) {
        this.closeView(el.dataset.path);
      } else {
        AppRouter.navigate(el.dataset.path);
      }
    });

    this.wrapper.addEventListener('contextmenu', (e) => {
      const el = e.target.closest('.tags-view-item');
      if (!el) return;
      e.preventDefault();
      this.contextMenuPath = el.dataset.path;
      this.showContextMenu(e.clientX, e.clientY);
    });

    this.wrapper.addEventListener('scroll', () => this.updateArrowState());

    // 鼠标滚轮横向滚动标签区
    this.wrapper.addEventListener('wheel', (e) => {
      if (this.wrapper.scrollWidth <= this.wrapper.clientWidth) return;
      e.preventDefault();
      this.wrapper.scrollLeft += e.deltaY || e.deltaX;
    }, { passive: false });

    document.getElementById('tags-scroll-left').addEventListener('click', () => {
      this.wrapper.scrollBy({ left: -200, behavior: 'smooth' });
    });

    document.getElementById('tags-scroll-right').addEventListener('click', () => {
      this.wrapper.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // 点击别处 / 按 Esc 关闭右键菜单
    document.addEventListener('click', () => this.closeContextMenu());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeContextMenu();
    });
    window.addEventListener('resize', () => this.updateArrowState());
  }
};
