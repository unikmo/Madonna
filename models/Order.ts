import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ILineItem {
  productId: string;
  variantId?: string;
  quantity: number;
  metafields?: Record<string, any>;
}

export interface IShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface IOrder extends Document {
  paymentProvider: 'shopify' | 'stripe';
  paymentReference?: string;
  shopifyOrderId?: string;
  shopifyOrderName?: string;
  shopifyProductId?: string;
  productCode?: string;
  orderQuantity: number;
  user: Types.ObjectId;
  email: string;
  customerName?: string;
  shippingAddress?: IShippingAddress;
  totalPrice: number;
  currency: string;
  paymentStatus: 'paid';
  source: 'webhook' | 'admin' | 'stripe';
  tags: string[];
  lineItems: ILineItem[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    paymentProvider: {
      type: String,
      enum: ['shopify', 'stripe'],
      default: 'shopify',
      required: true,
      index: true,
    },
    paymentReference: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true,
    },
    shopifyOrderId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true,
    },
    shopifyProductId: {
      type: String,
      required: false,
    },
    shopifyOrderName: {
      type: String,
      required: false,
    },
    productCode: {
      type: String,
      required: false,
      index: true,
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
    shippingAddress: {
      name: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
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
      enum: ['webhook', 'admin', 'stripe'],
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
