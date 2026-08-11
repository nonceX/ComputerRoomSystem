// 个人中心页面逻辑
const UserPage = {
  init() {
    this.renderProfile();
    this.loadAvatar();
    this.bindEvents();
  },

  // 读取登录态 / 注册资料回填个人信息
  renderProfile() {
    const user = Utils.storage.get('login-user');
    const username = user?.username || '未登录';
    document.getElementById('profile-name').textContent = user?.name || username;
    document.getElementById('profile-username').textContent = `账号：${username}`;
  },

  // 恢复已保存的头像；没有则显示默认图
  loadAvatar() {
    this.showImage(Utils.getAvatar());
  },

  bindEvents() {
    document.getElementById('btn-user-save-pwd').addEventListener('click', () => this.savePassword());

    // 点击头像 → 打开文件选择
    const wrap = document.getElementById('profile-avatar-wrap');
    const fileInput = document.getElementById('profile-avatar-file');
    wrap.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        fileInput.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('头像图片不能超过 2MB');
        fileInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (!Utils.setAvatar(reader.result)) {
          alert('头像保存失败，浏览器存储空间不足');
          return;
        }
        this.showImage(reader.result);
        // 同步更新顶部导航栏头像
        Navbar.applyAvatar?.();
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    });
  },

  showImage(src) {
    const img = document.getElementById('profile-avatar-img');
    const icon = document.getElementById('profile-avatar-icon');
    if (src) {
      img.src = src;
      img.style.display = 'block';
      icon.style.display = 'none';
    } else {
      img.removeAttribute('src');
      img.style.display = 'none';
      icon.style.display = '';
    }
  },

  async savePassword() {
    const oldPassword = document.getElementById('user-old-pwd').value;
    const newPassword = document.getElementById('user-new-pwd').value;
    const confirmPassword = document.getElementById('user-confirm-pwd').value;
    if (!oldPassword || !newPassword) return alert('请填写原密码和新密码');
    if (newPassword !== confirmPassword) return alert('两次输入的新密码不一致');

    const res = await Utils.put('/api/auth/password', {oldPassword, newPassword});
    if (!res) return;
    document.getElementById('user-old-pwd').value = '';
    document.getElementById('user-new-pwd').value = '';
    document.getElementById('user-confirm-pwd').value = '';
    alert('密码修改成功，请重新登录');
    Utils.storage.remove('login-token');
    Utils.storage.remove('login-user');
    location.href = 'login.html';
  },
};


// 暴露到全局，供 router.js 按页面名调用 init
window.UserPage = UserPage;
