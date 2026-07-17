import mongoose from 'mongoose';
import config from '../config/env';

/**
 * Establishes a connection to MongoDB Atlas via Mongoose.
 * Exits the process on failure.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`MongoDB connection failed: ${message}`);
    process.exit(1);
  }
};
