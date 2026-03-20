import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { UserModel } from '../models/user.model';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// 注册
router.post(
  '/register',
  [
    body('username').isLength({ min: 3, max: 50 }).withMessage('用户名长度 3-50'),
    body('email').isEmail().withMessage('邮箱格式不正确'),
    body('password').isLength({ min: 6 }).withMessage('密码至少 6 位'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { username, email, password } = req.body;

      // 检查用户是否已存在
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        throw new AppError('用户名已存在', 409);
      }

      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        throw new AppError('邮箱已被注册', 409);
      }

      // 密码加密
      const passwordHash = await bcrypt.hash(password, 10);

      // 创建用户
      const user = await UserModel.create({ username, email, password }, passwordHash);

      // 生成 JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        message: '注册成功',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// 登录
router.post(
  '/login',
  [
    body('username').optional().isString(),
    body('email').optional().isString(),
    body('password').notEmpty().withMessage('密码不能为空'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { username, email, password } = req.body;

      // 查找用户
      let user = null;
      if (username) {
        user = await UserModel.findByUsername(username);
      } else if (email) {
        user = await UserModel.findByEmail(email);
      }

      if (!user) {
        throw new AppError('用户名或密码错误', 401);
      }

      // 验证密码（需要查询带 password_hash 的完整用户信息）
      const result = await (await import('../config/database')).default.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [user.id]
      );
      const passwordHash = result.rows[0].password_hash;

      const isValid = await bcrypt.compare(password, passwordHash);
      if (!isValid) {
        throw new AppError('用户名或密码错误', 401);
      }

      // 生成 JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        message: '登录成功',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// 获取当前用户信息
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('未提供认证令牌', 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
