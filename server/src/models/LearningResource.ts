import mongoose, { Schema, Document } from 'mongoose';

export type ResourceDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type ResourceType = 'Video Masterclass' | 'Full Course' | 'Interactive Lab' | 'Documentation' | 'Practice Project';

export interface ILearningResourceDocument extends Document {
  resourceId: string; // Unique identifier (e.g. YouTube videoId or slug)
  title: string;
  description: string;
  url: string;
  provider: string; // e.g. 'YouTube', 'NPTEL / Swayam', 'Coursera', 'freeCodeCamp', 'Official Docs'
  type: string; // e.g. 'Video Masterclass', 'Full Course', 'Interactive Lab', 'Documentation'
  thumbnail?: string;
  channel?: string;
  publishedAt?: string;
  careerIds: string[]; // Canonical career IDs e.g. ['software_engineer', 'data_scientist']
  skills: string[]; // Canonical skills e.g. ['Python', 'Data Structures', 'Git']
  educationLevels: string[]; // e.g. ['school', 'intermediate', 'diploma', 'undergraduate', 'postgraduate']
  topicCategory: string; // e.g. 'Computer Science & Software', 'Medical & Healthcare'
  difficulty: ResourceDifficulty;
  duration?: string; // e.g. '1h 45m', '4 hours'
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LearningResourceSchema = new Schema<ILearningResourceDocument>(
  {
    resourceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
      default: 'YouTube',
      index: true,
    },
    type: {
      type: String,
      required: true,
      default: 'Video Masterclass',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    channel: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: String,
      default: '',
    },
    careerIds: {
      type: [String],
      default: [],
      index: true,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    educationLevels: {
      type: [String],
      default: ['school', 'intermediate', 'diploma', 'undergraduate', 'postgraduate'],
    },
    topicCategory: {
      type: String,
      default: 'General Learning',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    duration: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

LearningResourceSchema.index({ careerIds: 1, skills: 1 });
LearningResourceSchema.index({ topicCategory: 1, difficulty: 1 });

export const LearningResource = mongoose.model<ILearningResourceDocument>('LearningResource', LearningResourceSchema);
