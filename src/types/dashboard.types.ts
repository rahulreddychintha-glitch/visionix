export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  username?: string;
  phone?: string;
  bio?: string;
  timezone?: string;
  language?: string;
}

export interface StatCardData {
  title: string;
  value: string | number;
  trend?: string;
  trendPositive?: boolean;
  subtext: string;
  color: string;
  sparklinePoints: number[];
  hasProgress?: boolean;
  progress?: number;
}

export interface AssistantMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export interface AssistantData {
  messages: AssistantMessage[];
  isOnline: boolean;
}

export interface CareerRecommendationData {
  title: string;
  description: string;
  matchPercentage: number;
  salaryRange: string;
  difficulty: string;
  estimatedTime: string;
  expectedGrowth: string;
  learningProgress: number;
  topSkills: string[];
}

export interface RoadmapMilestone {
  title: string;
  duration: string;
  description: string;
  skills: string[];
  completed: boolean;
  status: 'completed' | 'active' | 'locked';
}

export interface LearningResourceData {
  provider: string;
  title: string;
  duration: string;
  difficulty: string;
  rating: number;
  continueUrl: string;
  categoryColor: string;
}

export interface ScholarshipData {
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string;
  link: string;
}

export interface TrendingCareerData {
  title: string;
  growth: string;
  matchScore: number;
}

export interface DashboardData {
  stats: StatCardData[];
  assistant: AssistantData;
  careerRecommendation: CareerRecommendationData;
  roadmap: RoadmapMilestone[];
  learningResources: LearningResourceData[];
  scholarships: ScholarshipData[];
  trendingCareers: TrendingCareerData[];
}
