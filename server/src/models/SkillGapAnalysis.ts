import mongoose, { Schema, Document } from 'mongoose';

export type SkillPriorityLevel = 'Critical' | 'High' | 'Medium' | 'Supporting';

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

export interface ISkillRoadmapMilestone {
  stageNumber: number;
  stageTitle: string;
  milestoneTitle: string;
  status: string;
}

export interface ISkillLearningResource {
  title: string;
  url: string;
  provider: string;
  type: string;
  thumbnail?: string;
}

export interface ISkillGapDetail {
  id?: string;
  skillName: string;
  category: 'Foundational' | 'Technical' | 'Tooling' | 'Professional';
  status: 'Verified' | 'Strong' | 'Developing' | 'Needs Improvement' | 'Missing';
  priority: SkillPriorityLevel;
  currentLevel: string;
  requiredLevel: string;
  whyItMatters: string;
  isVerified: boolean;
  recommendedAction: string;
  actionType: 'assessment' | 'learning' | 'roadmap' | 'interview' | 'project' | 'practice';
  actionRoute: string;
  hasAssessment: boolean;
  hasLearningResource: boolean;
  learningResource?: ISkillLearningResource;
  roadmapMilestone?: ISkillRoadmapMilestone;
  learningProgressPercent?: number;
}

export interface IPrioritySkill {
  id?: string;
  skillName: string;
  category: 'Foundational' | 'Technical' | 'Tooling' | 'Professional';
  priority: SkillPriorityLevel;
  status: string;
  reason: string;
  quickAction: string;
  actionRoute: string;
  actionType: 'assessment' | 'learning' | 'roadmap' | 'interview' | 'project' | 'practice';
  learningResource?: ISkillLearningResource;
  roadmapMilestone?: ISkillRoadmapMilestone;
}

export interface INextStepItem {
  id: string;
  title: string;
  description: string;
  actionType: 'assessment' | 'learning' | 'roadmap' | 'interview' | 'project' | 'practice';
  targetRoute: string;
  targetSkill: string;
  actionText: string;
  priority: SkillPriorityLevel;
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

export interface ISkillGapSummary {
  totalRequired: number;
  existingCount: number;
  missingCount: number;
  coveragePercentage: number;
  coverageText: string;
}

export interface ISkillGapAnalysisDocument extends Document {
  userId: mongoose.Types.ObjectId;
  hasTargetCareer: boolean;
  targetCareerId: string;
  targetCareerTitle: string;
  targetCategory: string;
  salaryRange?: string;
  growthRate?: string;
  demandLevel?: string;
  readinessScore: number; // 0 to 100 coverage percentage
  summary: ISkillGapSummary;
  requiredSkillsCount: number;
  strongSkillsCount: number;
  developingSkillsCount: number;
  missingSkillsCount: number;
  biggestSkillGap: string;
  biggestOpportunity: string;
  quickWin: string;
  currentSkills: ICurrentSkillsBreakdown;
  skillGaps: ISkillGapDetail[];
  existingSkills: ISkillGapDetail[];
  requiredSkills: ISkillGapDetail[];
  missingSkills: ISkillGapDetail[];
  prioritySkills: IPrioritySkill[];
  recommendedNextSkill?: ISkillGapDetail | null;
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

const SkillRoadmapMilestoneSchema = new Schema<ISkillRoadmapMilestone>(
  {
    stageNumber: { type: Number, required: true },
    stageTitle: { type: String, required: true },
    milestoneTitle: { type: String, required: true },
    status: { type: String, default: 'Not Started' },
  },
  { _id: false }
);

const SkillLearningResourceSchema = new Schema<ISkillLearningResource>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    provider: { type: String, default: 'YouTube' },
    type: { type: String, default: 'Video' },
    thumbnail: { type: String, default: '' },
  },
  { _id: false }
);

const SkillGapDetailSchema = new Schema<ISkillGapDetail>(
  {
    id: { type: String },
    skillName: { type: String, required: true },
    category: {
      type: String,
      enum: ['Foundational', 'Technical', 'Tooling', 'Professional'],
      default: 'Technical',
    },
    status: {
      type: String,
      enum: ['Verified', 'Strong', 'Developing', 'Needs Improvement', 'Missing'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Supporting', 'Low'],
      default: 'High',
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
    learningResource: { type: SkillLearningResourceSchema, required: false },
    roadmapMilestone: { type: SkillRoadmapMilestoneSchema, required: false },
    learningProgressPercent: { type: Number, required: false },
  },
  { _id: false }
);

const PrioritySkillSchema = new Schema<IPrioritySkill>(
  {
    id: { type: String },
    skillName: { type: String, required: true },
    category: {
      type: String,
      enum: ['Foundational', 'Technical', 'Tooling', 'Professional'],
      default: 'Technical',
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Supporting', 'Low'],
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
    learningResource: { type: SkillLearningResourceSchema, required: false },
    roadmapMilestone: { type: SkillRoadmapMilestoneSchema, required: false },
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
      enum: ['Critical', 'High', 'Medium', 'Supporting', 'Low'],
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
    hasTargetCareer: {
      type: Boolean,
      default: true,
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
    salaryRange: { type: String },
    growthRate: { type: String },
    demandLevel: { type: String },
    readinessScore: {
      type: Number,
      required: true,
      default: 0,
    },
    summary: {
      totalRequired: { type: Number, default: 0 },
      existingCount: { type: Number, default: 0 },
      missingCount: { type: Number, default: 0 },
      coveragePercentage: { type: Number, default: 0 },
      coverageText: { type: String, default: '' },
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
    existingSkills: {
      type: [SkillGapDetailSchema],
      default: [],
    },
    requiredSkills: {
      type: [SkillGapDetailSchema],
      default: [],
    },
    missingSkills: {
      type: [SkillGapDetailSchema],
      default: [],
    },
    prioritySkills: {
      type: [PrioritySkillSchema],
      default: [],
    },
    recommendedNextSkill: {
      type: SkillGapDetailSchema,
      required: false,
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
