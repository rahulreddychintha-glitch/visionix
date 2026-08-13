import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestone {
  id: string;
  title: string;
  description: string;
  skills: string[];
  tasks: string[];
  activities: string[];
  learningObjectives: string[];
  dependencies: string[];
  completed: boolean;
  status?: 'Upcoming' | 'In Progress' | 'Completed & Verified' | 'Completed — Review Recommended';
  assessmentAttempted?: boolean;
  assessmentScore?: number;
  assessmentStatus?: 'passed' | 'failed' | null;
  assessmentAttemptedAt?: Date | null;
  retakeAvailable?: boolean;
}

export interface IRoadmapStage {
  title: string;
  milestones: IMilestone[];
}

export interface ICareerRoadmapDocument extends Document {
  userId: mongoose.Types.ObjectId;
  careerId: string;
  careerTitle: string;
  stages: IRoadmapStage[];
  progress: number; // 0 to 100 percentage
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: [String], default: [] },
  tasks: { type: [String], default: [] },
  activities: { type: [String], default: [] },
  learningObjectives: { type: [String], default: [] },
  dependencies: { type: [String], default: [] },
  completed: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['Upcoming', 'In Progress', 'Completed & Verified', 'Completed — Review Recommended'],
    default: 'Upcoming',
  },
  assessmentAttempted: { type: Boolean, default: false },
  assessmentScore: { type: Number, default: 0 },
  assessmentStatus: { type: String, enum: ['passed', 'failed', null], default: null },
  assessmentAttemptedAt: { type: Date, default: null },
  retakeAvailable: { type: Boolean, default: true },
});

const RoadmapStageSchema = new Schema<IRoadmapStage>({
  title: { type: String, required: true },
  milestones: { type: [MilestoneSchema], default: [] },
});

const CareerRoadmapSchema = new Schema<ICareerRoadmapDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    careerId: {
      type: String,
      required: true,
    },
    careerTitle: {
      type: String,
      required: true,
    },
    stages: {
      type: [RoadmapStageSchema],
      default: [],
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one roadmap per career ID
CareerRoadmapSchema.index({ userId: 1, careerId: 1 }, { unique: true });

export const CareerRoadmap = mongoose.model<ICareerRoadmapDocument>('CareerRoadmap', CareerRoadmapSchema);
