import { Router } from 'express';
import { Types } from 'mongoose';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncRoute, ApiError } from '../lib/http';

const router = Router();

// GET /api/user/profile
router.get('/profile', authenticate, asyncRoute(async (req: AuthRequest, res) => {
  const user = await User.findById(new Types.ObjectId(req.user!.userId))
    .select('-passwordHash')
    .lean();
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');
  res.json({
    data: {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      abhaId: user.abhaId,
      pincode: user.pincode,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  });
}));

export default router;
