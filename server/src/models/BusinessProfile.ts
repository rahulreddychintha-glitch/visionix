import mongoose, { Schema, Document } from 'mongoose';

export type EntrepreneurshipExperience = 'Beginner' | 'Exploring' | 'Some Experience' | 'Experienced';
export type AvailableTime = 'Less than 5 hours/week' | '5–10 hours/week' | '10–20 hours/week' | '20+ hours/week';
export type StartupStage = 'Exploring' | 'Idea' | 'Validation' | 'MVP' | 'Early Launch' | 'Growth';

export interface ICurrentStartupIdea {
  title?: string;
  description?: string;
  stage?: StartupStage;
  targetMarket?: string;
}

export interface IBusinessProfile {
  userId: mongoose.Types.ObjectId;
  interestedIndustries: string[];
  interests: string[];
  preferredBusinessTypes: string[];
  entrepreneurshipExperience: EntrepreneurshipExperience;
  goals: string[];
  availableTime: AvailableTime;
  preferredStartupStage: StartupStage;
  savedBusinessIdeas: mongoose.Types.ObjectId[];
  savedOpportunities: mongoose.Types.ObjectId[];
  currentStartupIdea?: ICurrentStartupIdea;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBusinessProfileDocument extends IBusinessProfile, Document {}

const CurrentStartupIdeaSchema = new Schema<ICurrentStartupIdea>(
  {
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    stage: {
      type: String,
      enum: ['Exploring', 'Idea', 'Validation', 'MVP', 'Early Launch', 'Growth'],
      default: 'Exploring',
    },
    targetMarket: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const BusinessProfileSchema = new Schema<IBusinessProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    interestedIndustries: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    preferredBusinessTypes: {
      type: [String],
      default: [],
    },
    entrepreneurshipExperience: {
      type: String,
      enum: ['Beginner', 'Exploring', 'Some Experience', 'Experienced'],
      default: 'Exploring',
    },
    goals: {
      type: [String],
      default: [],
    },
    availableTime: {
      type: String,
      enum: ['Less than 5 hours/week', '5–10 hours/week', '10–20 hours/week', '20+ hours/week'],
      default: '5–10 hours/week',
    },
    preferredStartupStage: {
      type: String,
      enum: ['Exploring', 'Idea', 'Validation', 'MVP', 'Early Launch', 'Growth'],
      default: 'Exploring',
    },
    savedBusinessIdeas: [
      {
        type: Schema.Types.ObjectId,
        ref: 'BusinessIdea',
      },
    ],
    savedOpportunities: [
      {
        type: Schema.Types.ObjectId,
        ref: 'BusinessOpportunity',
      },
    ],
    currentStartupIdea: {
      type: CurrentStartupIdeaSchema,
      default: () => ({}),
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const BusinessProfile = mongoose.model<IBusinessProfileDocument>('BusinessProfile', BusinessProfileSchema);
