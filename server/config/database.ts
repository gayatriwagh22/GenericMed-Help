import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { seedMockData } from '../seeds/seedMockData';

const configuredPath = process.env.DATABASE_URL?.replace('file:', '') || './prisma/dev.db';
const databasePath = resolve(process.cwd(), configuredPath);
mkdirSync(dirname(databasePath), { recursive: true });
export const db = new DatabaseSync(databasePath);

export function initializeDatabase() {
  db.exec(`PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS medicines (id TEXT PRIMARY KEY, data TEXT NOT NULL, name TEXT NOT NULL, salt_name TEXT NOT NULL, therapeutic_class TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS pharmacies (id TEXT PRIMARY KEY, data TEXT NOT NULL, name TEXT NOT NULL, drug_license_number TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS pharmacy_offers (id TEXT PRIMARY KEY, pharmacy_id TEXT NOT NULL REFERENCES pharmacies(id), data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, full_name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, phone TEXT NOT NULL, role TEXT NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS cart_items (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), medicine_id TEXT NOT NULL REFERENCES medicines(id), strength_id TEXT NOT NULL, form_id TEXT NOT NULL, pack_size_id TEXT NOT NULL, offer_id TEXT NOT NULL REFERENCES pharmacy_offers(id), quantity INTEGER NOT NULL DEFAULT 1, UNIQUE(user_id, medicine_id, strength_id, form_id, pack_size_id, offer_id));
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), data TEXT NOT NULL, idempotency_key TEXT UNIQUE NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS medicines_search_idx ON medicines(name, salt_name);
    CREATE INDEX IF NOT EXISTS cart_user_idx ON cart_items(user_id);
    CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id);`);
  seedMockData();
}
