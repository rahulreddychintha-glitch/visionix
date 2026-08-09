import api from './api';
import type { PersonalizationApiResponse, PersonalizationContextData } from '../types/personalization.types';

export class PersonalizationApiService {
  /**
   * Fetch user personalization context and recommendation engine insights.
   */
  public static async getPersonalizationData(): Promise<PersonalizationApiResponse> {
    const response = await api.get<{ success: boolean; data: PersonalizationApiResponse }>('/personalization');
    return response.data.data;
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
    const response = await api.put<{ success: boolean; data: PersonalizationContextData['userPreferences'] }>('/personalization/preferences', prefs);
    return response.data.data;
  }

  /**
   * Fetch personalized YouTube learning videos.
   */
  public static async getPersonalizedVideos(): Promise<any[]> {
    const response = await api.get<{ success: boolean; data: any[] }>('/personalization/youtube');
    return response.data.data;
  }
}
