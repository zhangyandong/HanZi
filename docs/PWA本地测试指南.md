# 🧪 PWA 本地测试指南

## ✅ 可以在本地测试 PWA！

在调试环境完全可以测试 PWA 功能。有以下几种方式：

---

## 🎯 方法一：预览生产构建（推荐）

### 最接近线上环境的测试方式

```bash
# 1. 构建生产版本
cd /Users/ts/Desktop/HanZi
yarn build

# 2. 预览构建结果
yarn preview

# 3. 访问 http://localhost:4173
```

**特点**：
- ✅ Service Worker 完全启用
- ✅ PWA 功能完整
- ✅ 可以测试离线功能
- ✅ 可以测试"添加到主屏幕"
- ✅ 与生产环境一致

---

## 🔧 方法二：开发模式测试

### 在开发服务器测试

```bash
# 启动开发服务器
yarn dev

# 访问 http://localhost:3000
```

**限制**：
- ⚠️ Service Worker 默认禁用（开发模式）
- ⚠️ PWA 功能部分可用
- ✅ Manifest 可以测试
- ✅ 可以查看 PWA 配置

**如何启用 Service Worker（开发模式）**：

修改 `vite.config.ts`：
```typescript
VitePWA({
  registerType: 'autoUpdate',
  devOptions: {
    enabled: true  // ← 开发模式启用 SW
  }
})
```

然后重启开发服务器：
```bash
yarn dev
```

---

## 📱 本地测试 PWA 功能

### 1. 测试 Service Worker

**打开开发者工具（F12）**

```
Application → Service Workers
```

**检查项**：
- [ ] Service Worker 已注册
- [ ] 状态：activated and running
- [ ] 作用域：/ 或对应路径

**测试操作**：
```
1. 刷新页面，确认 SW 重新激活
2. 查看 Console，应该有 SW 注册日志
3. 点击 "Update" 测试更新机制
```

---

### 2. 测试 Manifest

**开发者工具**：
```
Application → Manifest
```

**检查项**：
- [ ] 名称：汉字学习助手
- [ ] 短名称：汉字学习
- [ ] 主题色：#FCD34D
- [ ] 图标：192x192, 512x512
- [ ] Display：standalone

**问题排查**：
- 如果图标不显示：检查 `public/` 目录
- 如果 Manifest 404：检查构建是否成功

---

### 3. 测试离线功能

**步骤**：

```
1. 访问网站（第一次会缓存资源）
2. 打开 Application → Service Workers
3. 勾选 "Offline" 复选框
4. 刷新页面
5. ✅ 页面应该仍能访问！
```

**检查缓存**：
```
Application → Cache Storage
→ workbox-precache-v2-...
→ 查看缓存的文件
```

---

### 4. 测试"添加到主屏幕"

#### 桌面浏览器（Chrome/Edge）

**检查安装条件**：
```
Application → Manifest → 底部
```

应该显示：
```
✓ Is installable
```

**安装测试**：
1. 地址栏出现安装图标 ⊕
2. 点击安装
3. 确认安装
4. 在桌面/应用列表找到应用
5. 点击打开（独立窗口）

**强制显示安装提示**：
```javascript
// 在 Console 执行
deferredPrompt.prompt()
```

---

#### 移动设备（iOS/Android）

**iOS Safari**：
```
1. 在 iPhone/iPad 上访问 http://[你的电脑IP]:4173
2. 点击分享按钮 📤
3. 选择"添加到主屏幕"
4. 确认添加
```

**Android Chrome**：
```
1. 访问网址
2. 看到"安装"横幅
3. 点击安装
```

**获取本机IP**：
```bash
# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# 或者
ipconfig getifaddr en0
```

然后在手机访问：
```
http://[你的IP]:4173
```

---

## 🔍 详细测试清单

### Service Worker 功能

```
□ SW 注册成功
□ SW 激活成功
□ SW 能拦截请求
□ 更新机制正常
□ 卸载/重装正常
```

### 缓存功能

```
□ 静态资源预缓存
□ 运行时缓存工作
□ 缓存策略正确
□ 缓存更新正常
□ 清除缓存正常
```

### Manifest 功能

```
□ Manifest 加载正常
□ 应用名称正确
□ 图标显示正常
□ 主题色正确
□ 显示模式正确
```

### 安装功能

