// 临时图标生成脚本
// 这会创建简单的占位图标，实际使用请用 生成图标.html 生成更好的图标

const fs = require('fs');
const path = require('path');

// 创建简单的 base64 PNG 数据（1x1 黄色像素）
const yellowPixel = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  'base64'
);

const publicDir = path.join(__dirname, 'public');

// 确保 public 目录存在
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 创建占位图标（这些是临时的，建议使用生成图标.html创建更好的）
console.log('⚠️  创建临时图标文件...');
console.log('📌 建议：打开 生成图标.html 创建正式的应用图标\n');

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), yellowPixel);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), yellowPixel);

console.log('✓ 已创建 public/icon-192.png（临时）');
console.log('✓ 已创建 public/icon-512.png（临时）');
console.log('\n📝 下一步：');
console.log('1. 在浏览器中打开 生成图标.html');
console.log('2. 下载生成的图标');
console.log('3. 替换 public/ 目录中的图标文件');
console.log('4. 重新构建项目: yarn build\n');

