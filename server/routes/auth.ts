import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { db } from '../config/database';
import { asyncRoute, ApiError, requiredString } from '../lib/http';

const router = Router();
const publicUser = (row: any) => ({ id: row.id, fullName: row.full_name, email: row.email, phone: row.phone, role: row.role });
const tokens = (user: any) => {
  const secret = process.env.JWT_SECRET!;
  const payload = { userId: user.id, role: user.role };
  return { accessToken: jwt.sign(payload, secret, { expiresIn: '1h' }), refreshToken: jwt.sign(payload, secret, { expiresIn: '7d' }) };
};
router.post('/register', asyncRoute(async (req, res) => {
  const fullName = requiredString(req.body.fullName, 'fullName');
  const email = requiredString(req.body.email, 'email').toLowerCase();
  const phone = requiredString(req.body.phone, 'phone');
  const password = requiredString(req.body.password, 'password');
  const role = req.body.role || 'patient';
  if (!['patient', 'doctor', 'pharmacist'].includes(role)) throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid role');
  if (password.length < 8) throw new ApiError(400, 'VALIDATION_ERROR', 'Password must be at least 8 characters');
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) throw new ApiError(409, 'EMAIL_IN_USE', 'Email is already registered');
  const user = { id: randomUUID(), full_name: fullName, email, phone, role, password_hash: await bcrypt.hash(password, 12), created_at: new Date().toISOString() };
  db.prepare('INSERT INTO users (id, full_name, email, phone, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(user.id, user.full_name, user.email, user.phone, user.role, user.password_hash, user.created_at);
  res.status(201).json({ data: { user: publicUser(user), ...tokens(user) } });
}));
router.post('/login', asyncRoute(async (req, res) => {
  const email = requiredString(req.body.email, 'email').toLowerCase();
  const password = requiredString(req.body.password, 'password');
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !(await bcrypt.compare(password, user.password_hash))) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  res.json({ data: { user: publicUser(user), ...tokens(user) } });
}));
router.post('/refresh', asyncRoute((req, res) => {
  const token = requiredString(req.body.refreshToken, 'refreshToken');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    res.json({ data: { accessToken: jwt.sign({ userId: payload.userId, role: payload.role }, process.env.JWT_SECRET!, { expiresIn: '1h' }) } });
  } catch { throw new ApiError(401, 'INVALID_TOKEN', 'Invalid refresh token'); }
}));
export default router;
