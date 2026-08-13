import api from './api';

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  url: string;
}

export interface YouTubeSearchResponse {
  query: string;
  videos: YouTubeVideo[];
  configMissing?: boolean;
  apiUnavailable?: boolean;
  errorType?: string;
}

export class YoutubeApiService {
  private static cache = new Map<string, { timestamp: number; response: YouTubeSearchResponse }>();
  private static pendingRequests = new Map<string, Promise<YouTubeSearchResponse>>();
  private static CACHE_TTL_MS = 60 * 1000; // 1 minute client cache

  /**
   * Search YouTube videos based on skill, career, category, or custom query.
   * Reuse pending promises for identical concurrent queries to prevent request storms.
   */
  public static async searchVideos(params: {
    careerId?: string;
    category?: string;
    skill?: string;
    milestoneId?: string;
    q?: string;
    maxResults?: number;
  }): Promise<YouTubeSearchResponse> {
    const cacheKey = JSON.stringify(params);
    const now = Date.now();

    // 1. Check client-side TTL cache
    const cached = YoutubeApiService.cache.get(cacheKey);
    if (cached && (now - cached.timestamp < YoutubeApiService.CACHE_TTL_MS)) {
      return cached.response;
    }

    // 2. Check pending requests map to deduplicate concurrent requests
    const pending = YoutubeApiService.pendingRequests.get(cacheKey);
    if (pending) {
      return pending;
    }

    // 3. Initiate the request and cache on success
    const promise = (async () => {
      try {
        const response = await api.get<{ success: boolean; data: YouTubeSearchResponse }>('/youtube/search', {
          params,
        });
        const data = response.data.data;
        if (!data.configMissing && !data.apiUnavailable) {
          YoutubeApiService.cache.set(cacheKey, { timestamp: Date.now(), response: data });
        }
        return data;
      } finally {
        // Clean up pending query on completion
        YoutubeApiService.pendingRequests.delete(cacheKey);
      }
    })();

    YoutubeApiService.pendingRequests.set(cacheKey, promise);
    return promise;
  }

  /**
   * Clear client cache (for explicit retries)
   */
  public static clearCache(): void {
    YoutubeApiService.cache.clear();
    YoutubeApiService.pendingRequests.clear();
  }
}
