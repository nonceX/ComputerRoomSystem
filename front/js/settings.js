const Settings = {
  STORAGE_KEY: 'computer-room-layout-setting',

  DEFAULTS: {
    sideTheme: 'theme-dark',
    theme: '#409EFF',
    tagsView: true,
    fixedHeader: false,
    sidebarLogo: true,
    footerVisible: true
  },

  settings: null,

  init() {
    this.load();
    this.bindEvents();
  },

  // 读取并应用已保存配置
  load() {
    const saved = Utils.storage.get(this.STORAGE_KEY, {});
    this.settings = { ...this.DEFAULTS, ...saved };
    this.apply();
    this.syncControls();
  },

  // 将配置应用到 DOM
  apply() {
    const s = this.settings;

    // 侧边栏主题 + 主题色
    document.documentElement.setAttribute('data-side-theme', s.sideTheme);
    this.applyPrimaryColor(s.theme);

    // 开启页签
    const tagsView = document.getElementById('tags-view-container');
    if (tagsView) tagsView.style.display = s.tagsView ? '' : 'none';
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) mainContainer.classList.toggle('has-tags-view', s.tagsView);

    // 固定 Header
    const fixedHeader = document.getElementById('fixed-header');
    if (fixedHeader) fixedHeader.classList.toggle('is-fixed', s.fixedHeader);

    // 固定 Header 时 AppMain 需预留头部高度（含/不含标签页）
    // 高度从 CSS 变量读，改 --navbar-height / --tags-height 不用再动这里
    const appMain = document.getElementById('app-main');
    if (appMain) {
      if (s.fixedHeader) {
        const css = getComputedStyle(document.documentElement);
        const navbarH = parseFloat(css.getPropertyValue('--navbar-height')) || 64;
        const tagsH = parseFloat(css.getPropertyValue('--tags-height')) || 40;
        const headerH = s.tagsView ? navbarH + tagsH : navbarH;
        appMain.style.marginTop = headerH + 'px';
        appMain.style.height = 'calc(100vh - ' + headerH + 'px)';
      } else {
        appMain.style.marginTop = '';
        appMain.style.height = '';
      }
    }

    // 显示 Logo
    const logo = document.querySelector('.sidebar-logo-container');
    if (logo) logo.style.display = s.sidebarLogo ? '' : 'none';

    // 底部版权
    document.querySelectorAll('.copyright').forEach(el => {
      el.style.display = s.footerVisible ? '' : 'none';
    });
  },

  // 主题色：--color-primary 及其半透明衍生色
  applyPrimaryColor(color) {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', color);
    root.style.setProperty('--color-primary-light', color + '1a');
    root.style.setProperty('--color-primary-dark-bg', color + '33');
  },

  // 用当前配置同步抽屉控件
  syncControls() {
    const s = this.settings;

    document.querySelectorAll('.theme-style-item').forEach(el => {
      el.classList.toggle('selected', el.dataset.theme === s.sideTheme);
    });

    const picker = document.getElementById('theme-color-picker');
    if (picker) picker.value = s.theme;

    const setCheck = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!val;
    };
    setCheck('setting-tags-view', s.tagsView);
    setCheck('setting-fixed-header', s.fixedHeader);
    setCheck('setting-sidebar-logo', s.sidebarLogo);
    setCheck('setting-footer-visible', s.footerVisible);
  },

  // 读取抽屉控件当前值
  collect() {
    const getCheck = (id, fallback) => {
      const el = document.getElementById(id);
      return el === null ? fallback : el.checked;
    };
    return {
      sideTheme: document.querySelector('.theme-style-item.selected')?.dataset.theme || this.settings.sideTheme,
      theme: document.getElementById('theme-color-picker')?.value || this.settings.theme,
      tagsView: getCheck('setting-tags-view', this.settings.tagsView),
      fixedHeader: getCheck('setting-fixed-header', this.settings.fixedHeader),
      sidebarLogo: getCheck('setting-sidebar-logo', this.settings.sidebarLogo),
      footerVisible: getCheck('setting-footer-visible', this.settings.footerVisible)
    };
  },

  // 抽屉改动即时预览（不写存储）
  preview() {
    this.settings = this.collect();
    this.apply();
  },

  save() {
    this.settings = this.collect();
    Utils.storage.set(this.STORAGE_KEY, this.settings);
    this.apply();
    this.syncControls();
    this.flashSaved();
  },

  reset() {
    this.settings = { ...this.DEFAULTS };
    Utils.storage.set(this.STORAGE_KEY, this.settings);
    this.apply();
    this.syncControls();
  },

  open() {
    this.syncControls();
    const drawer = document.getElementById('settings-drawer');
    const overlay = document.getElementById('settings-drawer-overlay');
    if (!drawer) return;
    drawer.style.display = 'block';
    overlay.style.display = 'block';
    // 先复位到关闭位再滑入，保证每次都能播放动画
    drawer.classList.add('closed');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      drawer.classList.remove('closed');
    }));
  },

  close() {
    const drawer = document.getElementById('settings-drawer');
    const overlay = document.getElementById('settings-drawer-overlay');
    if (!drawer) return;
    drawer.classList.add('closed');
    setTimeout(() => {
      drawer.style.display = 'none';
      overlay.style.display = 'none';
    }, 300);
  },

  // 保存成功提示：按钮文字短暂变化
  flashSaved() {
    const btn = document.getElementById('btn-save-settings');
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = '已保存 ✓';
    clearTimeout(this._flashTimer);
    this._flashTimer = setTimeout(() => { btn.innerHTML = original; }, 1500);
  },

  bindEvents() {
    // 主题预览项
    document.querySelectorAll('.theme-style-item').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.theme-style-item').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');
        this.preview();
      });
    });

    // 主题色即时预览
    document.getElementById('theme-color-picker')?.addEventListener('input', () => this.preview());

    // 开关即时预览
    ['setting-tags-view', 'setting-fixed-header', 'setting-sidebar-logo', 'setting-footer-visible']
      .forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => this.preview());
      });

    // 保存 / 重置
    document.getElementById('btn-save-settings')?.addEventListener('click', () => this.save());
    document.getElementById('btn-reset-settings')?.addEventListener('click', () => this.reset());

    // 点击遮罩关闭
    document.getElementById('settings-drawer-overlay')?.addEventListener('click', () => this.close());

    // Esc 关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }
};
