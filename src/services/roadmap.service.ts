import api from './api';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  skills: string[];
  tasks: string[];
  activities: string[];
  learningObjectives: string[];
  dependencies: string[];
  completed: boolean;
  status: 'Upcoming' | 'In Progress' | 'Completed & Verified' | 'Completed — Review Recommended';
  assessmentAttempted?: boolean;
  assessmentScore?: number;
  assessmentStatus?: 'passed' | 'failed' | null;
  assessmentAttemptedAt?: string | null;
  retakeAvailable?: boolean;
}

export interface RoadmapStage {
  title: string;
  milestones: Milestone[];
}

export interface RoadmapComparisonStage {
  stageIndex: number;
  title: string;
  milestonesCount: number;
  milestoneTitles: string[];
  skills: string[];
  activities: string[];
  learningFocus: string;
}

export interface RoadmapComparisonItem {
  careerId: string;
  careerTitle: string;
  category: string;
  totalStages: number;
  totalMilestones: number;
  stages: RoadmapComparisonStage[];
  allSkills: string[];
  keyProjects: string[];
  coreLearningDirection: string;
  assessmentCheckpoints: string[];
  salaryRange?: string;
  growthRate?: string;
  demandLevel?: string;
}

export interface RoadmapComparisonResponse {
  roadmaps: RoadmapComparisonItem[];
  pathDifferences: {
    overview: string;
    keyDifferences: string[];
    sharedSkills: string[];
    uniqueSkillsByCareer: Record<string, string[]>;
    focusComparison: Array<{
      careerId: string;
      careerTitle: string;
      primaryFocus: string;
      typicalProjects: string[];
    }>;
  };
}

export interface CareerRoadmap {
  _id: string;
  userId: string;
  careerId: string;
  careerTitle: string;
  stages: RoadmapStage[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoadmapSummary {
  careerId: string;
  careerTitle: string;
  progress: number;
  updatedAt?: string;
}

export interface RoadmapGenerateResponse {
  exists: boolean;
  careerId?: string;
  careerTitle?: string;
  progress?: number;
  roadmap?: CareerRoadmap;
}

export class RoadmapService {
  private static roadmapCache = new Map<string, { timestamp: number; data: CareerRoadmap | null }>();
  private static roadmapPromises = new Map<string, Promise<CareerRoadmap | null>>();
  private static userRoadmapsCache: { timestamp: number; data: UserRoadmapSummary[] } | null = null;
  private static userRoadmapsPromise: Promise<UserRoadmapSummary[]> | null = null;
  private static CACHE_TTL_MS = 30 * 1000; // 30 seconds cache TTL

  /**
   * Fetch active roadmap for user.
   * Caches results in memory and deduplicates in-flight requests.
   */
  public static async getRoadmap(careerId?: string): Promise<CareerRoadmap | null> {
    const cacheKey = careerId || '__active__';
    const now = Date.now();
    const cached = this.roadmapCache.get(cacheKey);
    if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    const pending = this.roadmapPromises.get(cacheKey);
    if (pending) {
      return pending;
    }

    const promise = (async () => {
      try {
        const response = await api.get('/roadmap', {
          params: { careerId }
        });
        const data = response.data.data.roadmap;
        RoadmapService.roadmapCache.set(cacheKey, { timestamp: Date.now(), data });
        return data;
      } finally {
        RoadmapService.roadmapPromises.delete(cacheKey);
      }
    })();

    this.roadmapPromises.set(cacheKey, promise);
    return promise;
  }

  /**
   * Fetch list of all existing roadmaps created by the user.
   */
  public static async getUserRoadmaps(): Promise<UserRoadmapSummary[]> {
    const now = Date.now();
    if (this.userRoadmapsCache && now - this.userRoadmapsCache.timestamp < this.CACHE_TTL_MS) {
      return this.userRoadmapsCache.data;
    }

    if (this.userRoadmapsPromise) {
      return this.userRoadmapsPromise;
    }

    this.userRoadmapsPromise = (async () => {
      try {
        const response = await api.get('/roadmap/user-roadmaps');
        const data = response.data.data.roadmaps || [];
        RoadmapService.userRoadmapsCache = { timestamp: Date.now(), data };
        return data;
      } catch (err) {
        console.warn('Could not fetch user roadmaps list:', err);
        return [];
      } finally {
        RoadmapService.userRoadmapsPromise = null;
      }
    })();

    return this.userRoadmapsPromise;
  }

  /**
   * Generate a roadmap for a career and invalidate cache.
   */
  public static async generateRoadmap(careerId: string, overwrite: boolean = false): Promise<RoadmapGenerateResponse> {
    RoadmapService.clearCache();
    const response = await api.post('/roadmap/generate', {
      careerId,
      overwrite
    });
    return response.data.data;
  }

  /**
   * Toggle a milestone completion status and invalidate cache.
   */
  public static async toggleMilestone(careerId: string, milestoneId: string, completed: boolean): Promise<CareerRoadmap> {
    RoadmapService.clearCache();
    const response = await api.post('/roadmap/toggle-milestone', {
      careerId,
      milestoneId,
      completed
    });
    return response.data.data.roadmap;
  }

  /**
   * Transition a milestone to In Progress and invalidate cache.
   */
  public static async startMilestone(careerId: string, milestoneId: string): Promise<CareerRoadmap> {
    RoadmapService.clearCache();
    const response = await api.post('/roadmap/start-milestone', {
      careerId,
      milestoneId
    });
    return response.data.data.roadmap;
  }

  /**
   * Compare roadmaps for 1 to 3 careers.
   */
  public static async compareRoadmaps(careerIds: string[]): Promise<RoadmapComparisonResponse> {
    const response = await api.post('/roadmap/compare', { careerIds });
    return response.data.data;
  }

  /**
   * Invalidate in-memory roadmap caches.
   */
  public static clearCache(): void {
    RoadmapService.roadmapCache.clear();
    RoadmapService.roadmapPromises.clear();
    RoadmapService.userRoadmapsCache = null;
    RoadmapService.userRoadmapsPromise = null;
  }
}


