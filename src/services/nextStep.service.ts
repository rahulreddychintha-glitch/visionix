import api from './api';
import type { INextStepData, INextStepResponse } from '../types/nextStep.types';

export class NextStepService {
  private static cache = new Map<string, { timestamp: number; data: INextStepData }>();
  private static CACHE_TTL_MS = 15 * 1000; // 15 seconds cache TTL

  /**
   * Fetches deterministic Next Step data for the authenticated student.
   */
  public static async getNextStep(careerId?: string): Promise<INextStepData> {
    const url = careerId
      ? `/next-step?careerId=${encodeURIComponent(careerId)}`
      : '/next-step';

    const now = Date.now();
    const cached = NextStepService.cache.get(url);
    if (cached && now - cached.timestamp < NextStepService.CACHE_TTL_MS) {
      return cached.data;
    }

    const response = await api.get<INextStepResponse>(url);
    const data = response.data.data;

    NextStepService.cache.set(url, { timestamp: Date.now(), data });
    return data;
  }

  /**
   * Clears the in-memory cache.
   */
  public static clearCache(): void {
    NextStepService.cache.clear();
  }
}

export default NextStepService;
