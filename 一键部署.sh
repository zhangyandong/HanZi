#!/bin/bash

# 汉字学习助手 - 一键部署脚本

echo "🚀 开始部署汉字学习助手..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 Yarn
if ! command -v yarn &> /dev/null; then
    echo "⚠️  未安装 Yarn，将使用 npm"
    USE_YARN=false
else
    USE_YARN=true
fi

echo "📦 安装依赖..."
if [ "$USE_YARN" = true ]; then
    yarn install
else
    npm install
fi

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo ""
echo "🔨 构建生产版本..."
if [ "$USE_YARN" = true ]; then
    yarn build
else
    npm run build
fi

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "✅ 构建成功！"
echo ""
echo "📁 构建文件位于: dist/"
echo ""
echo "🌐 部署选项："
echo "  1. Vercel:  vercel --prod"
echo "  2. Netlify: netlify deploy --prod --dir=dist"
echo "  3. 手动上传 dist 文件夹到服务器"
echo ""

# 询问是否预览
read -p "是否在本地预览构建结果？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌍 启动预览服务器..."
    if [ "$USE_YARN" = true ]; then
        yarn preview
    else
        npm run preview
    fi
fi

echo ""
echo "🎉 完成！"

