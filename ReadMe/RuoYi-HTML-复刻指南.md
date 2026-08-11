# RuoYi UI 纯 HTML 复刻指南

> 目标：用纯 HTML + CSS + 原生 JavaScript 复刻 RuoYi v3.9.2 后台管理界面
>
> 对照版本：RuoYi-Vue v3.9.2（前后端分离版）
>
> 原技术栈：Vue 2.6 + Element UI 2.15 + Vue Router + Vuex

---

## 目录

1. [总览：页面布局结构](#1-总览页面布局结构)
2. [设计令牌：CSS 变量全集](#2-设计令牌css-变量全集)
3. [文件结构建议](#3-文件结构建议)
4. [HTML 骨架](#4-html-骨架)
5. [全局样式](#5-全局样式)
6. [侧边栏 Sidebar](#6-侧边栏-sidebar)
7. [顶部导航栏 Navbar](#7-顶部导航栏-navbar)
8. [标签页栏 TagsView](#8-标签页栏-tagsview)
9. [主内容区 AppMain](#9-主内容区-appmain)
10. [布局设置抽屉](#10-布局设置抽屉)
11. [响应式适配（移动端）](#11-响应式适配移动端)
12. [主题切换系统](#12-主题切换系统)
13. [推荐的实施顺序](#13-推荐的实施顺序)
14. [附录：关键尺寸速查表](#14-附录关键尺寸速查表)

---

## 1. 总览：页面布局结构

```
┌──────────────────────────────────────────────────────────────┐
│  body (height: 100vh, overflow: hidden, margin: 0)          │
│  ┌─────────────┬──────────────────────────────────────────┐  │
│  │  侧边栏       │  右侧主容器 .main-container                │  │
│  │  .sidebar-   │  (flex: 1; display: flex; flex-dir:     │  │
│  │  container   │   column; overflow: hidden)              │  │
│  │             │  ┌────────────────────────────────────┐  │  │
│  │  width:     │  │  导航栏 .navbar                      │  │  │
│  │  200px      │  │  height: 50px, background: #fff     │  │  │
│  │  (折叠:     │  │  box-shadow: 0 1px 4px rgba(...)   │  │  │
│  │  54px)      │  ├────────────────────────────────────┤  │  │
│  │             │  │  标签页 .tags-view-container         │  │  │
│  │  position:  │  │  height: 34px, background: #fff     │  │  │
│  │  fixed      │  │  border-bottom: 1px solid #d8dce5   │  │  │
│  │             │  ├────────────────────────────────────┤  │  │
│  │  overflow-  │  │                                    │  │  │
│  │  y: auto    │  │  主内容区 .app-main                  │  │  │
│  │             │  │  flex: 1, overflow-y: auto          │  │  │
│  │             │  │  padding: 20px                      │  │  │
│  │             │  │  background: #f0f2f5                │  │  │
│  │             │  └────────────────────────────────────┘  │  │
│  └─────────────┴──────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 布局要点

- **最外层**：`display: flex; height: 100vh; overflow: hidden` — 禁止整个页面滚动，滚动仅在内容区内部发生
- **侧边栏**：`position: fixed; left: 0; top: 0; bottom: 0; width: 200px; z-index: 1001` — 固定定位，撑满左侧全高
- **右侧主容器**：`margin-left: 200px; flex: 1; display: flex; flex-direction: column; overflow: hidden` — 左侧留出侧边栏宽度
- **固定 Header 模式**：当开启固定 Header 时，`.fixed-header`（包含 Navbar + TagsView）设为 `position: fixed; top: 0; right: 0; z-index: 9`，AppMain 需要额外 `margin-top: 84px`

---

## 2. 设计令牌：CSS 变量全集

### 颜色变量

```css
:root {
  /* ===== 主题色（默认 Element UI 蓝） ===== */
  --color-primary: #409EFF;
  --color-primary-light: #409EFF1a;   /* 主题色 + 10% 透明度 */
  --color-primary-dark-bg: #409EFF33; /* 主题色 + 20% 透明度 */

  /* ===== 侧边栏暗色主题 ===== */
  --menu-dark-bg: #1a1f2e;            /* 一级菜单背景 */
  --menu-dark-sub-bg: #141824;        /* 子菜单背景 */
  --menu-dark-color: #bfcbd9;         /* 菜单文字色 */
  --menu-dark-color-active: #ffffff;  /* 菜单激活文字色 */
  --menu-dark-hover: rgba(255,255,255,.06); /* 菜单 hover 背景 */
  --logo-dark-title-color: #ffffff;   /* Logo 标题色（暗主题） */
  --logo-dark-bg: #2b2f3a;            /* Logo 区域背景（暗主题） */

  /* ===== 侧边栏亮色主题 ===== */
  --menu-light-bg: #ffffff;
  --menu-light-color: rgba(0,0,0,.70);
  --menu-light-color-active: var(--color-primary);
  --menu-light-hover: rgba(0,0,0,.06);
  --logo-light-title-color: #001529;
  --logo-light-bg: #ffffff;

  /* ===== 顶部导航栏 ===== */
  --navbar-bg: #ffffff;
  --navbar-height: 50px;
  --navbar-shadow: 0 1px 4px rgba(0,21,41,.08);
  --navbar-text-color: #5a5e66;
  --navbar-hover-bg: rgba(0,0,0,.025);

  /* ===== 标签页栏 ===== */
  --tags-height: 34px;
  --tags-bg: #ffffff;
  --tags-border: #d8dce5;
  --tags-item-text: #495060;
  --tags-item-active-bg: #42b983;
  --tags-item-active-text: #ffffff;
  --tags-item-height: 26px;
  --tags-btn-color: #71717a;
  --tags-btn-hover-bg: #f0f2f5;
  --tags-btn-hover-color: #303133;

  /* ===== 主内容区 ===== */
  --app-main-bg: #f0f2f5;
  --app-main-padding: 20px;

  /* ===== 布局尺寸 ===== */
  --sidebar-width: 200px;
  --sidebar-collapsed-width: 54px;

  /* ===== 过渡动画 ===== */
  --transition-sidebar: width 0.28s;
  --transition-all: all 0.3s cubic-bezier(.645, .045, .355, 1);

  /* ===== 滚动条 ===== */
  --scrollbar-width: 6px;
  --scrollbar-track: #f1f1f1;
  --scrollbar-thumb: #c0c0c0;
}
```

### 如何使用 CSS 变量实现主题切换

整个页面所有颜色都引用 CSS 变量，切换主题时只需修改 CSS 变量的值：

```css
/* 暗色侧边栏主题（默认） */
[data-side-theme="theme-dark"] {
  --sidebar-bg: var(--menu-dark-bg);
  --sidebar-sub-bg: var(--menu-dark-sub-bg);
  --sidebar-text: var(--menu-dark-color);
  --sidebar-text-active: var(--menu-dark-color-active);
  --sidebar-hover: var(--menu-dark-hover);
  --logo-bg: var(--logo-dark-bg);
  --logo-title-color: var(--logo-dark-title-color);
}

/* 亮色侧边栏主题 */
[data-side-theme="theme-light"] {
  --sidebar-bg: var(--menu-light-bg);
  --sidebar-sub-bg: var(--menu-light-bg);
  --sidebar-text: var(--menu-light-color);
  --sidebar-text-active: var(--menu-light-color-active);
  --sidebar-hover: var(--menu-light-hover);
  --logo-bg: var(--logo-light-bg);
  --logo-title-color: var(--logo-light-title-color);
}
```

---

## 3. 文件结构建议

```
ruoyi-html/
├── index.html              # 主入口文件（布局框架）
├── pages/
│   ├── login.html          # 登录页（独立页面）
│   ├── dashboard.html      # 首页内容
│   ├── system-user.html    # 系统管理-用户管理
│   └── ...                 # 其他页面
├── css/
│   ├── reset.css           # CSS Reset
│   ├── variables.css       # CSS 变量（设计令牌）
│   ├── layout.css          # 布局框架样式
│   ├── sidebar.css         # 侧边栏样式
│   ├── navbar.css          # 顶部导航栏样式
│   ├── tagsview.css        # 标签页样式
│   ├── appmain.css         # 主内容区样式
│   ├── settings.css        # 设置抽屉样式
│   ├── responsive.css      # 响应式 / 移动端样式
│   └── theme.css           # 主题色切换样式
├── js/
│   ├── app.js              # 全局 App 状态管理（模拟 Vuex）
│   ├── router.js           # 前端路由（hash 模式）
│   ├── menu.js             # 菜单数据 + 渲染逻辑
│   ├── sidebar.js          # 侧边栏折叠 / 展开
│   ├── navbar.js           # 导航栏交互（全屏/搜索/下拉）
│   ├── tagsview.js         # 标签页逻辑（核心难点）
│   ├── settings.js         # 布局设置抽屉 + localStorage 持久化
│   └── utils.js            # 工具函数
├── assets/
│   ├── logo.png            # Logo 图片 (32×32)
│   └── icons/              # SVG 图标
└── README.md
```

> **注意**：以上只是在开发阶段的文件组织方式。最终上线时建议把所有 CSS 合并为 1-2 个文件、所有 JS 合并压缩为一个文件，以减少 HTTP 请求。

---

## 4. HTML 骨架

### `index.html` — 主布局框架

```html
<!DOCTYPE html>
<html lang="zh-CN" data-side-theme="theme-dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RuoYi 后台管理系统</title>
  <!-- 1. 引入字体图标（推荐 Font Awesome 6 或 Element UI Icons CDN） -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- 2. CSS Reset -->
  <link rel="stylesheet" href="css/reset.css">
  <!-- 3. CSS 变量 -->
  <link rel="stylesheet" href="css/variables.css">
  <!-- 4. 布局和各组件样式 -->
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/sidebar.css">
  <link rel="stylesheet" href="css/navbar.css">
  <link rel="stylesheet" href="css/tagsview.css">
  <link rel="stylesheet" href="css/appmain.css">
  <link rel="stylesheet" href="css/settings.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <!-- ========== 最外层容器 ========== -->
  <div id="app" class="app-wrapper">
    
    <!-- ========== 移动端遮罩层（侧边栏打开时显示） ========== -->
    <div id="drawer-bg" class="drawer-bg" style="display:none;"></div>

    <!-- ========== 左侧：侧边栏 ========== -->
    <aside id="sidebar" class="sidebar-container">
      <!-- Logo 区域 -->
      <div class="sidebar-logo-container">
        <a href="#" class="sidebar-logo-link">
          <img src="assets/logo.png" alt="logo" class="sidebar-logo">
          <h1 class="sidebar-title">RuoYi</h1>
        </a>
      </div>
      <!-- 菜单区域：用 JS 动态渲染 -->
      <div class="sidebar-menu-wrapper" id="sidebar-menu">
        <!-- 菜单内容由 js/menu.js 动态生成 -->
      </div>
    </aside>

    <!-- ========== 右侧：主容器 ========== -->
    <div id="main-container" class="main-container has-tags-view">
      
      <!-- 固定头部区域（当 fixedHeader 为 true 时 fixed 定位） -->
      <div id="fixed-header" class="fixed-header">
        
        <!-- 顶部导航栏 -->
        <nav id="navbar" class="navbar">
          <!-- 汉堡按钮 -->
          <span class="hamburger-container" id="hamburger-btn">
            <svg class="hamburger-icon" viewBox="0 0 1024 1024" width="20" height="20">
              <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z" fill="currentColor"/>
            </svg>
          </span>
          <!-- 面包屑导航 -->
          <div id="breadcrumb" class="breadcrumb-container">
            <span class="breadcrumb-item"><a href="#">首页</a></span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">系统管理</span>
          </div>
          <!-- 右侧菜单 -->
          <div class="right-menu">
            <span class="right-menu-item" title="搜索"><i class="fa fa-search"></i></span>
            <span class="right-menu-item" title="全屏" id="fullscreen-btn"><i class="fa fa-expand"></i></span>
            <span class="right-menu-item" title="消息通知"><i class="fa fa-bell"></i></span>
            <!-- 用户头像下拉 -->
            <div class="avatar-container" id="avatar-dropdown">
              <div class="avatar-wrapper">
                <img src="assets/avatar.png" class="user-avatar" alt="avatar">
                <span class="user-nickname">Admin</span>
                <i class="fa fa-caret-down" style="font-size:12px;"></i>
              </div>
              <!-- 下拉菜单 -->
              <ul class="dropdown-menu" id="user-dropdown-menu" style="display:none;">
                <li><i class="fa fa-user"></i> 个人中心</li>
                <li id="btn-layout-settings"><i class="fa fa-cog"></i> 布局设置</li>
                <li><i class="fa fa-lock"></i> 锁定屏幕</li>
                <li class="dropdown-divider"></li>
                <li><i class="fa fa-sign-out"></i> 退出登录</li>
              </ul>
            </div>
          </div>
        </nav>

        <!-- 标签页栏 -->
        <div id="tags-view-container" class="tags-view-container">
          <!-- 左箭头 -->
          <span class="tags-nav-btn tags-nav-btn--left disabled" id="tags-scroll-left">
            <i class="fa fa-chevron-left"></i>
          </span>
          <!-- 标签滚动区 -->
          <div class="tags-view-wrapper" id="tags-view-wrapper">
            <span class="tags-view-item active">首页</span>
            <span class="tags-view-item">系统管理<i class="fa fa-times tag-close"></i></span>
            <span class="tags-view-item">用户管理<i class="fa fa-times tag-close"></i></span>
          </div>
          <!-- 右箭头 -->
          <span class="tags-nav-btn tags-nav-btn--right disabled" id="tags-scroll-right">
            <i class="fa fa-chevron-right"></i>
          </span>
          <!-- 下拉操作 -->
          <span class="tags-action-dropdown" id="tags-dropdown-btn">
            <i class="fa fa-chevron-down"></i>
          </span>
          <!-- 刷新按钮 -->
          <span class="tags-action-btn tags-refresh-btn" id="tags-refresh-btn">
            <i class="fa fa-refresh"></i> 刷新
          </span>
        </div>
      </div>

      <!-- 主内容区 -->
      <section id="app-main" class="app-main">
        <!-- 页面内容通过 JS 动态加载到此处 -->
        <!-- 底部版权 -->
        <div class="copyright">
          Copyright © 2018-2024 RuoYi All Rights Reserved.
        </div>
      </section>

    </div>

    <!-- ========== 右侧：布局设置抽屉 ========== -->
    <div id="settings-drawer-overlay" class="settings-overlay" style="display:none;"></div>
    <div id="settings-drawer" class="settings-drawer" style="display:none;">
      <div class="drawer-container">
        <!-- 菜单导航设置 -->
        <div class="drawer-section">
          <h3 class="drawer-title">菜单导航设置</h3>
          <div class="nav-type-selector">
            <div class="nav-type-item active" data-nav-type="1" title="左侧菜单">
              <b></b><b></b>
            </div>
            <div class="nav-type-item" data-nav-type="2" title="混合菜单">
              <b></b><b></b>
            </div>
            <div class="nav-type-item" data-nav-type="3" title="顶部菜单">
              <b></b><b></b>
            </div>
          </div>
        </div>

        <!-- 主题风格设置 -->
        <div class="drawer-section">
          <h3 class="drawer-title">主题风格设置</h3>
          <div class="theme-style-selector">
            <div class="theme-style-item selected" data-theme="theme-dark">
              <img src="assets/dark.svg" alt="暗色侧边栏">
              <span class="check-mark">✓</span>
            </div>
            <div class="theme-style-item" data-theme="theme-light">
              <img src="assets/light.svg" alt="亮色侧边栏">
              <span class="check-mark">✓</span>
            </div>
          </div>
          <div class="drawer-item">
            <span>主题颜色</span>
            <input type="color" id="theme-color-picker" value="#409EFF" class="color-picker">
          </div>
        </div>

        <hr>

        <!-- 系统布局配置 -->
        <h3 class="drawer-title">系统布局配置</h3>
        <div class="drawer-item">
          <span>开启页签</span>
          <label class="switch"><input type="checkbox" id="setting-tags-view" checked><span class="slider"></span></label>
        </div>
        <div class="drawer-item">
          <span>固定 Header</span>
          <label class="switch"><input type="checkbox" id="setting-fixed-header"><span class="slider"></span></label>
        </div>
        <div class="drawer-item">
          <span>显示 Logo</span>
          <label class="switch"><input type="checkbox" id="setting-sidebar-logo" checked><span class="slider"></span></label>
        </div>
        <div class="drawer-item">
          <span>底部版权</span>
          <label class="switch"><input type="checkbox" id="setting-footer-visible"><span class="slider"></span></label>
        </div>

        <hr>

        <button class="btn btn-primary" id="btn-save-settings">保存配置</button>
        <button class="btn btn-default" id="btn-reset-settings">重置配置</button>
      </div>
    </div>

  </div>

  <!-- ========== 脚本引入 ========== -->
  <script src="js/utils.js"></script>
  <script src="js/app.js"></script>
  <script src="js/menu.js"></script>
  <script src="js/sidebar.js"></script>
  <script src="js/navbar.js"></script>
  <script src="js/tagsview.js"></script>
  <script src="js/settings.js"></script>
  <script src="js/router.js"></script>
  <script>
    // 初始化应用
    document.addEventListener('DOMContentLoaded', function() {
      App.init();
    });
  </script>
</body>
</html>
```

---

## 5. 全局样式

### `reset.css`

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
               "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  color: #333;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

ul, ol { list-style: none; }

a {
  text-decoration: none;
  color: inherit;
}

img { max-width: 100%; }

/* ===== 自定义滚动条 ===== */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}

/* ===== 通用过渡 ===== */
.fade-enter, .fade-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
```

### `layout.css`

```css
/* ===== 最外层容器 ===== */
.app-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

/* ===== 侧边栏容器 ===== */
.sidebar-container {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);     /* 200px */
  z-index: 1001;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--sidebar-bg);
  transition: width var(--transition-sidebar);
}

/* 折叠状态 */
.sidebar-container.collapsed {
  width: var(--sidebar-collapsed-width);  /* 54px */
}

/* ===== 右侧主容器 ===== */
.main-container {
  margin-left: var(--sidebar-width);     /* 200px */
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: margin-left var(--transition-sidebar);
}

/* 侧边栏折叠时，右侧容器跟随展开 */
.sidebar-container.collapsed ~ .main-container {
  margin-left: var(--sidebar-collapsed-width);  /* 54px */
}

/* ===== 固定 Header 容器 ===== */
.fixed-header {
  /* 默认不固定，当开启 fixedHeader 时加 .is-fixed 类 */
  z-index: 9;
  flex-shrink: 0;
}

.fixed-header.is-fixed {
  position: fixed;
  top: 0;
  right: 0;
  width: calc(100% - var(--sidebar-width));
  transition: width var(--transition-sidebar);
}

.sidebar-container.collapsed ~ .main-container .fixed-header.is-fixed {
  width: calc(100% - var(--sidebar-collapsed-width));
}

/* 当 fixedHeader 时，主内容区需要额外 margin-top */
.fixed-header.is-fixed ~ .app-main {
  margin-top: 84px;  /* 50px navbar + 34px tags-view */
}
```

---

## 6. 侧边栏 Sidebar

### 6.1 侧边栏结构

侧边栏由两部分组成：
1. **Logo 区域**：固定在顶部，高度 50px
2. **菜单区域**：剩余空间，可滚动

### 6.2 CSS 样式 (`sidebar.css`)

```css
/* ===== Logo 区域 ===== */
.sidebar-logo-container {
  height: 50px;
  line-height: 50px;
  background-color: var(--logo-bg);
  text-align: center;
  overflow: hidden;
  transition: background-color 0.3s;
}

.sidebar-logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.sidebar-logo {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-right: 12px;
  flex-shrink: 0;
}

.sidebar-title {
  display: inline-block;
  margin: 0;
  color: var(--logo-title-color);
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  transition: opacity 0.28s;
}

/* 折叠时隐藏标题 */
.sidebar-container.collapsed .sidebar-logo-link {
  justify-content: center;
}
.sidebar-container.collapsed .sidebar-logo {
  margin-right: 0;
}
.sidebar-container.collapsed .sidebar-title {
  opacity: 0;
  width: 0;
}

/* ===== 菜单容器 ===== */
.sidebar-menu-wrapper {
  height: calc(100vh - 50px);  /* 总高 - Logo 高 */
  overflow-y: auto;
  overflow-x: hidden;
}

/* ===== 一级菜单项（有子菜单的情况） ===== */
.menu-submenu {
  /* 容器 */
}

.menu-submenu-title {
  display: flex;
  align-items: center;
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
  color: var(--sidebar-text);
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
}

.menu-submenu-title:hover {
  background-color: var(--sidebar-hover);
}

/* 展开状态 */
.menu-submenu.open > .menu-submenu-title {
  /* 可选：加深背景 */
}

/* 子菜单容器 — 折叠动画 */
.menu-submenu-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(.645, .045, .355, 1);
  background-color: var(--sidebar-sub-bg);
}

.menu-submenu.open > .menu-submenu-body {
  max-height: 600px;  /* 足够大即可，transition 作用于 max-height */
}

/* ===== 二级/三级菜单项 ===== */
.menu-item {
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 50px;
  padding: 0 20px 0 50px;  /* 左边距比一级多 30px */
  color: var(--sidebar-text);
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  transition: background-color 0.3s, color 0.3s;
}

.menu-item:hover {
  background-color: var(--sidebar-hover);
}

/* 激活状态：左边 3px 高亮条 + 主题色文字 */
.menu-item.active {
  color: var(--color-primary);
  position: relative;
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: var(--color-primary);
}

/* ===== 菜单图标 ===== */
.menu-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  font-size: 16px;
  text-align: center;
  flex-shrink: 0;
}

/* 折叠时：隐藏文字，只显示图标 */
.sidebar-container.collapsed .menu-submenu-title,
.sidebar-container.collapsed .menu-item {
  padding: 0;
  justify-content: center;
}
.sidebar-container.collapsed .menu-icon {
  margin-right: 0;
}
.sidebar-container.collapsed .menu-submenu-title span,
.sidebar-container.collapsed .menu-item span {
  display: none;  /* 隐藏文字 */
}

/* 折叠时子菜单箭头 */
.menu-arrow {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.3s;
}
.menu-submenu.open > .menu-submenu-title .menu-arrow {
  transform: rotate(90deg);
}
.sidebar-container.collapsed .menu-arrow {
  display: none;
}

/* 折叠时 hover 弹出子菜单 */
.sidebar-container.collapsed .menu-submenu-body {
  position: fixed;
  left: var(--sidebar-collapsed-width);
  /* top 由 JS 动态计算 */
  width: 160px;
  background: var(--sidebar-sub-bg);
  max-height: none;
  display: none;
  z-index: 2000;
  border-radius: 0 4px 4px 0;
  box-shadow: 2px 2px 8px rgba(0,0,0,.15);
}
.sidebar-container.collapsed .menu-submenu:hover .menu-submenu-body {
  display: block;
}
```

### 6.3 菜单数据结构 (`js/menu.js`)

```javascript
// 菜单数据：模拟 RuoYi 后端返回的路由表
const MENU_DATA = [
  {
    path: '/index',
    name: 'Index',
    meta: { title: '首页', icon: 'fa-home', affix: true },
    hidden: false
  },
  {
    path: '/system',
    name: 'System',
    meta: { title: '系统管理', icon: 'fa-cog' },
    hidden: false,
    children: [
      {
        path: '/system/user',
        name: 'User',
        meta: { title: '用户管理', icon: 'fa-user' },
        hidden: false
      },
      {
        path: '/system/role',
        name: 'Role',
        meta: { title: '角色管理', icon: 'fa-users' },
        hidden: false
      },
      {
        path: '/system/menu',
        name: 'Menu',
        meta: { title: '菜单管理', icon: 'fa-list' },
        hidden: false
      }
    ]
  },
  {
    path: '/monitor',
    name: 'Monitor',
    meta: { title: '系统监控', icon: 'fa-desktop' },
    hidden: false,
    children: [
      {
        path: '/monitor/online',
        name: 'Online',
        meta: { title: '在线用户', icon: 'fa-circle' },
        hidden: false
      },
      {
        path: '/monitor/log',
        name: 'Log',
        meta: { title: '操作日志', icon: 'fa-file-text' },
        hidden: false
      }
    ]
  }
  // ... 更多菜单
];

// 渲染菜单到侧边栏
const MenuRenderer = {
  /**
   * 递归渲染菜单
   * @param {Array} menuList - 菜单数据
   * @param {HTMLElement} container - 容器元素
   */
  render(menuList, container) {
    container.innerHTML = '';
    menuList.forEach(item => {
      if (item.hidden) return;

      if (item.children && item.children.length > 0) {
        // 有子菜单 — 渲染为 submenu
        this.renderSubmenu(item, container);
      } else {
        // 无子菜单 — 渲染为普通菜单项
        this.renderMenuItem(item, container);
      }
    });
  },

  renderSubmenu(item, container) {
    const submenu = document.createElement('div');
    submenu.className = 'menu-submenu';
    submenu.dataset.path = item.path;

    // 标题栏
    const title = document.createElement('div');
    title.className = 'menu-submenu-title';
    title.innerHTML = `
      <i class="fa ${item.meta.icon} menu-icon"></i>
      <span>${item.meta.title}</span>
      <i class="fa fa-chevron-right menu-arrow"></i>
    `;
    title.addEventListener('click', () => {
      submenu.classList.toggle('open');
    });

    // 子菜单体
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
    menuItem.className = 'menu-item';
    menuItem.dataset.path = item.path;
    menuItem.innerHTML = `
      <i class="fa ${item.meta.icon} menu-icon"></i>
      <span>${item.meta.title}</span>
    `;

    // 点击菜单项 -> 导航到对应页面
    menuItem.addEventListener('click', () => {
      AppRouter.navigate(item);
      // 高亮当前菜单
      document.querySelectorAll('.menu-item.active').forEach(el => el.classList.remove('active'));
      menuItem.classList.add('active');
    });

    container.appendChild(menuItem);
  }
};
```

---

## 7. 顶部导航栏 Navbar

### 7.1 CSS 样式 (`navbar.css`)

```css
/* ===== 导航栏主体 ===== */
.navbar {
  height: var(--navbar-height);         /* 50px */
  background: var(--navbar-bg);         /* #fff */
  box-shadow: var(--navbar-shadow);     /* 0 1px 4px rgba(0,21,41,.08) */
  display: flex;
  align-items: center;
  padding: 0 8px;
  position: relative;
  z-index: 10;
}

/* ===== 汉堡按钮 ===== */
.hamburger-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 100%;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.3s;
  color: var(--navbar-text-color);
}
.hamburger-container:hover {
  background-color: var(--navbar-hover-bg);
}
.hamburger-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}
/* 侧边栏折叠时旋转 180° */
.hamburger-icon.is-active {
  transform: rotate(180deg);
}

/* ===== 面包屑导航 ===== */
.breadcrumb-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 50px;
}
.breadcrumb-item { color: #333; }
.breadcrumb-item a:hover { color: var(--color-primary); }
.breadcrumb-item.active { color: #97a8be; cursor: text; }
.breadcrumb-separator {
  margin: 0 9px;
  color: #c0c4cc;
  font-weight: 700;
}

/* ===== 右侧菜单区 ===== */
.right-menu {
  margin-left: auto;
  display: flex;
  align-items: center;
  height: 100%;
}

.right-menu-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: var(--navbar-text-color);
  cursor: pointer;
  transition: background-color 0.3s;
}
.right-menu-item:hover {
  background-color: var(--navbar-hover-bg);
}

/* ===== 用户头像区域 ===== */
.avatar-container {
  position: relative;
  cursor: pointer;
  padding: 0 8px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.user-nickname {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

/* ===== 下拉菜单 ===== */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 140px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,.1);
  padding: 5px 0;
  z-index: 2000;
  font-size: 14px;
}

.dropdown-menu li {
  padding: 8px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  transition: background-color 0.2s;
}
.dropdown-menu li:hover {
  background-color: #f5f7fa;
}

.dropdown-divider {
  height: 1px;
  margin: 5px 0;
  background: #e4e7ed;
}
```

### 7.2 JS 交互 (`js/navbar.js`)

```javascript
const Navbar = {
  init() {
    // 汉堡按钮：切换侧边栏折叠
    document.getElementById('hamburger-btn').addEventListener('click', () => {
      App.toggleSidebar();
    });

    // 全屏按钮
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    });

    // 用户头像下拉菜单
    const avatarDropdown = document.getElementById('avatar-dropdown');
    const dropdownMenu = document.getElementById('user-dropdown-menu');

    avatarDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.style.display = 
        dropdownMenu.style.display === 'none' ? 'block' : 'none';
    });

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', () => {
      dropdownMenu.style.display = 'none';
    });

    // 退出登录
    dropdownMenu.querySelector('li:last-child').addEventListener('click', () => {
      if (confirm('确定注销并退出系统吗？')) {
        window.location.href = 'pages/login.html';
      }
    });
  },

  // 更新面包屑
  updateBreadcrumb(pathChain) {
    const container = document.getElementById('breadcrumb');
    container.innerHTML = pathChain.map((item, i) => {
      if (i === pathChain.length - 1) {
        return `<span class="breadcrumb-item active">${item.title}</span>`;
      }
      return `
        <span class="breadcrumb-item"><a href="#" data-path="${item.path}">${item.title}</a></span>
        <span class="breadcrumb-separator">/</span>
      `;
    }).join('');
  }
};
```

---

## 8. 标签页栏 TagsView

这是整个项目中**JS 逻辑最复杂的部分**，核心功能：
- 维护已访问页面的标签列表
- 支持点击切换、关闭（包括关闭当前/其他/左侧/右侧/全部）
- 标签过多时水平滚动
- 右键上下文菜单

### 8.1 CSS 样式 (`tagsview.css`)

```css
/* ===== 标签页栏主体 ===== */
.tags-view-container {
  height: var(--tags-height);           /* 34px */
  background: var(--tags-bg);           /* #fff */
  border-bottom: 1px solid var(--tags-border);
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* 左右滚动箭头 */
.tags-nav-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 100%;
  cursor: pointer;
  color: var(--tags-btn-color);
  font-size: 13px;
  user-select: none;
  transition: background-color 0.15s, color 0.15s;
}
.tags-nav-btn:hover:not(.disabled) {
  background: var(--tags-btn-hover-bg);
  color: var(--tags-btn-hover-color);
}
.tags-nav-btn.disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}
.tags-nav-btn--left  { border-right: 1px solid var(--tags-border); }
.tags-nav-btn--right { border-left: 1px solid var(--tags-border); }

/* ===== 标签滚动区 ===== */
.tags-view-wrapper {
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

/* 隐藏标签区滚动条 */
.tags-view-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* ===== 单个标签 ===== */
.tags-view-item {
  display: inline-flex;
  align-items: center;
  position: relative;
  height: var(--tags-item-height);      /* 26px */
  line-height: 1;
  border: 1px solid var(--tags-border);
  border-radius: 3px;
  color: var(--tags-item-text);         /* #495060 */
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  flex-shrink: 0;
}

.tags-view-item:first-child {
  margin-left: 6px;
}
.tags-view-item:last-child {
  margin-right: 15px;  /* 留出空间给关闭按钮 */
}

/* 激活标签 */
.tags-view-item.active {
  background-color: var(--tags-item-active-bg);  /* #42b983 */
  color: var(--tags-item-active-text);
  border-color: var(--tags-item-active-bg);
}

/* 激活标签左边的圆点指示器 */
.tags-view-item.active::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  margin-right: 4px;
}

/* 标签关闭按钮 */
.tag-close {
  margin-left: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  transition: background-color 0.2s, color 0.2s;
}
.tag-close:hover {
  background-color: #b4bccc;
  color: #fff;
}

/* 不可关闭的标签（如首页 affix 标签） */
.tags-view-item.affix .tag-close {
  display: none;
}

/* ===== 操作按钮（下拉菜单 + 刷新） ===== */
.tags-action-dropdown,
.tags-refresh-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 100%;
  cursor: pointer;
  color: var(--tags-btn-color);
  font-size: 13px;
  border-left: 1px solid var(--tags-border);
  transition: background-color 0.15s, color 0.15s;
}
.tags-refresh-btn {
  width: 60px;
  font-size: 12px;
}
.tags-action-dropdown:hover,
.tags-refresh-btn:hover {
  background: var(--tags-btn-hover-bg);
  color: var(--tags-btn-hover-color);
}

/* ===== 右键上下文菜单 ===== */
.contextmenu {
  position: fixed;
  z-index: 3000;
  background: #fff;
  border-radius: 4px;
  box-shadow: 2px 2px 3px 0 rgba(0,0,0,.3);
  padding: 5px 0;
  font-size: 12px;
  min-width: 120px;
}

.contextmenu li {
  padding: 7px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}
.contextmenu li:hover {
  background: #eee;
}
```

### 8.2 JS 逻辑 (`js/tagsview.js`)

```javascript
/**
 * 标签页管理器
 * 
 * 核心数据结构：visitedViews 数组
 * 每个元素：{ path, name, title, icon, query, affix }
 */
const TagsView = {
  visitedViews: [],       // 已访问的页面标签列表
  currentPath: '/index',  // 当前激活的页面路径
  affixTags: [],          // 固定标签（如首页）
  contextMenuTag: null,   // 右键菜单所操作的标签

  init() {
    // 初始化：加载首页标签
    this.addView({ 
      path: '/index', 
      name: 'Index', 
      title: '首页', 
      icon: 'fa-home', 
      affix: true 
    });

    // 事件绑定
    this.bindEvents();
  },

  /**
   * 添加标签页
   */
  addView(route) {
    // 如果已存在，不重复添加
    if (this.visitedViews.find(v => v.path === route.path)) {
      this.setActive(route.path);
      return;
    }
    this.visitedViews.push({
      path: route.path,
      name: route.name,
      title: route.title,
      icon: route.icon || '',
      affix: route.affix || false
    });
    this.render();
    this.setActive(route.path);
  },

  /**
   * 关闭标签页
   */
  closeView(path) {
    const idx = this.visitedViews.findIndex(v => v.path === path);
    if (idx === -1) return;
    const view = this.visitedViews[idx];
    if (view.affix) return;  // 固定标签不可关闭

    this.visitedViews.splice(idx, 1);

    // 如果关闭的是当前标签，激活相邻标签
    if (path === this.currentPath) {
      const newIdx = Math.min(idx, this.visitedViews.length - 1);
      if (this.visitedViews[newIdx]) {
        this.setActive(this.visitedViews[newIdx].path);
        AppRouter.push(this.visitedViews[newIdx]);
      }
    }

    this.render();
  },

  /**
   * 关闭其他标签
   */
  closeOthers(path) {
    this.visitedViews = this.visitedViews.filter(v => 
      v.path === path || v.affix
    );
    this.setActive(path);
    this.render();
  },

  /**
   * 关闭左侧标签
   */
  closeLeft(path) {
    const idx = this.visitedViews.findIndex(v => v.path === path);
    this.visitedViews = this.visitedViews.filter((v, i) => 
      i >= idx || v.affix
    );
    this.setActive(path);
    this.render();
  },

  /**
   * 关闭右侧标签
   */
  closeRight(path) {
    const idx = this.visitedViews.findIndex(v => v.path === path);
    this.visitedViews = this.visitedViews.filter((v, i) => 
      i <= idx || v.affix
    );
    this.setActive(path);
    this.render();
  },

  /**
   * 关闭全部标签（保留 affix 标签）
   */
  closeAll() {
    this.visitedViews = this.visitedViews.filter(v => v.affix);
    if (this.visitedViews.length > 0) {
      this.setActive(this.visitedViews[0].path);
    }
    this.render();
  },

  /**
   * 设置激活标签
   */
  setActive(path) {
    this.currentPath = path;
    // 更新 DOM 中的 active 状态
    document.querySelectorAll('.tags-view-item').forEach(el => {
      el.classList.toggle('active', el.dataset.path === path);
    });
    // 滚动到当前标签
    this.scrollToActive();
  },

  /**
   * 滚动标签区使当前激活标签可见
   */
  scrollToActive() {
    const wrapper = document.getElementById('tags-view-wrapper');
    const activeEl = wrapper.querySelector('.tags-view-item.active');
    if (!activeEl) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    if (activeRect.left < wrapperRect.left) {
      // 标签在左侧不可见 — 向左滚动
      wrapper.scrollLeft -= (wrapperRect.left - activeRect.left + 10);
    } else if (activeRect.right > wrapperRect.right) {
      // 标签在右侧不可见 — 向右滚动
      wrapper.scrollLeft += (activeRect.right - wrapperRect.right + 10);
    }

    this.updateArrowState();
  },

  /**
   * 更新左右箭头状态（是否可点击）
   */
  updateArrowState() {
    const wrapper = document.getElementById('tags-view-wrapper');
    const canLeft = wrapper.scrollLeft > 0;
    const canRight = wrapper.scrollLeft < (wrapper.scrollWidth - wrapper.clientWidth - 1);

    document.getElementById('tags-scroll-left').classList.toggle('disabled', !canLeft);
    document.getElementById('tags-scroll-right').classList.toggle('disabled', !canRight);
  },

  /**
   * 重新渲染所有标签
   */
  render() {
    const wrapper = document.getElementById('tags-view-wrapper');
    wrapper.innerHTML = this.visitedViews.map(v => `
      <span class="tags-view-item${v.path === this.currentPath ? ' active' : ''}${v.affix ? ' affix' : ''}" 
            data-path="${v.path}" 
            title="${v.title}">
        ${v.path === this.currentPath && !v.affix ? '' : ''}
        ${v.title}
        ${!v.affix ? '<i class="fa fa-times tag-close"></i>' : ''}
      </span>
    `).join('');

    // 重新绑定标签事件
    this.bindTagEvents();
    this.updateArrowState();
  },

  /**
   * 绑定标签点击、关闭、右键事件
   */
  bindTagEvents() {
    const wrapper = document.getElementById('tags-view-wrapper');

    // 点击标签 — 切换页面
    wrapper.querySelectorAll('.tags-view-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-close')) return;
        const path = el.dataset.path;
        this.setActive(path);
        AppRouter.pushByPath(path);
      });

      // 点击关闭按钮
      el.querySelector('.tag-close')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeView(el.dataset.path);
      });

      // 右键菜单
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.contextMenuTag = el.dataset;
        this.showContextMenu(e.clientX, e.clientY);
      });
    });

    // 滚动事件 — 更新箭头状态
    wrapper.addEventListener('scroll', () => this.updateArrowState());
  },

  /**
   * 显示右键上下文菜单
   */
  showContextMenu(x, y) {
    // 先移除旧菜单
    document.querySelector('.contextmenu')?.remove();

    const tag = this.visitedViews.find(v => v.path === this.contextMenuTag.path);
    if (!tag) return;

    // 判断是不是第一个/最后一个标签
    const idx = this.visitedViews.indexOf(tag);
    const isFirst = idx <= (this.visitedViews[0]?.affix ? 1 : 0);
    const isLast = idx === this.visitedViews.length - 1;

    const menu = document.createElement('ul');
    menu.className = 'contextmenu';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';

    const items = [
      { text: '刷新页面', icon: 'fa-refresh', action: () => AppRouter.refresh() },
      ...(tag.affix ? [] : [{ text: '关闭当前', icon: 'fa-times', action: () => this.closeView(tag.path) }]),
      { text: '关闭其他', icon: 'fa-circle-o', action: () => this.closeOthers(tag.path) },
      ...(isFirst ? [] : [{ text: '关闭左侧', icon: 'fa-arrow-left', action: () => this.closeLeft(tag.path) }]),
      ...(isLast  ? [] : [{ text: '关闭右侧', icon: 'fa-arrow-right', action: () => this.closeRight(tag.path) }]),
      { text: '全部关闭', icon: 'fa-times-circle', action: () => this.closeAll() }
    ];

    menu.innerHTML = items.map(item => 
      `<li><i class="fa ${item.icon}"></i> ${item.text}</li>`
    ).join('');

    // 绑定菜单项点击
    menu.querySelectorAll('li').forEach((li, i) => {
      li.addEventListener('click', () => {
        items[i].action();
        menu.remove();
      });
    });

    document.body.appendChild(menu);

    // 点击其他地方关闭
    const closeHandler = () => {
      menu.remove();
      document.removeEventListener('click', closeHandler);
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 0);
  },

  bindEvents() {
    // 左箭头滚动
    document.getElementById('tags-scroll-left').addEventListener('click', () => {
      const wrapper = document.getElementById('tags-view-wrapper');
      wrapper.scrollBy({ left: -200, behavior: 'smooth' });
    });

    // 右箭头滚动
    document.getElementById('tags-scroll-right').addEventListener('click', () => {
      const wrapper = document.getElementById('tags-view-wrapper');
      wrapper.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // 下拉操作按钮
    document.getElementById('tags-dropdown-btn').addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      // 复用右键菜单逻辑，基于当前激活标签
      const activeTag = this.visitedViews.find(v => v.path === this.currentPath);
      if (activeTag) {
        this.contextMenuTag = { path: activeTag.path };
        this.showContextMenu(rect.left, rect.bottom);
      }
    });

    // 刷新按钮
    document.getElementById('tags-refresh-btn').addEventListener('click', () => {
      AppRouter.refresh();
    });
  }
};
```

---

## 9. 主内容区 AppMain

### 9.1 CSS 样式 (`appmain.css`)

```css
/* ===== 主内容区 ===== */
.app-main {
  flex: 1;
  overflow-y: auto;
  background: var(--app-main-bg);      /* #f0f2f5 */
  padding: var(--app-main-padding);    /* 20px */
  position: relative;
  min-height: 0;  /* 确保 flex 子元素可以缩小 */
}

/* 无标签页时 */
.main-container:not(.has-tags-view) .app-main {
  min-height: calc(100vh - var(--navbar-height));  /* 100vh - 50px */
}

/* 有标签页时 */
.main-container.has-tags-view .app-main {
  min-height: calc(100vh - var(--navbar-height) - var(--tags-height));  /* 100vh - 84px */
}

/* 固定 Header 时，AppMain 不再需要 min-height 计算（因为 fixed-header 脱离了文档流） */
.fixed-header.is-fixed ~ .app-main {
  height: calc(100vh - var(--navbar-height) - var(--tags-height));
  min-height: 0;
}

/* ===== 底部版权 ===== */
.copyright {
  position: fixed;
  bottom: 0;
  right: 0;
  left: var(--sidebar-width);
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-size: 12px;
  color: #999;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  z-index: 5;
  transition: left var(--transition-sidebar);
}

.sidebar-container.collapsed ~ .main-container .copyright {
  left: var(--sidebar-collapsed-width);
}

/* ===== 页面内容卡片 ===== */
.search-card {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 1px 2px rgba(0,0,0,.06);
}

.table-card {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,.06);
}

/* ===== 查询表单 ===== */
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-item label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.form-item input,
.form-item select {
  height: 32px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  outline: none;
  transition: border-color 0.2s;
}

.form-item input:focus,
.form-item select:focus {
  border-color: var(--color-primary);
}

/* ===== 按钮 ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 15px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  background: #fff;
  color: #606266;
  transition: all 0.2s;
  gap: 6px;
}

.btn:hover { 
  color: var(--color-primary);
  border-color: var(--color-primary-light);
  background: var(--color-primary-light);
}

.btn-primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.btn-primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}

.btn-danger  { background: #f56c6c; border-color: #f56c6c; color: #fff; }
.btn-success { background: #67c23a; border-color: #67c23a; color: #fff; }
.btn-warning { background: #e6a23c; border-color: #e6a23c; color: #fff; }

.btn-sm { height: 28px; padding: 0 10px; font-size: 12px; }
.btn-lg { height: 40px; padding: 0 20px; font-size: 15px; }

/* ===== 表格 ===== */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  background: #fafafa;
  color: #909399;
  font-weight: 600;
  padding: 12px 0;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.data-table td {
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
  color: #606266;
}

.data-table tbody tr:hover {
  background: #f5f7fa;
}

/* ===== 分页 ===== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 15px;
  font-size: 13px;
}

.pagination .page-btn {
  min-width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  color: #606266;
  transition: all 0.2s;
}

.pagination .page-btn:hover {
  color: var(--color-primary);
}

.pagination .page-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.pagination .page-info {
  margin: 0 8px;
  color: #606266;
}
```

### 9.2 页面加载机制

```javascript
/**
 * 简易前端路由（Hash 模式）
 */
const AppRouter = {
  currentPath: '/index',

  /**
   * 导航到菜单项对应的页面
   */
  navigate(menuItem) {
    const path = menuItem.path;
    if (path === this.currentPath) return;
    this.currentPath = path;
    this.loadPage(path, menuItem.meta.title, menuItem.meta.icon);
    TagsView.addView({ path, name: menuItem.name, title: menuItem.meta.title, icon: menuItem.meta.icon });
    Navbar.updateBreadcrumb(this.resolveBreadcrumb(path));
  },

  /**
   * 根据 path 导航
   */
  pushByPath(path) {
    this.currentPath = path;
    this.loadPageContent(path);
    Navbar.updateBreadcrumb(this.resolveBreadcrumb(path));
  },

  /**
   * 加载页面内容（两种方式可选）
   *
   * 方式一：内联模板 — 在 JS 中定义页面 HTML（适合页面少的项目）
   * 方式二：Fetch 加载 — 从 pages/ 目录 fetch HTML 片段（推荐）
   */
  async loadPage(path, title, icon) {
    try {
      // 方式二：fetch 远程页面
      const pageName = path.replace(/\//g, '-').slice(1) || 'index';
      const response = await fetch(`pages/${pageName}.html`);
      if (response.ok) {
        const html = await response.text();
        document.getElementById('app-main').innerHTML = html;
      }
    } catch (err) {
      // 降级：显示占位内容
      document.getElementById('app-main').innerHTML = `
        <div class="search-card">
          <h2>${title || '页面'}</h2>
          <p>当前页面：${path}</p>
          <p>页面内容正在开发中...</p>
        </div>
      `;
    }
  },

  /**
   * 解析面包屑路径
   */
  resolveBreadcrumb(path) {
    const chain = [{ path: '/index', title: '首页' }];
    // 根据 path 在 MENU_DATA 中递归查找父级
    function findParent(menuList, targetPath, parents = []) {
      for (const item of menuList) {
        if (item.path === targetPath) {
          return [...parents, { path: item.path, title: item.meta.title }];
        }
        if (item.children) {
          const found = findParent(item.children, targetPath, [...parents, { path: item.path, title: item.meta.title }]);
          if (found) return found;
        }
      }
      return null;
    }

    const result = findParent(MENU_DATA, path) ||
                   (path === '/index' ? chain : [...chain, { path, title: '未知页面' }]);
    return result;
  },

  /**
   * 刷新当前页面
   */
  refresh() {
    this.loadPageContent(this.currentPath);
  }
};
```

---

## 10. 布局设置抽屉

### 10.1 CSS 样式 (`settings.css`)

```css
/* ===== 遮罩层 ===== */
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.3);
  z-index: 3000;
}

/* ===== 抽屉主体 ===== */
.settings-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  background: #fff;
  z-index: 3001;
  box-shadow: -2px 0 8px rgba(0,0,0,.15);
  transform: translateX(0);
  transition: transform 0.3s;
}

.settings-drawer.closed {
  transform: translateX(100%);
}

.drawer-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.5;
}

.drawer-title {
  margin-bottom: 12px;
  color: rgba(0,0,0,.85);
  font-size: 14px;
  font-weight: bold;
}

.drawer-section {
  margin-bottom: 20px;
}

.drawer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  color: rgba(0,0,0,.65);
  font-size: 14px;
}

.drawer-container hr {
  border: none;
  border-top: 1px solid #ebeef5;
  margin: 16px 0;
}

/* ===== 导航模式选择器（CSS 绘制的微型布局图） ===== */
.nav-type-selector {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.nav-type-item {
  width: 56px;
  height: 48px;
  border-radius: 4px;
  background: #f0f2f5;
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.nav-type-item.active {
  border-color: var(--color-primary);
}

/* 左侧菜单模式 */
.nav-type-item[data-nav-type="1"] b:first-child {
  display: block;
  height: 30%;
  background: #fff;
}
.nav-type-item[data-nav-type="1"] b:last-child {
  width: 30%;
  background: #1b2a47;
  position: absolute;
  height: 100%;
  top: 0;
  border-radius: 4px 0 0 4px;
}

/* 混合菜单模式 */
.nav-type-item[data-nav-type="2"] b:first-child {
  border-radius: 4px 4px 0 0;
  display: block;
  height: 30%;
  background: #1b2a47;
}
.nav-type-item[data-nav-type="2"] b:last-child {
  width: 30%;
  background: #1b2a47;
  position: absolute;
  height: 70%;
  border-radius: 0 0 0 4px;
}

/* 顶部菜单模式 */
.nav-type-item[data-nav-type="3"] b:first-child {
  display: block;
  height: 30%;
  background: #1b2a47;
  border-radius: 4px 4px 0 0;
}

/* ===== 主题风格选择器 ===== */
.theme-style-selector {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.theme-style-item {
  position: relative;
  cursor: pointer;
}

.theme-style-item img {
  width: 48px;
  height: 48px;
}

.theme-style-item .check-mark {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  color: #1890ff;
  font-weight: 700;
  font-size: 20px;
}

.theme-style-item.selected .check-mark {
  display: flex;
}

/* ===== 颜色选择器 ===== */
.color-picker {
  width: 32px;
  height: 26px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  padding: 0;
}

/* ===== Switch 开关 ===== */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #dcdfe6;
  transition: 0.3s;
  border-radius: 20px;
}

.switch .slider::before {
  content: "";
  position: absolute;
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: var(--color-primary);
}

.switch input:checked + .slider::before {
  transform: translateX(20px);
}
```

### 10.2 JS 逻辑 (`js/settings.js`)

```javascript
const Settings = {
  // 当前设置状态（从 localStorage 读取）
  state: {
    navType: 1,           // 1=左侧菜单 2=混合 3=顶部
    sideTheme: 'theme-dark',
    theme: '#409EFF',
    tagsView: true,
    fixedHeader: false,
    sidebarLogo: true,
    footerVisible: true
  },

  init() {
    // 从 localStorage 加载已保存的设置
    this.loadFromStorage();
    // 应用已保存的设置到 DOM
    this.applySettings();
    // 绑定 UI 事件
    this.bindEvents();
  },

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('ruoyi-layout-setting');
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('读取布局设置失败，使用默认值');
    }
  },

  saveToStorage() {
    localStorage.setItem('ruoyi-layout-setting', JSON.stringify(this.state));
  },

  /**
   * 将当前设置应用到 DOM
   */
  applySettings() {
    const s = this.state;

    // 侧边栏主题
    document.documentElement.setAttribute('data-side-theme', s.sideTheme);

    // 主题色
    document.documentElement.style.setProperty('--color-primary', s.theme);

    // 标签页
    document.getElementById('main-container').classList.toggle('has-tags-view', s.tagsView);
    document.getElementById('tags-view-container').style.display = s.tagsView ? '' : 'none';

    // 固定 Header
    document.getElementById('fixed-header').classList.toggle('is-fixed', s.fixedHeader);

    // 显示 Logo
    document.querySelector('.sidebar-logo-container').style.display = s.sidebarLogo ? '' : 'none';

    // 底部版权
    document.querySelector('.copyright').style.display = s.footerVisible ? '' : 'none';

    // 同步 checkbox 状态
    document.getElementById('setting-tags-view').checked = s.tagsView;
    document.getElementById('setting-fixed-header').checked = s.fixedHeader;
    document.getElementById('setting-sidebar-logo').checked = s.sidebarLogo;
    document.getElementById('setting-footer-visible').checked = s.footerVisible;
    document.getElementById('theme-color-picker').value = s.theme;
  },

  bindEvents() {
    // 打开设置面板
    document.getElementById('btn-layout-settings').addEventListener('click', () => {
      this.open();
    });

    // 关闭设置面板
    document.getElementById('settings-drawer-overlay').addEventListener('click', () => {
      this.close();
    });

    // 导航模式选择
    document.querySelectorAll('.nav-type-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.nav-type-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.state.navType = parseInt(item.dataset.navType);
      });
    });

    // 主题风格选择
    document.querySelectorAll('.theme-style-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.theme-style-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        this.state.sideTheme = item.dataset.theme;
        document.documentElement.setAttribute('data-side-theme', this.state.sideTheme);
      });
    });

    // 主题颜色
    document.getElementById('theme-color-picker').addEventListener('input', (e) => {
      this.state.theme = e.target.value;
      document.documentElement.style.setProperty('--color-primary', this.state.theme);
    });

    // 开关 toggle
    ['setting-tags-view', 'setting-fixed-header', 'setting-sidebar-logo', 'setting-footer-visible']
      .forEach(id => {
        document.getElementById(id).addEventListener('change', (e) => {
          const key = id.replace('setting-', '').replace(/-([a-z])/g, (m, c) => c.toUpperCase());
          this.state[key] = e.target.checked;
          this.applySettings();
        });
      });

    // 保存配置
    document.getElementById('btn-save-settings').addEventListener('click', () => {
      this.saveToStorage();
      this.applySettings();
      alert('配置已保存');
    });

    // 重置配置
    document.getElementById('btn-reset-settings').addEventListener('click', () => {
      localStorage.removeItem('ruoyi-layout-setting');
      location.reload();
    });
  },

  open() {
    document.getElementById('settings-drawer-overlay').style.display = 'block';
    document.getElementById('settings-drawer').style.display = 'block';
    document.getElementById('settings-drawer').classList.remove('closed');
  },

  close() {
    document.getElementById('settings-drawer').classList.add('closed');
    document.getElementById('settings-drawer-overlay').style.display = 'none';
  }
};
```

---

## 11. 响应式适配（移动端）

### 11.1 CSS (`responsive.css`)

```css
/* ===== 断点：991px（小于此宽度视为移动端） ===== */
@media screen and (max-width: 991px) {
  /**
   * 移动端核心策略：
   * - 侧边栏变成 overlay 模式（绝对定位 + 遮罩）
   * - 默认隐藏侧边栏，点击汉堡按钮打开
   * - 右侧容器占满全宽
   */

  /* 侧边栏默认隐藏到屏幕外 */
  .sidebar-container {
    position: fixed;
    left: calc(-1 * var(--sidebar-width));
    top: 0;
    bottom: 0;
    z-index: 1001;
    transition: left var(--transition-sidebar);
  }

  /* 侧边栏打开 */
  .sidebar-container.mobile-open {
    left: 0;
  }

  /* 右侧容器全宽 */
  .main-container {
    margin-left: 0 !important;
    width: 100%;
  }

  /* 遮罩层 */
  .drawer-bg {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,.3);
    z-index: 999;
  }

  /* 固定 Header 全宽 */
  .fixed-header.is-fixed {
    width: 100% !important;
  }

  /* 版权全宽 */
  .copyright {
    left: 0 !important;
  }

  /* 底部安全区适配（iPhone X 等） */
  .app-main {
    padding-bottom: max(60px, calc(env(safe-area-inset-bottom) + 40px));
  }
}
```

### 11.2 JS 逻辑

```javascript
const Responsive = {
  isMobile: false,

  init() {
    this.check();
    window.addEventListener('resize', () => this.check());
  },

  check() {
    this.isMobile = window.matchMedia('(max-width: 991px)').matches;
    document.getElementById('app').classList.toggle('mobile', this.isMobile);

    if (this.isMobile) {
      // 移动端默认关闭侧边栏
      App.sidebar.close();
    }
  }
};
```

---

## 12. 主题切换系统

### 12.1 主题色切换

用户选择一个新的主题色（如 `#E4393C` 红色），只需要做一件事：

```javascript
function changeThemeColor(newColor) {
  document.documentElement.style.setProperty('--color-primary', newColor);

  // 同步更新亮色变体
  // --color-primary-light: 主题色 + 10% 不透明度
  // 简化做法：hex 转 rgb，然后用 rgba
  const rgb = hexToRgb(newColor);
  document.documentElement.style.setProperty(
    '--color-primary-light', 
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
  );
}
```

由于页面其他所有地方都引用了 `var(--color-primary)`，所以改这一个变量即可全局生效。

### 12.2 暗色/亮色侧边栏切换

```javascript
function switchSideTheme(theme) {
  // 'theme-dark' 或 'theme-light'
  document.documentElement.setAttribute('data-side-theme', theme);
  // CSS 中已预先定义好 [data-side-theme="theme-dark"] 和
  // [data-side-theme="theme-light"] 下的变量值，自动切换
}
```

---

## 13. 推荐的实施顺序

按这个顺序来做，每一步做完都能看到可见进展：

| 步骤 | 内容 | 产出 | 预计耗时 |
|------|------|------|---------|
| **1** | 搭建 HTML 骨架 + CSS 变量 + 布局框架 | 页面分成左右两栏，侧边栏 + 内容区 | 1h |
| **2** | 侧边栏静态菜单（HTML 写死） + 样式 | 菜单可见、有 hover 效果 | 1h |
| **3** | 侧边栏折叠/展开动画 | 汉堡按钮可切换折叠 | 30min |
| **4** | 顶部导航栏完整样式 | 导航栏外观就位 | 40min |
| **5** | 顶部导航栏 JS 交互（下拉菜单、全屏、面包屑） | 导航栏可操作 | 40min |
| **6** | 主内容区基础样式（表格、按钮、表单、分页） | 至少一个示例页面可用 | 1.5h |
| **7** | 标签页栏（这里是难点，建议专门留时间） | 标签页增删切换全功能 | 2.5h |
| **8** | 菜单数据 JS 化 + 动态渲染 + 简单路由 | 点菜单能切换页面内容 | 1.5h |
| **9** | 布局设置抽屉（样式 + JS） | 主题/布局可配置 | 1.5h |
| **10** | localStorage 持久化 | 刷新后设置不丢失 | 30min |
| **11** | 响应式适配（移动端） | 手机也能用 | 1h |
| **12** | 其他页面内容填充 | 用户管理、角色管理等具体页面 | 按需 |
| **总计** | | | **约 12-15 小时** |

---

## 14. 附录：关键尺寸速查表

| 元素 | CSS 属性 | 值 |
|------|----------|-----|
| 侧边栏宽度 | `width` | `200px` |
| 侧边栏折叠宽度 | `width` | `54px` |
| 侧边栏折叠过渡 | `transition` | `width 0.28s` |
| Logo 高度 | `height` | `50px` |
| 一级菜单项高度 | `height` | `56px` |
| 二级菜单项高度 | `height` | `50px` |
| 菜单图标大小 | `font-size` | `16px` |
| 导航栏高度 | `height` | `50px` |
| 导航栏阴影 | `box-shadow` | `0 1px 4px rgba(0,21,41,.08)` |
| 标签页栏高度 | `height` | `34px` |
| 标签高度 | `height` | `26px` |
| 标签圆角 | `border-radius` | `3px` |
| 标签字号 | `font-size` | `12px` |
| 激活标签背景 | `background-color` | `#42b983` |
| 主内容区背景 | `background-color` | `#f0f2f5` |
| 主内容区内边距 | `padding` | `20px` |
| 卡片圆角 | `border-radius` | `4px` |
| 卡片阴影 | `box-shadow` | `0 1px 2px rgba(0,0,0,.06)` |
| 输入框高度 | `height` | `32px` |
| 按钮高度 | `height` | `32px` |
| 表格行 hover | `background` | `#f5f7fa` |
| 抽屉宽度 | `width` | `280px` |
| 移动端断点 | `max-width` | `991px` |
| 滚动条宽度 | `width` | `6px` |
| 滚动条颜色 | `background-color` | `#c0c0c0` |

---

> **最后提醒**：Element UI 的 CSS（如 `el-menu` 的配色和过渡）实际上是很好的参考。可以用 `https://unpkg.com/element-ui/lib/theme-chalk/index.css` 作为样式参考，但不建议直接引入整个库（太大了）。对照着抄需要的部分即可。
