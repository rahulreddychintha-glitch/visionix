export type NextActionType =
  | 'explore_careers'
  | 'create_roadmap'
  | 'complete_milestone'
  | 'continue_learning'
  | 'close_skill_gap'
  | 'take_assessment'
  | 'build_resume'
  | 'practice_interview'
  | 'explore_career_paths';

export interface INextStepPrimaryAction {
  actionType: NextActionType;
  title: string;
  description: string;
  reason: string;
  destination: string;
  navigationState?: Record<string, any>;
  relevantId?: string;
  priority: 'critical' | 'high' | 'medium' | 'normal';
  badgeText: string;
  ctaText: string;
}

export interface ICurrentPosition {
  education: {
    level: string;
    streamOrBranch?: string;
    institution?: string;
    yearOrClass?: string;
  };
  targetCareer: {
    id: string;
    title: string;
    category: string;
  } | null;
  roadmapState: {
    hasRoadmap: boolean;
    progressPercentage: number;
    currentMilestoneTitle?: string;
    totalMilestones: number;
    completedMilestones: number;
  };
  keyProgress: {
    verifiedSkillsCount: number;
    totalRequiredSkills: number;
    skillCoveragePercentage: number;
    inProgressCoursesCount: number;
    completedCoursesCount: number;
    assessmentsPassedCount: number;
    resumeStatus: string;
    interviewSessionsCount: number;
  };
}

export interface IWhyThisNextStepFactor {
  id: string;
  title: string;
  status: 'attention' | 'in_progress' | 'ready' | 'not_started';
  detail: string;
}

export interface ISecondaryAction {
  id: string;
  title: string;
  description: string;
  destination: string;
  navigationState?: Record<string, any>;
  ctaText: string;
  iconName: 'Compass' | 'GitBranch' | 'Route' | 'BookOpen' | 'FileEdit' | 'Mic' | 'Target';
}

export interface INextStepData {
  isNewStudent: boolean;
  isCompletedStudent: boolean;
  primaryAction: INextStepPrimaryAction;
  whyThisStep: {
    headline: string;
    factors: IWhyThisNextStepFactor[];
  };
  currentPosition: ICurrentPosition;
  secondaryActions: ISecondaryAction[];
  safetyDisclaimer: string;
}

export interface INextStepResponse {
  success: boolean;
  data: INextStepData;
  message?: string;
}
