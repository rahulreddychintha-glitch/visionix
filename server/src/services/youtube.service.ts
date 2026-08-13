import axios from 'axios';
import config from '../config/env';

export interface IYouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  url: string;
}

export class YoutubeService {
  private static cache = new Map<string, { timestamp: number; videos: IYouTubeVideo[] }>();
  private static detailsCache = new Map<string, { timestamp: number; video: IYouTubeVideo | null }>();
  private static pendingRequests = new Map<string, Promise<IYouTubeVideo[]>>();
  private static pendingDetailsRequests = new Map<string, Promise<IYouTubeVideo | null>>();
  private static CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes cache TTL

  /**
   * Search videos on YouTube using the Data API v3.
   * Reuses pending in-flight promises and returns cached results when available.
   */
  public static async searchVideos(query: string, maxResults: number = 4): Promise<IYouTubeVideo[]> {
    const apiKey = config.YOUTUBE_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      console.warn('[YoutubeService] YOUTUBE_API_KEY is not configured in env variables.');
      return [];
    }

    const cacheKey = `${query}_${maxResults}`;
    const now = Date.now();

    // 1. Check TTL cache
    const cached = YoutubeService.cache.get(cacheKey);
    if (cached && (now - cached.timestamp < YoutubeService.CACHE_TTL_MS)) {
      return cached.videos;
    }

    // 2. Check pending concurrent requests
    const pending = YoutubeService.pendingRequests.get(cacheKey);
    if (pending) {
      return pending;
    }

    // 3. Perform Google search and resolve/cache
    const promise = (async () => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search`;
        const response = await axios.get(url, {
          params: {
            part: 'snippet',
            q: query,
            maxResults,
            type: 'video',
            key: apiKey,
          },
          timeout: 5000,
        });

        const items = response.data?.items || [];
        const videos = items.map((item: any) => {
          const videoId = item.id?.videoId || '';
          const snippet = item.snippet || {};
          const thumbnails = snippet.thumbnails || {};
          const thumbnail = thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
          
          return {
            videoId,
            title: snippet.title || 'YouTube Video',
            description: snippet.description || '',
            thumbnail,
            channelTitle: snippet.channelTitle || 'YouTube Creator',
            publishedAt: snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : 'Recent',
            url: `https://www.youtube.com/watch?v=${videoId}`,
          };
        });

        YoutubeService.cache.set(cacheKey, { timestamp: Date.now(), videos });
        return videos;
      } finally {
        YoutubeService.pendingRequests.delete(cacheKey);
      }
    })();

    YoutubeService.pendingRequests.set(cacheKey, promise);
    return promise;
  }

  /**
   * Fetch details for a specific video ID from the YouTube Data API v3.
   */
  public static async getVideoDetails(videoId: string): Promise<IYouTubeVideo | null> {
    const apiKey = config.YOUTUBE_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      console.warn('[YoutubeService] YOUTUBE_API_KEY is not configured in env variables.');
      return null;
    }

    const now = Date.now();

    // 1. Check details cache
    const cached = YoutubeService.detailsCache.get(videoId);
    if (cached && (now - cached.timestamp < YoutubeService.CACHE_TTL_MS)) {
      return cached.video;
    }

    // 2. Check pending concurrent details request
    const pending = YoutubeService.pendingDetailsRequests.get(videoId);
    if (pending) {
      return pending;
    }

    // 3. Execute Google API details lookup and cache
    const promise = (async () => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/videos`;
        const response = await axios.get(url, {
          params: {
            part: 'snippet',
            id: videoId,
            key: apiKey,
          },
          timeout: 5000,
        });

        const items = response.data?.items || [];
        if (items.length === 0) {
          YoutubeService.detailsCache.set(videoId, { timestamp: Date.now(), video: null });
          return null;
        }

        const item = items[0];
        const snippet = item.snippet || {};
        const thumbnails = snippet.thumbnails || {};
        const thumbnail = thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

        const video = {
          videoId,
          title: snippet.title || 'YouTube Video',
          description: snippet.description || '',
          thumbnail,
          channelTitle: snippet.channelTitle || 'YouTube Creator',
          publishedAt: snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : 'Recent',
          url: `https://www.youtube.com/watch?v=${videoId}`,
        };

        YoutubeService.detailsCache.set(videoId, { timestamp: Date.now(), video });
        return video;
      } finally {
        YoutubeService.pendingDetailsRequests.delete(videoId);
      }
    })();

    YoutubeService.pendingDetailsRequests.set(videoId, promise);
    return promise;
  }
}
