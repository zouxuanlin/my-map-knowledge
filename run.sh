#!/bin/bash

echo "🚀 知识地图 - 一键启动"
echo "===================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 进程 PID
BACKEND_PID=""
FRONTEND_PID=""

# 清理函数
cleanup() {
    echo ""
    echo -e "${YELLOW}正在关闭服务...${NC}"

    if [ -n "$BACKEND_PID" ] && ps -p $BACKEND_PID > /dev/null; then
        echo "关闭后端服务 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
        wait $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✓ 后端已关闭${NC}"
    fi

    if [ -n "$FRONTEND_PID" ] && ps -p $FRONTEND_PID > /dev/null; then
        echo "关闭前端服务 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null
        wait $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✓ 前端已关闭${NC}"
    fi

    echo ""
    echo -e "${GREEN}所有服务已关闭，再见！${NC}"
    exit 0
}

# 捕获退出信号
trap cleanup EXIT INT TERM

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未安装 Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"

# 进入项目目录
cd "$(dirname "$0")"

# 检查后端
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ backend 目录不存在${NC}"
    exit 1
fi

# 检查前端
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ frontend 目录不存在${NC}"
    exit 1
fi

# 检查后端 node_modules
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}正在安装后端依赖...${NC}"
    cd backend && npm install
    cd ..
fi

# 检查前端 node_modules
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}正在安装前端依赖...${NC}"
    cd frontend && npm install
    cd ..
fi

echo ""
echo -e "${GREEN}✓ 依赖检查完成${NC}"
echo ""
echo "===================="
echo "📡 启动服务..."
echo "===================="
echo ""

# 启动后端 (后台运行)
cd backend
echo -e "${YELLOW}[后端] 启动中...${NC}"
# 先编译 TypeScript，然后运行编译后的代码
npm run build > ../backend-build.log 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 后端编译失败，查看 backend-build.log 获取详情${NC}"
    cat ../backend-build.log
    exit 1
fi
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 检查后端是否正常启动
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ 后端已启动 (PID: $BACKEND_PID)${NC}"
    echo -e "${GREEN}  API: http://localhost:3000${NC}"
else
    echo -e "${RED}❌ 后端启动失败，查看 backend.log 获取详情${NC}"
    cat backend.log
    exit 1
fi

# 启动前端 (后台运行)
cd frontend
echo -e "${YELLOW}[前端] 启动中...${NC}"
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# 等待前端启动
sleep 5

# 检查前端是否正常启动
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✓ 前端已启动 (PID: $FRONTEND_PID)${NC}"
    echo -e "${GREEN}  访问：http://localhost:5173${NC}"
else
    echo -e "${RED}❌ 前端启动失败，查看 frontend.log 获取详情${NC}"
    cat frontend.log
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "===================="
echo -e "${GREEN}✓ 所有服务已启动${NC}"
echo "===================="
echo ""
echo "📌 服务信息:"
echo "   前端：http://localhost:5173"
echo "   后端：http://localhost:3000"
echo ""
echo "📝 日志文件:"
echo "   后端：backend.log"
echo "   前端：frontend.log"
echo ""
echo "🛑 按 Ctrl+C 停止所有服务"
echo ""

# 监控日志输出
tail -f backend.log frontend.log 2>/dev/null &
TAIL_PID=$!

# 等待用户中断
wait

# 清理 tail 进程
kill $TAIL_PID 2>/dev/null
