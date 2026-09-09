import { Router } from 'express';
import { db } from '../config/database';
import { asyncRoute, ApiError } from '../lib/http';

const router = Router();
const decode = (row: { data: string }) => JSON.parse(row.data);

router.get('/search', asyncRoute((req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) throw new ApiError(400, 'VALIDATION_ERROR', 'q is required');
  const pattern = `%${q}%`;
  const rows = db.prepare('SELECT data FROM medicines WHERE name LIKE ? OR salt_name LIKE ? ORDER BY name').all(pattern, pattern) as { data: string }[];
  res.json({ data: rows.map(decode), total: rows.length });
}));

router.get('/', asyncRoute((req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const therapeuticClass = typeof req.query.therapeuticClass === 'string' ? req.query.therapeuticClass : undefined;
  const query = therapeuticClass ? 'SELECT data FROM medicines WHERE therapeutic_class = ? ORDER BY name LIMIT ? OFFSET ?' : 'SELECT data FROM medicines ORDER BY name LIMIT ? OFFSET ?';
  const countQuery = therapeuticClass ? 'SELECT COUNT(*) AS count FROM medicines WHERE therapeutic_class = ?' : 'SELECT COUNT(*) AS count FROM medicines';
  const params = therapeuticClass ? [therapeuticClass, limit, (page - 1) * limit] : [limit, (page - 1) * limit];
  const countParams = therapeuticClass ? [therapeuticClass] : [];
  const rows = db.prepare(query).all(...params) as { data: string }[];
  const total = (db.prepare(countQuery).get(...countParams) as { count: number }).count;
  res.json({ data: rows.map(decode), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}));

router.get('/:id/offers', asyncRoute((req, res) => {
  const medicine = db.prepare('SELECT id FROM medicines WHERE id = ?').get(req.params.id);
  if (!medicine) throw new ApiError(404, 'NOT_FOUND', 'Medicine not found');
  const rows = db.prepare('SELECT data FROM pharmacy_offers ORDER BY id').all() as { data: string }[];
  res.json({ data: rows.map(decode) });
}));

router.get('/:id', asyncRoute((req, res) => {
  const row = db.prepare('SELECT data FROM medicines WHERE id = ?').get(req.params.id) as { data: string } | undefined;
  if (!row) throw new ApiError(404, 'NOT_FOUND', 'Medicine not found');
  res.json({ data: decode(row) });
}));
export default router;
