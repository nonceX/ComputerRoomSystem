const LoginPage = {
  init() {
    // 清理旧版本“记住密码/账号”功能留下的数据
    Utils.storage.remove('login-remember');
    this.bindEvents();
  },

  bindEvents() {
    // 密码可见性切换
    const pwd = document.getElementById('password');
    const toggle = document.getElementById('pwd-toggle');
    toggle.addEventListener('click', () => {
      const isPwd = pwd.type === 'password';
      pwd.type = isPwd ? 'text' : 'password';
      toggle.classList.toggle('fa-eye-slash', isPwd);
      toggle.classList.toggle('fa-eye', !isPwd);
    });

    // 输入时隐藏错误提示
    document.querySelectorAll('#login-form input').forEach(el => {
      el.addEventListener('input', () => this.hideError());
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
  },

  async handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      this.showError('请输入账号和密码');
      return;
    }

    const res = await Utils.post('/api/auth/login', { username, password });
    if (!res) return;

    Utils.storage.set('login-token', res.data.token);
    Utils.storage.set('login-user', res.data.user);
    location.href = 'index.html';
  },


  showError(msg) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = msg;
    errorEl.classList.add('show');
  },

  hideError() {
    document.getElementById('login-error').classList.remove('show');
  }
};

document.addEventListener('DOMContentLoaded', () => LoginPage.init());
