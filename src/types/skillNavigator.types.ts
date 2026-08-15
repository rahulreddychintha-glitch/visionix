export type SkillStatus =
  | 'Verified'
  | 'Strong'
  | 'Developing'
  | 'Needs Improvement'
  | 'Missing';

export type SkillPriority = 'High' | 'Medium' | 'Low';

export type ActionType =
  | 'assessment'
  | 'learning'
  | 'roadmap'
  | 'interview'
  | 'project'
  | 'practice';

export interface IVerifiedSkillItem {
  name: string;
  score?: number;
  verifiedAt: string;
  source?: string;
}

export interface ICurrentSkillsBreakdown {
  verified: IVerifiedSkillItem[];
  profile: string[];
  developing: string[];
}

export interface ISkillGapItem {
  skillName: string;
  status: SkillStatus;
  priority: SkillPriority;
  currentLevel: string;
  requiredLevel: string;
  whyItMatters: string;
  isVerified: boolean;
  recommendedAction: string;
  actionType: ActionType;
  actionRoute: string;
  hasAssessment: boolean;
  hasLearningResource: boolean;
}

export interface IPrioritySkillItem {
  skillName: string;
  priority: SkillPriority;
  status: string;
  reason: string;
  quickAction: string;
  actionRoute: string;
  actionType: ActionType;
}

export interface INextStepItem {
  id: string;
  title: string;
  description: string;
  actionType: ActionType;
  targetRoute: string;
  targetSkill: string;
  actionText: string;
  priority: SkillPriority;
}

export interface ICareerComparisonItem {
  careerId: string;
  title: string;
  category: string;
  matchScore: number;
  strongSkillsCount: number;
  missingSkillsCount: number;
  topMissingSkill?: string;
  demandLevel?: string;
}

export interface IAiSkillInsight {
  summary: string;
  missingSkillsInsight: string;
  whyItMattersInsight: string;
  recommendedActionPlan: string;
  generatedAt: string;
  aiProviderUsed: 'gemini' | 'unconfigured' | 'deterministic_fallback';
}

export interface ISkillGapAnalysis {
  _id?: string;
  userId: string;
  targetCareerId: string;
  targetCareerTitle: string;
  targetCategory: string;
  readinessScore: number;
  requiredSkillsCount: number;
  strongSkillsCount: number;
  developingSkillsCount: number;
  missingSkillsCount: number;
  biggestSkillGap: string;
  biggestOpportunity: string;
  quickWin: string;
  currentSkills: ICurrentSkillsBreakdown;
  skillGaps: ISkillGapItem[];
  prioritySkills: IPrioritySkillItem[];
  nextSteps: INextStepItem[];
  careerComparisons: ICareerComparisonItem[];
  aiAnalysis?: IAiSkillInsight;
  createdAt: string;
  updatedAt: string;
}

export interface ISkillCoachResponse {
  answer: string;
  suggestedQuestions: string[];
  aiProviderUsed: string;
}
