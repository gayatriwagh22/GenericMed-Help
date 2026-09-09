import { Schema, model, Document } from 'mongoose';

// The canonical medicine document stores the full typed object as a sub-document
// so it round-trips perfectly with the frontend CanonicalMedicine interface.
export interface IMedicine extends Document {
  _id: string;       // same as the slug id (e.g. "paracetamol-ip")
  name: string;
  saltName: string;
  therapeuticClass: string;
  data: Record<string, unknown>; // full CanonicalMedicine JSON
}

const MedicineSchema = new Schema<IMedicine>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, index: true },
    saltName: { type: String, required: true, index: true },
    therapeuticClass: { type: String, required: true, index: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: false, _id: false }
);

MedicineSchema.index({ name: 'text', saltName: 'text' });

export const Medicine = model<IMedicine>('Medicine', MedicineSchema);
