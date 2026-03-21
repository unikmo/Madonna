import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminSettings extends Document {
  shopifyTestModeOverride?: boolean | null;
  /** When false, storefront is in waitlist mode (no checkout). */
  sellingEnabled?: boolean;
  waitlistHeadline?: string;
  waitlistSubline1?: string;
  waitlistSubline2?: string;
  waitlistSupportingLine?: string;
  waitlistEmailPlaceholder?: string;
  waitlistNamePlaceholder?: string;
  waitlistCtaLabel?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSettingsSchema: Schema = new Schema(
  {
    shopifyTestModeOverride: {
      type: Boolean,
      required: false,
      default: null,
    },
    sellingEnabled: {
      type: Boolean,
      required: false,
    },
    waitlistHeadline: { type: String, required: false },
    waitlistSubline1: { type: String, required: false },
    waitlistSubline2: { type: String, required: false },
    waitlistSupportingLine: { type: String, required: false },
    waitlistEmailPlaceholder: { type: String, required: false },
    waitlistNamePlaceholder: { type: String, required: false },
    waitlistCtaLabel: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const AdminSettings: Model<IAdminSettings> =
  mongoose.models.AdminSettings || mongoose.model<IAdminSettings>('AdminSettings', AdminSettingsSchema);

export default AdminSettings;

