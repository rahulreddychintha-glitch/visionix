import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningProgressDocument extends Document {
  userId: mongoose.Types.ObjectId;
  completedResources: string[];
  bookmarkedResources: string[];
  streakDays: number;
  totalStudyMinutes: number;
  lastStudyDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const LearningProgressSchema = new Schema<ILearningProgressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    completedResources: {
      type: [String],
      default: [],
    },
    bookmarkedResources: {
      type: [String],
      default: [],
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    totalStudyMinutes: {
      type: Number,
      default: 0,
    },
    lastStudyDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const LearningProgress = mongoose.model<ILearningProgressDocument>('LearningProgress', LearningProgressSchema);
