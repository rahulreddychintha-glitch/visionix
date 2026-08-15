import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export type AssessmentType = 'milestone' | 'standalone_skill';
export type SkillDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ICareerAssessmentDocument extends Document {
  userId: mongoose.Types.ObjectId;
  assessmentType: AssessmentType;
  careerId?: string;
  milestoneId?: string;
  skillName?: string;
  domain?: string;
  difficulty?: SkillDifficulty;
  questions: IQuestion[];
  completed: boolean;
  score: number;
  passed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true },
});

const CareerAssessmentSchema = new Schema<ICareerAssessmentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assessmentType: {
      type: String,
      enum: ['milestone', 'standalone_skill'],
      default: 'milestone',
    },
    careerId: {
      type: String,
      required: false,
    },
    milestoneId: {
      type: String,
      required: false,
    },
    skillName: {
      type: String,
      required: false,
    },
    domain: {
      type: String,
      required: false,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
      required: false,
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CareerAssessmentSchema.index({ userId: 1, careerId: 1, milestoneId: 1, completed: 1 });
CareerAssessmentSchema.index({ userId: 1, assessmentType: 1, skillName: 1, completed: 1 });
CareerAssessmentSchema.index({ userId: 1, completed: 1, createdAt: -1 });

export const CareerAssessment = mongoose.model<ICareerAssessmentDocument>('CareerAssessment', CareerAssessmentSchema);
