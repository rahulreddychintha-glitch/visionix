import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPreferencesDocument extends Document {
  userId: mongoose.Types.ObjectId;
  theme: 'dark' | 'light' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  careerUpdates: boolean;
  learningReminders: boolean;
  assessmentReminders: boolean;
  interviewReminders: boolean;
  businessUpdates: boolean;
  aiRecommendationsEnabled: boolean;
  aiPersonalizedSuggestions: boolean;
  aiLearningAssistance: boolean;
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
      index: true,
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'system'],
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
    careerUpdates: {
      type: Boolean,
      default: true,
    },
    learningReminders: {
      type: Boolean,
      default: true,
    },
    assessmentReminders: {
      type: Boolean,
      default: true,
    },
    interviewReminders: {
      type: Boolean,
      default: true,
    },
    businessUpdates: {
      type: Boolean,
      default: true,
    },
    aiRecommendationsEnabled: {
      type: Boolean,
      default: true,
    },
    aiPersonalizedSuggestions: {
      type: Boolean,
      default: true,
    },
    aiLearningAssistance: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserPreferences = mongoose.model<IUserPreferencesDocument>('UserPreferences', UserPreferencesSchema);
