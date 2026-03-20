# 知识地图管理系统 - 启动说明

## ✅ 服务状态

### 当前运行状态
- ✅ **前端服务**: http://localhost:5173
- ✅ **后端 API**: http://localhost:3000
- ✅ **健康检查**: http://localhost:3000/api/health

### 日志查看
```bash
# 实时查看后端日志
tail -f backend.log

# 实时查看前端日志
tail -f frontend.log
```

## 🚀 启动方式

### 一键启动（推荐）
```bash
./run.sh
```

**特性：**
- 自动检查并安装依赖
- 同时启动前端和后端
- 按 **Ctrl+C** 自动关闭所有服务

### 手动启动
```bash
# 终端 1 - 启动后端
cd backend
npm run dev

# 终端 2 - 启动前端
cd frontend
npm run dev
```

## ⚠️ 当前限制

由于未安装 PostgreSQL 和 Redis：
- 后端以降級模式运行
- 数据库相关功能不可用（用户注册/登录、知识节点 CRUD 等）
- Redis 缓存功能不可用

## 📦 安装数据库以使用完整功能

### macOS 安装 PostgreSQL
```bash
# 安装 PostgreSQL
brew install postgresql@14

# 启动服务
brew services start postgresql@14

# 创建数据库
createdb my_map_knowledge

# 修改 backend/.env 配置（如需要）
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=my_map_knowledge
# DB_USER=postgres
# DB_PASSWORD=postgres
```

### macOS 安装 Redis（可选）
```bash
# 安装 Redis
brew install redis

# 启动服务
brew services start redis
```

### 重启服务
安装数据库后，按 Ctrl+C 停止服务，然后重新运行：
```bash
./run.sh
```

## 📁 项目文件

### 启动脚本
- `run.sh` - Mac/Linux 一键启动脚本
- `run.bat` - Windows 一键启动脚本

### 配置文件
- `backend/.env` - 后端环境配置
- `frontend/.env` - 前端环境配置

### 日志文件
- `backend.log` - 后端运行日志
- `frontend.log` - 前端运行日志

### 文档
- `README.md` - 项目说明
- `GETTING_STARTED.md` - 详细启动指南
- `CLAUDE.md` - 开发配置
- `STATUS.md` - 当前状态

## 🔧 故障排查

### 端口被占用
如果端口 3000 或 5173 被占用：
```bash
# 查找并关闭占用端口的进程
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### 清理缓存
```bash
# 清理前端 Vite 缓存
rm -rf frontend/node_modules/.vite

# 清理后端依赖后重新安装
cd backend
rm -rf node_modules
npm install
```

### 查看错误日志
```bash
# 查看完整的后端错误
cat backend.log | grep -i error

# 查看前端错误
cat frontend.log | grep -i error
```
