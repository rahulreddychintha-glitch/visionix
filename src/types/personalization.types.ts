import type { IVerifiedSkill } from './profile.types';

export interface PersonalizationContextData {
  userId: string;
  name: string;
  discipline: string;
  specialization: string;
  educationLevel: string;
  studentStatus: string;
  institution: string;
  dreamCareer: string;
  currentOccupation: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  skills: {
    technicalSkills: string[];
    softSkills: string[];
    languages: string[];
    certifications: string[];
    verifiedSkills?: IVerifiedSkill[];
  };
  interests: {
    careerInterests: string[];
    favouriteSubjects: string[];
    technologies: string[];
    industries: string[];
  };
  careerGoals: {
    dreamCareer: string;
    preferredIndustries: string[];
    salaryGoal: string;
    careerObjectives: string;
    preferredJobType: string;
    preferredLocation: string;
    longTermAspirations: string;
  };
  learningPreferences: {
    learningStyle: string;
    weeklyStudyTime: number;
    preferredResources: string[];
  };
  workPreferences: {
    remoteHybridOffice: string;
    startupEnterprise: string;
    teamSize: string;
  };
  userPreferences: {
    theme: string;
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReport: boolean;
  };
  hasCompletedOnboarding: boolean;
  learningProgress: {
    completedResources: string[];
    bookmarkedResources: string[];
    streakDays: number;
    totalStudyMinutes: number;
    lastStudyDate: string | null;
  } | null;
  careerProgress: {
    selectedCareer: string | null;
    currentPhase: number;
    completedMilestones: string[];
    totalMilestones: number;
    lastActivity: string;
  } | null;
}

export interface RecommendationInsights {
  topCareers: Array<{
    id: string;
    title: string;
    matchScore: number;
    stars: string;
    reason: string;
    category: string;
  }>;
  skillGap: {
    currentSkills: string[];
    expectedSkills: string[];
    missingSkills: string[];
  };
  smartSuggestions: Array<{
    id: string;
    label: string;
    category: string;
  }>;
  summarySentences: string[];
}

export interface PersonalizationApiResponse {
  context: PersonalizationContextData;
  recommendations: RecommendationInsights;
}
