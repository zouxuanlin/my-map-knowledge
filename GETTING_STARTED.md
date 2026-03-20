# 快速启动指南

## 环境准备

### 1. 安装 Node.js
确保已安装 Node.js 18 或更高版本：
```bash
node --version  # 应该显示 v18.x.x 或更高
```

如果没有安装，请从 https://nodejs.org/ 下载安装。

### 2. 安装 PostgreSQL
确保已安装 PostgreSQL 14 或更高版本：

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
从 https://www.postgresql.org/download/windows/ 下载并安装

**Linux (Ubuntu):**
```bash
sudo apt-get install postgresql-14
```

### 3. 安装 Redis (可选，用于缓存)
**macOS:**
```bash
brew install redis
brew services start redis
```

**Windows:**
从 https://github.com/microsoftarchive/redis/releases 下载

**Linux (Ubuntu):**
```bash
sudo apt-get install redis-server
```

## 数据库初始化

```bash
# 创建数据库
createdb my_map_knowledge

# 或者使用 psql
psql -U postgres
CREATE DATABASE my_map_knowledge;
\q
```

## 安装依赖

### 后端
```bash
cd backend
npm install
```

### 前端
```bash
cd ../frontend
npm install
```

## 启动应用

### 方式一：分别启动（推荐开发使用）

**终端 1 - 启动后端:**
```bash
cd backend
npm run dev
```
后端将在 http://localhost:3000 启动

**终端 2 - 启动前端:**
```bash
cd frontend
npm run dev
```
前端将在 http://localhost:5173 启动

### 方式二：仅启动前端（使用后端 API 服务）

如果后端已经部署在服务器上，只需：
```bash
cd frontend
npm run dev
```

## 首次使用

1. 打开浏览器访问 http://localhost:5173
2. 点击"立即注册"创建第一个账号
3. 登录后即可开始创建知识节点

## 默认管理员账号

首次启动时，你可以手动创建管理员账号：

1. 注册一个普通账号
2. 在数据库中修改角色：
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 常见问题

### 端口已被占用
如果 3000 或 5173 端口被占用，可以在 `.env` 文件中修改：

**后端 (.env):**
```
PORT=3001
```

**前端 (vite.config.ts):**
```ts
server: {
  port: 5174,
}
```

### 数据库连接失败
检查 PostgreSQL 是否运行：
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

### Redis 连接失败
如果未安装 Redis，可以暂时不使用缓存功能，后端会自动降级。

## 构建生产版本

```bash
# 构建后端
cd backend
npm run build

# 构建前端
cd ../frontend
npm run build

# 启动生产服务器
cd ../backend
npm start
```

## 下一步

- [ ] 创建你的第一个知识节点
- [ ] 探索知识图谱可视化
- [ ] 尝试 Markdown 编辑
- [ ] 配置 AI 推荐功能（可选）
- [ ] 自定义站点设置

祝你使用愉快！
