import mongoose, { Schema, Document } from 'mongoose';

export interface IAiSession {
  sessionId: string;
  title: string;
  messages: Array<{
    role: 'user' | 'model' | 'system';
    content: string;
    timestamp: Date;
  }>;
  lastActive: Date;
}

export interface IAiConversationHistoryDocument extends Document {
  userId: mongoose.Types.ObjectId;
  sessions: IAiSession[];
  totalTokensUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'model', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AiSessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  messages: [MessageSchema],
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

const AiConversationHistorySchema = new Schema<IAiConversationHistoryDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    sessions: {
      type: [AiSessionSchema],
      default: [],
    },
    totalTokensUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const AiConversationHistory = mongoose.model<IAiConversationHistoryDocument>('AiConversationHistory', AiConversationHistorySchema);
