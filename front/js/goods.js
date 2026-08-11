// 耗材库 + 库存管理页面逻辑（接入后端 API）
const GoodsPage = {
  CATEGORIES: ['打印耗材', '纸张', '电脑配件', '网络配件', '存储设备', '其他'],
  PAGE_SIZE: 10,
  currentPage: 1,
  total: 0,
  totalPages: 1,
  stockPage: 1,
  stockTotal: 0,
  stockTotalPages: 1,
  keyword: { name: '', category: '' },
  stockFilter: { goodsId: '', start: '', end: '' },
  editingId: null,
  stockMode: 'in',
  goodsList: [],
  stockGoodsList: [],
  stockRecords: [],
  warnings: [],

  async init() {
    if (!document.getElementById('goods-tbody')) return;
    await this.initGoodsList();
  },

  // 后端字段 -> 页面字段：goodsNo -> no
  mapGoods(goods) {
    return {
      ...goods,
      no: goods.goodsNo
    };
  },

  // 后端字段 -> 页面字段：businessDate -> date、IN/OUT -> 入库/出库、operatorName -> operator
  mapStockRecord(record) {
    const type = record.recordType === 'IN'
      ? '入库'
      : record.recordType === 'OUT'
        ? '出库'
        : record.recordType === 'RETURN' ? '归还' : record.recordType;
    return {
      ...record,
      date: record.businessDate,
      type,
      operator: record.operatorName
    };
  },

  // ================= 耗材列表页 =================
  async initGoodsList() {
    this.bindGoodsEvents();
    this.bindStockEvents();
    await Promise.all([this.loadGoods(), this.loadStockSupport()]);
  },

  async loadGoods() {
    const res = await Utils.get('/api/goods', {
      name: this.keyword.name,
      category: this.keyword.category,
      page: this.currentPage,
      size: this.PAGE_SIZE
    });
    if (!res) return;

    this.goodsList = (res.data.list || []).map(goods => this.mapGoods(goods));
    this.total = res.data.total;
    this.totalPages = Math.max(1, res.data.totalPages);
    this.currentPage = res.data.page;
    this.renderGoods();
  },

  bindGoodsEvents() {
    document.getElementById('goods-search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.keyword = {
        name: document.getElementById('goods-search-name').value.trim(),
        category: document.getElementById('goods-search-category').value
      };
      this.currentPage = 1;
      this.loadGoods();
    });

    document.getElementById('btn-goods-reset').addEventListener('click', () => {
      document.getElementById('goods-search-name').value = '';
      document.getElementById('goods-search-category').value = '';
      this.keyword = { name: '', category: '' };
      this.currentPage = 1;
      this.loadGoods();
    });

    document.getElementById('btn-goods-add').addEventListener('click', () => this.openGoodsModal());
    document.getElementById('btn-goods-records').addEventListener('click', () => this.openStockRecords(''));
    document.getElementById('btn-goods-save').addEventListener('click', () => this.saveGoods());
    document.getElementById('btn-goods-cancel').addEventListener('click', () => this.closeGoodsModal());
    document.getElementById('goods-modal-close').addEventListener('click', () => this.closeGoodsModal());
    document.getElementById('goods-modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeGoodsModal();
    });

    // 表格操作 + 名称链接定位到当前耗材流水
    document.getElementById('goods-tbody').addEventListener('click', (e) => {
      const link = e.target.closest('a.link-goods');
      if (link) {
        e.preventDefault();
        this.openStockRecords(link.dataset.goods);
        return;
      }

      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      if (btn.dataset.action === 'edit') this.openGoodsModal(id);
      if (btn.dataset.action === 'del') this.removeGoods(id);
      if (btn.dataset.action === 'in') this.openStockModal('in', id);
      if (btn.dataset.action === 'out') this.openStockModal('out', id);
      if (btn.dataset.action === 'return') this.openStockModal('return', id);
      if (btn.dataset.action === 'records') this.openStockRecords(String(id));
    });

    document.getElementById('goods-pagination').addEventListener('click', (e) => {
      const btn = e.target.closest('.page-btn');
      if (!btn) return;
      this.currentPage = this.gotoPage(btn.dataset.page, this.currentPage, this.totalPages);
      this.loadGoods();
    });
  },

  renderGoods() {
    const tbody = document.getElementById('goods-tbody');
    if (this.goodsList.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-row">暂无数据</td></tr>';
    } else {
      tbody.innerHTML = this.goodsList.map(g => {
        const low = g.lowStock ?? g.stock < g.safeStock;
        return `
          <tr${low ? ' class="row-warning"' : ''}>
            <td><a href="#" class="link-goods" data-goods="${g.id}">${Utils.escapeHTML(g.name)}</a></td>
            <td>${Utils.escapeHTML(g.no)}</td>
            <td>${Utils.escapeHTML(g.category)}</td>
            <td class="${low ? 'text-danger' : ''}">${g.stock}</td>
            <td>${Utils.escapeHTML(g.unit)}</td>
            <td>${g.safeStock}</td>
            <td>${low ? '<span class="type-tag type-tag--out">预警</span>' : '<span class="type-tag type-tag--in">正常</span>'}</td>
            <td>
              <button type="button" class="btn btn-sm" data-action="edit" data-id="${g.id}"><i class="fa fa-edit"></i> 编辑</button>
              <button type="button" class="btn btn-danger btn-sm" data-action="del" data-id="${g.id}"><i class="fa fa-trash"></i> 删除</button>
              <button type="button" class="btn btn-success btn-sm" data-action="in" data-id="${g.id}"><i class="fa fa-arrow-down"></i> 入库</button>
              <button type="button" class="btn btn-warning btn-sm" data-action="out" data-id="${g.id}"><i class="fa fa-arrow-up"></i> 出库</button>
              <button type="button" class="btn btn-primary btn-sm" data-action="return" data-id="${g.id}"><i class="fa fa-rotate-left"></i> 归还</button>
              <button type="button" class="btn btn-sm" data-action="records" data-id="${g.id}"><i class="fa fa-list"></i> 流水</button>
            </td>
          </tr>`;
      }).join('');
    }
    this.renderPagination('goods-pagination', this.total, this.totalPages, this.currentPage);
  },

  openGoodsModal(id) {
    this.editingId = id ?? null;
    const stockInput = document.getElementById('goods-stock-count');
    document.getElementById('goods-modal-title').textContent = this.editingId === null ? '添加耗材' : '编辑耗材';
    document.getElementById('goods-name').value = '';
    document.getElementById('goods-no').value = '';
    document.getElementById('goods-category').value = this.CATEGORIES[0];
    document.getElementById('goods-unit').value = '';
    stockInput.value = 0;
    stockInput.disabled = this.editingId !== null;
    document.getElementById('goods-safe-stock').value = 0;

    if (this.editingId !== null) {
      const g = this.goodsList.find(item => item.id === this.editingId);
      if (!g) return;
      document.getElementById('goods-name').value = g.name;
      document.getElementById('goods-no').value = g.no;
      document.getElementById('goods-category').value = g.category;
      document.getElementById('goods-unit').value = g.unit;
      stockInput.value = g.stock;
      document.getElementById('goods-safe-stock').value = g.safeStock;
    }
    document.getElementById('goods-modal-overlay').style.display = 'flex';
  },

  closeGoodsModal() {
    document.getElementById('goods-modal-overlay').style.display = 'none';
  },

  async saveGoods() {
    const name = document.getElementById('goods-name').value.trim();
    const no = document.getElementById('goods-no').value.trim();
    const category = document.getElementById('goods-category').value;
    const unit = document.getElementById('goods-unit').value.trim();
    const stock = Number(document.getElementById('goods-stock-count').value) || 0;
    const safeStock = Number(document.getElementById('goods-safe-stock').value) || 0;

    if (!name || !no || !unit) return alert('请填写名称、编号和单位');

    // 页面 no -> 后端 goodsNo；更新接口不接收 stock
    const payload = { goodsNo: no, name, category, unit, safeStock };
    const res = this.editingId === null
      ? await Utils.post('/api/goods', { ...payload, stock })
      : await Utils.put(`/api/goods/${this.editingId}`, payload);
    if (!res) return;

    this.closeGoodsModal();
    await Promise.all([this.loadGoods(), this.loadStockSupport()]);
  },

  async removeGoods(id) {
    const goods = this.goodsList.find(item => item.id === id);
    if (!goods) return;
    if (!confirm(`确定删除「${goods.name}」吗？`)) return;

    const res = await Utils.del(`/api/goods/${id}`);
    if (!res) return;
    if (this.goodsList.length === 1 && this.currentPage > 1) this.currentPage--;
    await Promise.all([this.loadGoods(), this.loadStockSupport()]);
  },

  // ================= 出入库与流水 =================
  async loadStockSupport() {
    const [goodsRes, warningRes] = await Promise.all([
      Utils.get('/api/goods', { page: 1, size: 100 }),
      Utils.get('/api/goods/warnings')
    ]);

    if (goodsRes) {
      this.stockGoodsList = (goodsRes.data.list || []).map(goods => this.mapGoods(goods));
      this.fillGoodsSelects();
    }
    if (warningRes) {
      this.warnings = (warningRes.data || []).map(goods => this.mapGoods(goods));
      this.renderWarning();
    }
  },

  async loadStockRecords() {
    const res = await Utils.get('/api/goods/stock-records', {
      goodsId: this.stockFilter.goodsId,
      start: this.stockFilter.start,
      end: this.stockFilter.end,
      page: this.stockPage,
      size: this.PAGE_SIZE
    });
    if (!res) return;

    this.stockRecords = (res.data.list || []).map(record => this.mapStockRecord(record));
    this.stockTotal = res.data.total;
    this.stockTotalPages = Math.max(1, res.data.totalPages);
    this.stockPage = res.data.page;
    this.renderStock();
  },

  fillGoodsSelects() {
    const options = this.stockGoodsList.map(g =>
      `<option value="${g.id}">${Utils.escapeHTML(g.name)}</option>`).join('');
    document.getElementById('stock-search-goods').innerHTML = '<option value="">全部耗材</option>' + options;
    document.getElementById('stock-search-goods').value = this.stockFilter.goodsId;
    document.getElementById('stock-goods').innerHTML = '<option value="">请选择耗材</option>' + options;
  },

  bindStockEvents() {
    document.getElementById('stock-search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.stockFilter = {
        goodsId: document.getElementById('stock-search-goods').value,
        start: document.getElementById('stock-search-start').value,
        end: document.getElementById('stock-search-end').value
      };
      this.stockPage = 1;
      this.loadStockRecords();
    });

    document.getElementById('btn-stock-reset').addEventListener('click', () => {
      document.getElementById('stock-search-goods').value = '';
      document.getElementById('stock-search-start').value = '';
      document.getElementById('stock-search-end').value = '';
      this.stockFilter = { goodsId: '', start: '', end: '' };
      this.stockPage = 1;
      this.loadStockRecords();
    });

    document.getElementById('btn-stock-save').addEventListener('click', () => this.saveStockRecord());
    document.getElementById('btn-stock-cancel').addEventListener('click', () => this.closeStockModal());
    document.getElementById('stock-modal-close').addEventListener('click', () => this.closeStockModal());
    document.getElementById('stock-modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeStockModal();
    });
    document.getElementById('stock-records-modal-close').addEventListener('click', () => this.closeStockRecords());
    document.getElementById('stock-records-modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeStockRecords();
    });

    document.getElementById('stock-pagination').addEventListener('click', (e) => {
      const btn = e.target.closest('.page-btn');
      if (!btn) return;
      this.stockPage = this.gotoPage(btn.dataset.page, this.stockPage, this.stockTotalPages);
      this.loadStockRecords();
    });
  },

  renderStock() {
    const tbody = document.getElementById('stock-tbody');
    if (this.stockRecords.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row">暂无出入库记录</td></tr>';
    } else {
      tbody.innerHTML = this.stockRecords.map(record => {
        const isIncrease = record.type === '入库' || record.type === '归还';
        return `
          <tr>
            <td>${Utils.escapeHTML(record.date)}</td>
            <td>${Utils.escapeHTML(record.goodsName)}</td>
            <td><span class="type-tag ${isIncrease ? 'type-tag--in' : 'type-tag--out'}">${Utils.escapeHTML(record.type)}</span></td>
            <td>${record.quantity}</td>
            <td>${Utils.escapeHTML(record.operator)}</td>
            <td>${Utils.escapeHTML(record.remark || '')}</td>
          </tr>`;
      }).join('');
    }
    this.renderPagination('stock-pagination', this.stockTotal, this.stockTotalPages, this.stockPage);
  },

  renderWarning() {
    const el = document.getElementById('stock-warning');
    if (this.warnings.length === 0) {
      el.style.display = 'none';
      return;
    }
    const text = this.warnings.map(g => `${g.name}(${g.stock}/${g.safeStock})`).join('、');
    el.innerHTML = `<i class="fa fa-exclamation-triangle"></i> 以下耗材低于安全库存，请及时补货：${Utils.escapeHTML(text)}`;
    el.style.display = 'block';
  },

  openStockModal(mode, goodsId) {
    this.stockMode = mode;
    const isIn = mode === 'in';
    const user = Utils.storage.get('login-user', {});
    const operatorInput = document.getElementById('stock-operator');
    const title = mode === 'return' ? '归还' : isIn ? '入库' : '出库';
    document.getElementById('stock-modal-title').textContent = title;
    document.getElementById('stock-operator-label').textContent = mode === 'return'
      ? '归还人'
      : isIn ? '经办人' : '领用人';
    document.getElementById('stock-goods').value = String(goodsId || '');
    document.getElementById('stock-quantity').value = '';
    document.getElementById('stock-date').value = Utils.formatDate(new Date(), 'yyyy-MM-dd');
    document.getElementById('stock-date').max = Utils.formatDate(new Date(), 'yyyy-MM-dd');
    operatorInput.value = user.username || user.name || '';
    operatorInput.disabled = true;
    document.getElementById('stock-remark').value = '';
    document.getElementById('stock-modal-overlay').style.display = 'flex';
  },

  closeStockModal() {
    document.getElementById('stock-modal-overlay').style.display = 'none';
  },

  async openStockRecords(goodsId) {
    this.stockFilter.goodsId = String(goodsId || '');
    this.stockPage = 1;
    document.getElementById('stock-search-goods').value = this.stockFilter.goodsId;
    document.getElementById('stock-records-modal-overlay').style.display = 'flex';
    await this.loadStockRecords();
  },

  closeStockRecords() {
    document.getElementById('stock-records-modal-overlay').style.display = 'none';
  },

  async saveStockRecord() {
    const goodsId = Number(document.getElementById('stock-goods').value);
    const quantity = Number(document.getElementById('stock-quantity').value);
    const date = document.getElementById('stock-date').value;
    const remark = document.getElementById('stock-remark').value.trim();
    const isOut = this.stockMode === 'out';

    if (!goodsId) return alert('请选择耗材');
    if (!quantity || quantity <= 0) return alert('请输入有效的数量');
    if (!date) return alert('请选择日期');

    const goods = this.stockGoodsList.find(item => item.id === goodsId);
    if (isOut && goods && quantity > goods.stock) {
      return alert(`出库数量不能大于当前库存（${goods.stock}${goods.unit}）`);
    }

    // 页面 date -> 后端 businessDate；operatorName 由后端从当前登录用户生成
    const action = this.stockMode === 'return'
      ? 'stock-return'
      : isOut ? 'stock-out' : 'stock-in';
    const path = `/api/goods/${goodsId}/${action}`;
    const res = await Utils.post(path, { quantity, businessDate: date, remark });
    if (!res) return;

    this.closeStockModal();
    await Promise.all([this.loadGoods(), this.loadStockSupport()]);
    if (document.getElementById('stock-records-modal-overlay').style.display === 'flex') {
      await this.loadStockRecords();
    }
  },

  // ================= 通用工具 =================
  gotoPage(target, current, totalPages) {
    if (target === 'prev') return Math.max(1, current - 1);
    if (target === 'next') return Math.min(totalPages, current + 1);
    return Math.min(totalPages, Math.max(1, Number(target) || 1));
  },

  renderPagination(elId, total, totalPages, current) {
    const el = document.getElementById(elId);
    if (total === 0) {
      el.innerHTML = '';
      return;
    }

    let html = '<span class="page-btn" data-page="prev"><i class="fa fa-chevron-left"></i></span>';
    for (let i = 1; i <= totalPages; i++) {
      html += `<span class="page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</span>`;
    }
    html += '<span class="page-btn" data-page="next"><i class="fa fa-chevron-right"></i></span>';
    html += `<span class="page-info">共 ${total} 条</span>`;
    el.innerHTML = html;
  }
};

// 暴露到全局，供 router.js 按页面名调用 init
window.GoodsPage = GoodsPage;
