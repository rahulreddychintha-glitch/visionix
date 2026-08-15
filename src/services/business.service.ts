import api from './api';
import type {
  IBusinessIdea,
  IBusinessOpportunity,
  IBusinessProfile,
  IBusinessIdeaFilters,
  IBusinessOpportunityFilters,
  IBusinessIdeaListResponse,
  IBusinessOpportunityListResponse,
  IBusinessProfileResponse,
  IBusinessIdeaSingleResponse,
  IBusinessOpportunitySingleResponse,
} from '../types/business.types';

export class BusinessService {
  // ==========================================
  // 1. BUSINESS IDEAS
  // ==========================================

  /**
   * Retrieves business ideas with filtering and pagination.
   */
  public static async getBusinessIdeas(filters: IBusinessIdeaFilters = {}): Promise<IBusinessIdeaListResponse> {
    const response = await api.get<{ success: boolean; data: IBusinessIdeaListResponse }>(
      '/business/ideas',
      { params: filters }
    );
    return response.data.data;
  }

  /**
   * Retrieves a single business idea by ID.
   */
  public static async getBusinessIdea(id: string): Promise<IBusinessIdea> {
    const response = await api.get<{ success: boolean; data: IBusinessIdeaSingleResponse }>(
      `/business/ideas/${id}`
    );
    return response.data.data.idea;
  }

  /**
   * Saves a business idea to the user's saved list.
   */
  public static async saveBusinessIdea(id: string): Promise<IBusinessProfile> {
    const response = await api.post<{ success: boolean; data: IBusinessProfileResponse }>(
      `/business/ideas/${id}/save`
    );
    return response.data.data.profile;
  }

  /**
   * Removes a saved business idea from the user's saved list.
   */
  public static async removeSavedBusinessIdea(id: string): Promise<IBusinessProfile> {
    const response = await api.delete<{ success: boolean; data: IBusinessProfileResponse }>(
      `/business/ideas/${id}/save`
    );
    return response.data.data.profile;
  }

  // ==========================================
  // 2. OPPORTUNITIES (PHASE 14.3)
  // ==========================================

  /**
   * Retrieves business opportunities with filtering and pagination.
   */
  public static async getBusinessOpportunities(
    filters: IBusinessOpportunityFilters = {}
  ): Promise<IBusinessOpportunityListResponse> {
    const response = await api.get<{ success: boolean; data: IBusinessOpportunityListResponse }>(
      '/business/opportunities',
      { params: filters }
    );
    return response.data.data;
  }

  /**
   * Retrieves a single business opportunity by ID.
   */
  public static async getBusinessOpportunityById(id: string): Promise<IBusinessOpportunity> {
    const response = await api.get<{ success: boolean; data: IBusinessOpportunitySingleResponse }>(
      `/business/opportunities/${id}`
    );
    return response.data.data.opportunity;
  }

  /**
   * Retrieves recommended opportunities for the authenticated user.
   */
  public static async getRecommendedOpportunities(): Promise<IBusinessOpportunity[]> {
    const response = await api.get<{ success: boolean; data: { opportunities: IBusinessOpportunity[] } }>(
      '/business/opportunities/recommended'
    );
    return response.data.data.opportunities;
  }

  /**
   * Retrieves saved opportunities for the authenticated user.
   */
  public static async getSavedBusinessOpportunities(): Promise<IBusinessOpportunity[]> {
    const response = await api.get<{ success: boolean; data: { opportunities: IBusinessOpportunity[] } }>(
      '/business/opportunities/saved'
    );
    return response.data.data.opportunities;
  }

  /**
   * Saves an opportunity to the user's saved list.
   */
  public static async saveBusinessOpportunity(id: string): Promise<IBusinessProfile> {
    const response = await api.post<{ success: boolean; data: IBusinessProfileResponse }>(
      `/business/opportunities/${id}/save`
    );
    return response.data.data.profile;
  }

  /**
   * Removes a saved opportunity from the user's saved list.
   */
  public static async removeSavedBusinessOpportunity(id: string): Promise<IBusinessProfile> {
    const response = await api.delete<{ success: boolean; data: IBusinessProfileResponse }>(
      `/business/opportunities/${id}/save`
    );
    return response.data.data.profile;
  }

  // ==========================================
  // 3. BUSINESS PROFILE
  // ==========================================

  /**
   * Retrieves the authenticated user's Business Profile.
   */
  public static async getBusinessProfile(): Promise<IBusinessProfile> {
    const response = await api.get<{ success: boolean; data: IBusinessProfileResponse }>(
      '/business/profile'
    );
    return response.data.data.profile;
  }

  /**
   * Creates or initializes the user's Business Profile.
   */
  public static async createBusinessProfile(data: Partial<IBusinessProfile>): Promise<IBusinessProfile> {
    const response = await api.post<{ success: boolean; data: IBusinessProfileResponse }>(
      '/business/profile',
      data
    );
    return response.data.data.profile;
  }

  /**
   * Updates the user's Business Profile.
   */
  public static async updateBusinessProfile(data: Partial<IBusinessProfile>): Promise<IBusinessProfile> {
    const response = await api.put<{ success: boolean; data: IBusinessProfileResponse }>(
      '/business/profile',
      data
    );
    return response.data.data.profile;
  }
}
