import api from './api';
import type { LearningHubData, ILearningFilterParams } from '../types/learning.types';

export class LearningHubApiService {
  private static cache = new Map<string, { timestamp: number; data: LearningHubData }>();
  private static CACHE_TTL_MS = 15 * 1000; // 15 seconds cache TTL

  /**
   * Fetch personalized Learning Hub 2.0 data with optional filters or boolean
   */
  public static async getLearningHubData(filters?: ILearningFilterParams | boolean): Promise<LearningHubData> {
    const params = new URLSearchParams();
    if (typeof filters === 'object' && filters !== null) {
      if (filters.search) params.append('search', filters.search);
      if (filters.career) params.append('career', filters.career);
      if (filters.skill) params.append('skill', filters.skill);
      if (filters.educationLevel) params.append('educationLevel', filters.educationLevel);
      if (filters.resourceType) params.append('resourceType', filters.resourceType);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.topicCategory) params.append('topicCategory', filters.topicCategory);
      if (filters.provider) params.append('provider', filters.provider);
    }

    const queryString = params.toString();
    const url = queryString ? `/learning-hub?${queryString}` : '/learning-hub';

    // 1. Check client-side cache
    const now = Date.now();
    const cached = LearningHubApiService.cache.get(url);
    if (cached && (now - cached.timestamp < LearningHubApiService.CACHE_TTL_MS)) {
      return cached.data;
    }

    const response = await api.get<{ success: boolean; data: LearningHubData }>(url);
    const data = response.data.data;

    LearningHubApiService.cache.set(url, { timestamp: Date.now(), data });
    return data;
  }

  /**
   * Start tracking progress for a resource (marks as in_progress)
   */
  public static async startResource(resourceId: string): Promise<{ resourceId: string; status: 'in_progress' }> {
    LearningHubApiService.clearCache();
    const response = await api.post<{ success: boolean; data: { resourceId: string; status: 'in_progress' } }>('/learning-hub/start', {
      resourceId,
    });
    return response.data.data;
  }

  /**
   * Update progress status of a resource (e.g. mark as completed)
   */
  public static async updateProgress(resourceId: string, status: 'in_progress' | 'completed'): Promise<{ resourceId: string; status: 'in_progress' | 'completed' }> {
    LearningHubApiService.clearCache();
    const response = await api.post<{ success: boolean; data: { resourceId: string; status: 'in_progress' | 'completed' } }>('/learning-hub/progress', {
      resourceId,
      status,
    });
    return response.data.data;
  }

  /**
   * Toggle bookmark status of a resource
   */
  public static async toggleBookmark(resourceId: string): Promise<{ resourceId: string; bookmarked: boolean }> {
    LearningHubApiService.clearCache();
    const response = await api.post<{ success: boolean; data: { resourceId: string; bookmarked: boolean } }>('/learning-hub/bookmark', {
      resourceId,
    });
    return response.data.data;
  }

  /**
   * Force invalidate the cached Learning Hub responses
   */
  public static clearCache(): void {
    LearningHubApiService.cache.clear();
  }
}

export default LearningHubApiService;
