const MENU_DATA = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { title: '首页', icon: 'fa-tachometer', affix: true },
    hidden: false
  },
  {
    path: '/person',
    name: 'Person',
    meta: { title: '人员管理', icon: 'fa-users', permission: 'person:view' },
    hidden: false
  },
  {
    path: '/permission',
    name: 'Permission',
    meta: { title: '权限管理', icon: 'fa-shield', permission: 'permission:view' },
    hidden: false
  },
  {
    path: '/goods',
    name: 'Goods',
    meta: { title: '商品管理', icon: 'fa-cubes', permission: 'goods:view' },
    hidden: false,
    children: [
      {
        path: '/goods/list',
        name: 'GoodsList',
        meta: { title: '耗材管理', icon: 'fa-cubes', permission: 'goods:view' },
        hidden: false
      },
      {
        path: '/equipment',
        name: 'Equipment',
        meta: { title: '设备库', icon: 'fa-server', permission: 'equipment:view' },
        hidden: false
      }
    ]
  },
  {
    path: '/attendance',
    name: 'Attendance',
    meta: { title: '考勤管理', icon: 'fa-clock', permission: 'attendance:view' },
    hidden: false
  },
  {
    path: '/wiki',
    name: 'Wiki',
    meta: { title: '机房百科', icon: 'fa-book', externalUrl: 'https://xgwiki.cea.top/' },
    hidden: false
  },
  {
    path: '/user',
    name: 'User',
    meta: { title: '个人中心', icon: 'fa-user-circle' },
    hidden: false
  }
];

// 前端权限只负责界面与路由体验，后端 @PreAuthorize 仍是最终安全边界。
const AccessControl = {
  DEFAULT_PERMISSIONS: {
    admin: [
      'person:view', 'person:add', 'person:edit', 'person:delete',
      'permission:view', 'permission:edit',
      'goods:view', 'goods:add', 'goods:edit', 'goods:delete', 'goods:stock',
      'equipment:view', 'equipment:add', 'equipment:edit', 'equipment:delete', 'equipment:stock',
      'attendance:view', 'attendance:record'
    ],
    user: ['attendance:view', 'attendance:record']
  },

  async init() {
    this.user = Utils.storage.get('login-user', {});
    this.roleCode = this.resolveRoleCode(this.user);
    const suppliedPermissions = Array.isArray(this.user.permissions)
      ? this.user.permissions
      : this.DEFAULT_PERMISSIONS[this.roleCode] || [];
    this.permissions = new Set(suppliedPermissions);

    // 超级管理员固定拥有全部权限；普通用户无权读取角色权限接口。
    if (this.roleCode === 'root' || this.roleCode === 'user' || Array.isArray(this.user.permissions)) return;
    await this.loadRolePermissions();
  },

  resolveRoleCode(user) {
    if (user.roleCode) return user.roleCode;
    return {
      '超级管理员': 'root',
      '管理员': 'admin',
      '普通用户': 'user'
    }[user.role] || 'user';
  },

  async loadRolePermissions() {
    const token = Utils.storage.get('login-token');
    if (!token) return;

    try {
      const response = await fetch(
        `${Utils.API_BASE}/api/roles/${encodeURIComponent(this.roleCode)}/permissions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) return;
      const body = await response.json();
      if (body.code === 200 && Array.isArray(body.data)) {
        this.permissions = new Set(body.data);
      }
    } catch (err) {
      console.warn('[权限] 无法同步角色权限，使用本地最小权限配置');
    }
  },

  hasPermission(permission) {
    if (!permission || this.roleCode === 'root') return true;
    return this.permissions?.has(permission) || false;
  },

  canAccess(item) {
    return Boolean(item) && this.hasPermission(item.meta?.permission);
  },

  filterMenu(list = MENU_DATA) {
    return list.reduce((result, item) => {
      if (item.hidden) return result;
      if (item.children) {
        const children = this.filterMenu(item.children);
        if (children.length > 0) result.push({ ...item, children });
      } else if (this.canAccess(item)) {
        result.push(item);
      }
      return result;
    }, []);
  }
};

// 菜单树查询：路径 → 菜单项 / 祖先链，供路由和面包屑复用
const MenuTree = {
  find(path, list = MENU_DATA) {
    for (const item of list) {
      if (item.path === path) return item;
      if (item.children) {
        const found = this.find(path, item.children);
        if (found) return found;
      }
    }
    return null;
  },

  // 返回从顶级到目标的链：[{ path, title }, ...]，找不到返回 null
  chain(path, list = MENU_DATA, parents = []) {
    for (const item of list) {
      const node = { path: item.path, title: item.meta.title };
      if (item.path === path) return [...parents, node];
      if (item.children) {
        const found = this.chain(path, item.children, [...parents, node]);
        if (found) return found;
      }
    }
    return null;
  }
};

const MenuRenderer = {
  render(menuList, container) {
    container.innerHTML = '';
    menuList.forEach(item => {
      if (item.hidden) return;
      if (item.children && item.children.length > 0) {
        this.renderSubmenu(item, container);
      } else {
        this.renderMenuItem(item, container);
      }
    });
  },

  renderSubmenu(item, container) {
    const submenu = document.createElement('div');
    submenu.className = 'menu-submenu';
    submenu.dataset.path = item.path;

    const title = document.createElement('div');
    title.className = 'menu-submenu-title';
    title.innerHTML = `
      <i class="fa ${item.meta.icon} menu-icon"></i>
      <span>${Utils.escapeHTML(item.meta.title)}</span>
      <i class="fa fa-chevron-right menu-arrow"></i>
    `;
    title.title = item.meta.title;   // 折叠态下靠 tooltip 认菜单
    title.addEventListener('click', () => {
      submenu.classList.toggle('open');
    });
    const body = document.createElement('div');
    body.className = 'menu-submenu-body';
    item.children.forEach(child => {
      if (child.hidden) return;
      this.renderMenuItem(child, body, true);
    });

    submenu.appendChild(title);
    submenu.appendChild(body);
    container.appendChild(submenu);
  },

  renderMenuItem(item, container, isChild = false) {
    const menuItem = document.createElement('div');
    menuItem.className = isChild ? 'menu-item' : 'menu-item menu-item--first';
    menuItem.dataset.path = item.path;
    menuItem.innerHTML = `
      <i class="fa ${item.meta.icon} menu-icon"></i>
      <span>${Utils.escapeHTML(item.meta.title)}</span>
    `;
    menuItem.title = item.meta.title;

    menuItem.addEventListener('click', () => {
      // 外链菜单：直接跳转到外部网站
      if (item.meta.externalUrl) {
        window.location.href = item.meta.externalUrl;
        return;
      }
      AppRouter.navigate(item.path);
    });

    container.appendChild(menuItem);
  },

  // 高亮当前菜单项，并展开它所在的父级菜单
  setActive(path) {
    document.querySelectorAll('#sidebar-menu .menu-item.active')
      .forEach(el => el.classList.remove('active'));

    const el = document.querySelector(`#sidebar-menu .menu-item[data-path="${path}"]`);
    if (!el) return;
    el.classList.add('active');
    el.closest('.menu-submenu')?.classList.add('open');
  }
};
