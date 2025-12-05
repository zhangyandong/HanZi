# 🚀 快速部署到 PinMe (IPFS)

PinMe 是一个简单的命令行工具，用于将静态网站部署到 IPFS 网络，实现去中心化、永久在线的托管。

## 📋 准备工作

### 1. 安装 Node.js
确保你的电脑上安装了 Node.js (推荐 v16+)。

### 2. 安装 PinMe CLI
打开终端，运行以下命令全局安装 PinMe：

```bash
npm install -g pinme
```

## 🚀 部署步骤

### 第一步：构建项目

在项目根目录下运行构建命令：

```bash
yarn build
# 或者
npm run build
```

构建完成后，会生成 `dist` 目录。

### 第二步：上传部署

直接运行以下命令将 `dist` 目录上传到 IPFS：

```bash
pinme upload dist
```

### 第三步：访问网站

部署完成后，PinMe 会返回：
1. **IPFS Hash (CID)**: 内容的唯一标识符
2. **Gateway URL**: 可访问的 HTTP 链接

你可以直接点击链接访问你的网站。

## 🔄 更新部署

每次代码更新后，只需重复上述步骤：

1. `yarn build`
2. `pinme upload dist`

## ❓ 常见问题

### 为什么选择 PinMe / IPFS?
- **去中心化**: 不依赖单一服务器，内容分布在全球节点。
- **抗审查**: 内容一旦上传，很难被移除。
- **永久性**: 只要有人 pin 住内容，它就永远存在。
- **免费**: 基础使用通常是免费的。

### 如何绑定自定义域名?
PinMe 支持 ENS (Ethereum Name Service) 绑定。具体请参考 PinMe 官方文档。
