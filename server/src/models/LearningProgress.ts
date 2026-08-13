import mongoose, { Schema, Document } from 'mongoose';

export interface IResourceProgress {
  resourceId: string;
  status: 'in_progress' | 'completed';
  startedAt: Date;
  lastAccessed: Date;
  completedAt: Date | null;
}

export interface ILearningProgressDocument extends Document {
  userId: mongoose.Types.ObjectId;
  completedResources: string[];
  bookmarkedResources: string[];
  resources: IResourceProgress[];
  streakDays: number;
  totalStudyMinutes: number;
  lastStudyDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceProgressSchema = new Schema<IResourceProgress>({
  resourceId: { type: String, required: true },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  startedAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

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
    resources: {
      type: [ResourceProgressSchema],
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
