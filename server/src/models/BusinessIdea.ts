import mongoose, { Schema, Document } from 'mongoose';

export type BusinessDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type StartupPotential = 'High' | 'Medium' | 'Niche';
export type BusinessModelType = 'B2B' | 'B2C' | 'B2B2C' | 'Marketplace' | 'SaaS' | 'Subscription' | 'Other';
export type EstimatedComplexity = 'Low' | 'Medium' | 'High';

export interface IBusinessIdea {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  industry: string;
  problem: string;
  solution: string;
  targetAudience: string[];
  requiredSkills: string[];
  recommendedSkills: string[];
  difficulty: BusinessDifficulty;
  startupPotential: StartupPotential;
  businessModel: BusinessModelType;
  estimatedComplexity: EstimatedComplexity;
  tags: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'article' | 'tool' | 'guide' | 'template' | 'other';
  }>;
  source?: string;
  sourceUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBusinessIdeaDocument extends IBusinessIdea, Document {}

const ResourceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['article', 'tool', 'guide', 'template', 'other'],
      default: 'article',
    },
  },
  { _id: false }
);

const BusinessIdeaSchema = new Schema<IBusinessIdeaDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    problem: {
      type: String,
      required: true,
      trim: true,
    },
    solution: {
      type: String,
      required: true,
      trim: true,
    },
    targetAudience: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    recommendedSkills: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
      index: true,
    },
    startupPotential: {
      type: String,
      enum: ['High', 'Medium', 'Niche'],
      default: 'High',
    },
    businessModel: {
      type: String,
      enum: ['B2B', 'B2C', 'B2B2C', 'Marketplace', 'SaaS', 'Subscription', 'Other'],
      default: 'B2B',
    },
    estimatedComplexity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    resources: {
      type: [ResourceSchema],
      default: [],
    },
    source: {
      type: String,
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound discovery index
BusinessIdeaSchema.index({ category: 1, industry: 1, difficulty: 1, isActive: 1 });
BusinessIdeaSchema.index({ title: 'text', description: 'text', problem: 'text', solution: 'text', tags: 'text' });

export const BusinessIdea = mongoose.model<IBusinessIdeaDocument>('BusinessIdea', BusinessIdeaSchema);
