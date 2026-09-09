import { Router } from 'express';
import { db } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncRoute, ApiError } from '../lib/http';

const router = Router();
router.get('/profile', authenticate, asyncRoute((req: AuthRequest, res) => {
  const user = db.prepare('SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?').get(req.user!.userId) as any;
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');
  res.json({ data: { id: user.id, fullName: user.full_name, email: user.email, phone: user.phone, role: user.role, createdAt: user.created_at } });
}));
export default router;
