import { Schema, model, Document, Types } from 'mongoose';

export interface ICartItem extends Document {
  userId: Types.ObjectId;
  medicineId: string;
  strengthId: string;
  formId: string;
  packSizeId: string;
  offerId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    medicineId: { type: String, required: true },
    strengthId: { type: String, required: true },
    formId: { type: String, required: true },
    packSizeId: { type: String, required: true },
    offerId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

// Prevent duplicate lines for the same variant + offer in one cart
CartItemSchema.index(
  { userId: 1, medicineId: 1, strengthId: 1, formId: 1, packSizeId: 1, offerId: 1 },
  { unique: true }
);

export const CartItem = model<ICartItem>('CartItem', CartItemSchema);
