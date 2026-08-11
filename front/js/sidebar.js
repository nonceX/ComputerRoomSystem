const Sidebar = {
  STORAGE_KEY: 'sidebar-collapsed',
  collapsed: false,

  isMobile() {
    return window.matchMedia('(max-width: 991px)').matches;
  },

  init() {
    this.el = document.getElementById('sidebar');
    this.icon = document.querySelector('.hamburger-icon');
    this.mask = document.getElementById('drawer-bg');

    // 移动端以完整菜单形态从左侧滑入，不应用折叠态
    if (!this.isMobile()) {
      this.apply(Utils.storage.get(this.STORAGE_KEY, false));
    }

    document.getElementById('hamburger-btn').addEventListener('click', () => {
      this.toggle();
    });

    // 移动端点击遮罩收起
    this.mask.addEventListener('click', () => {
      this.closeMobile();
    });

    // 窗口尺寸变化时清理移动端状态
    window.addEventListener('resize', () => {
      if (this.isMobile()) {
        this.el.classList.remove('collapsed');
      } else {
        this.el.classList.remove('mobile-open');
        this.icon.classList.remove('is-active');
        this.mask.style.display = 'none';
      }
    });
  },

  toggle() {
    if (this.isMobile()) {
      this.toggleMobile();
    } else {
      this.apply(!this.collapsed);
      Utils.storage.set(this.STORAGE_KEY, this.collapsed);
    }
  },

  toggleMobile() {
    const open = !this.el.classList.contains('mobile-open');
    this.el.classList.toggle('mobile-open', open);
    this.icon.classList.toggle('is-active', open);
    this.mask.style.display = open ? 'block' : 'none';
  },

  closeMobile() {
    this.el.classList.remove('mobile-open');
    this.icon.classList.remove('is-active');
    this.mask.style.display = 'none';
  },

  close() {
    if (this.isMobile()) {
      this.closeMobile();
      return;
    }
    this.apply(true);
    Utils.storage.set(this.STORAGE_KEY, true);
  },

  open() {
    this.apply(false);
    Utils.storage.set(this.STORAGE_KEY, false);
  },

  // 只改 DOM，不写存储：初始化恢复状态时复用
  apply(collapsed) {
    this.collapsed = collapsed;
    this.el.classList.toggle('collapsed', collapsed);
    this.icon.classList.toggle('is-active', collapsed);
  }
};
