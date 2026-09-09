import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'pharmacist';
  passwordHash: string;
  abhaId?: string;
  pincode?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ['patient', 'doctor', 'pharmacist'], default: 'patient' },
    passwordHash: { type: String, required: true },
    abhaId: { type: String },
    pincode: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
