export interface AiChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string | Date;
}

export interface AiSession {
  sessionId: string;
  title: string;
  messages: AiChatMessage[];
  lastActive: string | Date;
}

export interface AiChatResponse {
  reply: string;
  sessionId: string;
  history: AiChatMessage[];
  aiProviderUsed: 'gemini' | 'unconfigured';
}

export interface AiHistoryResponse {
  sessions: AiSession[];
  activeSession: AiSession | null;
}
