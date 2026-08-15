import api from './api';
import type {
  IStartupRoadmap,
  IStartupTask,
  INextStepRecommendation,
  IBusinessValidationResult,
  IPitchGenerationResult,
} from '../types/startupRoadmap.types';

export class StartupRoadmapApiService {
  // ==========================================
  // 1. ROADMAP CRUD & GENERATION
  // ==========================================

  /**
   * Generates a personalized startup roadmap from a curated business idea.
   */
  public static async generateRoadmap(businessIdeaId: string): Promise<IStartupRoadmap> {
    const response = await api.post<{ success: boolean; data: { roadmap: IStartupRoadmap } }>(
      '/business/roadmaps/generate',
      { businessIdeaId }
    );
    return response.data.data.roadmap;
  }

  /**
   * Retrieves all roadmaps owned by the user.
   */
  public static async getRoadmaps(): Promise<IStartupRoadmap[]> {
    const response = await api.get<{ success: boolean; data: { roadmaps: IStartupRoadmap[] } }>(
      '/business/roadmaps'
    );
    return response.data.data.roadmaps;
  }

  /**
   * Retrieves a single roadmap by ID.
   */
  public static async getRoadmapById(id: string): Promise<IStartupRoadmap> {
    const response = await api.get<{ success: boolean; data: { roadmap: IStartupRoadmap } }>(
      `/business/roadmaps/${id}`
    );
    return response.data.data.roadmap;
  }

  /**
   * Updates basic fields of a roadmap.
   */
  public static async updateRoadmap(
    id: string,
    data: Partial<IStartupRoadmap>
  ): Promise<IStartupRoadmap> {
    const response = await api.patch<{ success: boolean; data: { roadmap: IStartupRoadmap } }>(
      `/business/roadmaps/${id}`,
      data
    );
    return response.data.data.roadmap;
  }

  /**
   * Deletes a roadmap.
   */
  public static async deleteRoadmap(id: string): Promise<void> {
    await api.delete(`/business/roadmaps/${id}`);
  }

  /**
   * Retrieves recommended next actions for a roadmap.
   */
  public static async getNextSteps(id: string): Promise<INextStepRecommendation[]> {
    const response = await api.get<{ success: boolean; data: { nextSteps: INextStepRecommendation[] } }>(
      `/business/roadmaps/${id}/next-steps`
    );
    return response.data.data.nextSteps;
  }

  // ==========================================
  // 2. TASK & MILESTONE MUTATIONS
  // ==========================================

  /**
   * Adds a task to a specific milestone.
   */
  public static async addTask(
    roadmapId: string,
    milestoneId: string,
    taskData: Partial<IStartupTask>
  ): Promise<IStartupRoadmap> {
    const response = await api.post<{ success: boolean; data: { roadmap: IStartupRoadmap } }>(
      `/business/roadmaps/${roadmapId}/milestones/${milestoneId}/tasks`,
      taskData
    );
    return response.data.data.roadmap;
  }

  /**
   * Updates or toggles a task.
   */
  public static async updateTask(
    roadmapId: string,
    milestoneId: string,
    taskId: string,
    taskData: Partial<IStartupTask>
  ): Promise<IStartupRoadmap> {
    const response = await api.patch<{ success: boolean; data: { roadmap: IStartupRoadmap } }>(
      `/business/roadmaps/${roadmapId}/milestones/${milestoneId}/tasks/${taskId}`,
      taskData
    );
    return response.data.data.roadmap;
  }

  /**
   * Deletes a task from a milestone.
   */
  public static async deleteTask(
    roadmapId: string,
    milestoneId: string,
    taskId: string
  ): Promise<IStartupRoadmap> {
    const response = await api.delete<{ success: boolean; data: { roadmap: IStartupRoadmap } }>(
      `/business/roadmaps/${roadmapId}/milestones/${milestoneId}/tasks/${taskId}`
    );
    return response.data.data.roadmap;
  }

  // ==========================================
  // 3. AI BUSINESS ASSISTANT & VALIDATION
  // ==========================================

  /**
   * Chats with the context-aware startup mentor.
   */
  public static async chatWithAssistant(
    message: string,
    roadmapId?: string,
    businessIdeaId?: string,
    history?: { role: 'user' | 'assistant'; content: string }[]
  ): Promise<{
    reply: string;
    suggestedFollowUps: string[];
    contextUsed: {
      ventureTitle?: string;
      stage?: string;
      verifiedSkillsCount: number;
    };
  }> {
    const response = await api.post<{
      success: boolean;
      data: {
        reply: string;
        suggestedFollowUps: string[];
        contextUsed: {
          ventureTitle?: string;
          stage?: string;
          verifiedSkillsCount: number;
        };
      };
    }>('/business/assistant/chat', {
      message,
      roadmapId,
      businessIdeaId,
      history,
    });
    return response.data.data;
  }

  /**
   * Evaluates and validates a startup idea.
   */
  public static async validateIdea(payload: {
    businessIdeaId?: string;
    roadmapId?: string;
    title?: string;
    description?: string;
  }): Promise<IBusinessValidationResult> {
    const response = await api.post<{
      success: boolean;
      data: { validation: IBusinessValidationResult };
    }>('/business/assistant/validate', payload);
    return response.data.data.validation;
  }

  /**
   * Generates a pitch or structured business plan draft.
   */
  public static async generatePitch(payload: {
    pitchType: 'one_liner' | 'elevator' | 'pitch_deck' | 'business_plan';
    roadmapId?: string;
    businessIdeaId?: string;
  }): Promise<IPitchGenerationResult> {
    const response = await api.post<{
      success: boolean;
      data: { pitch: IPitchGenerationResult };
    }>('/business/assistant/pitch', payload);
    return response.data.data.pitch;
  }
}
