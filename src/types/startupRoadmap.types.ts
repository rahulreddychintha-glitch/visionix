export type RoadmapStatus = 'planning' | 'active' | 'paused' | 'completed';
export type MilestoneStatus = 'locked' | 'upcoming' | 'active' | 'completed';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface IStartupTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedMinutes?: number;
  dueDate?: string | null;
  completedAt?: string | null;
  resources?: { title: string; url: string; type?: string }[];
  aiGenerated?: boolean;
  order: number;
}

export interface IStartupMilestone {
  id: string;
  title: string;
  description: string;
  stage: string;
  order: number;
  status: MilestoneStatus;
  progress: number;
  estimatedDays?: number;
  tasks: IStartupTask[];
  resources?: { title: string; url: string }[];
  notes?: string;
}

export interface IStartupRoadmap {
  _id: string;
  userId: string;
  businessIdeaId?: string;
  title: string;
  description: string;
  founderRole?: string;
  industry: string;
  businessModel: string;
  currentStage: string;
  overallProgress: number;
  status: RoadmapStatus;
  milestones: IStartupMilestone[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface INextStepRecommendation {
  id: string;
  title: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  estimatedMinutes: number;
  milestoneTitle: string;
  milestoneId: string;
}

export interface IBusinessValidationResult {
  validationScore: number;
  metricScores: {
    problemClarity: number;
    solutionClarity: number;
    targetCustomerClarity: number;
    feasibility: number;
    differentiation: number;
  };
  summary: string;
  strengths: string[];
  risks: string[];
  missingInformation: string[];
  recommendedSteps: string[];
}

export interface IPitchGenerationResult {
  pitchType: 'one_liner' | 'elevator' | 'pitch_deck' | 'business_plan';
  title: string;
  oneLiner?: string;
  elevatorPitch?: string;
  sections: { title: string; content: string; missingFields?: string[] }[];
  generatedAt: string;
}

export interface IAssistantChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}
