// 人员管理页面逻辑（接入后端 API）
const PersonPage = {
  PAGE_SIZE: 10,
  currentPage: 1,
  keyword: { name: '', dept: '', role: '' },
  editingId: null,

  data: [],        // 当前页数据，由后端返回
  total: 0,        // 总条数，由后端返回
  totalPage: 1,    // 总页数，由后端返回

  // 前端下拉框是中文，后端存的是英文编码，这里做转换
  ROLE_TO_CODE: { '管理员': 'admin', '普通用户': 'user' },

  canChangeRoles() {
    const user = Utils.storage.get('login-user', {});
    return user.roleCode === 'root' || user.role === '超级管理员';
  },

  async init() {
    this.bindEvents();
    await this.load();
  },

  // 向后端请求当前页数据
  async load() {
    const res = await Utils.get('/api/users', {
      realName: this.keyword.name,
      dept: this.keyword.dept,
      roleCode: this.ROLE_TO_CODE[this.keyword.role] || '',
      page: this.currentPage,
      size: this.PAGE_SIZE
    });
    if (!res) return;                 // 请求失败，Utils 已经弹过提示了

    this.data = res.data.list;
    this.total = res.data.total;
    this.totalPage = res.data.totalPages;
    this.currentPage = res.data.page;
    this.render();
  },

  render() {
    const page = this.data;      // 后端已经返回了当前页，直接用
    const tbody = document.getElementById('person-tbody');

    if (page.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-row">暂无数据</td></tr>';
    } else {
      tbody.innerHTML = page.map(p => `
        <tr>
          <td><input type="checkbox" class="person-check" data-id="${p.id}"></td>
          <td>${Utils.escapeHTML(p.name)}</td>
          <td>${Utils.escapeHTML(p.no)}</td>
          <td>${Utils.escapeHTML(p.dept)}</td>
          <td>${this.roleTag(p.role)}</td>
          <td>${Utils.escapeHTML(p.phone)}</td>
          <td>
            <button type="button" class="btn btn-sm" data-action="edit" data-id="${p.id}"><i class="fa fa-edit"></i> 编辑</button>
            <button type="button" class="btn btn-danger btn-sm" data-action="del" data-id="${p.id}"><i class="fa fa-trash"></i> 删除</button>
          </td>
        </tr>
      `).join('');
    }

    this.renderPagination(this.total);
  },


  roleTag(role) {
    const cls = role === '管理员' ? 'role-tag--admin' : 'role-tag--user';
    return `<span class="role-tag ${cls}">${Utils.escapeHTML(role)}</span>`;
  },

  renderPagination(total) {
    const el = document.getElementById('person-pagination');
    if (total === 0) { el.innerHTML = ''; return; }

    let html = `<span class="page-btn" data-page="prev"><i class="fa fa-chevron-left"></i></span>`;
    for (let i = 1; i <= this.totalPage; i++) {
      html += `<span class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</span>`;
    }
    html += `<span class="page-btn" data-page="next"><i class="fa fa-chevron-right"></i></span>`;
    html += `<span class="page-info">共 ${total} 条</span>`;
    el.innerHTML = html;
  },

  bindEvents() {
    document.getElementById('person-search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.doSearch();
    });
    document.getElementById('btn-person-reset').addEventListener('click', () => {
      document.getElementById('person-search-name').value = '';
      document.getElementById('person-search-dept').value = '';
      document.getElementById('person-search-role').value = '';
      this.keyword = { name: '', dept: '', role: '' };
      this.currentPage = 1;
      this.load();
    });

    // 表格操作：编辑 / 删除（事件委托）
    document.getElementById('person-tbody').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      if (btn.dataset.action === 'edit') this.openEdit(id);
      if (btn.dataset.action === 'del') this.remove(id);
    });

    // 分页：改页号后向后端重新请求
    document.getElementById('person-pagination').addEventListener('click', (e) => {
      const btn = e.target.closest('.page-btn');
      if (!btn) return;
      const target = btn.dataset.page;
      if (target === 'prev') this.currentPage = Math.max(1, this.currentPage - 1);
      else if (target === 'next') this.currentPage = Math.min(this.totalPage, this.currentPage + 1);
      else this.currentPage = Number(target);
      this.load();
    });

    // 添加 / 弹窗开关
    document.getElementById('btn-person-add').addEventListener('click', () => this.openAdd());
    document.getElementById('btn-person-save').addEventListener('click', () => this.save());
    document.getElementById('btn-person-cancel').addEventListener('click', () => this.closeModal());
    document.getElementById('person-modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('person-modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });

    // 全选 / 批量删除
    document.getElementById('person-check-all').addEventListener('change', (e) => {
      document.querySelectorAll('.person-check').forEach(c => c.checked = e.target.checked);
    });
    document.getElementById('btn-person-batch-del').addEventListener('click', () => this.batchRemove());
  },

  doSearch() {
    this.keyword = {
      name: document.getElementById('person-search-name').value.trim(),
      dept: document.getElementById('person-search-dept').value,
      role: document.getElementById('person-search-role').value
    };
    this.currentPage = 1;
    this.load();
  },

  openAdd() {
    this.editingId = null;
    document.getElementById('person-modal-title').textContent = '添加人员';
    document.getElementById('person-name').value = '';
    document.getElementById('person-no').value = '';
    document.getElementById('person-dept').value = '技术部';
    document.getElementById('person-role').value = '普通用户';
    document.getElementById('person-role').disabled = !this.canChangeRoles();
    document.getElementById('person-phone').value = '';
    this.showModal();
  },

  openEdit(id) {
    const p = this.data.find(i => i.id === id);
    if (!p) return;
    this.editingId = id;
    document.getElementById('person-modal-title').textContent = '编辑人员';
    document.getElementById('person-name').value = p.name;
    document.getElementById('person-no').value = p.no;
    document.getElementById('person-dept').value = p.dept;
    document.getElementById('person-role').value = p.role;
    document.getElementById('person-role').disabled = !this.canChangeRoles();
    document.getElementById('person-phone').value = p.phone;
    this.showModal();
  },

  async save() {
    const name = document.getElementById('person-name').value.trim();
    const no = document.getElementById('person-no').value.trim();
    const dept = document.getElementById('person-dept').value;
    const role = document.getElementById('person-role').value;
    const phone = document.getElementById('person-phone').value.trim();

    if (!name || !no || !phone) {
      alert('请填写姓名、工号和电话');
      return;
    }

    let res;
    if (this.editingId === null) {
      // 新增：后端要求 username 和 password，这里用工号生成默认值
      res = await Utils.post('/api/users', {
        username: 'u' + no,
        password: '123456',
        name, no, dept, phone
      });
    } else {
      res = await Utils.put(`/api/users/${this.editingId}`, {
        name, no, dept, phone
      });

      if (res && this.canChangeRoles()) {
        const current = this.data.find(item => item.id === this.editingId);
        const roleCode = this.ROLE_TO_CODE[role] || 'user';
        const currentRoleCode = current?.roleCode || this.ROLE_TO_CODE[current?.role];
        if (current && roleCode !== currentRoleCode) {
          res = await Utils.put(`/api/users/${this.editingId}/role`, { roleCode });
        }
      }
    }

    if (!res) return;          // 后端校验没过，Utils 已弹出提示，弹窗保持打开让用户改
    this.closeModal();
    await this.load();
  },


  async remove(id) {
    const p = this.data.find(i => i.id === id);
    if (!p) return;
    if (!confirm(`确定删除「${p.name}」吗？`)) return;

    const res = await Utils.del(`/api/users/${id}`);
    if (!res) return;
    await this.load();
  },

  async batchRemove() {
    const ids = [...document.querySelectorAll('.person-check:checked')].map(c => Number(c.dataset.id));
    if (ids.length === 0) {
      alert('请先勾选要删除的人员');
      return;
    }
    if (!confirm(`确定删除选中的 ${ids.length} 位人员吗？`)) return;

    const res = await Utils.del('/api/users', ids);
    if (!res) return;
    document.getElementById('person-check-all').checked = false;
    await this.load();
  },

  showModal() {
    document.getElementById('person-modal-overlay').style.display = 'flex';
  },

  closeModal() {
    document.getElementById('person-modal-overlay').style.display = 'none';
  }
};

// 暴露到全局，供 router.js 按页面名调用 init
window.PersonPage = PersonPage;
