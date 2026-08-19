import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminSettings extends Document {
  shopifyTestModeOverride?: boolean | null;
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
  },
  {
    timestamps: true,
  }
);

const AdminSettings: Model<IAdminSettings> =
  mongoose.models.AdminSettings || mongoose.model<IAdminSettings>('AdminSettings', AdminSettingsSchema);

export default AdminSettings;

