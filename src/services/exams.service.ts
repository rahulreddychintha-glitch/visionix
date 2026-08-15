import api from './api';
import type { CareerRoadmap } from './roadmap.service';

export interface ExamQuestion {
  question: string;
  options: string[];
}

export interface AssessmentResult {
  score: number;
  passed: boolean;
  roadmap: CareerRoadmap;
}

export interface SkillAssessmentData {
  assessmentId: string;
  skillName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  domain: string;
  questions: ExamQuestion[];
}

export interface SkillAssessmentResult {
  assessmentId: string;
  skillName: string;
  score: number;
  passed: boolean;
  difficulty?: string;
}

export interface AssessmentHistoryItem {
  _id: string;
  assessmentType?: 'milestone' | 'standalone_skill';
  careerId?: string;
  milestoneId?: string;
  skillName?: string;
  domain?: string;
  difficulty?: string;
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
   * Generates or retrieves questions for a standalone skill assessment
   */
  public static async generateSkillAssessment(
    skillName: string,
    domain?: string,
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  ): Promise<SkillAssessmentData> {
    const response = await api.post<{ success: boolean; data: SkillAssessmentData }>('/roadmap/assessment/skill/generate', {
      skillName,
      domain,
      difficulty: difficulty || 'Intermediate'
    });
    return response.data.data;
  }

  /**
   * Submits answers for a standalone skill assessment
   */
  public static async submitSkillAssessment(
    assessmentId: string,
    answers: number[]
  ): Promise<SkillAssessmentResult> {
    const response = await api.post<{ success: boolean; data: SkillAssessmentResult }>('/roadmap/assessment/skill/submit', {
      assessmentId,
      answers
    });
    return response.data.data;
  }

  /**
   * Resets active uncompleted skill assessment
   */
  public static async resetSkillAssessment(skillName: string): Promise<void> {
    await api.post('/roadmap/assessment/skill/reset', { skillName });
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
