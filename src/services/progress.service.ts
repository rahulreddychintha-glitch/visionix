import api from './api';
import type { IUnifiedProgressData, IUnifiedProgressResponse } from '../types/progress.types';

export class ProgressService {
  private static cache = new Map<string, { timestamp: number; data: IUnifiedProgressData }>();
  private static CACHE_TTL_MS = 15 * 1000; // 15 seconds cache TTL

  /**
   * Fetches unified progress aggregation across Skills, Courses, Roadmap,
   * Assessments, Resume, and Interview Preparation from the server.
   */
  public static async getUnifiedProgress(careerId?: string): Promise<IUnifiedProgressData> {
    const url = careerId ? `/progress?careerId=${encodeURIComponent(careerId)}` : '/progress';

    const now = Date.now();
    const cached = ProgressService.cache.get(url);
    if (cached && (now - cached.timestamp < ProgressService.CACHE_TTL_MS)) {
      return cached.data;
    }

    const response = await api.get<IUnifiedProgressResponse>(url);
    const data = response.data.data.progress;

    ProgressService.cache.set(url, { timestamp: Date.now(), data });
    return data;
  }

  /**
   * Invalidates cached progress data (e.g. after milestone toggle, course start, assessment)
   */
  public static clearCache(): void {
    ProgressService.cache.clear();
  }
}

export default ProgressService;
