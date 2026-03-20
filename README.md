# 知识地图管理系统 (My Map Knowledge)

一个功能完整的知识地图管理网站，支持知识节点的可视化管理和智能关联。

## ✨ 特性

### 前端功能
- 📊 **知识图谱可视化** - 使用 Cytoscape.js 实现力导向图展示
- 🔗 **双向链接** - 自动检测并创建节点间的双向引用
- 📝 **Markdown 编辑** - 支持实时预览的 Markdown 编辑器
- 🔍 **搜索功能** - 快速查找知识点
- 👥 **协作编辑** - 实时同步多人编辑状态
- 📱 **响应式设计** - 适配各种屏幕尺寸

### 后端功能
- 🔐 **用户认证** - JWT 令牌认证
- 📦 **RESTful API** - 标准的 REST 接口
- 🗄️ **数据持久化** - PostgreSQL 数据库
- 💾 **版本控制** - 节点修改历史记录
- 🚀 **性能优化** - Redis 缓存支持
- 🤖 **AI 辅助** - 智能推荐相关知识点

### 管理后台
- 📈 **数据分析** - 用户行为和内容统计
- 👥 **用户管理** - 角色权限控制
- ⚙️ **系统配置** - 站点参数设置
- 💾 **备份恢复** - 数据备份功能

## 🏗️ 技术架构

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Ant Design (UI 组件库)
- Tailwind CSS (样式)
- Cytoscape.js (图谱可视化)
- React Router (路由)
- Zustand (状态管理)
- Axios (HTTP 客户端)

### 后端
- Node.js + Express
- TypeScript
- PostgreSQL (主数据库)
- Redis (缓存)
- JWT (认证)
- Socket.IO (实时通信)

## 📦 项目结构

```
my-map-knowledge/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   │   ├── Graph/       # 图谱组件
│   │   │   ├── Editor/      # 编辑器组件
│   │   │   ├── Layout.tsx   # 布局组件
│   │   │   └── ...
│   │   ├── pages/           # 页面组件
│   │   │   ├── KnowledgeMap.tsx
│   │   │   ├── NodeEditor.tsx
│   │   │   ├── Login.tsx
│   │   │   └── admin/       # 管理后台页面
│   │   ├── services/        # API 服务
│   │   ├── stores/          # 状态管理
│   │   └── styles/          # 全局样式
│   └── package.json
├── backend/                  # Node.js 后端
│   ├── src/
│   │   ├── config/          # 配置文件
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── middleware/      # 中间件
│   │   └── services/        # 业务逻辑
│   └── package.json
└── README.md
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6 (可选，用于缓存)

### 方式一：一键启动（推荐）

**macOS / Linux:**
```bash
./run.sh
```

**Windows:**
```bash
run.bat
```

> 脚本会自动安装依赖、启动前后端服务，按 Ctrl+C 自动关闭所有服务。

### 方式二：初始化安装

### 1. 克隆项目
```bash
cd my-map-knowledge
```

### 2. 安装后端依赖
```bash
cd backend
npm install
```

### 3. 配置后端
```bash
# 复制环境配置示例
cp .env.example .env

# 编辑 .env 文件，配置数据库连接信息
```

### 4. 安装前端依赖
```bash
cd ../frontend
npm install
```

### 5. 启动开发服务器

后端（终端 1）:
```bash
cd backend
npm run dev
```

前端（终端 2）:
```bash
cd frontend
npm run dev
```

访问 http://localhost:5173 查看应用

## 📝 API 端点

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

## 🗄️ 数据库

### 初始化
```sql
-- 创建数据库
createdb my_map_knowledge

-- 后端启动时会自动创建表结构
```

### 数据表
- `users` - 用户表
- `knowledge_nodes` - 知识节点
- `node_relations` - 节点关系
- `node_versions` - 版本记录
- `tags` - 标签
- `node_tags` - 节点标签关联

## 🔧 开发

### 代码规范
```bash
# 后端
cd backend
npm run lint

# 前端
cd frontend
npm run lint
```

### 构建
```bash
# 后端构建
cd backend
npm run build

# 前端构建
cd frontend
npm run build
```

## 📸 截图

### 知识地图
> 知识图谱可视化界面

### 节点编辑
> Markdown 编辑器支持实时预览

### 管理后台
> 数据分析和用户管理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👥 作者

My Map Knowledge Team
