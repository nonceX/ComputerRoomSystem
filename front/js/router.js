const AppRouter = {
  currentPath: null,
  HOME_PATH: '/dashboard',

  // 页面文件 → 全局模块名（无 JS 的页面不登记）
  PAGE_MODULES: {
    dashboard: 'DashboardPage',
    person: 'PersonPage',
    permission: 'PermissionPage',
    goods: 'GoodsPage',
    equipment: 'EquipmentPage',
    attendance: 'AttendancePage',
    wiki: 'WikiPage',
    user: 'UserPage'
  },

  init() {
    this.navigate(this.HOME_PATH);
  },

  // 唯一的导航入口：菜单点击、标签页点击、面包屑点击都走这里
  navigate(path) {
    if (path === '/goods/stock') path = '/goods/list';
    const item = MenuTree.find(path);
    if (!item) return;
    if (!AccessControl.canAccess(item)) {
      this.denyAccess();
      return;
    }
    if (path === this.currentPath) return;

    this.currentPath = path;

    TagsView.addView({
      path: item.path,
      name: item.name,
      title: item.meta.title,
      icon: item.meta.icon,
      affix: item.meta.affix || false
    });
    MenuRenderer.setActive(path);
    Navbar.updateBreadcrumb(this.resolveBreadcrumb(path));
    this.loadPage(path);

    // 移动端点击菜单后收起侧边栏
    Sidebar.closeMobile?.();
  },

  async loadPage(path) {
    if (!this.canAccessPath(path)) {
      this.denyAccess();
      return;
    }

    const appMain = document.getElementById('app-main');
    // path → 文件名；个别路径走 FILE_MAP 映射
    const pageName = this.pageName(path);

    let html;
    try {
      const response = await fetch(`pages/${pageName}.html`);
      html = response.ok ? await response.text() : this.placeholderHTML(path);
    } catch (err) {
      html = this.placeholderHTML(path);
    }

    // 竞态保护：慢请求返回时用户可能已切走，丢弃过期响应
    if (path !== this.currentPath) return;

    appMain.innerHTML = html;
    appMain.insertAdjacentHTML('beforeend',
      '<div class="copyright">Copyright © 2026 机房综合管理系统 All Rights Reserved.</div>');
    // 重新应用布局配置（如「显示底部版权」开关）
    Settings.apply?.();
    appMain.scrollTop = 0;

    // 页面脚本初始化（页面 JS 已全局加载，进入页面时调用其 init）
    this.initPage(path);
  },

  initPage(path) {
    const pageName = this.pageName(path);
    const moduleName = this.PAGE_MODULES[pageName];
    const mod = window[moduleName];
    if (mod && typeof mod.init === 'function') {
      mod.init();
    }
  },

  // path → HTML 文件名（默认「去斜杠转短横线」，个别路径单独映射）
  pageName(path) {
    const FILE_MAP = { '/goods/list': 'goods' };
    return FILE_MAP[path] || path.replace(/^\//, '').replace(/\//g, '-');
  },

  placeholderHTML(path) {
    const item = MenuTree.find(path);
    return `
      <div class="search-card">
        <h2>${item ? item.meta.title : path}</h2>
        <p>页面内容正在开发中...</p>
      </div>
    `;
  },

  canAccessPath(path) {
    return AccessControl.canAccess(MenuTree.find(path));
  },

  denyAccess() {
    alert('当前账号无权访问该页面');
    if (!this.currentPath && this.canAccessPath(this.HOME_PATH)) {
      this.navigate(this.HOME_PATH);
    }
  },

  resolveBreadcrumb(path) {
    const home = { path: this.HOME_PATH, title: '首页' };
    if (path === this.HOME_PATH) return [home];

    const chain = MenuTree.chain(path);
    return chain ? [home, ...chain] : [home, { path, title: '未知页面' }];
  }
};
