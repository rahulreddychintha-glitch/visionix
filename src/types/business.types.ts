export type BusinessDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type StartupPotential = 'High' | 'Medium' | 'Niche';
export type BusinessModelType = 'B2B' | 'B2C' | 'B2B2C' | 'Marketplace' | 'SaaS' | 'Subscription' | 'Other';
export type EstimatedComplexity = 'Low' | 'Medium' | 'High';
export type EntrepreneurshipExperience = 'Beginner' | 'Exploring' | 'Some Experience' | 'Experienced';
export type AvailableTime = 'Less than 5 hours/week' | '5–10 hours/week' | '10–20 hours/week' | '20+ hours/week';
export type StartupStage = 'Exploring' | 'Idea' | 'Validation' | 'MVP' | 'Early Launch' | 'Growth';

export type OpportunityType =
  | 'grant'
  | 'hackathon'
  | 'incubator'
  | 'accelerator'
  | 'competition'
  | 'fellowship'
  | 'startup_program'
  | 'scholarship'
  | 'founder_resource'
  | 'other';

export type OpportunityDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface IBusinessIdeaResource {
  title: string;
  url: string;
  type: 'article' | 'tool' | 'guide' | 'template' | 'other';
}

export interface IBusinessIdea {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  industry: string;
  problem: string;
  solution: string;
  targetAudience: string[];
  requiredSkills: string[];
  recommendedSkills: string[];
  difficulty: BusinessDifficulty;
  startupPotential: StartupPotential;
  businessModel: BusinessModelType;
  estimatedComplexity: EstimatedComplexity;
  tags: string[];
  resources: IBusinessIdeaResource[];
  source?: string;
  sourceUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBusinessOpportunity {
  _id: string;
  title: string;
  organization: string;
  description: string;
  opportunityType: OpportunityType;
  category: string;
  industries: string[];
  eligibleFor: string[];
  requiredSkills: string[];
  location: string;
  isOnline: boolean;
  applicationUrl: string;
  officialWebsite: string;
  deadline: string | null;
  isOpen: boolean;
  difficulty: OpportunityDifficulty;
  benefits: string[];
  eligibility: string[];
  tags: string[];
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICurrentStartupIdea {
  title?: string;
  description?: string;
  stage?: StartupStage;
  targetMarket?: string;
}

export interface IBusinessProfile {
  _id?: string;
  userId: string;
  interestedIndustries: string[];
  interests: string[];
  preferredBusinessTypes: string[];
  entrepreneurshipExperience: EntrepreneurshipExperience;
  goals: string[];
  availableTime: AvailableTime;
  preferredStartupStage: StartupStage;
  savedBusinessIdeas: (IBusinessIdea | string)[];
  savedOpportunities: (IBusinessOpportunity | string)[];
  currentStartupIdea?: ICurrentStartupIdea;
  onboardingCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBusinessIdeaFilters {
  category?: string;
  industry?: string;
  difficulty?: BusinessDifficulty;
  startupPotential?: StartupPotential;
  businessModel?: BusinessModelType;
  skills?: string;
  sortBy?: 'best_match' | 'newest' | 'potential' | 'difficulty' | 'alphabetical';
  search?: string;
  page?: number;
  limit?: number;
}

export interface IBusinessOpportunityFilters {
  search?: string;
  opportunityType?: OpportunityType;
  category?: string;
  industry?: string;
  location?: string;
  isOnline?: boolean;
  difficulty?: OpportunityDifficulty;
  skills?: string;
  sortBy?: 'best_match' | 'deadline' | 'newest' | 'featured' | 'alphabetical';
  page?: number;
  limit?: number;
}

export interface ISkillMatchResult {
  totalRequired: number;
  matchedCount: number;
  matchingSkills: string[];
  missingSkills: string[];
  verifiedMatchingSkills: string[];
  matchScore: number;
  matchReasons: string[];
}

export interface IBusinessOpportunityMatch extends ISkillMatchResult {
  deadlineStatus: 'open' | 'closing_soon' | 'passed' | 'no_deadline';
  daysLeft: number | null;
}

export interface IBusinessIdeaListResponse {
  ideas: IBusinessIdea[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IBusinessOpportunityListResponse {
  opportunities: IBusinessOpportunity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IBusinessProfileResponse {
  profile: IBusinessProfile;
}

export interface IBusinessIdeaSingleResponse {
  idea: IBusinessIdea;
}

export interface IBusinessOpportunitySingleResponse {
  opportunity: IBusinessOpportunity;
}
