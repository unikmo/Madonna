import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  roles: ('buyer' | 'admin')[];
  password?: string;
  shopifyCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    roles: {
      type: [String],
      enum: ['buyer', 'admin'],
      default: ['buyer'],
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    shopifyCustomerId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
