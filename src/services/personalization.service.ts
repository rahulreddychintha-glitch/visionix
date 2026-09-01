import api from './api';
import type { PersonalizationApiResponse, PersonalizationContextData } from '../types/personalization.types';

export class PersonalizationApiService {
  private static personalizationCache: { timestamp: number; data: PersonalizationApiResponse } | null = null;
  private static personalizationPromise: Promise<PersonalizationApiResponse> | null = null;
  private static videosCache: { timestamp: number; data: any[] } | null = null;
  private static videosPromise: Promise<any[]> | null = null;
  private static CACHE_TTL_MS = 30 * 1000; // 30 seconds cache TTL

  /**
   * Fetch user personalization context and recommendation engine insights.
   * Uses 30s in-memory cache and deduplicates in-flight promises.
   */
  public static async getPersonalizationData(): Promise<PersonalizationApiResponse> {
    const now = Date.now();
    if (this.personalizationCache && now - this.personalizationCache.timestamp < this.CACHE_TTL_MS) {
      return this.personalizationCache.data;
    }

    if (this.personalizationPromise) {
      return this.personalizationPromise;
    }

    this.personalizationPromise = (async () => {
      try {
        const response = await api.get<{ success: boolean; data: PersonalizationApiResponse }>('/personalization');
        const data = response.data.data;
        this.personalizationCache = { timestamp: Date.now(), data };
        return data;
      } finally {
        this.personalizationPromise = null;
      }
    })();

    return this.personalizationPromise;
  }

  /**
   * Fetch current user preferences.
   */
  public static async getPreferences(): Promise<PersonalizationContextData['userPreferences']> {
    const response = await api.get<{ success: boolean; data: PersonalizationContextData['userPreferences'] }>('/personalization/preferences');
    return response.data.data;
  }

  /**
   * Update user preferences.
   */
  public static async updatePreferences(prefs: Partial<PersonalizationContextData['userPreferences']>): Promise<PersonalizationContextData['userPreferences']> {
    PersonalizationApiService.clearCache();
    const response = await api.put<{ success: boolean; data: PersonalizationContextData['userPreferences'] }>('/personalization/preferences', prefs);
    return response.data.data;
  }

  /**
   * Fetch personalized YouTube learning videos.
   * Uses 30s in-memory cache and deduplicates in-flight promises.
   */
  public static async getPersonalizedVideos(): Promise<any[]> {
    const now = Date.now();
    if (this.videosCache && now - this.videosCache.timestamp < this.CACHE_TTL_MS) {
      return this.videosCache.data;
    }

    if (this.videosPromise) {
      return this.videosPromise;
    }

    this.videosPromise = (async () => {
      try {
        const response = await api.get<{ success: boolean; data: any[] }>('/personalization/youtube');
        const data = response.data.data;
        this.videosCache = { timestamp: Date.now(), data };
        return data;
      } finally {
        this.videosPromise = null;
      }
    })();

    return this.videosPromise;
  }

  /**
   * Clear in-memory personalization caches.
   */
  public static clearCache(): void {
    PersonalizationApiService.personalizationCache = null;
    PersonalizationApiService.personalizationPromise = null;
    PersonalizationApiService.videosCache = null;
    PersonalizationApiService.videosPromise = null;
  }
}

