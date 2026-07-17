// Stub user service file for Phase 4 (Profile & Onboarding Engine)
export class UserService {
  public static async getProfile(): Promise<unknown> {
    return Promise.resolve({ message: 'Profile details stub' });
  }

  public static async updateProfile(): Promise<unknown> {
    return Promise.resolve({ message: 'Profile update stub' });
  }
}
