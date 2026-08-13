import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningResourceDocument extends Document {
  resourceId: string; // Unique identifier (e.g. YouTube videoId)
  title: string;
  description: string;
  url: string;
  provider: string; // e.g. 'YouTube'
  type: string; // e.g. 'Video'
  thumbnail?: string;
  channel?: string;
  publishedAt?: string;
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
    },
    type: {
      type: String,
      required: true,
      default: 'Video',
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
  },
  {
    timestamps: true,
  }
);

export const LearningResource = mongoose.model<ILearningResourceDocument>('LearningResource', LearningResourceSchema);
