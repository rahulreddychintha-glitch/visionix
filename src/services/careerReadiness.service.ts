import api from './api';
import type { ICareerReadinessData, ICareerReadinessResponse } from '../types/careerReadiness.types';

export class CareerReadinessService {
  private static cache = new Map<string, { timestamp: number; data: ICareerReadinessData }>();
  private static CACHE_TTL_MS = 15 * 1000; // 15 seconds cache TTL

  /**
   * Fetches deterministic career preparation readiness data for the student across
   * Skills, Learning, Roadmap, Assessments, Resume, and Interview Preparation.
   */
  public static async getCareerReadiness(careerId?: string): Promise<ICareerReadinessData> {
    const url = careerId
      ? `/career-readiness?careerId=${encodeURIComponent(careerId)}`
      : '/career-readiness';

    const now = Date.now();
    const cached = CareerReadinessService.cache.get(url);
    if (cached && now - cached.timestamp < CareerReadinessService.CACHE_TTL_MS) {
      return cached.data;
    }

    const response = await api.get<ICareerReadinessResponse>(url);
    const data = response.data.data.readiness;

    CareerReadinessService.cache.set(url, { timestamp: Date.now(), data });
    return data;
  }

  /**
   * Invalidates cached readiness data
   */
  public static clearCache(): void {
    CareerReadinessService.cache.clear();
  }
}

export default CareerReadinessService;
