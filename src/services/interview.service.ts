import api from './api';
import type {
  IInterview,
  IInterviewProgress,
  IGenerateInterviewRequest,
  IEvaluateInterviewRequest,
  IInterviewSingleResponse,
  IInterviewListResponse,
  IInterviewProgressResponse,
} from '../types/interview.types';

export class InterviewService {
  /**
   * Generates a new AI interview session.
   */
  public static async generateInterview(data: IGenerateInterviewRequest): Promise<IInterview> {
    const response = await api.post<{ success: boolean; data: IInterviewSingleResponse }>(
      '/interview/generate',
      data
    );
    return response.data.data.interview;
  }

  /**
   * Retrieves all interview sessions for the authenticated user.
   */
  public static async getInterviews(): Promise<IInterview[]> {
    const response = await api.get<{ success: boolean; data: IInterviewListResponse }>('/interview');
    return response.data.data.interviews;
  }

  /**
   * Retrieves user cumulative interview analytics and progress.
   */
  public static async getProgress(): Promise<IInterviewProgress> {
    const response = await api.get<{ success: boolean; data: IInterviewProgressResponse }>('/interview/progress');
    return response.data.data.progress;
  }

  /**
   * Retrieves a specific interview session by ID.
   */
  public static async getInterview(id: string): Promise<IInterview> {
    const response = await api.get<{ success: boolean; data: IInterviewSingleResponse }>(`/interview/${id}`);
    return response.data.data.interview;
  }

  /**
   * Submits interview answers for server-side Gemini AI evaluation.
   */
  public static async evaluateInterview(id: string, data: IEvaluateInterviewRequest): Promise<IInterview> {
    const response = await api.post<{ success: boolean; data: IInterviewSingleResponse }>(
      `/interview/${id}/evaluate`,
      data
    );
    return response.data.data.interview;
  }

  /**
   * Retries an interview or spawns a fresh session focusing on weak areas.
   */
  public static async retryInterview(id: string, focusWeakAreas = false): Promise<IInterview> {
    const response = await api.post<{ success: boolean; data: IInterviewSingleResponse }>(
      `/interview/${id}/retry`,
      { focusWeakAreas }
    );
    return response.data.data.interview;
  }

  /**
   * Deletes an interview session.
   */
  public static async deleteInterview(id: string): Promise<boolean> {
    const response = await api.delete<{ success: boolean }>(`/interview/${id}`);
    return response.data.success;
  }
}
