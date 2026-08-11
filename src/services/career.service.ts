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
}

export interface CareersListResponse {
  careers: Career[];
  isMockMode: boolean;
}

export class CareerService {
  /**
   * Fetch all careers with optional search and category filters.
   */
  public static async getCareers(search?: string, category?: string): Promise<CareersListResponse> {
    const response = await api.get('/careers', {
      params: { search, category }
    });
    return response.data.data;
  }

  /**
   * Fetch all bookmarked careers for current user.
   */
  public static async getSavedCareers(): Promise<CareersListResponse> {
    const response = await api.get('/careers/saved');
    return response.data.data;
  }

  /**
   * Fetch personalized career recommendations based on user profile.
   */
  public static async getRecommendations(search?: string, category?: string): Promise<CareersListResponse & { isProfileComplete: boolean }> {
    const response = await api.get('/careers/recommended', {
      params: { search, category }
    });
    return response.data.data;
  }

  /**
   * Fetch natural-language AI explanation for why a career is recommended.
   */
  public static async getRecommendationExplanation(id: string): Promise<string> {
    const response = await api.post(`/careers/${id}/recommendation-explanation`);
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
   * Bookmark a career.
   */
  public static async saveCareer(id: string): Promise<{ careerId: string; saved: boolean }> {
    const response = await api.post(`/careers/${id}/save`);
    return response.data.data;
  }

  /**
   * Remove bookmark.
   */
  public static async unsaveCareer(id: string): Promise<{ careerId: string; saved: boolean }> {
    const response = await api.delete(`/careers/${id}/save`);
    return response.data.data;
  }
}
