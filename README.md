# 🚀 EZ-Theme

一个美观、现代的 **V2board / Xiao-V2board / Xboard 面板前端主题**，基于 **Vue 3** 开发。

---

## ✨ 特性

- 🎨 简约高端的 UI 设计，支持亮色/暗色主题切换
- 🌍 内置国际化支持（中文/英文）
- 📱 响应式设计，完美适配各种设备
- 🔒 完善的登录认证系统，支持多面板类型
- ⚡ 多 API 地址自动竞速检测，优选最快节点
- 🔐 API 地址 base64 轻量混淆，支持独立配置文件
- 🛒 完整的商店、订单、充值、工单系统
- 📊 流量明细图表、节点列表、邀请管理
- 🎯 自定义右键菜单（复制/刷新/前进/后退）
- 🌀 应用预加载器，优化首屏加载体验
- 🚀 模块化代码结构，易于维护与扩展

---

## 🧩 技术栈

| 技术                | 说明                     |
|---------------------|--------------------------|
| **Vue 3**           | 渐进式 JavaScript 框架   |
| **Vue CLI 5**       | 项目脚手架（Webpack 5）  |
| **Vue Router**      | 官方路由管理器           |
| **Vuex 4**          | 状态管理模式             |
| **Axios**           | 基于 Promise 的 HTTP 客户端 |
| **Sass (SCSS)**     | CSS 预处理器             |
| **Vue I18n**        | 国际化解决方案           |
| **@tabler/icons-vue** | 开源图标库             |

---

## 📂 项目结构

```
src/
├── api/                # API 接口层
│   └── utils/          # API 工具（路径映射、加密）
├── assets/             # 静态资源
│   ├── images/         # 图片资源
│   ├── styles/         # 样式文件
│   └── i18n/           # 国际化
├── components/         # 公共组件
│   ├── auth/           # 认证相关组件
│   ├── common/         # 通用组件
│   ├── icons/          # 图标组件
│   ├── popup/          # 弹窗组件
│   ├── shop/           # 商店组件
│   └── ticket/         # 工单组件
├── composables/        # 组合式 API
├── config/             # 用户配置文件
├── hooks/              # 自定义 Hooks
├── i18n/               # 国际化配置
│   └── locales/        # 语言包
├── router/             # 路由配置
├── store/              # Vuex 存储
├── utils/              # 工具函数
└── views/              # 页面视图
    ├── auth/           # 登录/注册
    ├── dashboard/      # 仪表盘
    ├── shop/           # 商店
    ├── orders/         # 订单
    ├── servers/        # 节点列表
    ├── profile/        # 用户中心
    ├── wallet/         # 充值
    ├── invite/         # 邀请
    ├── ticket/         # 工单
    ├── docs/           # 文档
    ├── trafficLog/     # 流量明细
    ├── landing/        # 落地页
    ├── layout/         # 布局
    ├── more/           # 更多
    └── errors/         # 错误页
```

---

## ⚙️ 自定义配置

所有配置集中在 `src/config/index.js`，构建后可通过独立配置文件修改（无需重新构建）：

| 配置项 | 说明 |
|--------|------|
| PANEL_TYPE | 面板类型：V2board / Xiao-V2board / Xboard |
| API_CONFIG.staticBaseUrl | API 地址（支持多地址竞速） |
| API_MIDDLEWARE_ENABLED | 中间件加密代理开关 |
| SITE_CONFIG | 网站名称、描述、版权信息 |
| DEFAULT_CONFIG | 默认语言、主题、主题色 |
| SHOP_CONFIG | 商店页面配置 |
| DASHBOARD_CONFIG | 仪表盘配置 |
| CLIENT_CONFIG | 客户端下载配置 |
| PAYMENT_CONFIG | 支付相关配置 |
| CUSTOMER_SERVICE_CONFIG | 客服系统配置 |

---

## 🛠️ 开始使用

### 1️⃣ 安装依赖
```bash
npm install
```

### 2️⃣ 开发环境运行
```bash
npm run serve
```

### 3️⃣ 生产环境构建
```bash
npm run build
```

### 构建产物说明

构建后生成 `dist/` 目录，包含：
- `index.html` — 入口文件
- `static/js/` — 应用代码分包
- 静态资源文件 — 图片、字体等

> 当 VUE_APP_CONFIGJS=true 时（默认），会额外生成独立配置文件 {随机名}.js，可在部署后直接修改该文件中的配置，无需重新构建。

---

## 🌐 环境变量

在 `.env.production` 中配置：

| 变量 | 说明 |
|------|------|
| VUE_APP_TITLE | 网站标题 |
| VUE_APP_DEBUGGING | 是否启用反调试（阻止 F12） |
| VUE_APP_CONFIGJS | 是否生成独立配置文件 |
| VUE_APP_OBFUSCATION | 是否对独立配置文件混淆 |

---

## 🌎 浏览器支持

✅ Chrome  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ 其他现代浏览器  

---

## 📄 许可证

本项目遵循 **MIT License** 开源协议。
