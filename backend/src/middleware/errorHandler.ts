import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // PostgreSQL 错误处理
  if ((err as any).code) {
    const pgCode = (err as any).code;
    if (pgCode === '23505') {
      return res.status(409).json({ error: '资源已存在' });
    }
    if (pgCode === '23503') {
      return res.status(400).json({ error: '引用的资源不存在' });
    }
  }

  // 默认 500 错误
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? '服务器内部错误'
      : err.message,
  });
};
