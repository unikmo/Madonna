import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMedia {
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  createdAt: Date;
}

export interface IMomentCode extends Document {
  code: string;
  user: Types.ObjectId;
  order: Types.ObjectId;
  quantity: 1 | 4 | 7;
  deliveryType: 'digital' | 'physical' | 'split';
  status: 'new' | 'claimed' | 'revoked';
  unlockable: boolean;
  claimedAt?: Date;
  media: IMedia[];
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'text'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const MomentCodeSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    quantity: {
      type: Number,
      enum: [1, 4, 7],
      required: true,
    },
    deliveryType: {
      type: String,
      enum: ['digital', 'physical', 'split'],
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'claimed', 'revoked'],
      default: 'new',
      required: true,
    },
    unlockable: {
      type: Boolean,
      default: false,
      required: true,
    },
    claimedAt: {
      type: Date,
      required: false,
    },
    media: {
      type: [MediaSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during development
const MomentCode: Model<IMomentCode> =
  mongoose.models.MomentCode || mongoose.model<IMomentCode>('MomentCode', MomentCodeSchema);

export default MomentCode;
