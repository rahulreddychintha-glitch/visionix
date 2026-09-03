import api from './api';
import type { ICourseRecommendationsResponse, ICourseFilterOptions } from '../types/course.types';

export class CourseService {
  private static cache = new Map<string, { timestamp: number; data: ICourseRecommendationsResponse }>();
  private static CACHE_TTL_MS = 15 * 1000; // 15 seconds client cache

  /**
   * Fetch personalized course recommendations driven by Phase 23 Skill Gap Analysis
   */
  public static async getCourseRecommendations(
    options: ICourseFilterOptions = {}
  ): Promise<ICourseRecommendationsResponse> {
    const params = new URLSearchParams();
    if (options.careerId) params.append('careerId', options.careerId);
    if (options.skill) params.append('skill', options.skill);
    if (options.difficulty) params.append('difficulty', options.difficulty);
    if (options.provider) params.append('provider', options.provider);
    if (options.search) params.append('search', options.search);
    if (options.resourceType) params.append('resourceType', options.resourceType);

    const queryString = params.toString();
    const url = queryString ? `/courses/recommendations?${queryString}` : '/courses/recommendations';

    const now = Date.now();
    const cached = CourseService.cache.get(url);
    if (cached && (now - cached.timestamp < CourseService.CACHE_TTL_MS)) {
      return cached.data;
    }

    const response = await api.get<{ success: boolean; data: ICourseRecommendationsResponse }>(url);
    const data = response.data.data;

    CourseService.cache.set(url, { timestamp: Date.now(), data });
    return data;
  }

  /**
   * Invalidate course cache
   */
  public static clearCache(): void {
    CourseService.cache.clear();
  }
}

export default CourseService;
