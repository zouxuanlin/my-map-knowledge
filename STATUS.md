# 启动状态

## 服务状态

✅ **前端服务**: 正常运行
- 地址：http://localhost:5173
- 状态：正常响应

✅ **后端服务**: 正常运行（有限功能）
- 地址：http://localhost:3000
- 健康检查：http://localhost:3000/api/health
- 状态：⚠️ 数据库未连接

## 当前限制

由于系统未安装 PostgreSQL 和 Redis，以下功能暂时不可用：
- 用户注册/登录
- 知识节点 CRUD
- 数据持久化

## 完整功能启动步骤

### 1. 安装 PostgreSQL

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
createdb my_map_knowledge
```

**安装后修改 backend/.env:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=my_map_knowledge
DB_USER=postgres
DB_PASSWORD=postgres
```

### 2. 安装 Redis (可选)

**macOS:**
```bash
brew install redis
brew services start redis
```

### 3. 重启服务

```bash
./run.sh
```

## 当前可用功能

- 前端 UI 界面浏览
- 后端健康检查 API
- API 端点调用（需要数据库才能正常工作）

## 文件说明

- `run.sh` / `run.bat` - 一键启动脚本（按 Ctrl+C 自动关闭所有服务）
- `backend.log` - 后端日志
- `frontend.log` - 前端日志
