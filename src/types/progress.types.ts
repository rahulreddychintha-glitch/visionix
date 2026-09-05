export type PillarStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Ready' | 'Active Practice';

export interface ICompletedItem {
  id: string;
  pillar: 'roadmap' | 'skills' | 'courses' | 'assessments' | 'resume' | 'interview';
  title: string;
  subtitle: string;
  date?: string;
  badge?: string;
  score?: number;
}

export interface INextProgressAction {
  pillar: 'roadmap' | 'skills' | 'courses' | 'assessments' | 'resume' | 'interview';
  title: string;
  description: string;
  actionText: string;
  actionRoute: string;
  urgency: 'high' | 'medium' | 'normal';
}

export interface IPillarsSummaryItem {
  status: PillarStatus;
  label: string;
  metric: string;
}

export interface IUnifiedProgressData {
  targetCareer: {
    id: string;
    title: string;
    category: string;
    source: 'roadmap' | 'profile' | 'default';
  } | null;
  overview: {
    activePillarsCount: number; // 0 to 6
    totalPillars: 6;
    overallProgressScore: number; // 0 to 100 percentage
    calculationExplanation: string;
    pillarsSummary: {
      roadmap: IPillarsSummaryItem;
      skills: IPillarsSummaryItem;
      courses: IPillarsSummaryItem;
      assessments: IPillarsSummaryItem;
      resume: IPillarsSummaryItem;
      interview: IPillarsSummaryItem;
    };
  };
  roadmap: {
    status: PillarStatus;
    hasRoadmap: boolean;
    careerId: string | null;
    careerTitle: string | null;
    progress: number; // 0 to 100 percentage from CareerRoadmap
    totalMilestones: number;
    completedMilestonesCount: number;
    currentMilestone: {
      id: string;
      title: string;
      description: string;
      skills: string[];
      status: string;
    } | null;
    upcomingMilestones: Array<{
      id: string;
      title: string;
      description: string;
      skills: string[];
    }>;
    completedMilestones: Array<{
      id: string;
      title: string;
      status: string;
      assessmentScore?: number;
    }>;
    route: string;
  };
  skills: {
    status: PillarStatus;
    verifiedSkills: string[];
    developingSkills: string[];
    totalRequired: number;
    existingCount: number;
    missingCount: number;
    coveragePercentage: number;
    criticalMissing: string[];
    hasAnalysis: boolean;
    route: string;
  };
  learning: {
    status: PillarStatus;
    inProgressCount: number;
    completedCount: number;
    bookmarkedCount: number;
    totalStudyMinutes: number;
    streakDays: number;
    inProgressResources: Array<{
      resourceId: string;
      title: string;
      provider: string;
      type: string;
      thumbnail?: string;
      lastAccessed?: string;
    }>;
    completedResources: Array<{
      resourceId: string;
      title: string;
      provider: string;
      type: string;
      thumbnail?: string;
      completedAt?: string;
    }>;
    route: string;
  };
  assessments: {
    status: PillarStatus;
    totalCompleted: number;
    passedCount: number;
    averageScore: number | null;
    recentAssessments: Array<{
      id: string;
      title: string;
      type: string;
      score: number;
      passed: boolean;
      date: string;
    }>;
    route: string;
  };
  resume: {
    status: PillarStatus;
    resumeCount: number;
    hasResume: boolean;
    latestResume: {
      id: string;
      title: string;
      targetRole: string;
      updatedAt: string;
    } | null;
    route: string;
  };
  interview: {
    status: PillarStatus;
    totalCompleted: number;
    averageScore: number | null;
    bestScore: number | null;
    questionsAnswered: number;
    recentSessions: Array<{
      id: string;
      targetRole: string;
      interviewType: string;
      score?: number;
      date: string;
    }>;
    route: string;
  };
  completed: {
    totalCompletedCount: number;
    items: ICompletedItem[];
  };
  nextAction: INextProgressAction | null;
}

export interface IUnifiedProgressResponse {
  success: boolean;
  message: string;
  data: {
    progress: IUnifiedProgressData;
  };
}
