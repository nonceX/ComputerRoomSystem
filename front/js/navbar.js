const Navbar = {
  init() {
    this.applySystemLogo();
    this.applyUserInfo();
    this.applyAvatar();
    this.bindEvents();
  },

  // images/system-logo.png 存在时显示图片，否则保留默认系统图标。
  applySystemLogo() {
    const img = document.getElementById('system-logo-img');
    const fallback = document.getElementById('system-logo-default');
    if (!img || !fallback) return;

    const probe = new Image();
    probe.onload = () => {
      img.src = probe.src;
      img.style.display = 'block';
      fallback.style.display = 'none';
    };
    probe.onerror = () => {
      img.removeAttribute('src');
      img.style.display = 'none';
      fallback.style.display = 'inline-flex';
    };
    probe.src = 'images/system-logo.png';
  },

  applyUserInfo() {
    const user = Utils.storage.get('login-user', {});
    const nickname = document.querySelector('.user-nickname');
    if (!nickname) return;

    const name = user.name || user.username || '未登录';
    const role = user.role || {
      root: '超级管理员',
      admin: '管理员',
      user: '普通用户'
    }[user.roleCode] || '';
    nickname.textContent = role ? `${name}（${role}）` : name;
    nickname.title = nickname.textContent;
  },

  // 顶部头像：已上传自定义头像则用之，否则显示默认图
  applyAvatar() {
    const img = document.querySelector('.user-avatar');
    const fallback = document.querySelector('.user-avatar-default');
    if (!img || !fallback) return;

    const src = Utils.getAvatar();
    if (src) {
      img.src = src;
      img.style.display = 'block';
      fallback.style.display = 'none';
    } else {
      img.removeAttribute('src');
      img.style.display = 'none';
      fallback.style.display = 'inline-flex';
    }
  },

  bindEvents() {
    // 用户头像下拉菜单
    const avatarDropdown = document.getElementById('avatar-dropdown');
    const dropdownMenu = document.getElementById('user-dropdown-menu');

    avatarDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.style.display === 'block';
      dropdownMenu.style.display = isOpen ? 'none' : 'block';
    });

    // 点击页面其他任意处，关闭下拉菜单
    document.addEventListener('click', () => {
      dropdownMenu.style.display = 'none';
    });

    // 下拉菜单项：用 data-action 而不是文案匹配，改文案不会破坏逻辑
    dropdownMenu.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-action]');
      if (!li) return;

      switch (li.dataset.action) {
        case 'profile':
          AppRouter.navigate('/user');
          break;
        case 'settings':
          Settings.open();
          break;
        case 'logout':
          if (confirm('确定注销并退出系统吗？')) {
            Utils.storage.remove('login-token');
            Utils.storage.remove('login-user');
            window.location.href = 'login.html';
          }
          break;
      }
    });

    // 面包屑：点击父级跳回对应页面
    document.getElementById('breadcrumb').addEventListener('click', (e) => {
      const link = e.target.closest('a[data-path]');
      if (!link) return;
      e.preventDefault();
      AppRouter.navigate(link.dataset.path);
    });
  },

  // 更新面包屑（由 AppRouter.navigate 调用）
  updateBreadcrumb(pathChain) {
    const container = document.getElementById('breadcrumb');
    container.innerHTML = pathChain.map((item, i) => {
      const title = Utils.escapeHTML(item.title);
      if (i === pathChain.length - 1) {
        return `<span class="breadcrumb-item active">${title}</span>`;
      }
      return `
        <span class="breadcrumb-item"><a href="#" data-path="${item.path}">${title}</a></span>
        <span class="breadcrumb-separator">/</span>
      `;
    }).join('');
  }
};
