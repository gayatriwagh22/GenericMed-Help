import { Schema, model, Document } from 'mongoose';

export interface IPharmacyOffer extends Document {
  _id: string;        // offer id
  pharmacyId: string;
  pharmacyName: string;
  drugLicenseNumber: string;
  data: Record<string, unknown>; // full PharmacyOffer JSON
}

const PharmacyOfferSchema = new Schema<IPharmacyOffer>(
  {
    _id: { type: String, required: true },
    pharmacyId: { type: String, required: true, index: true },
    pharmacyName: { type: String, required: true },
    drugLicenseNumber: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: false, _id: false }
);

export const PharmacyOffer = model<IPharmacyOffer>('PharmacyOffer', PharmacyOfferSchema);
