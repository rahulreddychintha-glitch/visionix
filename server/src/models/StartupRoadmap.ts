import mongoose, { Schema, Document } from 'mongoose';

export type RoadmapStatus = 'planning' | 'active' | 'paused' | 'completed';
export type MilestoneStatus = 'locked' | 'upcoming' | 'active' | 'completed';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface IStartupTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedMinutes?: number;
  dueDate?: Date | null;
  completedAt?: Date | null;
  resources?: { title: string; url: string; type?: string }[];
  aiGenerated?: boolean;
  order: number;
}

export interface IStartupMilestone {
  id: string;
  title: string;
  description: string;
  stage: string;
  order: number;
  status: MilestoneStatus;
  progress: number;
  estimatedDays?: number;
  tasks: IStartupTask[];
  resources?: { title: string; url: string }[];
  notes?: string;
}

export interface IStartupRoadmap {
  userId: mongoose.Types.ObjectId;
  businessIdeaId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  founderRole?: string;
  industry: string;
  businessModel: string;
  currentStage: string;
  overallProgress: number;
  status: RoadmapStatus;
  milestones: IStartupMilestone[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}

export interface IStartupRoadmapDocument extends IStartupRoadmap, Document {}

const StartupTaskSchema = new Schema<IStartupTask>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed'],
      default: 'todo',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    estimatedMinutes: { type: Number, default: 45 },
    dueDate: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    resources: [
      {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
        type: { type: String, default: 'guide' },
      },
    ],
    aiGenerated: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const StartupMilestoneSchema = new Schema<IStartupMilestone>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    stage: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['locked', 'upcoming', 'active', 'completed'],
      default: 'upcoming',
      index: true,
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    estimatedDays: { type: Number, default: 14 },
    tasks: { type: [StartupTaskSchema], default: [] },
    resources: [
      {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const StartupRoadmapSchema = new Schema<IStartupRoadmapDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    businessIdeaId: {
      type: Schema.Types.ObjectId,
      ref: 'BusinessIdea',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    founderRole: {
      type: String,
      default: 'Founder / Product Lead',
      trim: true,
    },
    industry: {
      type: String,
      default: 'Technology',
      trim: true,
    },
    businessModel: {
      type: String,
      default: 'SaaS',
      trim: true,
    },
    currentStage: {
      type: String,
      default: 'Problem Definition & Validation',
      trim: true,
    },
    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['planning', 'active', 'paused', 'completed'],
      default: 'active',
      index: true,
    },
    milestones: {
      type: [StartupMilestoneSchema],
      default: [],
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

StartupRoadmapSchema.index({ userId: 1, status: 1, updatedAt: -1 });

export const StartupRoadmap = mongoose.model<IStartupRoadmapDocument>(
  'StartupRoadmap',
  StartupRoadmapSchema
);
