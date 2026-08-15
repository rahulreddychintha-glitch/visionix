import mongoose, { Schema, Document } from 'mongoose';

export interface ICurrentSkillsBreakdown {
  verified: Array<{
    name: string;
    score?: number;
    verifiedAt: Date;
    source?: string;
  }>;
  profile: string[];
  developing: string[];
}

export interface ISkillGapDetail {
  skillName: string;
  status: 'Verified' | 'Strong' | 'Developing' | 'Needs Improvement' | 'Missing';
  priority: 'High' | 'Medium' | 'Low';
  currentLevel: string;
  requiredLevel: string;
  whyItMatters: string;
  isVerified: boolean;
  recommendedAction: string;
  actionType: 'assessment' | 'learning' | 'roadmap' | 'interview' | 'project' | 'practice';
  actionRoute: string;
  hasAssessment: boolean;
  hasLearningResource: boolean;
}

export interface IPrioritySkill {
  skillName: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  reason: string;
  quickAction: string;
  actionRoute: string;
  actionType: 'assessment' | 'learning' | 'roadmap' | 'interview' | 'project' | 'practice';
}

export interface INextStepItem {
  id: string;
  title: string;
  description: string;
  actionType: 'assessment' | 'learning' | 'roadmap' | 'interview' | 'project' | 'practice';
  targetRoute: string;
  targetSkill: string;
  actionText: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ICareerComparisonItem {
  careerId: string;
  title: string;
  category: string;
  matchScore: number;
  strongSkillsCount: number;
  missingSkillsCount: number;
  topMissingSkill?: string;
  demandLevel?: string;
}

export interface IAiSkillInsight {
  summary: string;
  missingSkillsInsight: string;
  whyItMattersInsight: string;
  recommendedActionPlan: string;
  generatedAt: Date;
  aiProviderUsed: 'gemini' | 'unconfigured' | 'deterministic_fallback';
}

export interface ISkillGapAnalysisDocument extends Document {
  userId: mongoose.Types.ObjectId;
  targetCareerId: string;
  targetCareerTitle: string;
  targetCategory: string;
  readinessScore: number; // 0 to 100
  requiredSkillsCount: number;
  strongSkillsCount: number;
  developingSkillsCount: number;
  missingSkillsCount: number;
  biggestSkillGap: string;
  biggestOpportunity: string;
  quickWin: string;
  currentSkills: ICurrentSkillsBreakdown;
  skillGaps: ISkillGapDetail[];
  prioritySkills: IPrioritySkill[];
  nextSteps: INextStepItem[];
  careerComparisons: ICareerComparisonItem[];
  aiAnalysis?: IAiSkillInsight;
  createdAt: Date;
  updatedAt: Date;
}

const CurrentSkillsBreakdownSchema = new Schema<ICurrentSkillsBreakdown>(
  {
    verified: [
      {
        name: { type: String, required: true },
        score: { type: Number },
        verifiedAt: { type: Date, default: Date.now },
        source: { type: String },
      },
    ],
    profile: { type: [String], default: [] },
    developing: { type: [String], default: [] },
  },
  { _id: false }
);

const SkillGapDetailSchema = new Schema<ISkillGapDetail>(
  {
    skillName: { type: String, required: true },
    status: {
      type: String,
      enum: ['Verified', 'Strong', 'Developing', 'Needs Improvement', 'Missing'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
    },
    currentLevel: { type: String, default: 'None' },
    requiredLevel: { type: String, default: 'Proficient' },
    whyItMatters: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    recommendedAction: { type: String, default: '' },
    actionType: {
      type: String,
      enum: ['assessment', 'learning', 'roadmap', 'interview', 'project', 'practice'],
      default: 'learning',
    },
    actionRoute: { type: String, default: '/courses' },
    hasAssessment: { type: Boolean, default: true },
    hasLearningResource: { type: Boolean, default: true },
  },
  { _id: false }
);

const PrioritySkillSchema = new Schema<IPrioritySkill>(
  {
    skillName: { type: String, required: true },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
    },
    status: { type: String, required: true },
    reason: { type: String, default: '' },
    quickAction: { type: String, default: '' },
    actionRoute: { type: String, default: '/courses' },
    actionType: {
      type: String,
      enum: ['assessment', 'learning', 'roadmap', 'interview', 'project', 'practice'],
      default: 'learning',
    },
  },
  { _id: false }
);

const NextStepItemSchema = new Schema<INextStepItem>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    actionType: {
      type: String,
      enum: ['assessment', 'learning', 'roadmap', 'interview', 'project', 'practice'],
      required: true,
    },
    targetRoute: { type: String, required: true },
    targetSkill: { type: String, required: true },
    actionText: { type: String, required: true },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
  },
  { _id: false }
);

const CareerComparisonItemSchema = new Schema<ICareerComparisonItem>(
  {
    careerId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    matchScore: { type: Number, required: true },
    strongSkillsCount: { type: Number, default: 0 },
    missingSkillsCount: { type: Number, default: 0 },
    topMissingSkill: { type: String },
    demandLevel: { type: String },
  },
  { _id: false }
);

const AiSkillInsightSchema = new Schema<IAiSkillInsight>(
  {
    summary: { type: String, required: true },
    missingSkillsInsight: { type: String, required: true },
    whyItMattersInsight: { type: String, required: true },
    recommendedActionPlan: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
    aiProviderUsed: {
      type: String,
      enum: ['gemini', 'unconfigured', 'deterministic_fallback'],
      default: 'gemini',
    },
  },
  { _id: false }
);

const SkillGapAnalysisSchema = new Schema<ISkillGapAnalysisDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetCareerId: {
      type: String,
      required: true,
      index: true,
    },
    targetCareerTitle: {
      type: String,
      required: true,
    },
    targetCategory: {
      type: String,
      required: true,
    },
    readinessScore: {
      type: Number,
      required: true,
      default: 0,
    },
    requiredSkillsCount: {
      type: Number,
      default: 0,
    },
    strongSkillsCount: {
      type: Number,
      default: 0,
    },
    developingSkillsCount: {
      type: Number,
      default: 0,
    },
    missingSkillsCount: {
      type: Number,
      default: 0,
    },
    biggestSkillGap: {
      type: String,
      default: '',
    },
    biggestOpportunity: {
      type: String,
      default: '',
    },
    quickWin: {
      type: String,
      default: '',
    },
    currentSkills: {
      type: CurrentSkillsBreakdownSchema,
      required: true,
    },
    skillGaps: {
      type: [SkillGapDetailSchema],
      default: [],
    },
    prioritySkills: {
      type: [PrioritySkillSchema],
      default: [],
    },
    nextSteps: {
      type: [NextStepItemSchema],
      default: [],
    },
    careerComparisons: {
      type: [CareerComparisonItemSchema],
      default: [],
    },
    aiAnalysis: {
      type: AiSkillInsightSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

SkillGapAnalysisSchema.index({ userId: 1, targetCareerId: 1, createdAt: -1 });

export const SkillGapAnalysis = mongoose.model<ISkillGapAnalysisDocument>(
  'SkillGapAnalysis',
  SkillGapAnalysisSchema
);
