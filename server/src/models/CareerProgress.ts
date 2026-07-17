import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerProgressDocument extends Document {
  userId: mongoose.Types.ObjectId;
  selectedCareer: string | null;
  currentPhase: number;
  completedMilestones: string[];
  totalMilestones: number;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CareerProgressSchema = new Schema<ICareerProgressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    selectedCareer: {
      type: String,
      default: null,
    },
    currentPhase: {
      type: Number,
      default: 0,
    },
    completedMilestones: {
      type: [String],
      default: [],
    },
    totalMilestones: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const CareerProgress = mongoose.model<ICareerProgressDocument>('CareerProgress', CareerProgressSchema);
