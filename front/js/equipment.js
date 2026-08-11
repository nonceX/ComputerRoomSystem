// 后端使用稳定英文编码，页面继续显示中文，两边在这一层统一转换。
const EQUIPMENT_STATUS_TO_API = { '正常': 'NORMAL', '维修': 'REPAIR', '报废': 'SCRAPPED' };
const EQUIPMENT_STATUS_FROM_API = { NORMAL: '正常', REPAIR: '维修', SCRAPPED: '报废' };

function equipmentFromApi(e) {
  return {
    id: e.id,
    no: e.equipmentNo,
    name: e.name,
    model: e.model || '',
    quantity: e.quantity,
    status: EQUIPMENT_STATUS_FROM_API[e.status] || e.status,
    location: e.location
  };
}

function equipmentRecordFromApi(record) {
  return {
    id: record.id,
    deviceId: record.equipmentId,
    deviceName: record.equipmentName,
    type: record.recordType === 'IN' ? '入库' : '出库',
    quantity: record.quantity,
    date: record.businessDate,
    operator: record.operatorName,
    remark: record.remark || ''
  };
}

const EquipmentPage = {
  PAGE_SIZE: 10,
  RECORD_SIZE: 100,
  currentPage: 1,
  total: 0,
  totalPage: 1,
  keyword: { name: '', status: '' },
  editingId: null,
  flowMode: 'in',
  data: [],
  records: [],
  statistics: { normal: 0, repair: 0, scrapped: 0, total: 0 },

  async init() {
    this.bindEvents();
    await this.reloadAll();
  },

  async reloadAll() {
    await Promise.all([this.load(), this.loadRecords(), this.loadStatistics()]);
  },

  async load() {
    const res = await Utils.get('/api/equipment', {
      name: this.keyword.name,
      status: EQUIPMENT_STATUS_TO_API[this.keyword.status] || '',
      page: this.currentPage,
      size: this.PAGE_SIZE
    });
    if (!res) return;

    this.data = res.data.list.map(equipmentFromApi);
    this.total = res.data.total;
    this.totalPage = Math.max(1, res.data.totalPages);
    this.currentPage = res.data.page;
    this.renderTable();
  },

  async loadRecords() {
    const res = await Utils.get('/api/equipment/stock-records', { page: 1, size: this.RECORD_SIZE });
    if (!res) return;
    this.records = res.data.list.map(equipmentRecordFromApi);
    this.renderRecords();
  },

  async loadStatistics() {
    const res = await Utils.get('/api/equipment/statistics');
    if (!res) return;
    this.statistics = res.data;
    this.renderStats();
  },

  renderStats() {
    document.getElementById('eq-stat-normal').textContent = this.statistics.normal;
    document.getElementById('eq-stat-repair').textContent = this.statistics.repair;
    document.getElementById('eq-stat-scrapped').textContent = this.statistics.scrapped;
    document.getElementById('eq-stat-total').textContent = this.statistics.total;
  },

  renderTable() {
    const tbody = document.getElementById('eq-tbody');
    if (this.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-row">暂无数据</td></tr>';
    } else {
      tbody.innerHTML = this.data.map(d => `
        <tr>
          <td>${Utils.escapeHTML(d.no)}</td>
          <td>${Utils.escapeHTML(d.name)}</td>
          <td>${Utils.escapeHTML(d.model)}</td>
          <td>${d.quantity}</td>
          <td>${this.statusTag(d.status)}</td>
          <td>${Utils.escapeHTML(d.location)}</td>
          <td>
            ${d.status === '报废' ? '' : `<button type="button" class="btn btn-sm" data-action="edit" data-id="${d.id}"><i class="fa fa-edit"></i> 编辑</button>`}
            ${d.status === '报废' ? '' : `<button type="button" class="btn btn-danger btn-sm" data-action="scrap" data-id="${d.id}"><i class="fa fa-trash"></i> 报废</button>`}
          </td>
        </tr>`).join('');
    }
    this.renderPagination();
  },

  statusTag(status) {
    const classes = { '正常': 'type-tag--in', '维修': 'type-tag--out', '报废': 'type-tag--danger' };
    return `<span class="type-tag ${classes[status] || ''}">${Utils.escapeHTML(status)}</span>`;
  },

  renderRecords() {
    const tbody = document.getElementById('eq-record-tbody');
    if (this.records.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row">暂无出入库记录</td></tr>';
      return;
    }

    tbody.innerHTML = this.records.map(record => {
      const isIn = record.type === '入库';
      return `
        <tr>
          <td>${Utils.escapeHTML(record.date)}</td>
          <td>${Utils.escapeHTML(record.deviceName)}</td>
          <td><span class="type-tag ${isIn ? 'type-tag--in' : 'type-tag--out'}">${record.type}</span></td>
          <td>${record.quantity}</td>
          <td>${Utils.escapeHTML(record.operator)}</td>
          <td>${Utils.escapeHTML(record.remark)}</td>
        </tr>`;
    }).join('');
  },

  bindEvents() {
    document.getElementById('eq-search-form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.keyword = {
        name: document.getElementById('eq-search-name').value.trim(),
        status: document.getElementById('eq-search-status').value
      };
      this.currentPage = 1;
      this.load();
    });

    document.getElementById('btn-eq-reset').addEventListener('click', () => {
      document.getElementById('eq-search-name').value = '';
      document.getElementById('eq-search-status').value = '';
      this.keyword = { name: '', status: '' };
      this.currentPage = 1;
      this.load();
    });

    document.getElementById('btn-eq-add').addEventListener('click', () => this.openModal());
    document.getElementById('btn-eq-save').addEventListener('click', () => this.save());
    document.getElementById('btn-eq-cancel').addEventListener('click', () => this.closeModal());
    document.getElementById('eq-modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('eq-modal-overlay').addEventListener('click', (event) => {
      if (event.target === event.currentTarget) this.closeModal();
    });

    document.getElementById('btn-eq-in').addEventListener('click', () => this.openFlow('in'));
    document.getElementById('btn-eq-out').addEventListener('click', () => this.openFlow('out'));
    document.getElementById('btn-eq-flow-save').addEventListener('click', () => this.saveFlow());
    document.getElementById('btn-eq-flow-cancel').addEventListener('click', () => this.closeFlow());
    document.getElementById('eq-flow-close').addEventListener('click', () => this.closeFlow());
    document.getElementById('eq-flow-overlay').addEventListener('click', (event) => {
      if (event.target === event.currentTarget) this.closeFlow();
    });

    document.getElementById('eq-tbody').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const id = Number(button.dataset.id);
      if (button.dataset.action === 'edit') this.openModal(id);
      if (button.dataset.action === 'scrap') this.scrap(id);
    });

    document.getElementById('eq-pagination').addEventListener('click', (event) => {
      const button = event.target.closest('.page-btn');
      if (!button) return;
      const target = button.dataset.page;
      if (target === 'prev') this.currentPage = Math.max(1, this.currentPage - 1);
      else if (target === 'next') this.currentPage = Math.min(this.totalPage, this.currentPage + 1);
      else this.currentPage = Number(target);
      this.load();
    });
  },

  openModal(id) {
    this.editingId = id ?? null;
    const quantityInput = document.getElementById('eq-quantity');
    document.getElementById('eq-modal-title').textContent = this.editingId === null ? '登记设备' : '编辑设备';
    document.getElementById('eq-name').value = '';
    document.getElementById('eq-no').value = '';
    document.getElementById('eq-model').value = '';
    quantityInput.value = 0;
    quantityInput.disabled = this.editingId !== null;
    document.getElementById('eq-location').value = '';
    document.getElementById('eq-status').value = '正常';

    if (this.editingId !== null) {
      const equipment = this.data.find(item => item.id === this.editingId);
      if (!equipment) return;
      document.getElementById('eq-name').value = equipment.name;
      document.getElementById('eq-no').value = equipment.no;
      document.getElementById('eq-model').value = equipment.model;
      quantityInput.value = equipment.quantity;
      document.getElementById('eq-location').value = equipment.location;
      document.getElementById('eq-status').value = equipment.status;
    }
    document.getElementById('eq-modal-overlay').style.display = 'flex';
  },

  closeModal() {
    document.getElementById('eq-modal-overlay').style.display = 'none';
  },

  async save() {
    const name = document.getElementById('eq-name').value.trim();
    const equipmentNo = document.getElementById('eq-no').value.trim();
    const model = document.getElementById('eq-model').value.trim();
    const quantity = Number(document.getElementById('eq-quantity').value);
    const location = document.getElementById('eq-location').value.trim();
    const status = EQUIPMENT_STATUS_TO_API[document.getElementById('eq-status').value];

    if (!name || !equipmentNo || !location) {
      alert('请填写设备名称、编号和位置');
      return;
    }
    if (this.editingId === null && (!Number.isInteger(quantity) || quantity < 0)) {
      alert('初始库存必须是大于或等于 0 的整数');
      return;
    }

    const payload = { equipmentNo, name, model, status, location };
    const res = this.editingId === null
      ? await Utils.post('/api/equipment', { ...payload, quantity })
      : await Utils.put(`/api/equipment/${this.editingId}`, payload);
    if (!res) return;

    this.closeModal();
    await this.reloadAll();
  },

  async scrap(id) {
    const equipment = this.data.find(item => item.id === id);
    if (!equipment) return;
    if (!confirm(`确定将「${equipment.name}」报废吗？`)) return;

    const res = await Utils.put(`/api/equipment/${id}/scrap`, {});
    if (!res) return;
    await this.reloadAll();
  },

  openFlow(mode) {
    const available = this.data.filter(item => item.status !== '报废');
    if (available.length === 0) {
      alert('当前列表没有可操作的设备');
      return;
    }

    this.flowMode = mode;
    document.getElementById('eq-flow-title').textContent = mode === 'in' ? '入库' : '出库';
    document.getElementById('eq-flow-device').innerHTML = available.map(item =>
      `<option value="${item.id}">${Utils.escapeHTML(item.name)}（库存 ${item.quantity}）</option>`
    ).join('');
    document.getElementById('eq-flow-quantity').value = '';
    const today = Utils.formatDate(new Date(), 'yyyy-MM-dd');
    const dateInput = document.getElementById('eq-flow-date');
    dateInput.value = today;
    dateInput.max = today;
    document.getElementById('eq-flow-remark').value = '';
    document.getElementById('eq-flow-overlay').style.display = 'flex';
  },

  closeFlow() {
    document.getElementById('eq-flow-overlay').style.display = 'none';
  },

  async saveFlow() {
    const equipmentId = Number(document.getElementById('eq-flow-device').value);
    const quantity = Number(document.getElementById('eq-flow-quantity').value);
    const businessDate = document.getElementById('eq-flow-date').value;
    const remark = document.getElementById('eq-flow-remark').value.trim();
    const stockIn = this.flowMode === 'in';

    if (!equipmentId) return alert('请选择设备');
    if (!Number.isInteger(quantity) || quantity <= 0) return alert('数量必须是大于 0 的整数');
    if (!businessDate) return alert('请选择日期');

    const equipment = this.data.find(item => item.id === equipmentId);
    if (!stockIn && equipment && quantity > equipment.quantity) {
      return alert(`出库数量不能大于当前库存（${equipment.quantity}）`);
    }

    const action = stockIn ? 'stock-in' : 'stock-out';
    const res = await Utils.post(`/api/equipment/${equipmentId}/${action}`, {
      quantity,
      businessDate,
      remark
    });
    if (!res) return;

    this.closeFlow();
    await this.reloadAll();
  },

  renderPagination() {
    const element = document.getElementById('eq-pagination');
    if (this.total === 0) {
      element.innerHTML = '';
      return;
    }

    let html = '<span class="page-btn" data-page="prev"><i class="fa fa-chevron-left"></i></span>';
    for (let page = 1; page <= this.totalPage; page++) {
      html += `<span class="page-btn ${page === this.currentPage ? 'active' : ''}" data-page="${page}">${page}</span>`;
    }
    html += '<span class="page-btn" data-page="next"><i class="fa fa-chevron-right"></i></span>';
    html += `<span class="page-info">共 ${this.total} 条</span>`;
    element.innerHTML = html;
  }
};

window.EquipmentPage = EquipmentPage;
