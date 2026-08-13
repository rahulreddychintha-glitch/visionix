import api from './api';

export interface ExamQuestion {
  question: string;
  options: string[];
}

export interface AssessmentResult {
  score: number;
  passed: boolean;
  roadmap: any;
}

export interface AssessmentHistoryItem {
  _id: string;
  careerId: string;
  milestoneId: string;
  questions: ExamQuestion[];
  completed: boolean;
  score: number;
  passed: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ExamsApiService {
  /**
   * Generates or retrieves questions for a milestone assessment
   */
  public static async generateAssessment(careerId: string, milestoneId: string): Promise<ExamQuestion[]> {
    const response = await api.post<{ success: boolean; data: { questions: ExamQuestion[] } }>('/roadmap/assessment/generate', {
      careerId,
      milestoneId
    });
    return response.data.data.questions;
  }

  /**
   * Submits answers to evaluate and update milestone progress
   */
  public static async submitAssessment(careerId: string, milestoneId: string, answers: number[]): Promise<AssessmentResult> {
    const response = await api.post<{ success: boolean; data: AssessmentResult }>('/roadmap/assessment/submit', {
      careerId,
      milestoneId,
      answers
    });
    return response.data.data;
  }

  /**
   * Retrieves user's past completed assessment attempts
   */
  public static async getAssessmentHistory(): Promise<AssessmentHistoryItem[]> {
    const response = await api.get<{ success: boolean; data: { history: AssessmentHistoryItem[] } }>('/roadmap/assessment/history');
    return response.data.data.history;
  }
}
export default ExamsApiService;
