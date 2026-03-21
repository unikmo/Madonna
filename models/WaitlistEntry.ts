import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type WaitlistStatus = 'pending' | 'invited' | 'code_sent';

export interface IWaitlistEntry extends Document {
  email: string;
  name: string;
  deliveryType?: 'physical' | 'digital';
  productId?: string;
  productTitle?: string;
  quantity?: 1 | 4 | 7;
  status: WaitlistStatus;
  order?: Types.ObjectId;
  generatedCodes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistEntrySchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryType: {
      type: String,
      enum: ['physical', 'digital'],
      required: false,
    },
    productId: {
      type: String,
      required: false,
      trim: true,
    },
    productTitle: {
      type: String,
      required: false,
      trim: true,
    },
    quantity: {
      type: Number,
      enum: [1, 4, 7],
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'invited', 'code_sent'],
      default: 'pending',
      required: true,
      index: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },
    generatedCodes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const WaitlistEntry: Model<IWaitlistEntry> =
  mongoose.models.WaitlistEntry || mongoose.model<IWaitlistEntry>('WaitlistEntry', WaitlistEntrySchema);

export default WaitlistEntry;
