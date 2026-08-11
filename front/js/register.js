const RegisterPage = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegister();
    });

    // 取消 → 返回登录页
    document.getElementById('btn-cancel').addEventListener('click', () => {
      location.href = 'login.html';
    });

    // 输入时隐藏错误提示
    document.querySelectorAll('#register-form input, #register-form select').forEach(el => {
      el.addEventListener('input', () => this.hideError());
    });
  },

  async handleRegister() {
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;
    if (password !== confirmPassword) {
      this.showError('两次输入的密码不一致');
      return;
    }

    const data = {
      username: document.getElementById('reg-username').value.trim(),
      password,
      name: document.getElementById('reg-name').value.trim(),
      no: document.getElementById('reg-no').value.trim(),
      dept: document.getElementById('reg-department').value,
      phone: document.getElementById('reg-phone').value.trim()
    };

    const res = await Utils.post('/api/auth/register', data);
    if (!res) return;

    alert('注册成功，请登录');
    location.href = 'login.html';
  },


  showError(msg) {
    const el = document.getElementById('reg-error');
    el.textContent = msg;
    el.classList.add('show');
  },

  hideError() {
    document.getElementById('reg-error').classList.remove('show');
  },

  showSuccess() {
    const btn = document.querySelector('#register-form .btn-login');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-check"></i> 注册成功，正在跳转登录...';
    btn.disabled = true;
    setTimeout(() => {
      location.href = 'login.html';
    }, 800);
  }
};

document.addEventListener('DOMContentLoaded', () => RegisterPage.init());
