import { Router } from 'express';
import { Types } from 'mongoose';
import { CartItem } from '../models/CartItem';
import { Medicine } from '../models/Medicine';
import { PharmacyOffer } from '../models/PharmacyOffer';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncRoute, ApiError, requiredString } from '../lib/http';

const router = Router();
router.use(authenticate);

// Build the response shape expected by the frontend
async function presentCart(userId: string) {
  const items = await CartItem.find({ userId: new Types.ObjectId(userId) }).lean();
  const result = await Promise.all(
    items.map(async (item) => {
      const [med, offer] = await Promise.all([
        Medicine.findById(item.medicineId).lean(),
        PharmacyOffer.findById(item.offerId).lean(),
      ]);
      return {
        id: item._id.toString(),
        medicine: med?.data ?? null,
        offer: offer?.data ?? null,
        strengthId: item.strengthId,
        formId: item.formId,
        packSizeId: item.packSizeId,
        quantity: item.quantity,
      };
    })
  );
  return result.filter((r) => r.medicine && r.offer);
}

// GET /api/cart
router.get('/', asyncRoute(async (req: AuthRequest, res) => {
  res.json({ data: await presentCart(req.user!.userId) });
}));

// POST /api/cart
router.post('/', asyncRoute(async (req: AuthRequest, res) => {
  const { medicineId, strengthId, formId, packSizeId, offerId } = req.body;
  for (const [name, value] of [
    ['medicineId', medicineId],
    ['strengthId', strengthId],
    ['formId', formId],
    ['packSizeId', packSizeId],
    ['offerId', offerId],
  ] as [string, unknown][]) {
    requiredString(value, name);
  }

  const [med, offer] = await Promise.all([
    Medicine.findById(medicineId).lean(),
    PharmacyOffer.findById(offerId).lean(),
  ]);
  if (!med || !offer) throw new ApiError(404, 'NOT_FOUND', 'Medicine or pharmacy offer not found');

  const userId = new Types.ObjectId(req.user!.userId);
  const filter = { userId, medicineId, strengthId, formId, packSizeId, offerId };

  // Increment quantity if line already exists, otherwise create
  await CartItem.findOneAndUpdate(
    filter,
    { $inc: { quantity: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ data: await presentCart(req.user!.userId) });
}));

// PUT /api/cart/:itemId
router.put('/:itemId', asyncRoute(async (req: AuthRequest, res) => {
  const quantity = Number(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1)
    throw new ApiError(400, 'VALIDATION_ERROR', 'quantity must be a positive integer');

  const item = await CartItem.findOneAndUpdate(
    { _id: req.params.itemId, userId: new Types.ObjectId(req.user!.userId) },
    { quantity },
    { new: true }
  );
  if (!item) throw new ApiError(404, 'NOT_FOUND', 'Cart item not found');

  res.json({ data: await presentCart(req.user!.userId) });
}));

// DELETE /api/cart/:itemId
router.delete('/:itemId', asyncRoute(async (req: AuthRequest, res) => {
  const result = await CartItem.deleteOne({
    _id: req.params.itemId,
    userId: new Types.ObjectId(req.user!.userId),
  });
  if (!result.deletedCount) throw new ApiError(404, 'NOT_FOUND', 'Cart item not found');
  res.status(204).send();
}));

export default router;
