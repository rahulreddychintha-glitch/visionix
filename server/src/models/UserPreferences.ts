import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPreferencesDocument extends Document {
  userId: mongoose.Types.ObjectId;
  theme: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferencesDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    theme: {
      type: String,
      default: 'dark',
    },
    language: {
      type: String,
      default: 'en',
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    weeklyReport: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserPreferences = mongoose.model<IUserPreferencesDocument>('UserPreferences', UserPreferencesSchema);
