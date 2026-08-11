// 考勤管理页面逻辑（接入后端 API）
const AttendancePage = {
  PAGE_SIZE: 10,
  clockTimer: null,
  records: [],
  todayRecord: null,
  statistics: null,
  currentPage: 1,
  keyword: { month: '', status: '' },

  async init() {
    this.records = [];
    this.todayRecord = null;
    this.currentPage = 1;
    this.keyword = { month: this.currentMonth(), status: '' };
    document.getElementById('atd-search-month').value = this.keyword.month;
    this.bindEvents();
    this.startClock();
    await this.reload();
  },

  currentMonth() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
  },

  normalizeStatus(status) {
    return {
      LATE: '迟到',
      EARLY: '早退',
      NORMAL: '正常'
    }[status] || status || '未打卡';
  },

  mapRecord(item) {
    return {
      id: item.id,
      date: item.attendanceDate,
      in: item.checkInTime || '',
      out: item.checkOutTime || '',
      inStatus: this.normalizeStatus(item.checkInStatus),
      outStatus: this.normalizeStatus(item.checkOutStatus)
    };
  },

  async reload() {
    await Promise.all([this.loadRecords(), this.loadStatistics()]);
  },

  async loadRecords() {
    // 每人每天最多一条，一个月不超过 31 条；一次取全后再做状态筛选和页面分页。
    const res = await Utils.get('/api/attendance/my', {
      month: this.keyword.month,
      page: 1,
      size: 100
    });
    if (!res) return;

    this.records = (res.data.list || []).map(item => this.mapRecord(item));
    if (this.keyword.month === this.currentMonth()) {
      const today = this.dateKey(new Date());
      this.todayRecord = this.records.find(item => item.date === today) || null;
    }
    const totalPages = Math.max(1, Math.ceil(this.filtered().length / this.PAGE_SIZE));
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    if (document.getElementById('atd-tbody')) this.renderTable();
    this.updateStatus();
  },

  async loadStatistics() {
    const res = await Utils.get('/api/attendance/my/statistics', {
      month: this.keyword.month
    });
    if (!res) return;

    this.statistics = res.data;
    this.renderStats();
  },

  // ================= 时钟 =================
  startClock() {
    this.tick();
    if (this.clockTimer) clearInterval(this.clockTimer);
    this.clockTimer = setInterval(() => this.tick(), 1000);
  },

  tick() {
    const now = new Date();
    const timeEl = document.getElementById('atd-time');
    const dateEl = document.getElementById('atd-date');
    if (!timeEl || !dateEl) return;

    const pad = value => String(value).padStart(2, '0');
    timeEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
    dateEl.textContent = `${now.getFullYear()}年${pad(now.getMonth() + 1)}月${pad(now.getDate())}日 星期${week}`;
  },

  dateKey(date) {
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  },

  // ================= 渲染 =================
  updateStatus() {
    const statusEl = document.getElementById('atd-status');
    const checkInButton = document.getElementById('btn-atd-in');
    const checkOutButton = document.getElementById('btn-atd-out');
    if (!statusEl || !checkInButton || !checkOutButton) return;

    const record = this.todayRecord;
    checkInButton.disabled = Boolean(record?.in);
    checkOutButton.disabled = !record?.in || Boolean(record?.out);

    if (!record) {
      statusEl.textContent = '今日尚未打卡';
    } else if (record.in && record.out) {
      statusEl.textContent = `今日已完成打卡：参会 ${record.in}（${record.inStatus}）/ 结束 ${record.out}（${record.outStatus}）`;
    } else {
      statusEl.textContent = `已完成参会打卡（${record.in}，${record.inStatus}），请及时进行结束打卡`;
    }
  },

  statusOf(record) {
    const statuses = [];
    if (!record.in) {
      statuses.push('缺卡');
    } else if (record.inStatus === '迟到') {
      statuses.push('迟到');
    }

    if (!record.out) {
      statuses.push('缺卡');
    } else if (record.outStatus === '早退') {
      statuses.push('早退');
    }

    return [...new Set(statuses)].join('、') || '正常';
  },

  renderStats() {
    const stats = this.statistics || {};
    this.setText('atd-stat-days', stats.attendanceDays ?? 0);
    this.setText('atd-stat-late', stats.lateCount ?? 0);
    this.setText('atd-stat-early', stats.earlyCount ?? 0);
    this.setText('atd-stat-normal', stats.normalCheckInCount ?? 0);
  },

  setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  },

  filtered() {
    return this.records.filter(record => {
      if (!this.keyword.status) return true;
      return this.statusOf(record).split('、').includes(this.keyword.status);
    });
  },

  renderTable() {
    const tbody = document.getElementById('atd-tbody');
    const list = this.filtered();
    const totalPages = Math.max(1, Math.ceil(list.length / this.PAGE_SIZE));
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    const start = (this.currentPage - 1) * this.PAGE_SIZE;
    const page = list.slice(start, start + this.PAGE_SIZE);

    if (page.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-row">暂无考勤记录</td></tr>';
    } else {
      tbody.innerHTML = page.map(record => {
        const status = this.statusOf(record);
        const tagClass = status === '正常'
          ? 'type-tag--in'
          : status === '缺卡' ? 'type-tag--danger' : 'type-tag--out';
        return `
          <tr>
            <td>${Utils.escapeHTML(record.date)}</td>
            <td>${record.in ? Utils.escapeHTML(record.in) : '<span class="text-muted">--:--</span>'}</td>
            <td>${record.out ? Utils.escapeHTML(record.out) : '<span class="text-muted">--:--</span>'}</td>
            <td><span class="type-tag ${tagClass}">${Utils.escapeHTML(status)}</span></td>
          </tr>`;
      }).join('');
    }

    this.renderPagination(list.length, totalPages);
  },

  renderPagination(total, totalPages) {
    const container = document.getElementById('atd-pagination');
    if (!container || total === 0) {
      if (container) container.innerHTML = '';
      return;
    }

    let html = '<span class="page-btn" data-page="prev"><i class="fa fa-chevron-left"></i></span>';
    for (let page = 1; page <= totalPages; page++) {
      html += `<span class="page-btn ${page === this.currentPage ? 'active' : ''}" data-page="${page}">${page}</span>`;
    }
    html += '<span class="page-btn" data-page="next"><i class="fa fa-chevron-right"></i></span>';
    html += `<span class="page-info">共 ${total} 条</span>`;
    container.innerHTML = html;
  },

  // ================= 事件 =================
  bindEvents() {
    document.getElementById('btn-atd-in').addEventListener('click', () => this.punch('in'));
    document.getElementById('btn-atd-out').addEventListener('click', () => this.punch('out'));

    document.getElementById('atd-search-form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.keyword = {
        month: document.getElementById('atd-search-month').value || this.currentMonth(),
        status: document.getElementById('atd-search-status').value
      };
      this.currentPage = 1;
      this.reload();
    });

    document.getElementById('btn-atd-reset').addEventListener('click', () => {
      this.keyword = { month: this.currentMonth(), status: '' };
      document.getElementById('atd-search-month').value = this.keyword.month;
      document.getElementById('atd-search-status').value = '';
      this.currentPage = 1;
      this.reload();
    });

    document.getElementById('atd-pagination').addEventListener('click', (event) => {
      const button = event.target.closest('.page-btn');
      if (!button) return;
      const totalPages = Math.max(1, Math.ceil(this.filtered().length / this.PAGE_SIZE));
      if (button.dataset.page === 'prev') this.currentPage = Math.max(1, this.currentPage - 1);
      else if (button.dataset.page === 'next') this.currentPage = Math.min(totalPages, this.currentPage + 1);
      else this.currentPage = Number(button.dataset.page);
      this.renderTable();
    });
  },

  async punch(type) {
    const isCheckIn = type === 'in';
    const checkInButton = document.getElementById('btn-atd-in');
    const checkOutButton = document.getElementById('btn-atd-out');
    checkInButton.disabled = true;
    checkOutButton.disabled = true;

    const res = await Utils.post(`/api/attendance/${isCheckIn ? 'check-in' : 'check-out'}`);
    if (!res) {
      this.updateStatus();
      return;
    }

    const record = this.mapRecord(res.data);
    this.todayRecord = record;
    const time = isCheckIn ? record.in : record.out;
    const status = isCheckIn ? record.inStatus : record.outStatus;
    alert(`${isCheckIn ? '参会' : '结束'}打卡成功（${time}，${status}）`);
    await this.reload();
  }
};

// 暴露到全局，供 router.js 按页面名调用 init
window.AttendancePage = AttendancePage;
