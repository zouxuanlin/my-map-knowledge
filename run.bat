@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo 🚀 知识地图 - 一键启动
echo ====================
echo.

set BACKEND_PID=
set FRONTEND_PID=

:: 清理函数
:cleanup
echo.
echo 正在关闭服务...

if defined BACKEND_PID (
    taskkill /F /PID %BACKEND_PID% >nul 2>&1
    echo [后端] 已关闭
)

if defined FRONTEND_PID (
    taskkill /F /PID %FRONTEND_PID% >nul 2>&1
    echo [前端] 已关闭
)

echo.
echo 所有服务已关闭，再见！
exit /b 0

:: 捕获 Ctrl+C
ctrlc cleanup

:: 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未安装 Node.js
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js: %NODE_VERSION%
echo.

:: 进入项目目录
cd /d "%~dp0"

:: 检查后端
if not exist "backend" (
    echo ❌ backend 目录不存在
    pause
    exit /b 1
)

:: 检查前端
if not exist "frontend" (
    echo ❌ frontend 目录不存在
    pause
    exit /b 1
)

:: 安装后端依赖
if not exist "backend\node_modules" (
    echo 正在安装后端依赖...
    cd backend
    call npm install
    cd ..
)

:: 安装前端依赖
if not exist "frontend\node_modules" (
    echo 正在安装前端依赖...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ✓ 依赖检查完成
echo.
echo ====================
echo 📡 启动服务...
echo ====================
echo.

:: 启动后端
cd backend
echo [后端] 启动中...
start /B cmd /c "npm run dev > ..\backend.log 2>&1"
cd ..

:: 获取后端 PID (简化处理，实际 PID 较难获取)
set BACKEND_PID=backend

:: 等待后端启动
timeout /t 5 /nobreak >nul

echo ✓ 后端已启动
echo   API: http://localhost:3000

:: 启动前端
cd frontend
echo [前端] 启动中...
start /B cmd /c "npm run dev > ..\frontend.log 2>&1"
cd ..

set FRONTEND_PID=frontend

:: 等待前端启动
timeout /t 5 /nobreak >nul

echo ✓ 前端已启动
echo   访问：http://localhost:5173
echo.
echo ====================
echo ✓ 所有服务已启动
echo ====================
echo.
echo 📌 服务信息:
echo    前端：http://localhost:5173
echo    后端：http://localhost:3000
echo.
echo 📝 日志文件:
echo    后端：backend.log
echo    前端：frontend.log
echo.
echo 🛑 关闭窗口停止所有服务
echo.
echo 按任意键查看日志输出...
pause >nul

:: 查看日志
type backend.log
type frontend.log

pause
