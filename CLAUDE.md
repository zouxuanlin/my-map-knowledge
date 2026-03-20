# CLAUDE.md - 知识地图项目配置

## 项目概述
知识地图管理系统 (My Map Knowledge) - 一个功能完整的知识地图管理网站，支持知识节点的可视化管理和智能关联。

## 技术栈
- **前端**: React 18 + TypeScript + Vite + Ant Design + Tailwind CSS + Cytoscape.js
- **后端**: Node.js + Express + TypeScript + PostgreSQL + Redis + JWT

## 项目结构
```
my-map-knowledge/
├── backend/           # 后端服务
│   ├── src/
│   │   ├── config/    # 数据库、Redis 配置
│   │   ├── middleware/# 认证、错误处理
│   │   ├── models/    # 数据模型
│   │   ├── routes/    # API 路由
│   │   └── app.ts     # 应用入口
│   └── package.json
├── frontend/          # 前端应用
│   ├── src/
│   │   ├── components/# 可复用组件
│   │   ├── pages/     # 页面组件
│   │   ├── services/  # API 服务
│   │   ├── stores/    # 状态管理
│   │   └── styles/    # 全局样式
│   └── package.json
└── README.md
```

## 开发命令

### 后端
```bash
cd backend
npm install          # 安装依赖
npm run dev          # 开发模式 (端口 3000)
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

### 前端
```bash
cd frontend
npm install          # 安装依赖
npm run dev          # 开发模式 (端口 5173)
npm run build        # 构建生产版本
npm run preview      # 预览生产构建
npm run lint         # 代码检查
```

## 环境配置

### 后端 (.env)
```
PORT=3000
NODE_ENV=development
JWT_SECRET=my-super-secret-jwt-key-change-in-production-2024
DB_HOST=localhost
DB_PORT=5432
DB_NAME=my_map_knowledge
DB_USER=postgres
DB_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
FRONTEND_URL=http://localhost:5173
```

### 前端 (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## 数据库初始化
```bash
# 创建数据库
createdb my_map_knowledge

# 或者使用 psql
psql -U postgres -c "CREATE DATABASE my_map_knowledge;"
```
后端启动时会自动创建表结构。

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/users/me` - 获取当前用户

### 知识节点
- `GET /api/knowledge` - 获取节点列表
- `GET /api/knowledge/:id` - 获取节点详情
- `POST /api/knowledge` - 创建节点
- `PUT /api/knowledge/:id` - 更新节点
- `DELETE /api/knowledge/:id` - 删除节点
- `GET /api/knowledge/graph` - 获取图谱数据

### 用户管理 (管理员)
- `GET /api/users` - 用户列表
- `PUT /api/users/:id/role` - 更新用户角色

## 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式写法 + Hooks
- 使用 Ant Design 组件库
