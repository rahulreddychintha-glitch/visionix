import api from './api';

export interface Career {
  id: string;
  title: string;
  category: string;
  description: string;
  education: string;
  skills: string[];
  responsibilities: string[];
  salaryRange: string;
  growthRate: string;
  demandLevel: string;
  saved: boolean;
  relevanceTag: 'Dream Career' | 'Interested' | 'Relevant' | null;
  recommendationReason?: string;
  relevanceScore?: number;
  match?: CareerMatchResult;
}

export interface CareersListResponse {
  careers: Career[];
  isMockMode: boolean;
}

export interface CareerMatchResult {
  careerId: string;
  careerTitle: string;
  matchScore: number;
  matchLevel: 'Strong' | 'Moderate' | 'Low' | 'Needs Development';
  isProfileComplete: boolean;
  strengths: string[];
  skillsYouHave: string[];
  skillGaps: string[];
  improvementSuggestions: string[];
}

export class CareerService {
  private static careersCache = new Map<string, { timestamp: number; data: CareersListResponse }>();
  private static careersPromises = new Map<string, Promise<CareersListResponse>>();

  private static recsCache = new Map<string, { timestamp: number; data: CareersListResponse & { isProfileComplete: boolean } }>();
  private static recsPromises = new Map<string, Promise<CareersListResponse & { isProfileComplete: boolean }>>();

  private static savedCache: { timestamp: number; data: CareersListResponse } | null = null;
  private static savedPromise: Promise<CareersListResponse> | null = null;

  private static CACHE_TTL_MS = 30 * 1000; // 30 seconds cache TTL

  /**
   * Fetch all careers with optional search and category filters.
   * Caches results in memory and deduplicates in-flight requests.
   */
  public static async getCareers(search?: string, category?: string): Promise<CareersListResponse> {
    const cacheKey = `${search || ''}_${category || ''}`;
    const now = Date.now();
    const cached = this.careersCache.get(cacheKey);
    if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    const pending = this.careersPromises.get(cacheKey);
    if (pending) {
      return pending;
    }

    const promise = (async () => {
      try {
        const response = await api.get('/careers', {
          params: { search, category }
        });
        const data = response.data.data;
        CareerService.careersCache.set(cacheKey, { timestamp: Date.now(), data });
        return data;
      } finally {
        CareerService.careersPromises.delete(cacheKey);
      }
    })();

    this.careersPromises.set(cacheKey, promise);
    return promise;
  }

  /**
   * Fetch all bookmarked careers for current user.
   * Caches results in memory and deduplicates in-flight requests.
   */
  public static async getSavedCareers(): Promise<CareersListResponse> {
    const now = Date.now();
    if (this.savedCache && now - this.savedCache.timestamp < this.CACHE_TTL_MS) {
      return this.savedCache.data;
    }

    if (this.savedPromise) {
      return this.savedPromise;
    }

    this.savedPromise = (async () => {
      try {
        const response = await api.get('/careers/saved');
        const data = response.data.data;
        CareerService.savedCache = { timestamp: Date.now(), data };
        return data;
      } finally {
        CareerService.savedPromise = null;
      }
    })();

    return this.savedPromise;
  }

  /**
   * Fetch personalized career recommendations based on user profile.
   * Caches results in memory and deduplicates in-flight requests.
   */
  public static async getRecommendations(search?: string, category?: string): Promise<CareersListResponse & { isProfileComplete: boolean }> {
    const cacheKey = `${search || ''}_${category || ''}`;
    const now = Date.now();
    const cached = this.recsCache.get(cacheKey);
    if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    const pending = this.recsPromises.get(cacheKey);
    if (pending) {
      return pending;
    }

    const promise = (async () => {
      try {
        const response = await api.get('/careers/recommended', {
          params: { search, category }
        });
        const data = response.data.data;
        CareerService.recsCache.set(cacheKey, { timestamp: Date.now(), data });
        return data;
      } finally {
        CareerService.recsPromises.delete(cacheKey);
      }
    })();

    this.recsPromises.set(cacheKey, promise);
    return promise;
  }

  /**
   * Fetch natural-language AI explanation for why a career is recommended.
   */
  public static async getRecommendationExplanation(id: string): Promise<string> {
    const response = await api.post(`/careers/${id}/recommendation-explanation`);
    return response.data.data.explanation;
  }

  /**
   * Fetch deterministic career match analysis for a selected career.
   */
  public static async getCareerMatch(id: string): Promise<CareerMatchResult> {
    const response = await api.get(`/careers/${id}/match`);
    return response.data.data.match;
  }

  /**
   * Fetch natural-language AI explanation of the calculated match score.
   */
  public static async getCareerMatchExplanation(id: string): Promise<string> {
    const response = await api.post(`/careers/${id}/match/explanation`);
    return response.data.data.explanation;
  }

  /**
   * Fetch detailed metadata of a specific career.
   */
  public static async getCareerDetails(id: string): Promise<Career> {
    const response = await api.get(`/careers/${id}`);
    return response.data.data;
  }

  /**
   * Bookmark a career and invalidate cache.
   */
  public static async saveCareer(id: string): Promise<{ careerId: string; saved: boolean }> {
    CareerService.clearCache();
    const response = await api.post(`/careers/${id}/save`);
    return response.data.data;
  }

  /**
   * Remove bookmark and invalidate cache.
   */
  public static async unsaveCareer(id: string): Promise<{ careerId: string; saved: boolean }> {
    CareerService.clearCache();
    const response = await api.delete(`/careers/${id}/save`);
    return response.data.data;
  }

  /**
   * Invalidate in-memory career caches.
   */
  public static clearCache(): void {
    CareerService.careersCache.clear();
    CareerService.careersPromises.clear();
    CareerService.recsCache.clear();
    CareerService.recsPromises.clear();
    CareerService.savedCache = null;
    CareerService.savedPromise = null;
  }
}

