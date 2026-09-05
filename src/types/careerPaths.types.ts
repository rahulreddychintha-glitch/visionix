export type EducationCompatibility =
  | 'Direct Fit'
  | 'Related Transition'
  | 'Requires Additional Education';

export interface ICareerPathItem {
  id: string;
  title: string;
  category: string;
  description: string;
  overview?: string;
  relationshipType: 'alternative' | 'backup';
  matchScore: number; // 0 - 100
  relevanceReason: string;
  sharedSkills: string[];
  transferableSkills: string[];
  skillsToDevelop: string[];
  education: {
    compatibility: EducationCompatibility;
    requiredEducation: string;
    relevantDegrees: string[];
    relevantSubjects: string[];
    transitionRequirement: string;
  };
  learning: {
    recommendedSkill: string;
    hubRoute: string;
  };
  actions: {
    compareRoute: string;
    skillGapRoute: string;
    roadmapRoute: string;
  };
  metrics: {
    salaryRange: string;
    demandLevel: string;
    growthRate: string;
  };
}

export interface IPrimaryCareerInfo {
  id: string;
  title: string;
  category: string;
  description: string;
  education: string;
  skills: string[];
  salaryRange: string;
  demandLevel: string;
  growthRate: string;
  source: 'roadmap' | 'profile' | 'override' | 'none';
}

export interface ICareerPathsData {
  hasTargetCareer: boolean;
  primaryCareer: IPrimaryCareerInfo | null;
  alternatives: ICareerPathItem[];
  backupPaths: ICareerPathItem[];
  factorsExplanation: {
    domain: string;
    skills: string;
    transferableSkills: string;
    education: string;
    learning: string;
  };
  disclaimer: string;
  lastUpdated: string;
}
