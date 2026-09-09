import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase, mongoose } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { seedMockData } from './seeds/seedMockData';
import medicineRoutes from './routes/medicines';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import aiRoutes from './routes/ai';

for (const required of ['JWT_SECRET', 'MONGODB_URI']) {
  if (!process.env[required]) throw new Error(`Missing required environment variable: ${required}`);
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' })); // 5 MB to allow base64 prescription images

app.use('/api/medicines', medicineRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', async (_req, res) => {
  const state = mongoose.connection.readyState;
  // 1 = connected
  if (state === 1) {
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } else {
    res.status(503).json({ error: 'Database unavailable', code: 'DATABASE_UNAVAILABLE' });
  }
});

app.use(errorHandler);

async function start() {
  await connectDatabase();
  // Seed catalog data on first run (upsert is safe to call on every restart)
  await seedMockData();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
