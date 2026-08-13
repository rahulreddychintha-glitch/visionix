export interface LearningResource {
  resourceId: string;
  title: string;
  description: string;
  url: string;
  provider: string; // e.g. 'YouTube'
  type: string; // e.g. 'Video'
  thumbnail?: string;
  channel?: string;
  publishedAt?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  startedAt?: string;
  lastAccessed?: string;
  completedAt?: string | null;
}

export interface NextLearningStep {
  milestoneTitle: string;
  milestoneDescription: string;
  requiredSkills: string[];
  learningObjectives: string[];
  reason: string;
}

export interface RecommendedSkill {
  name: string;
  reason: string;
}

export interface LearningHubData {
  dreamCareer: string | null;
  hasRoadmap: boolean;
  nextLearningStep: NextLearningStep | null;
  recommendedSkills: RecommendedSkill[];
  continueLearning: LearningResource[];
  completedLearning: LearningResource[];
  bookmarkedResources: LearningResource[];
  youtubeVideos: any[]; // Matches YouTube API response structure
  youtubeQuery: string;
  youtubeError?: string | null;
}
