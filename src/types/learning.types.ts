export type ResourceDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface IEnrichedLearningResource {
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
  relevanceScore?: number;
  relevanceReason?: string;
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

export interface IPrioritySkillItem {
  name: string;
  count: number;
  priority: string;
}

export interface IRecommendedNextStep {
  milestoneTitle: string;
  targetSkill: string;
  reason: string;
  resource: IEnrichedLearningResource | null;
}

export interface IAvailableFilters {
  careers: Array<{ id: string; title: string }>;
  skills: string[];
  categories: string[];
  resourceTypes: string[];
  difficulties: string[];
  providers: string[];
}

export interface LearningHubData {
  targetCareer: { id: string; title: string; category: string } | null;
  educationContext: { level?: string; stream?: string; branchSpecialization?: string } | null;
  recommendedNextStep: IRecommendedNextStep | null;
  priorityMissingSkills: IPrioritySkillItem[];
  recommendedResources: IEnrichedLearningResource[];
  catalog: IEnrichedLearningResource[];
  continueLearning: IEnrichedLearningResource[];
  completedLearning: IEnrichedLearningResource[];
  bookmarkedResources: IEnrichedLearningResource[];
  availableFilters: IAvailableFilters;
  // Backward compatibility fields
  dreamCareer?: string | null;
  hasRoadmap?: boolean;
}

export interface ILearningFilterParams {
  search?: string;
  career?: string;
  skill?: string;
  educationLevel?: string;
  resourceType?: string;
  difficulty?: string;
  topicCategory?: string;
  provider?: string;
}
