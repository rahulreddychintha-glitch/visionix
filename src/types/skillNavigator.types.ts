export type SkillStatus =
  | 'Verified'
  | 'Strong'
  | 'Developing'
  | 'Needs Improvement'
  | 'Missing';

export type SkillPriority = 'Critical' | 'High' | 'Medium' | 'Supporting' | 'Low';

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

export interface ISkillLearningResource {
  title: string;
  url: string;
  provider: string;
  type: string;
  thumbnail?: string;
}

export interface ISkillRoadmapMilestone {
  stageNumber: number;
  stageTitle: string;
  milestoneTitle: string;
  status: string;
}

export interface ISkillGapSummary {
  totalRequired: number;
  existingCount: number;
  missingCount: number;
  coveragePercentage: number;
  coverageText: string;
}

export interface ISkillGapItem {
  id?: string;
  skillName: string;
  category: 'Foundational' | 'Technical' | 'Tooling' | 'Professional';
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
  learningResource?: ISkillLearningResource;
  roadmapMilestone?: ISkillRoadmapMilestone;
  learningProgressPercent?: number;
}

export interface IPrioritySkillItem {
  id?: string;
  skillName: string;
  category: 'Foundational' | 'Technical' | 'Tooling' | 'Professional';
  priority: SkillPriority;
  status: string;
  reason: string;
  quickAction: string;
  actionRoute: string;
  actionType: ActionType;
  learningResource?: ISkillLearningResource;
  roadmapMilestone?: ISkillRoadmapMilestone;
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
  hasTargetCareer: boolean;
  targetCareerId: string;
  targetCareerTitle: string;
  targetCategory: string;
  salaryRange?: string;
  growthRate?: string;
  demandLevel?: string;
  readinessScore: number;
  summary: ISkillGapSummary;
  requiredSkillsCount: number;
  strongSkillsCount: number;
  developingSkillsCount: number;
  missingSkillsCount: number;
  biggestSkillGap: string;
  biggestOpportunity: string;
  quickWin: string;
  currentSkills: ICurrentSkillsBreakdown;
  skillGaps: ISkillGapItem[];
  existingSkills: ISkillGapItem[];
  requiredSkills: ISkillGapItem[];
  missingSkills: ISkillGapItem[];
  prioritySkills: IPrioritySkillItem[];
  recommendedNextSkill?: ISkillGapItem | null;
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
