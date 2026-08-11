const App = {
  async init() {
    // 未登录直接踢回登录页
    if (!this.guard()) return;

    await AccessControl.init();

    // 顺序有讲究：菜单先渲染出 DOM，路由才能高亮到对应菜单项
    MenuRenderer.render(AccessControl.filterMenu(), document.getElementById('sidebar-menu'));
    Sidebar.init();
    Navbar.init();
    TagsView.init();
    Settings.init();
    AppRouter.init();
  },

  guard() {
    const path = location.pathname;
    const isPublicPage = path.endsWith('login.html') || path.endsWith('register.html');
    if (isPublicPage) return true;
    if (Utils.storage.get('login-token')) return true;

    location.href = 'login.html';
    return false;
  }
};
