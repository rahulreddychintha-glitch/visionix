import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface ICareerAssessmentDocument extends Document {
  userId: mongoose.Types.ObjectId;
  careerId: string;
  milestoneId: string;
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
    careerId: {
      type: String,
      required: true,
    },
    milestoneId: {
      type: String,
      required: true,
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

// We index by userId, careerId, milestoneId. We can have one active (completed: false) assessment at a time.
CareerAssessmentSchema.index({ userId: 1, careerId: 1, milestoneId: 1, completed: 1 });

export const CareerAssessment = mongoose.model<ICareerAssessmentDocument>('CareerAssessment', CareerAssessmentSchema);
