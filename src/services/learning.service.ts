import api from './api';
import type { LearningHubData } from '../types/learning.types';

export class LearningHubApiService {
  private static cache = new Map<string, { timestamp: number; data: LearningHubData }>();
  private static CACHE_TTL_MS = 30 * 1000; // 30 seconds client-side cache TTL
  
  private static pendingRequest: Promise<LearningHubData> | null = null;
  private static pendingRequestWithSkip: Promise<LearningHubData> | null = null;

  /**
   * Fetch personalized Learning Hub data, recommendations, progress, and videos
   */
  public static async getLearningHubData(skipYoutube?: boolean): Promise<LearningHubData> {
    const cacheKey = skipYoutube ? 'skip' : 'noskip';
    
    // 1. Check cache
    const cached = LearningHubApiService.cache.get(cacheKey);
    const now = Date.now();
    if (cached && (now - cached.timestamp < LearningHubApiService.CACHE_TTL_MS)) {
      return cached.data;
    }

    // 2. Check pending in-flight requests to deduplicate concurrent calls
    if (skipYoutube && LearningHubApiService.pendingRequestWithSkip) {
      return LearningHubApiService.pendingRequestWithSkip;
    }
    if (!skipYoutube && LearningHubApiService.pendingRequest) {
      return LearningHubApiService.pendingRequest;
    }

    const promise = (async () => {
      try {
        const response = await api.get<{ success: boolean; data: LearningHubData }>(
          skipYoutube ? '/learning-hub?skipYoutube=true' : '/learning-hub'
        );
        const data = response.data.data;
        
        // Cache successful requests (only if there are no backend errors)
        if (!data.youtubeError) {
          LearningHubApiService.cache.set(cacheKey, { timestamp: Date.now(), data });
        }
        return data;
      } finally {
        if (skipYoutube) {
          LearningHubApiService.pendingRequestWithSkip = null;
        } else {
          LearningHubApiService.pendingRequest = null;
        }
      }
    })();

    if (skipYoutube) {
      LearningHubApiService.pendingRequestWithSkip = promise;
    } else {
      LearningHubApiService.pendingRequest = promise;
    }

    return promise;
  }

  /**
   * Start tracking progress for a resource (marks as in_progress)
   */
  public static async startResource(resourceId: string): Promise<{ resourceId: string; status: 'in_progress' }> {
    // Clear cache to force fresh reload of tracking stats
    LearningHubApiService.clearCache();
    const response = await api.post<{ success: boolean; data: { resourceId: string; status: 'in_progress' } }>('/learning-hub/start', {
      resourceId
    });
    return response.data.data;
  }

  /**
   * Update progress status of a resource (e.g. mark as completed)
   */
  public static async updateProgress(resourceId: string, status: 'in_progress' | 'completed'): Promise<{ resourceId: string; status: 'in_progress' | 'completed' }> {
    // Clear cache to force fresh reload of tracking stats
    LearningHubApiService.clearCache();
    const response = await api.post<{ success: boolean; data: { resourceId: string; status: 'in_progress' | 'completed' } }>('/learning-hub/progress', {
      resourceId,
      status
    });
    return response.data.data;
  }

  /**
   * Toggle bookmark status of a resource
   */
  public static async toggleBookmark(resourceId: string): Promise<{ resourceId: string; bookmarked: boolean }> {
    // Clear cache to force fresh reload of bookmarks
    LearningHubApiService.clearCache();
    const response = await api.post<{ success: boolean; data: { resourceId: string; bookmarked: boolean } }>('/learning-hub/bookmark', {
      resourceId
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
