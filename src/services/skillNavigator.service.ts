import api from './api';
import type {
  ISkillGapAnalysis,
  ICareerComparisonItem,
  ISkillCoachResponse,
} from '../types/skillNavigator.types';

export class SkillNavigatorService {
  /**
   * Retrieves the latest skill gap analysis for the authenticated user.
   */
  public static async getLatestAnalysis(careerId?: string): Promise<ISkillGapAnalysis> {
    const url = careerId ? `/skill-gap?careerId=${encodeURIComponent(careerId)}` : '/skill-gap';
    const response = await api.get<{ success: boolean; data: { analysis: ISkillGapAnalysis } }>(url);
    return response.data.data.analysis;
  }

  /**
   * Generates or recalculates a skill gap analysis for a specific or default career.
   */
  public static async analyzeSkills(
    targetCareerId?: string,
    includeAi: boolean = true
  ): Promise<ISkillGapAnalysis> {
    const response = await api.post<{ success: boolean; data: { analysis: ISkillGapAnalysis } }>(
      '/skill-gap/analyze',
      { targetCareerId, includeAi }
    );
    return response.data.data.analysis;
  }

  /**
   * Retrieves analysis history for progress tracking.
   */
  public static async getAnalysisHistory(): Promise<ISkillGapAnalysis[]> {
    const response = await api.get<{ success: boolean; data: { history: ISkillGapAnalysis[] } }>(
      '/skill-gap/history'
    );
    return response.data.data.history;
  }

  /**
   * Retrieves career comparisons across all available careers.
   */
  public static async getCareerComparisons(): Promise<ICareerComparisonItem[]> {
    const response = await api.get<{ success: boolean; data: { comparisons: ICareerComparisonItem[] } }>(
      '/skill-gap/careers'
    );
    return response.data.data.comparisons;
  }

  /**
   * Asks a question to the AI Skill Coach.
   */
  public static async askCoach(
    question: string,
    careerId?: string
  ): Promise<ISkillCoachResponse> {
    const response = await api.post<{ success: boolean; data: ISkillCoachResponse }>(
      '/skill-gap/coach',
      { question, careerId }
    );
    return response.data.data;
  }
}
