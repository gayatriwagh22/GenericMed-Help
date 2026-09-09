import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { Types } from 'mongoose';
import { Order } from '../models/Order';
import { CartItem } from '../models/CartItem';
import { Medicine } from '../models/Medicine';
import { PharmacyOffer } from '../models/PharmacyOffer';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncRoute, ApiError, requiredString } from '../lib/http';

const router = Router();
router.use(authenticate);

// POST /api/orders
router.post('/', asyncRoute(async (req: AuthRequest, res) => {
  const idempotencyKey = requiredString(
    req.header('Idempotency-Key') || req.body.idempotencyKey,
    'Idempotency-Key'
  );
  const userId = new Types.ObjectId(req.user!.userId);

  // Idempotency — return existing order if key already used
  const existing = await Order.findOne({ idempotencyKey, userId }).lean();
  if (existing) return res.status(200).json({ data: existing, idempotent: true });

  // Build order from cart
  const cartItems = await CartItem.find({ userId }).lean();
  if (!cartItems.length) throw new ApiError(400, 'EMPTY_CART', 'Cart is empty');

  const items = await Promise.all(
    cartItems.map(async (item) => {
      const [med, offer] = await Promise.all([
        Medicine.findById(item.medicineId).lean(),
        PharmacyOffer.findById(item.offerId).lean(),
      ]);
      return {
        medicine: med?.data ?? null,
        offer: offer?.data ?? null,
        strengthId: item.strengthId,
        formId: item.formId,
        packSizeId: item.packSizeId,
        quantity: item.quantity,
      };
    })
  );

  const validItems = items.filter((i) => i.medicine && i.offer);
  if (!validItems.length) throw new ApiError(400, 'EMPTY_CART', 'Cart contains no valid items');

  const subtotal = validItems.reduce(
    (sum, i) => sum + (i.offer as any).price * i.quantity,
    0
  );
  const savingsTotal = validItems.reduce(
    (sum, i) => sum + ((i.offer as any).brandedPrice - (i.offer as any).price) * i.quantity,
    0
  );

  const orderId = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;
  const order = await Order.create({
    orderId,
    userId,
    idempotencyKey,
    status: 'placed',
    items: validItems,
    subtotal,
    savingsTotal,
    deliveryFee: 0,
    packagingFee: 0,
    totalAmount: subtotal,
    pharmacy: validItems[0].offer as Record<string, unknown>,
    deliveryAddress: req.body.deliveryAddress || {},
    paymentMethod: req.body.paymentMethod || 'cash_on_delivery',
    estimatedDelivery: 'To be confirmed',
    batchNumber: 'Pending allocation',
  });

  // Clear cart after order placed
  await CartItem.deleteMany({ userId });

  res.status(201).json({ data: order });
}));

// GET /api/orders/:id
router.get('/:id', asyncRoute(async (req: AuthRequest, res) => {
  const order = await Order.findOne({
    orderId: req.params.id,
    userId: new Types.ObjectId(req.user!.userId),
  }).lean();
  if (!order) throw new ApiError(404, 'NOT_FOUND', 'Order not found');
  res.json({ data: order });
}));

// GET /api/orders/:id/tracking
router.get('/:id/tracking', asyncRoute(async (req: AuthRequest, res) => {
  const order = await Order.findOne({
    orderId: req.params.id,
    userId: new Types.ObjectId(req.user!.userId),
  })
    .select('orderId status estimatedDelivery createdAt')
    .lean();
  if (!order) throw new ApiError(404, 'NOT_FOUND', 'Order not found');
  res.json({
    data: {
      orderId: order.orderId,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery,
      updatedAt: order.createdAt,
    },
  });
}));

export default router;
