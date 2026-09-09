import { Schema, model, Document, Types } from 'mongoose';

export type OrderStatus =
  | 'placed'
  | 'pharmacy_accepted'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface IOrder extends Document {
  orderId: string;         // human-readable e.g. "ORD-A1B2C3D4"
  userId: Types.ObjectId;
  idempotencyKey: string;
  status: OrderStatus;
  items: unknown[];
  subtotal: number;
  savingsTotal: number;
  deliveryFee: number;
  packagingFee: number;
  totalAmount: number;
  pharmacy: Record<string, unknown>;
  deliveryAddress: Record<string, unknown>;
  paymentMethod: string;
  estimatedDelivery: string;
  batchNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    idempotencyKey: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['placed', 'pharmacy_accepted', 'packed', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    items: { type: Schema.Types.Mixed, required: true },
    subtotal: { type: Number, required: true },
    savingsTotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    packagingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    pharmacy: { type: Schema.Types.Mixed, required: true },
    deliveryAddress: { type: Schema.Types.Mixed, required: true },
    paymentMethod: { type: String, required: true },
    estimatedDelivery: { type: String, default: 'To be confirmed' },
    batchNumber: { type: String, default: 'Pending allocation' },
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', OrderSchema);
