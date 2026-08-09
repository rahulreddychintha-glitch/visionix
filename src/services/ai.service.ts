import api from './api';
import type { AiChatResponse, AiHistoryResponse } from '../types/ai.types';

export class AiApiService {
  /**
   * Send a chat message to Visionix AI Assistant.
   */
  public static async sendMessage(message: string, sessionId?: string): Promise<AiChatResponse> {
    const response = await api.post<{ success: boolean; data: AiChatResponse }>('/ai/chat', {
      message,
      sessionId,
    });
    return response.data.data;
  }

  /**
   * Fetch chat history sessions.
   */
  public static async getHistory(sessionId?: string): Promise<AiHistoryResponse> {
    const response = await api.get<{ success: boolean; data: AiHistoryResponse }>('/ai/history', {
      params: { sessionId },
    });
    return response.data.data;
  }

  /**
   * Clear AI conversation history.
   */
  public static async clearHistory(): Promise<boolean> {
    const response = await api.delete<{ success: boolean }>('/ai/history');
    return response.data.success;
  }

  /**
   * Delete a specific chat session by ID.
   */
  public static async deleteChatSession(sessionId: string): Promise<boolean> {
    const response = await api.delete<{ success: boolean }>(`/ai/history/${sessionId}`);
    return response.data.success;
  }
}
