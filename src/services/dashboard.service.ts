// Stub dashboard service file for Phase 5 (User Dashboard & Core Layout Shell)
export class DashboardService {
  public static async getDashboardSettings(): Promise<unknown> {
    return Promise.resolve({ message: 'Dashboard settings stub' });
  }

  public static async getWidgets(): Promise<unknown[]> {
    return Promise.resolve([]);
  }
}
