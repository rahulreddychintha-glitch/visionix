import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeAnalysisStrength {
  title: string;
  description: string;
}

export interface IResumeAnalysisImprovement {
  section: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'achievements' | 'general';
  priority: 'high' | 'medium' | 'low';
  issue: string;
  recommendation: string;
}

export interface IResumeAnalysisAts {
  score: number;
  positiveFactors: string[];
  issues: string[];
  recommendations: string[];
}

export interface IResumeAnalysisSectionScores {
  summary: number;
  experience: number;
  skills: number;
  projects: number;
  education: number;
  overallStructure: number;
}

export interface IResumeSuggestedChange {
  id: string;
  section: string;
  fieldPath: string; // e.g. "summary", "experience[0].highlights[1]", "skills.technical"
  original: string;
  suggested: string;
  reason: string;
}

export interface IResumeAnalysis {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  overallScore: number;
  summary: string;
  targetRoleAlignment?: {
    score: number;
    role: string;
    feedback: string;
  };
  strengths: IResumeAnalysisStrength[];
  improvements: IResumeAnalysisImprovement[];
  ats: IResumeAnalysisAts;
  sectionScores: IResumeAnalysisSectionScores;
  suggestedChanges: IResumeSuggestedChange[];
  createdAt: Date;
}

export interface IResumeAnalysisDocument extends IResumeAnalysis, Document {}

const ResumeAnalysisStrengthSchema = new Schema<IResumeAnalysisStrength>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ResumeAnalysisImprovementSchema = new Schema<IResumeAnalysisImprovement>(
  {
    section: {
      type: String,
      enum: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'general'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    issue: { type: String, required: true },
    recommendation: { type: String, required: true },
  },
  { _id: false }
);

const ResumeAnalysisAtsSchema = new Schema<IResumeAnalysisAts>(
  {
    score: { type: Number, required: true, min: 0, max: 100 },
    positiveFactors: { type: [String], default: [] },
    issues: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
  },
  { _id: false }
);

const ResumeAnalysisSectionScoresSchema = new Schema<IResumeAnalysisSectionScores>(
  {
    summary: { type: Number, default: 0, min: 0, max: 100 },
    experience: { type: Number, default: 0, min: 0, max: 100 },
    skills: { type: Number, default: 0, min: 0, max: 100 },
    projects: { type: Number, default: 0, min: 0, max: 100 },
    education: { type: Number, default: 0, min: 0, max: 100 },
    overallStructure: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);

const ResumeSuggestedChangeSchema = new Schema<IResumeSuggestedChange>(
  {
    id: { type: String, required: true },
    section: { type: String, required: true },
    fieldPath: { type: String, required: true },
    original: { type: String, default: '' },
    suggested: { type: String, required: true },
    reason: { type: String, required: true },
  },
  { _id: false }
);

const ResumeAnalysisSchema = new Schema<IResumeAnalysisDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    summary: {
      type: String,
      required: true,
    },
    targetRoleAlignment: {
      score: { type: Number, min: 0, max: 100 },
      role: { type: String, default: '' },
      feedback: { type: String, default: '' },
    },
    strengths: {
      type: [ResumeAnalysisStrengthSchema],
      default: [],
    },
    improvements: {
      type: [ResumeAnalysisImprovementSchema],
      default: [],
    },
    ats: {
      type: ResumeAnalysisAtsSchema,
      required: true,
    },
    sectionScores: {
      type: ResumeAnalysisSectionScoresSchema,
      required: true,
    },
    suggestedChanges: {
      type: [ResumeSuggestedChangeSchema],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ResumeAnalysis = mongoose.model<IResumeAnalysisDocument>(
  'ResumeAnalysis',
  ResumeAnalysisSchema
);
