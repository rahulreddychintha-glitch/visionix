import api from './api';
import type { ISettingsResponse, IPreferencesData } from '../types/settings.types';

export class SettingsApiService {
  /**
   * Fetches all user settings, profile, and preferences.
   */
  public static async getSettings(): Promise<ISettingsResponse> {
    const response = await api.get<{ success: boolean; data: { settings: ISettingsResponse } }>('/settings');
    return response.data.data.settings;
  }

  /**
   * Updates user preferences, theme, and notification toggles.
   */
  public static async updatePreferences(
    preferences: Partial<IPreferencesData>
  ): Promise<IPreferencesData> {
    const response = await api.put<{ success: boolean; data: { preferences: IPreferencesData } }>(
      '/settings',
      preferences
    );
    return response.data.data.preferences;
  }

  /**
   * Updates account and profile info safely.
   */
  public static async updateAccountProfile(data: {
    fullName?: string;
    personal?: any;
    education?: any;
    experience?: any;
    careerGoals?: any;
  }): Promise<void> {
    await api.put('/settings/profile', data);
  }

  /**
   * Changes password with email verification and confirmation.
   */
  public static async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    await api.put('/settings/password', {
      email,
      oldPassword,
      newPassword,
      confirmPassword,
    });
  }

  /**
   * Exports complete user data as JSON file download.
   */
  public static async exportUserData(): Promise<void> {
    const response = await api.get('/settings/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `visionix_data_export_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Permanently deletes user account.
   */
  public static async deleteAccount(password: string): Promise<void> {
    await api.delete('/settings/account', { data: { password } });
  }
}
