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

export interface RoadmapGenerateResponse {
  exists: boolean;
  careerId?: string;
  careerTitle?: string;
  progress?: number;
  roadmap?: CareerRoadmap;
}

export class RoadmapService {
  /**
   * Fetch active roadmap for user.
   */
  public static async getRoadmap(careerId?: string): Promise<CareerRoadmap | null> {
    const response = await api.get('/roadmap', {
      params: { careerId }
    });
    return response.data.data.roadmap;
  }

  /**
   * Generate a roadmap for a career.
   */
  public static async generateRoadmap(careerId: string, overwrite: boolean = false): Promise<RoadmapGenerateResponse> {
    const response = await api.post('/roadmap/generate', {
      careerId,
      overwrite
    });
    return response.data.data;
  }

  /**
   * Toggle a milestone completion status.
   */
  public static async toggleMilestone(careerId: string, milestoneId: string, completed: boolean): Promise<CareerRoadmap> {
    const response = await api.post('/roadmap/toggle-milestone', {
      careerId,
      milestoneId,
      completed
    });
    return response.data.data.roadmap;
  }

  /**
   * Transition a milestone to In Progress.
   */
  public static async startMilestone(careerId: string, milestoneId: string): Promise<CareerRoadmap> {
    const response = await api.post('/roadmap/start-milestone', {
      careerId,
      milestoneId
    });
    return response.data.data.roadmap;
  }
}

