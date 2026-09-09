import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { asyncRoute, ApiError, requiredString } from '../lib/http';

const router = Router();

const publicUser = (user: InstanceType<typeof User>) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

const makeTokens = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET!;
  const payload = { userId, role };
  return {
    accessToken: jwt.sign(payload, secret, { expiresIn: '1h' }),
    refreshToken: jwt.sign(payload, secret, { expiresIn: '7d' }),
  };
};

// POST /api/auth/register
router.post('/register', asyncRoute(async (req, res) => {
  const fullName = requiredString(req.body.fullName, 'fullName');
  const email = requiredString(req.body.email, 'email').toLowerCase();
  const phone = requiredString(req.body.phone, 'phone');
  const password = requiredString(req.body.password, 'password');
  const role = req.body.role || 'patient';

  if (!['patient', 'doctor', 'pharmacist'].includes(role))
    throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid role');
  if (password.length < 8)
    throw new ApiError(400, 'VALIDATION_ERROR', 'Password must be at least 8 characters');

  const exists = await User.findOne({ email }).lean();
  if (exists) throw new ApiError(409, 'EMAIL_IN_USE', 'Email is already registered');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ fullName, email, phone, role, passwordHash });

  res.status(201).json({
    data: { user: publicUser(user), ...makeTokens(user._id.toString(), user.role) },
  });
}));

// POST /api/auth/login
router.post('/login', asyncRoute(async (req, res) => {
  const email = requiredString(req.body.email, 'email').toLowerCase();
  const password = requiredString(req.body.password, 'password');

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

  res.json({ data: { user: publicUser(user), ...makeTokens(user._id.toString(), user.role) } });
}));

// POST /api/auth/refresh
router.post('/refresh', asyncRoute((req, res) => {
  const token = requiredString(req.body.refreshToken, 'refreshToken');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    const accessToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    res.json({ data: { accessToken } });
  } catch {
    throw new ApiError(401, 'INVALID_TOKEN', 'Invalid refresh token');
  }
}));

export default router;
