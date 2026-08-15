export interface IAccountData {
  fullName: string;
  email: string;
  avatar?: string;
  role: string;
  isOnboarded: boolean;
  createdAt: string;
}

export interface IProfileData {
  personal: {
    fullName?: string;
    country?: string;
    state?: string;
    city?: string;
    gender?: string;
  };
  education: {
    level?: string;
    studentStatus?: string;
    institution?: string;
    stream?: string;
    branchSpecialization?: string;
    currentOccupation?: string;
    graduationYear?: number;
  };
  experience?: {
    yearsOfExperience?: string;
    currentRole?: string;
  };
  careerGoals?: {
    dreamCareer?: string;
    preferredIndustries?: string[];
    salaryGoal?: string;
    preferredLocation?: string;
  };
}

export interface IPreferencesData {
  theme: 'dark' | 'light' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  careerUpdates: boolean;
  learningReminders: boolean;
  assessmentReminders: boolean;
  interviewReminders: boolean;
  businessUpdates: boolean;
  aiRecommendationsEnabled: boolean;
  aiPersonalizedSuggestions: boolean;
  aiLearningAssistance: boolean;
}

export interface ISettingsResponse {
  account: IAccountData;
  profile: IProfileData;
  preferences: IPreferencesData;
}
