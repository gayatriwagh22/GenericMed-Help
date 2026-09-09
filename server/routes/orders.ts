import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { db } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncRoute, ApiError, requiredString } from '../lib/http';

const router = Router();
router.use(authenticate);
const decode = (row: any) => JSON.parse(row.data);
router.post('/', asyncRoute((req: AuthRequest, res) => {
  const idempotencyKey = requiredString(req.header('Idempotency-Key') || req.body.idempotencyKey, 'Idempotency-Key');
  const existing = db.prepare('SELECT data FROM orders WHERE idempotency_key = ? AND user_id = ?').get(idempotencyKey, req.user!.userId) as any;
  if (existing) return res.status(200).json({ data: decode(existing), idempotent: true });
  const cart = db.prepare(`SELECT c.*, m.data AS medicine, o.data AS offer FROM cart_items c JOIN medicines m ON m.id = c.medicine_id JOIN pharmacy_offers o ON o.id = c.offer_id WHERE c.user_id = ?`).all(req.user!.userId) as any[];
  if (!cart.length) throw new ApiError(400, 'EMPTY_CART', 'Cart is empty');
  const items = cart.map(item => ({ medicine: JSON.parse(item.medicine), offer: JSON.parse(item.offer), strengthId: item.strength_id, formId: item.form_id, packSizeId: item.pack_size_id, quantity: item.quantity }));
  const subtotal = items.reduce((sum, item) => sum + item.offer.price * item.quantity, 0);
  const savingsTotal = items.reduce((sum, item) => sum + (item.offer.brandedPrice - item.offer.price) * item.quantity, 0);
  const order = { id: `ORD-${randomUUID().slice(0, 8).toUpperCase()}`, userId: req.user!.userId, items, subtotal, savingsTotal, deliveryFee: 0, packagingFee: 0, totalAmount: subtotal, status: 'placed', pharmacy: items[0].offer, deliveryAddress: req.body.deliveryAddress || {}, paymentMethod: req.body.paymentMethod || 'cash_on_delivery', idempotencyKey, estimatedDelivery: 'To be confirmed', batchNumber: 'Pending allocation', createdAt: new Date().toISOString() };
  db.prepare('INSERT INTO orders (id, user_id, data, idempotency_key, status, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(order.id, order.userId, JSON.stringify(order), idempotencyKey, order.status, order.createdAt);
  db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user!.userId);
  res.status(201).json({ data: order });
}));
router.get('/:id', asyncRoute((req: AuthRequest, res) => {
  const row = db.prepare('SELECT data FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.userId) as any;
  if (!row) throw new ApiError(404, 'NOT_FOUND', 'Order not found');
  res.json({ data: decode(row) });
}));
router.get('/:id/tracking', asyncRoute((req: AuthRequest, res) => {
  const row = db.prepare('SELECT data FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.userId) as any;
  if (!row) throw new ApiError(404, 'NOT_FOUND', 'Order not found');
  const order = decode(row);
  res.json({ data: { orderId: order.id, status: order.status, estimatedDelivery: order.estimatedDelivery, updatedAt: order.createdAt } });
}));
export default router;
