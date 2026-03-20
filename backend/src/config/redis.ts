import { createClient } from 'redis';

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

const config: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

let redisClient: ReturnType<typeof createClient> | null = null;

redisClient = createClient({
  socket: {
    host: config.host,
    port: config.port,
    reconnectStrategy: false, // 禁用自动重连
  },
  password: config.password,
});

redisClient.on('error', (err) => {
  // 静默处理 Redis 连接错误（Redis 未安装时）
});

export const connectRedis = async (): Promise<boolean> => {
  try {
    await redisClient!.connect();
    console.log('Redis connected');
    return true;
  } catch (err) {
    // Redis 未安装时不显示错误
    redisClient = null;
    return false;
  }
};

export const getRedisClient = () => redisClient;
