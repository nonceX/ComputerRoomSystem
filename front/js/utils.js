const Utils = {
  AVATAR_KEY_PREFIX: 'user-avatar:',

  avatarKey() {
    const user = this.storage.get('login-user', {});
    return this.AVATAR_KEY_PREFIX + (user.id || user.username || 'guest');
  },

  // 每个用户使用独立头像；没有上传时返回 null，由界面显示默认图标。
  getAvatar() {
    const saved = this.storage.get(this.avatarKey());
    if (saved) return saved;

    // 迁移旧版本保存的有效头像，不迁移已经失效的图片路径。
    const legacy = this.storage.get('user-avatar');
    if (typeof legacy === 'string' && legacy.startsWith('data:image/')) {
      this.storage.set(this.avatarKey(), legacy);
      this.storage.remove('user-avatar');
      return legacy;
    }
    if (legacy) this.storage.remove('user-avatar');
    return null;
  },

  setAvatar(src) {
    return this.storage.set(this.avatarKey(), src);
  },

  removeAvatar() {
    this.storage.remove(this.avatarKey());
  },

  // 转义动态文本，避免拼进 innerHTML 时被当成标签解析
  escapeHTML(str) {
    return String(str ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  },

  // localStorage 读写：包一层，避免隐私模式下抛异常打断流程
  storage: {
    get(key, fallback = null) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (err) {
        return fallback;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        // 存储不可用（隐私模式 / 配额满）时静默降级
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        // 同上
      }
    }
  },

  // 高频事件（resize / scroll / 搜索输入）降频
  debounce(fn, delay = 300) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  throttle(fn, interval = 200) {
    let last = 0;
    return function (...args) {
      const now = performance.now();
      if (now - last < interval) return;
      last = now;
      fn.apply(this, args);
    };
  },

  // ===== 后端接口请求 =====
  API_BASE: 'http://localhost:8080',

  async request(path, options = {}) {
    const token = this.storage.get('login-token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(this.API_BASE + path, { ...options, headers });

      if (res.status === 401) {
        this.storage.remove('login-token');
        this.storage.remove('login-user');
        alert('登录已过期，请重新登录');
        location.href = 'login.html';
        return null;
      }

      const body = await res.json();
      if (body.code !== 200) {
        alert(body.message || '请求失败');
        return null;
      }
      return body;
    } catch (err) {
      console.error('[API]', path, err);
      alert('无法连接服务器，请确认后端已启动');
      return null;
    }
  },

  get(path, params) {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ) : '';
    return this.request(path + query);
  },

  post(path, data) {
    return this.request(path, { method: 'POST', body: JSON.stringify(data) });
  },

  put(path, data) {
    return this.request(path, { method: 'PUT', body: JSON.stringify(data) });
  },

  del(path, data) {
    return this.request(path, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined
    });
  },

  // 日期格式化：yyyy-MM-dd HH:mm:ss
  formatDate(date, pattern = 'yyyy-MM-dd HH:mm:ss') {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';

    const pad = n => String(n).padStart(2, '0');
    return pattern
      .replace('yyyy', d.getFullYear())
      .replace('MM', pad(d.getMonth() + 1))
      .replace('dd', pad(d.getDate()))
      .replace('HH', pad(d.getHours()))
      .replace('mm', pad(d.getMinutes()))
      .replace('ss', pad(d.getSeconds()));


  }
};
