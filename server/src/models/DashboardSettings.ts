import mongoose, { Schema, Document } from 'mongoose';

export interface IDashboardSettingsDocument extends Document {
  userId: mongoose.Types.ObjectId;
  layout: string;
  widgets: string[];
  sidebarCollapsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DashboardSettingsSchema = new Schema<IDashboardSettingsDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    layout: {
      type: String,
      default: 'default',
    },
    widgets: {
      type: [String],
      default: ['career-overview', 'learning-tracker', 'progress-chart', 'ai-advisor-shortcuts'],
    },
    sidebarCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const DashboardSettings = mongoose.model<IDashboardSettingsDocument>('DashboardSettings', DashboardSettingsSchema);
