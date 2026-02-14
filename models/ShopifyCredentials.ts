import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export interface IShopifyCredentials extends Document {
  storeDomain: string;
  accessToken: string; // Encrypted
  webhookSecret: string; // Encrypted
  baseUrl: string;
  apiVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShopifyCredentialsSchema: Schema = new Schema(
  {
    storeDomain: {
      type: String,
      required: true,
      trim: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    webhookSecret: {
      type: String,
      required: true,
    },
    baseUrl: {
      type: String,
      required: false,
      trim: true,
    },
    apiVersion: {
      type: String,
      default: '2024-10',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one credentials document exists
ShopifyCredentialsSchema.statics.getCredentials = async function () {
  let credentials = await this.findOne();
  if (!credentials) {
    credentials = await this.create({});
  }
  return credentials;
};

// Prevent re-compilation during development
const ShopifyCredentials: Model<IShopifyCredentials> =
  mongoose.models.ShopifyCredentials ||
  mongoose.model<IShopifyCredentials>('ShopifyCredentials', ShopifyCredentialsSchema);

export default ShopifyCredentials;
