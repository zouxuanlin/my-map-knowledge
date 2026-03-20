import { Router } from 'express';
import { UserModel } from '../models/user.model';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// 获取所有用户（需要管理员权限）
router.get('/', authenticate, requireRole('admin'), async (req: AuthRequest, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await UserModel.findAll(limit, offset);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// 更新用户角色（需要管理员权限）
router.put('/:id/role', authenticate, requireRole('admin'), async (req: AuthRequest, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['viewer', 'editor', 'admin'];

    if (!role || !validRoles.includes(role)) {
      throw new AppError('无效的角色', 400);
    }

    const user = await UserModel.updateRole(req.params.id, role);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
});

// 获取当前用户信息
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  res.json({
    id: req.user?.id,
    username: req.user?.username,
    email: req.user?.email,
    role: req.user?.role,
    avatar_url: req.user?.avatar_url,
  });
});

export default router;
