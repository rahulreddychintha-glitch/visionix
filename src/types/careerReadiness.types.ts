export type ReadinessStage =
  | 'Getting Started'
  | 'Building Foundation'
  | 'Progressing Well'
  | 'Advanced Preparation';

export interface ICareerReadinessContributor {
  id: 'skills' | 'learning' | 'roadmap' | 'assessments' | 'resume' | 'interview';
  name: string;
  score: number; // 0 - 100
  weight: number; // e.g. 25, 15, 10
  weightedScore: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Ready' | 'Active Practice';
  summary: string;
  detail: string;
  route: string;
  metrics: Record<string, any>;
}

export interface IReadinessGap {
  id: string;
  contributor: 'skills' | 'learning' | 'roadmap' | 'assessments' | 'resume' | 'interview';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  actionLabel: string;
  actionRoute: string;
}

export interface IReadinessStrength {
  id: string;
  contributor: 'skills' | 'learning' | 'roadmap' | 'assessments' | 'resume' | 'interview';
  title: string;
  description: string;
}

export interface ICareerReadinessData {
  targetCareer: {
    id: string;
    title: string;
    source: 'roadmap' | 'profile' | 'default' | 'none';
    category?: string;
    salaryRange?: string;
    demandLevel?: string;
  } | null;
  overallScore: number; // 0 - 100
  readinessStage: ReadinessStage;
  stageDescription: string;
  disclaimer: string;
  contributors: ICareerReadinessContributor[];
  strongAreas: IReadinessStrength[];
  areasNeedingAttention: IReadinessGap[];
  whyThisResult: string;
  nextAction: {
    contributor: string;
    title: string;
    description: string;
    actionLabel: string;
    actionRoute: string;
  };
  lastUpdated: string;
}

export interface ICareerReadinessResponse {
  success: boolean;
  data: {
    readiness: ICareerReadinessData;
  };
}
