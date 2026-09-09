import { Router } from 'express';
import { Medicine } from '../models/Medicine';
import { PharmacyOffer } from '../models/PharmacyOffer';
import { asyncRoute, ApiError } from '../lib/http';

const router = Router();

// GET /api/medicines/search?q=
router.get('/search', asyncRoute(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) throw new ApiError(400, 'VALIDATION_ERROR', 'q is required');

  const medicines = await Medicine.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { saltName: { $regex: q, $options: 'i' } },
    ],
  })
    .sort({ name: 1 })
    .lean();

  const data = medicines.map((m) => m.data);
  res.json({ data, total: data.length });
}));

// GET /api/medicines?page=&limit=&therapeuticClass=
router.get('/', asyncRoute(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const therapeuticClass =
    typeof req.query.therapeuticClass === 'string' ? req.query.therapeuticClass : undefined;

  const filter = therapeuticClass ? { therapeuticClass } : {};
  const [medicines, total] = await Promise.all([
    Medicine.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Medicine.countDocuments(filter),
  ]);

  res.json({
    data: medicines.map((m) => m.data),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}));

// GET /api/medicines/:id/offers
router.get('/:id/offers', asyncRoute(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id).lean();
  if (!medicine) throw new ApiError(404, 'NOT_FOUND', 'Medicine not found');

  const offers = await PharmacyOffer.find().sort({ _id: 1 }).lean();
  res.json({ data: offers.map((o) => o.data) });
}));

// GET /api/medicines/:id
router.get('/:id', asyncRoute(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id).lean();
  if (!medicine) throw new ApiError(404, 'NOT_FOUND', 'Medicine not found');
  res.json({ data: medicine.data });
}));

export default router;
