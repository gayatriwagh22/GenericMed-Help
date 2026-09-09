import mongoose from 'mongoose';

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing required environment variable: MONGODB_URI');

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || 'genericmed',
  });

  isConnected = true;
  console.log('MongoDB Atlas connected');

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('MongoDB disconnected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
  });
}

export { mongoose };
