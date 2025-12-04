# 🧪 PWA 本地测试 - 实战步骤

## ✅ 预览服务器已启动

```
✓ 服务器地址：http://localhost:4173/
✓ PWA 功能：完全启用
✓ 可以测试：所有 PWA 特性
```

---

## 🎯 立即测试（跟着做）

### 步骤 1：打开网站

在浏览器中访问：
```
http://localhost:4173/
```

**建议使用 Chrome 或 Edge**（PWA 支持最好）

---

### 步骤 2：打开开发者工具

**快捷键**：
- macOS: `Cmd + Option + I`
- Windows: `F12`

**或者**：
- 右键 → 检查
- 菜单 → 更多工具 → 开发者工具

---

### 步骤 3：检查 Service Worker

**导航到**：
```
Application 标签 → Service Workers
```

**应该看到**：
```
✓ Source: sw.js
✓ Status: #activated and running
✓ Scope: http://localhost:4173/
```

**如果看到这些，说明 Service Worker 工作正常！** ✅

---

### 步骤 4：检查 Manifest

**导航到**：
```
Application 标签 → Manifest
```

**应该看到**：
```
Identity
  - Name: 汉字学习助手
  - Short name: 汉字学习

Presentation  
  - Display: standalone
  - Theme color: #FCD34D

Icons
  - 192x192
  - 512x512
```

**底部会显示**：
```
✓ 此应用可以安装
```

---

### 步骤 5：测试离线功能 🔥

**重要测试**：

**1. 首次访问**
```
访问网站 → 浏览几个页面 → 资源自动缓存
```

**2. 启用离线模式**
```
Application → Service Workers
勾选 ☑️ Offline
```

**3. 刷新页面**
```
按 Cmd+R 或 F5 刷新
```

**4. 验证**
```
✅ 页面应该仍然正常显示！
✅ 所有功能应该可用！
✅ Console 可能显示：Service Worker 从缓存提供资源
```

**5. 恢复在线**
```
取消勾选 Offline
刷新页面
```

---

### 步骤 6：测试"添加到主屏幕"

#### 方法 A：浏览器安装图标

**Chrome/Edge 桌面**：
```
1. 地址栏右侧会出现 ⊕ 图标
2. 点击图标
3. 点击"安装"
4. ✅ 应用安装完成！
```

**找到已安装的应用**：
- macOS: Applications 文件夹
- Windows: 开始菜单
- 点击打开，独立窗口运行

#### 方法 B：手机测试

**获取本机 IP**：
```bash
ipconfig getifaddr en0
# 例如：192.168.1.100
```

**在手机访问**：
```
http://192.168.1.100:4173/
```

**iOS Safari**：
1. 分享按钮 📤
2. "添加到主屏幕"
3. 确认

**Android Chrome**：
1. 自动提示"安装应用"
2. 点击安装

---

### 步骤 7：测试缓存

**导航到**：
```
Application → Cache Storage
```

**应该看到**：
```
▼ workbox-precache-v2-http://localhost:4173/
  - index.html
  - assets/index-xxx.css
  - assets/index-xxx.js
  - manifest.webmanifest
  - registerSW.js
  - icon.svg
  - vite.svg
  - workbox-xxx.js
```

**展开查看**：
- 所有预缓存的文件
- 可以查看文件内容
- 可以删除测试

---

## 🎨 完整测试演示

### 视频演示流程

**1. 功能测试（2分钟）**
```
打开网站
  ↓
输入汉字：小学生
  ↓
查看列表
  ↓
点击"学"字
  ↓
切换"笔顺动画"和"手写练习"
  ↓
测试手写绘制
  ↓
✅ 功能正常！
```

**2. PWA 测试（3分钟）**
```
打开 DevTools
  ↓
检查 Service Worker → ✓ 激活
  ↓
检查 Manifest → ✓ 配置正确
  ↓
勾选 Offline
  ↓
刷新页面 → ✓ 仍可访问
  ↓
取消 Offline
  ↓
点击安装图标 → ✓ 安装成功
  ↓
✅ PWA 完全正常！
```

---

## 📋 测试检查表

### 必测项目

```
基础功能：
□ 输入汉字
□ 查看列表
□ 笔顺动画
□ 手写练习

PWA 功能：
□ Service Worker 注册
□ Manifest 配置
□ 离线访问
□ 应用安装
□ 缓存策略

设备测试：
□ 桌面浏览器
□ iPad
□ iPhone
```

---

## 🎯 快速测试（5分钟）

### 时间表

```
0:00 - 打开 http://localhost:4173
0:30 - 测试基本功能
1:30 - 打开 DevTools
2:00 - 检查 Service Worker
2:30 - 检查 Manifest
3:00 - 测试离线模式
4:00 - 测试安装功能
5:00 - ✅ 测试完成！
```

---

## 🔧 高级测试

### 1. 模拟慢速网络

```
DevTools → Network 标签
选择：Slow 3G
刷新页面
观察：PWA 缓存的作用
```

### 2. 测试更新机制

```
1. 修改代码
2. yarn build
3. 刷新预览
4. 观察：SW 更新提示
```

### 3. 性能分析

```
DevTools → Lighthouse
点击：Generate report
查看：PWA 评分
```

---

## 💡 调试技巧

### 查看详细日志

**Console 输入**：
```javascript
// 查看所有 Service Worker
navigator.serviceWorker.getRegistrations()

// 查看缓存
caches.keys()

// 查看 Manifest
fetch('/manifest.webmanifest').then(r => r.json())
```

### 强制更新

```javascript
// 强制 Service Worker 更新
navigator.serviceWorker.getRegistration().then(reg => {
  reg.update()
  console.log('SW updating...')
})
```

---

## 🎊 测试成功标志

如果看到以下情况，说明 PWA 配置完全成功：

✅ **Service Worker**
```
Status: activated and running
```

✅ **离线模式**
```
勾选 Offline → 刷新 → 仍能访问
```

✅ **可安装性**
```
地址栏出现安装图标 ⊕
或
Manifest 底部显示 "可安装"
```

✅ **缓存工作**
```
Cache Storage 有数据
离线时从缓存加载
```

---

## 📞 遇到问题？

### 常见解决方案

**Service Worker 不注册**：
```bash
# 重新构建
yarn build
yarn preview
# 硬刷新：Cmd+Shift+R
```

**离线不工作**：
```
1. 检查 SW 是否激活
2. 检查 Cache Storage
3. 确认访问过至少一次
```

**图标404**：
```bash
# 生成图标
open 生成图标.html
# 下载并放到 public/
# 重新构建
```

---

## 🚀 现在开始测试

### 访问地址

```
http://localhost:4173/
```

### 测试顺序

1. ✅ 测试功能
2. ✅ 检查 Service Worker
3. ✅ 测试离线模式
4. ✅ 尝试安装应用

---

**预览服务器已启动，打开浏览器开始测试吧！** 🧪✨

