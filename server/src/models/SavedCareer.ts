import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedCareerDocument extends Document {
  userId: mongoose.Types.ObjectId;
  careerId: string; // e.g. 'software_engineer', 'civil_engineer'
  createdAt: Date;
  updatedAt: Date;
}

const SavedCareerSchema = new Schema<ISavedCareerDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    careerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness of saved career per user
SavedCareerSchema.index({ userId: 1, careerId: 1 }, { unique: true });

export const SavedCareer = mongoose.model<ISavedCareerDocument>('SavedCareer', SavedCareerSchema);
