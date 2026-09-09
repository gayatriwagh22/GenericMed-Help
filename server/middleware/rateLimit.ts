import { Request, Response, NextFunction } from 'express';

const requests = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (limit = 20, windowMs = 60_000) => (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }
  if (current.count >= limit) return res.status(429).json({ error: 'Too many AI requests. Please try again shortly.', code: 'RATE_LIMITED' });
  current.count += 1;
  next();
};
