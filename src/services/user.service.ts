import api from './api';

export class UserService {
  /**
   * Fetch full user profile details.
   */
  public static async getProfile(): Promise<any> {
    const response = await api.get('/profile');
    return response.data;
  }

  /**
   * Upsert onboarding details (supports draft saves and final completions).
   */
  public static async saveProfile(data: any): Promise<any> {
    const response = await api.post('/profile', data);
    return response.data;
  }

  /**
   * Fetch lightweight onboarding status.
   */
  public static async getStatus(): Promise<any> {
    const response = await api.get('/profile/status');
    return response.data;
  }
}
