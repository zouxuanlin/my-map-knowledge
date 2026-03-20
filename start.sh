#!/bin/bash

echo "🚀 知识地图 - 启动脚本"
echo "===================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本：$(node --version)"

# 检查 PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  未检测到 PostgreSQL，请确保已安装并运行"
fi

# 检查数据库
echo ""
echo "📊 检查数据库..."
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw my_map_knowledge; then
    echo "创建数据库 my_map_knowledge..."
    createdb my_map_knowledge 2>/dev/null || echo "⚠️  数据库创建失败，请手动创建"
fi

# 安装后端依赖
echo ""
echo "📦 安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ 后端依赖已安装"
fi

# 检查后端 .env
if [ ! -f ".env" ]; then
    echo "创建后端环境配置..."
    cp .env.example .env 2>/dev/null || echo "⚠️  请手动配置 backend/.env"
fi

# 安装前端依赖
cd ../frontend
echo ""
echo "📦 安装前端依赖..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ 前端依赖已安装"
fi

echo ""
echo "===================="
echo "✅ 准备工作完成！"
echo ""
echo "📌 启动说明："
echo ""
echo "1. 打开终端 1，运行以下命令启动后端："
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. 打开终端 2，运行以下命令启动前端："
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. 访问 http://localhost:5173 开始使用"
echo ""
echo "===================="
