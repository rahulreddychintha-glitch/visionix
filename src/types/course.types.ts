import type { ResourceDifficulty } from './learning.types';

export interface IRecommendedCourseItem {
  resourceId: string;
  title: string;
  description: string;
  url: string;
  provider: string;
  type: string;
  thumbnail?: string;
  channel?: string;
  careerIds: string[];
  skills: string[];
  educationLevels: string[];
  topicCategory: string;
  difficulty: ResourceDifficulty;
  duration?: string;
  tags: string[];
  relevanceScore: number;
  recommendationReason: string;
  priorityLevel: 'Critical' | 'High' | 'Medium' | 'Supporting' | 'General';
  primaryTargetSkill: string;
  coveredMissingSkills: string[];
  isBookmarked: boolean;
  progressStatus: 'not_started' | 'in_progress' | 'completed';
  startedAt?: string;
  completedAt?: string | null;
  roadmapMilestone?: {
    stageNumber: number;
    stageTitle: string;
    milestoneTitle: string;
  };
}

export interface ISkillBasedCourseGroup {
  skillName: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Supporting';
  status: 'Missing' | 'Developing' | 'Target Required';
  coursesCount: number;
  courses: IRecommendedCourseItem[];
}

export interface ICourseRecommendationsResponse {
  hasTargetCareer: boolean;
  is100PercentCovered: boolean;
  targetCareer: {
    id: string;
    title: string;
    category: string;
    salaryRange?: string;
    demandLevel?: string;
  } | null;
  educationStage: string;
  summary: {
    totalRecommended: number;
    totalGapsTargeted: number;
    totalMissingGaps: number;
    coveragePercentage: number;
    topMissingSkill: string | null;
  };
  topPriorityCourses: IRecommendedCourseItem[];
  skillBasedRecommendations: ISkillBasedCourseGroup[];
  allRecommendedCourses: IRecommendedCourseItem[];
  availableFilters: {
    skills: string[];
    difficulties: string[];
    providers: string[];
    categories: string[];
    careers: Array<{ id: string; title: string }>;
  };
}

export interface ICourseFilterOptions {
  careerId?: string;
  skill?: string;
  difficulty?: string;
  provider?: string;
  search?: string;
  resourceType?: string;
}
