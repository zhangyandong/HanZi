# 🎓 汉字学习助手

一个专为小学生设计的交互式汉字学习应用，通过动画演示和手写练习帮助孩子掌握汉字的拼音、笔顺和书写规范。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)

## ✨ 功能特点

### 核心功能
- 📝 **汉字输入**：支持输入多个汉字，自动过滤非汉字字符
- 📋 **列表展示**：以卡片形式展示所有汉字，顶部显示拼音
- 🔍 **详细信息**：查看汉字的拼音、部首、笔画数、笔画列表
- 🎨 **笔顺动画**：田字格中循环播放标准笔顺动画
- ✍️ **手写练习**：触屏/鼠标手写练习，支持参考字显示

### 设计特点
- 🌈 儿童友好的配色方案
- 📏 超大字号和按钮
- 🎭 流畅的动画效果
- 📱 iPad 横竖屏自适应
- 👆 大触摸目标，防误触

## 🚀 快速开始

### 开发环境
```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 访问 http://localhost:3000
```

### 生产构建
```bash
# 构建生产版本
yarn build

# 预览生产版本
yarn preview
```

## 📦 部署上线

### 方法一：PinMe（推荐）⭐
```bash
# 安装 PinMe CLI
npm install -g pinme

# 构建并部署
yarn build
pinme upload dist
```

### 方法二：Vercel
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录并部署
vercel login
vercel --prod
```

### 方法二：Netlify
```bash
# 拖拽部署
# 访问 https://app.netlify.com/drop
# 拖拽 dist 文件夹

# 或使用 CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### 方法三：GitHub Pages
```bash
yarn add -D gh-pages
yarn deploy
```

详细部署指南请查看 [部署指南.md](./部署指南.md)

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **React Router v6** - 路由管理
- **Hanzi Writer** - 笔顺动画库
- **pinyin-pro** - 拼音转换

## 📁 项目结构

```
HanZi/
├── src/
│   ├── components/          # React 组件
│   │   ├── StrokeAnimation.tsx      # 笔顺动画
│   │   └── HandwritingCanvas.tsx    # 手写画板
│   ├── context/             # Context
│   │   └── CharacterContext.tsx     # 状态管理
│   ├── pages/               # 页面
│   │   ├── InputPage.tsx            # 输入页
│   │   ├── CharacterList.tsx        # 列表页
│   │   └── CharacterDetail.tsx      # 详情页
│   ├── utils/               # 工具函数
│   │   ├── characterUtils.ts        # 汉字工具
│   │   └── strokeUtils.ts           # 笔画工具
│   ├── types/               # TypeScript 类型
│   ├── App.tsx              # 根组件
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── dist/                    # 构建输出目录
├── public/                  # 静态资源
└── index.html               # HTML 模板
```

## 🎯 使用指南

### 1️⃣ 输入汉字
在首页输入框中输入想要学习的汉字（支持1-100个字）

### 2️⃣ 浏览列表
查看所有输入的汉字，每个汉字上方显示拼音

### 3️⃣ 查看详情
点击任意汉字卡片，进入详情页面：
- 查看汉字的拼音（带声调）、部首、笔画列表
- 观看田字格中的笔顺动画演示
- 切换到手写练习模式

### 4️⃣ 手写练习
- 点击"手写练习"标签
- 在田字格中用手指/鼠标书写
- 可显示/隐藏参考字
- 点击"清除"重新书写

## 📱 浏览器支持

- ✅ Safari (iOS/iPadOS 14+)
- ✅ Chrome (iOS 14+)
- ✅ Safari (macOS)
- ✅ Chrome (Desktop)
- ✅ Edge (Desktop)

## 📄 许可证

MIT License

## 👨‍💻 开发者

本项目由 AI 助手协助创建，遵循教育性、儿童友好的设计原则。

---

## 📚 项目文档

所有文档已整理到 `docs/` 目录：

- **项目规划**：需求文档、开发总结
- **功能说明**：各功能的详细说明
- **部署指南**：完整的部署流程

查看完整文档列表：[docs/README.md](./docs/README.md)

---

**让我们一起帮助孩子们爱上汉字学习！** 📚✨
