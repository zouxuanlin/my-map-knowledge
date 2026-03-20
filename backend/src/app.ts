import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { initDatabase } from './models/init';
import { connectRedis } from './config/redis';
import knowledgeRoutes from './routes/knowledge.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet()); // 安全头
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(compression()); // 压缩响应
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 每个 IP 最多 100 个请求
  message: '请求过于频繁，请稍后再试',
});
app.use('/api', limiter);

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/users', userRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  // 尝试初始化数据库（失败不退出）
  initDatabase().then(() => {
    console.log('Database initialized');
  }).catch((err) => {
    console.error('数据库初始化失败 (请确保 PostgreSQL 已安装并运行):', err.message);
    console.warn('服务器将在没有数据库的情况下启动，但 API 将无法正常工作');
  });

  // 尝试连接 Redis（失败不退出）
  connectRedis().then(() => {
    console.log('Redis connected');
  }).catch((err) => {
    console.error('Redis 连接失败 (可选):', err.message);
  });

  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`健康检查：http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;
