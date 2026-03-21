import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ILineItem {
  productId: string;
  variantId: string;
  quantity: number;
  metafields?: Record<string, any>;
}

export interface IOrder extends Document {
  shopifyOrderId: string;
  shopifyOrderName?: string;
  shopifyProductId: string;
  orderQuantity: number;
  user: Types.ObjectId;
  email: string;
  customerName?: string;
  totalPrice: number;
  currency: string;
  paymentStatus: 'paid';
  source: 'webhook' | 'admin' | 'waitlist';
  tags: string[];
  lineItems: ILineItem[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    shopifyOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    shopifyProductId: {
      type: String,
      required: true,
    },
    shopifyOrderName: {
      type: String,
      required: false,
    },
    orderQuantity: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    paymentStatus: {
      type: String,
      enum: ['paid'],
      default: 'paid',
      required: true,
    },
    source: {
      type: String,
      enum: ['webhook', 'admin', 'waitlist'],
      default: 'webhook',
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    lineItems: [
      {
        productId: String,
        variantId: String,
        quantity: Number,
        metafields: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during development
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
