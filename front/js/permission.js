// 权限管理页面逻辑（角色权限树 + root 提权，示例数据）
const ACTION_TO_CODE = {
  view: 'view',
  add: 'add',
  edit: 'edit',
  del: 'delete',
  record: 'record'
};

// 页面使用 module -> actions，接口使用 module:action
function toApiPermissions(tree) {
  return Object.entries(tree).flatMap(([module, actions]) =>
    actions.map(action => `${module}:${ACTION_TO_CODE[action] || action}`)
  );
}

function fromApiPermissions(codes) {
  const result = {};
  for (const code of codes || []) {
    const [module, action] = String(code).split(':');
    if (!module || !action) continue;
    const uiAction = action === 'delete' ? 'del' : action;
    (result[module] ||= []).push(uiAction);
  }
  return result;
}

const ROLE_PERMISSIONS_KEY = 'role-permissions';

const PermissionPage = {
  MODULES: [
    { key: 'person', name: '人员管理', perms: [['view', '查看'], ['add', '添加'], ['edit', '修改'], ['del', '删除']] },
    { key: 'goods', name: '商品管理', perms: [['view', '查看'], ['add', '添加'], ['edit', '修改'], ['del', '删除']] },
    { key: 'equipment', name: '设备库', perms: [['view', '查看'], ['add', '添加'], ['edit', '修改'], ['del', '报废'], ['stock', '出入库']] },
    { key: 'attendance', name: '考勤管理', perms: [['view', '查看'], ['record', '打卡']] },
    { key: 'wiki', name: '机房百科', perms: [['view', '查看'], ['manage', '管理']] }
  ],

  ROLE_NAMES: { admin: '管理员', user: '普通用户' },

  rolePermissions: {
    admin: {
      person: ['view', 'add', 'edit', 'del'],
      goods: ['view', 'add', 'edit', 'del'],
      equipment: ['view', 'add', 'edit', 'del', 'stock'],
      attendance: ['view', 'record'],
      wiki: ['view', 'manage']
    },
    user: {
      person: ['view'],
      goods: ['view'],
      equipment: ['view'],
      attendance: ['view', 'record'],
      wiki: ['view']
    }
  },

  users: [],

  async init() {
    this.loadRolePermissions();
    await this.loadUsers();
    this.renderTree();
    this.renderUsers();
    this.bindEvents();
  },

  async loadUsers() {
    const res = await Utils.get('/api/users', { page: 1, size: 100 });
    if (!res) return;
    this.users = res.data.list.map(user => ({
      id: user.id,
      account: user.username,
      name: user.name,
      dept: user.dept,
      roleCode: user.roleCode,
      role: user.role
    }));
  },

  // 兼容本地保存的接口编码格式和旧版树状格式
  loadRolePermissions() {
    const saved = Utils.storage.get(ROLE_PERMISSIONS_KEY);
    if (!saved || typeof saved !== 'object') return;

    Object.entries(saved).forEach(([role, permissions]) => {
      if (!Array.isArray(permissions)) return;
      const isApiFormat = permissions.every(code =>
        typeof code === 'string' && code.includes(':')
      );
      this.rolePermissions[role] = isApiFormat
        ? fromApiPermissions(permissions)
        : permissions;
    });
  },

  // 注册页保存的账号自动并入用户列表
  mergeRegisteredUser() {
    const reg = Utils.storage.get('register-account');
    if (reg && reg.username && !this.users.some(u => u.account === reg.username)) {
      this.users.push({
        id: this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
        account: reg.username,
        name: reg.name || reg.username,
        dept: reg.department || '—',
        role: '普通用户'
      });
    }
  },

  currentRole() {
    return document.getElementById('perm-role-select').value;
  },

  canChangeRoles() {
    const user = Utils.storage.get('login-user', {});
    return user.roleCode === 'root' || user.role === '超级管理员';
  },

  renderTree() {
    const container = document.getElementById('perm-tree');
    const perms = this.rolePermissions[this.currentRole()] || {};

    container.innerHTML = this.MODULES.map(m => {
      const granted = perms[m.key] || [];
      const moduleChecked = m.perms.every(([k]) => granted.includes(k));
      const items = m.perms.map(([k, label]) => {
        const checked = granted.includes(k) ? ' checked' : '';
        return `<label class="perm-item"><input type="checkbox" class="perm-check" data-module="${m.key}" data-perm="${k}"${checked}> ${label}</label>`;
      }).join('');
      return `
        <div class="perm-module">
          <label class="perm-module-title">
            <input type="checkbox" class="perm-module-check" data-module="${m.key}"${moduleChecked ? ' checked' : ''}> ${m.name}
          </label>
          <div class="perm-perms">${items}</div>
        </div>`;
    }).join('');
  },

  renderUsers() {
    const tbody = document.getElementById('perm-user-tbody');
    tbody.innerHTML = this.users.map(u => {
      const isAdmin = u.roleCode === 'admin' || u.role === '管理员';
      const isRoot = u.roleCode === 'root' || u.account === 'root';
      const canChangeRoles = this.canChangeRoles();
      const roleTag = isAdmin
        ? '<span class="role-tag role-tag--admin">管理员</span>'
        : '<span class="role-tag role-tag--user">普通用户</span>';
      const action = isRoot
        ? '<span class="text-warning">内置 root 账号</span>'
        : (!canChangeRoles
            ? '<span class="text-muted">仅超级管理员可调整</span>'
            : isAdmin
            ? `<button type="button" class="btn btn-sm" data-action="demote" data-id="${u.id}"><i class="fa fa-arrow-down"></i> 降为普通用户</button>`
            : `<button type="button" class="btn btn-primary btn-sm" data-action="promote" data-id="${u.id}"><i class="fa fa-arrow-up"></i> 提为管理员</button>`);
      return `
        <tr>
          <td>${Utils.escapeHTML(u.account)}</td>
          <td>${Utils.escapeHTML(u.name)}</td>
          <td>${Utils.escapeHTML(u.dept)}</td>
          <td>${roleTag}</td>
          <td>${action}</td>
        </tr>`;
    }).join('');
  },

  bindEvents() {
    // 角色切换 → 重新渲染权限树
    document.getElementById('perm-role-select').addEventListener('change', () => this.renderTree());

    // 权限树勾选联动
    document.getElementById('perm-tree').addEventListener('change', (e) => {
      if (e.target.classList.contains('perm-module-check')) {
        const module = e.target.dataset.module;
        document.querySelectorAll(`.perm-check[data-module="${module}"]`).forEach(c => c.checked = e.target.checked);
      } else if (e.target.classList.contains('perm-check')) {
        this.syncModuleCheck(e.target.dataset.module);
      }
    });

    // 保存权限
    document.getElementById('btn-perm-save').addEventListener('click', () => {
      const role = this.currentRole();
      const perms = {};
      document.querySelectorAll('.perm-module').forEach(mod => {
        const module = mod.querySelector('.perm-module-check').dataset.module;
        perms[module] = [...mod.querySelectorAll('.perm-check:checked')].map(c => c.dataset.perm);
      });
      this.rolePermissions[role] = perms;
      const saved = Utils.storage.get(ROLE_PERMISSIONS_KEY, {});
      saved[role] = toApiPermissions(perms);
      Utils.storage.set(ROLE_PERMISSIONS_KEY, saved);
      alert(`已保存「${this.ROLE_NAMES[role]}」的角色权限`);
    });

    // 提权 / 降权
    document.getElementById('perm-user-tbody').addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const u = this.users.find(i => i.id === Number(btn.dataset.id));
      if (!u) return;
      const toAdmin = btn.dataset.action === 'promote';
      if (!confirm(`确定将「${u.name}」${toAdmin ? '提为管理员' : '降为普通用户'}吗？`)) return;
      const res = await Utils.put(`/api/users/${u.id}/role`, {
        roleCode: toAdmin ? 'admin' : 'user'
      });
      if (!res) return;
      u.roleCode = toAdmin ? 'admin' : 'user';
      u.role = toAdmin ? '管理员' : '普通用户';
      this.renderUsers();
    });
  },

  // 子级全部勾选时自动勾上父级
  syncModuleCheck(module) {
    const mod = document.querySelector(`.perm-module-check[data-module="${module}"]`);
    if (!mod) return;
    const checks = document.querySelectorAll(`.perm-check[data-module="${module}"]`);
    mod.checked = [...checks].every(c => c.checked);
  }
};

// 暴露到全局，供 router.js 按页面名调用 init
window.PermissionPage = PermissionPage;
