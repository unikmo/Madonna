import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ILineItem {
  productId: string;
  variantId: string;
  quantity: number;
  metafields?: Record<string, any>;
}

export interface IOrder extends Document {
  shopifyOrderId: string;
  shopifyProductId: string;
  orderQuantity: number;
  user: Types.ObjectId;
  email: string;
  totalPrice: number;
  currency: string;
  paymentStatus: 'paid';
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
