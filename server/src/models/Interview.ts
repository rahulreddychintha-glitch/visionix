import mongoose, { Schema, Document } from 'mongoose';

export type InterviewType = 'mock' | 'technical' | 'behavioral' | 'resume_based' | 'mixed';
export type InterviewDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned';

export interface IInterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  focusArea: string;
}

export interface IStarAssessment {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface IInterviewAnswer {
  questionId: string;
  answer: string;
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  starAssessment?: IStarAssessment;
}

export interface ICategoryScores {
  technical: number;
  communication: number;
  problemSolving: number;
  roleAlignment: number;
  clarity: number;
}

export interface IWeakArea {
  topic: string;
  score: number;
  recommendation: string;
}

export interface IInterview {
  userId: mongoose.Types.ObjectId;
  resumeId?: mongoose.Types.ObjectId;
  targetRole: string;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  questionCount: number;
  focusAreas: string[];
  timerSeconds: number; // 0 = no timer, 30, 60, 90, 120
  timeSpentSeconds: number;
  status: InterviewStatus;
  questions: IInterviewQuestion[];
  answers: IInterviewAnswer[];
  overallScore?: number;
  categoryScores?: ICategoryScores;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  weakAreas?: IWeakArea[];
  createdAt: Date;
  completedAt?: Date;
}

export interface IInterviewDocument extends IInterview, Document {}

const InterviewQuestionSchema = new Schema<IInterviewQuestion>(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    focusArea: { type: String, required: true },
  },
  { _id: false }
);

const StarAssessmentSchema = new Schema<IStarAssessment>(
  {
    situation: { type: String, default: '' },
    task: { type: String, default: '' },
    action: { type: String, default: '' },
    result: { type: String, default: '' },
  },
  { _id: false }
);

const InterviewAnswerSchema = new Schema<IInterviewAnswer>(
  {
    questionId: { type: String, required: true },
    answer: { type: String, default: '' },
    score: { type: Number, min: 0, max: 100 },
    feedback: { type: String, default: '' },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    starAssessment: { type: StarAssessmentSchema, default: undefined },
  },
  { _id: false }
);

const CategoryScoresSchema = new Schema<ICategoryScores>(
  {
    technical: { type: Number, default: 0, min: 0, max: 100 },
    communication: { type: Number, default: 0, min: 0, max: 100 },
    problemSolving: { type: Number, default: 0, min: 0, max: 100 },
    roleAlignment: { type: Number, default: 0, min: 0, max: 100 },
    clarity: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);

const WeakAreaSchema = new Schema<IWeakArea>(
  {
    topic: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    recommendation: { type: String, required: true },
  },
  { _id: false }
);

const InterviewSchema = new Schema<IInterviewDocument>(
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
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      trim: true,
    },
    interviewType: {
      type: String,
      enum: ['mock', 'technical', 'behavioral', 'resume_based', 'mixed'],
      required: true,
      default: 'mock',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
      default: 'Intermediate',
    },
    questionCount: {
      type: Number,
      enum: [5, 10, 15],
      required: true,
      default: 5,
    },
    focusAreas: {
      type: [String],
      default: [],
    },
    timerSeconds: {
      type: Number,
      enum: [0, 30, 60, 90, 120],
      default: 0,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
      index: true,
    },
    questions: {
      type: [InterviewQuestionSchema],
      required: true,
      default: [],
    },
    answers: {
      type: [InterviewAnswerSchema],
      default: [],
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    categoryScores: {
      type: CategoryScoresSchema,
      default: undefined,
    },
    feedback: {
      type: String,
      default: '',
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    weakAreas: {
      type: [WeakAreaSchema],
      default: [],
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound indexes for user history and dashboard queries
InterviewSchema.index({ userId: 1, createdAt: -1 });
InterviewSchema.index({ userId: 1, status: 1 });

export const Interview = mongoose.model<IInterviewDocument>('Interview', InterviewSchema);
