import api from './api';
import type { ICareerPathsData } from '../types/careerPaths.types';

export interface ICareerPathsApiResponse {
  success: boolean;
  data: {
    careerPaths: ICareerPathsData;
  };
}

export class CareerPathsService {
  private static cache = new Map<string, { timestamp: number; data: ICareerPathsData }>();
  private static CACHE_TTL_MS = 15 * 1000; // 15 seconds cache TTL

  /**
   * Fetches deterministic Alternative Careers and Backup Career Paths for the student.
   */
  public static async getCareerPaths(careerId?: string): Promise<ICareerPathsData> {
    const url = careerId
      ? `/career-paths?careerId=${encodeURIComponent(careerId)}`
      : '/career-paths';

    const now = Date.now();
    const cached = CareerPathsService.cache.get(url);
    if (cached && now - cached.timestamp < CareerPathsService.CACHE_TTL_MS) {
      return cached.data;
    }

    const response = await api.get<ICareerPathsApiResponse>(url);
    const data = response.data.data.careerPaths;

    CareerPathsService.cache.set(url, { timestamp: Date.now(), data });
    return data;
  }

  /**
   * Clears the in-memory cache for career paths.
   */
  public static clearCache(): void {
    CareerPathsService.cache.clear();
  }
}

export default CareerPathsService;
