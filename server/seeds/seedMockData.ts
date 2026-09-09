import { Medicine } from '../models/Medicine';
import { PharmacyOffer } from '../models/PharmacyOffer';
import { MEDICINES, PHARMACY_OFFERS } from '../../src/data/mockData';

export async function seedMockData(): Promise<void> {
  // Upsert medicines — replace on re-seed so data stays in sync with mockData.ts
  for (const item of MEDICINES) {
    await Medicine.findByIdAndUpdate(
      item.id,
      {
        _id: item.id,
        name: item.name,
        saltName: item.saltName,
        therapeuticClass: item.therapeuticClass,
        data: item as unknown as Record<string, unknown>,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // Upsert pharmacy offers
  for (const item of PHARMACY_OFFERS) {
    await PharmacyOffer.findByIdAndUpdate(
      item.id,
      {
        _id: item.id,
        pharmacyId: item.pharmacyId,
        pharmacyName: item.pharmacyName,
        drugLicenseNumber: item.drugLicenseNumber,
        data: item as unknown as Record<string, unknown>,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${MEDICINES.length} medicines and ${PHARMACY_OFFERS.length} pharmacy offers`);
}
