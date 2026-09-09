import { db } from '../config/database';
import { MEDICINES, PHARMACY_OFFERS } from '../../src/data/mockData';

export function seedMockData() {
  const medicine = db.prepare('INSERT OR IGNORE INTO medicines (id, data, name, salt_name, therapeutic_class) VALUES (?, ?, ?, ?, ?)');
  const pharmacy = db.prepare('INSERT OR IGNORE INTO pharmacies (id, data, name, drug_license_number) VALUES (?, ?, ?, ?)');
  const offer = db.prepare('INSERT OR IGNORE INTO pharmacy_offers (id, pharmacy_id, data) VALUES (?, ?, ?)');
  for (const item of MEDICINES) medicine.run(item.id, JSON.stringify(item), item.name, item.saltName, item.therapeuticClass);
  for (const item of PHARMACY_OFFERS) {
    pharmacy.run(item.pharmacyId, JSON.stringify(item), item.pharmacyName, item.drugLicenseNumber);
    offer.run(item.id, item.pharmacyId, JSON.stringify(item));
  }
}

if (process.argv[1]?.endsWith('seedMockData.ts')) {
  // The standalone seed command requires the schema to exist, so use the server initializer instead.
  console.log('Seed data is applied automatically when the server starts.');
}
