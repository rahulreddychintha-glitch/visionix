import mongoose, { Document, Schema } from 'mongoose';

export type OpportunityType =
  | 'grant'
  | 'hackathon'
  | 'incubator'
  | 'accelerator'
  | 'competition'
  | 'fellowship'
  | 'startup_program'
  | 'scholarship'
  | 'founder_resource'
  | 'other';

export type OpportunityDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface IBusinessOpportunityDocument extends Document {
  title: string;
  organization: string;
  description: string;
  opportunityType: OpportunityType;
  category: string;
  industries: string[];
  eligibleFor: string[];
  requiredSkills: string[];
  location: string;
  isOnline: boolean;
  applicationUrl: string;
  officialWebsite: string;
  deadline: Date | null;
  isOpen: boolean;
  difficulty: OpportunityDifficulty;
  benefits: string[];
  eligibility: string[];
  tags: string[];
  sourceName: string;
  sourceUrl: string;
  verifiedAt: Date | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessOpportunitySchema = new Schema<IBusinessOpportunityDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    opportunityType: {
      type: String,
      required: true,
      enum: [
        'grant',
        'hackathon',
        'incubator',
        'accelerator',
        'competition',
        'fellowship',
        'startup_program',
        'scholarship',
        'founder_resource',
        'other',
      ],
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    industries: {
      type: [String],
      default: [],
      index: true,
    },
    eligibleFor: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
      index: true,
    },
    location: {
      type: String,
      default: 'Global',
      trim: true,
    },
    isOnline: {
      type: Boolean,
      default: true,
      index: true,
    },
    applicationUrl: {
      type: String,
      required: true,
      trim: true,
    },
    officialWebsite: {
      type: String,
      default: '',
      trim: true,
    },
    deadline: {
      type: Date,
      default: null,
      index: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
      index: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    sourceName: {
      type: String,
      default: '',
      trim: true,
    },
    sourceUrl: {
      type: String,
      default: '',
      trim: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for discovery filtering & performance
BusinessOpportunitySchema.index({ opportunityType: 1, isOpen: 1, deadline: 1 });
BusinessOpportunitySchema.index({ industries: 1, difficulty: 1, isOpen: 1 });
BusinessOpportunitySchema.index({
  title: 'text',
  organization: 'text',
  description: 'text',
  tags: 'text',
  requiredSkills: 'text',
});

export const BusinessOpportunity = mongoose.model<IBusinessOpportunityDocument>(
  'BusinessOpportunity',
  BusinessOpportunitySchema
);
