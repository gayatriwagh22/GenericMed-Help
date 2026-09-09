import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { db } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncRoute, ApiError, requiredString } from '../lib/http';

const router = Router();
router.use(authenticate);
const cartRows = (userId: string) => db.prepare(`SELECT c.*, m.data AS medicine, o.data AS offer FROM cart_items c JOIN medicines m ON m.id = c.medicine_id JOIN pharmacy_offers o ON o.id = c.offer_id WHERE c.user_id = ?`).all(userId) as any[];
const present = (row: any) => ({ id: row.id, medicine: JSON.parse(row.medicine), offer: JSON.parse(row.offer), strengthId: row.strength_id, formId: row.form_id, packSizeId: row.pack_size_id, quantity: row.quantity });

router.get('/', asyncRoute((req: AuthRequest, res) => res.json({ data: cartRows(req.user!.userId).map(present) })));
router.post('/', asyncRoute((req: AuthRequest, res) => {
  const { medicineId, strengthId, formId, packSizeId, offerId } = req.body;
  [ ['medicineId', medicineId], ['strengthId', strengthId], ['formId', formId], ['packSizeId', packSizeId], ['offerId', offerId] ].forEach(([name, value]) => requiredString(value, name));
  if (!db.prepare('SELECT id FROM medicines WHERE id = ?').get(medicineId) || !db.prepare('SELECT id FROM pharmacy_offers WHERE id = ?').get(offerId)) throw new ApiError(404, 'NOT_FOUND', 'Medicine or pharmacy offer not found');
  const current = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND medicine_id = ? AND strength_id = ? AND form_id = ? AND pack_size_id = ? AND offer_id = ?').get(req.user!.userId, medicineId, strengthId, formId, packSizeId, offerId) as any;
  if (current) db.prepare('UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?').run(current.id);
  else db.prepare('INSERT INTO cart_items (id, user_id, medicine_id, strength_id, form_id, pack_size_id, offer_id, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, 1)').run(randomUUID(), req.user!.userId, medicineId, strengthId, formId, packSizeId, offerId);
  res.status(201).json({ data: cartRows(req.user!.userId).map(present) });
}));
router.put('/:itemId', asyncRoute((req: AuthRequest, res) => {
  const quantity = Number(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) throw new ApiError(400, 'VALIDATION_ERROR', 'quantity must be a positive integer');
  const result = db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?').run(quantity, req.params.itemId, req.user!.userId);
  if (!result.changes) throw new ApiError(404, 'NOT_FOUND', 'Cart item not found');
  res.json({ data: cartRows(req.user!.userId).map(present) });
}));
router.delete('/:itemId', asyncRoute((req: AuthRequest, res) => {
  const result = db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.itemId, req.user!.userId);
  if (!result.changes) throw new ApiError(404, 'NOT_FOUND', 'Cart item not found');
  res.status(204).send();
}));
export default router;
