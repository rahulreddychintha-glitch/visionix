export interface IPersonalProfile {
  fullName?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
}

export interface IEducationProfile {
  level?: string;
  studentStatus?: string;
  institution?: string;
  stream?: string;
  branchSpecialization?: string;
  currentOccupation?: string;
  graduationYear?: number | string;
  higherEducationPlans?: string;
}

export interface IExperienceProfile {
  yearsOfExperience?: string | number;
  currentRole?: string;
}

export interface IInterestsProfile {
  careerInterests: string[];
  favouriteSubjects: string[];
  technologies: string[];
  industries: string[];
}

export interface IPortfolioLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  other?: string;
}

export interface IVerifiedSkill {
  name: string;
  verifiedAt: string | Date;
  source: string;
  assessmentId?: string;
  careerId?: string;
  milestoneId?: string;
  score?: number;
}

export interface ISkillsProfile {
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  certifications?: string[];
  portfolioLinks?: IPortfolioLinks;
  skillLevels?: Record<string, string>;
  verifiedSkills?: IVerifiedSkill[];
}

export interface ICareerGoalsProfile {
  dreamCareer?: string;
  preferredIndustries: string[];
  salaryGoal?: string;
  careerObjectives?: string;
  preferredJobType?: string;
  preferredLocation?: string;
  longTermAspirations?: string;
  careerConfidence?: number;
}

export interface ILearningPreferences {
  learningStyle?: string;
  learningPace?: string;
  weeklyStudyTime?: number | string;
  preferredResources: string[];
}

export interface IWorkPreferences {
  remoteHybridOffice?: string;
  startupEnterprise?: string;
  teamSize?: string;
}

export interface IOnboardingStatus {
  currentStep: number;
  completed: boolean;
  completedAt?: string | Date;
  lastSavedAt?: string | Date;
}

export interface IUserProfileData {
  _id?: string;
  userId?: string;
  personal?: IPersonalProfile;
  education?: IEducationProfile;
  experience?: IExperienceProfile;
  interests?: IInterestsProfile;
  skills?: ISkillsProfile;
  careerGoals?: ICareerGoalsProfile;
  learningPreferences?: ILearningPreferences;
  workPreferences?: IWorkPreferences;
  onboarding?: IOnboardingStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
