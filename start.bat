@echo off
chcp 65001 >nul
echo.
echo 🚀 知识地图 - 启动脚本
echo ====================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未安装 Node.js，请先安装 Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ %NODE_VERSION%

REM 检查 PostgreSQL
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  未检测到 PostgreSQL，请确保已安装并运行
)

echo.
echo 📦 准备启动...
echo.

REM 安装后端依赖
cd backend
if not exist "node_modules" (
    echo 安装后端依赖...
    call npm install
) else (
    echo ✅ 后端依赖已安装
)

REM 检查后端 .env
if not exist ".env" (
    echo 创建后端环境配置...
    if exist ".env.example" (
        copy .env.example .env
    ) else (
        echo ⚠️  请手动配置 backend\.env
    )
)

REM 安装前端依赖
cd ..\frontend
if not exist "node_modules" (
    echo 安装前端依赖...
    call npm install
) else (
    echo ✅ 前端依赖已安装
)

echo.
echo ====================
echo ✅ 准备工作完成！
echo.
echo 📌 启动说明：
echo.
echo 1. 打开终端 1，运行以下命令启动后端：
echo    cd backend
echo    npm run dev
echo.
echo 2. 打开终端 2，运行以下命令启动前端：
echo    cd frontend
echo    npm run dev
echo.
echo 3. 访问 http://localhost:5173 开始使用
echo.
echo ====================
echo.
pause
