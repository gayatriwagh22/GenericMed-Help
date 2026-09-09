import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { db, initializeDatabase } from './config/database';
import medicineRoutes from './routes/medicines';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import aiRoutes from './routes/ai';

dotenv.config();

for (const required of ['JWT_SECRET']) {
  if (!process.env[required]) throw new Error(`Missing required environment variable: ${required}`);
}
initializeDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/medicines', medicineRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ error: 'Database unavailable', code: 'DATABASE_UNAVAILABLE' });
  }
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