```
□ 满足安装条件
□ 安装提示出现
□ 可以成功安装
□ 图标正常显示
□ 独立窗口打开
```

### 离线功能

```
□ 离线可访问
□ 功能正常工作
□ 离线提示友好
□ 恢复在线正常
```

---

## 🛠️ 调试技巧

### 1. 查看 Console 日志

```javascript
// Service Worker 注册
navigator.serviceWorker.ready.then(registration => {
  console.log('SW ready:', registration)
})

// 监听更新
navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('SW updated!')
})
```

### 2. 手动触发更新

```javascript
// 在 Console 执行
navigator.serviceWorker.getRegistration().then(reg => {
  reg.update()
})
```

### 3. 强制跳过等待

```javascript
// 在 Service Worker 中
self.skipWaiting()
```

### 4. 清除所有缓存

```javascript
// 在 Console 执行
caches.keys().then(names => {
  names.forEach(name => caches.delete(name))
})
```

### 5. 注销 Service Worker

```javascript
// 在 Console 执行
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})
```

---

## 🐛 常见问题

### Q: Service Worker 没有注册？

**检查**：
1. 是否使用 HTTPS（localhost 除外）
2. 是否构建了生产版本
3. 浏览器是否支持 SW
4. 是否有 JavaScript 错误

**解决**：
```bash
# 重新构建
yarn build
yarn preview
```

### Q: 离线不工作？

**检查**：
1. Service Worker 是否激活
2. 资源是否缓存
3. Cache Storage 是否有数据

**解决**：
```
Application → Cache Storage
确认有 workbox-precache-v2-... 缓存
```

### Q: 更新不生效？

**原因**：Service Worker 有等待机制

**解决**：
```
1. 关闭所有页面标签
2. 重新打开
3. 或在 SW 面板点击 "skipWaiting"
```

### Q: 图标不显示？

**检查**：
```bash
ls -la public/icon-*.png
```

**解决**：
1. 确认图标文件存在
2. 重新生成图标（使用 生成图标.html）
3. 重新构建

---

## 📊 测试对比

### 开发模式 vs 预览模式

| 功能 | 开发模式 | 预览模式 |
|------|---------|---------|
| Service Worker | ❌ 默认禁用 | ✅ 完全启用 |
| 离线访问 | ❌ 不可用 | ✅ 可用 |
| 安装应用 | ⚠️ 部分支持 | ✅ 完全支持 |
| Manifest | ✅ 可用 | ✅ 可用 |
| 热更新 | ✅ 支持 | ❌ 不支持 |
| 调试便利 | ✅ 很好 | ⚠️ 一般 |

**推荐**：
- 功能开发：使用开发模式
- PWA 测试：使用预览模式
- 最终验证：部署后测试

---

## 🎯 完整测试流程

### 第一步：本地预览测试

```bash
# 1. 构建
yarn build

# 2. 预览
yarn preview

# 3. 打开浏览器
open http://localhost:4173
```

### 第二步：功能测试

```
1. ✓ 测试所有页面功能
2. ✓ 测试 Service Worker
3. ✓ 测试离线模式
4. ✓ 测试安装功能
```

### 第三步：移动设备测试

```bash
# 1. 获取本机IP
ipconfig getifaddr en0

# 2. 在手机访问
http://[IP]:4173

# 3. 测试安装
```

### 第四步：部署后测试

```
1. 部署到 Vercel
2. 在实际网址测试
3. 多设备验证
```

---

## 🚀 快速测试命令

```bash
# 完整测试流程（一键执行）
cd /Users/ts/Desktop/HanZi
yarn build && yarn preview
```

**然后访问**：
```
http://localhost:4173
```

**测试项目**：
- □ 打开 DevTools
- □ 检查 Service Worker
- □ 测试离线模式
- □ 尝试安装应用

---

## ✅ 测试通过标准

### 基础功能
- [x] 网站正常访问
- [x] 所有功能可用
- [x] 无 Console 错误

### PWA 功能
- [x] Service Worker 注册成功
- [x] Manifest 加载正常
- [x] 离线访问可用
- [x] 可以安装应用

### 用户体验
- [x] 加载速度快
- [x] 离线提示友好
- [x] 安装流程顺畅
- [x] 图标显示正确

---

**现在就试试吧！** 🧪

```bash
yarn build && yarn preview
```

然后打开 http://localhost:4173 测试 PWA 功能！

