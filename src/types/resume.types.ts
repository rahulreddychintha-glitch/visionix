export interface IResumeEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  grade?: string;
  description?: string;
}

export interface IResumeExperience {
  company: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
}

export interface IResumeProject {
  name: string;
  description?: string;
  technologies?: string[];
  link?: string;
  github?: string;
  highlights?: string[];
}

export interface IResumeSkills {
  technical: string[];
  soft: string[];
  tools?: string[];
}

export interface IResumeCertification {
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface IResumeLanguage {
  name: string;
  proficiency?: string;
}

export interface IResumeCustomSection {
  heading: string;
  content: string;
}

export interface IResumePersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface IResume {
  _id?: string;
  userId?: string;
  title: string;
  targetRole?: string;
  templateId?: 'modern' | 'classic' | 'minimal';
  personalInfo: IResumePersonalInfo;
  summary?: string;
  education: IResumeEducation[];
  experience: IResumeExperience[];
  projects: IResumeProject[];
  skills: IResumeSkills;
  certifications: IResumeCertification[];
  achievements: string[];
  languages: IResumeLanguage[];
  customSections: IResumeCustomSection[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IResumeListResponse {
  resumes: IResume[];
}

export interface IResumeSingleResponse {
  resume: IResume;
}

export interface IProfilePrefillResponse {
  prefill: Partial<IResume>;
}

export interface IResumeAnalysisStrength {
  title: string;
  description: string;
}

export interface IResumeAnalysisImprovement {
  section: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'achievements' | 'general';
  priority: 'high' | 'medium' | 'low';
  issue: string;
  recommendation: string;
}

export interface IResumeAnalysisAts {
  score: number;
  positiveFactors: string[];
  issues: string[];
  recommendations: string[];
}

export interface IResumeAnalysisSectionScores {
  summary: number;
  experience: number;
  skills: number;
  projects: number;
  education: number;
  overallStructure: number;
}

export interface IResumeSuggestedChange {
  id: string;
  section: string;
  fieldPath: string;
  original: string;
  suggested: string;
  reason: string;
}

export interface IResumeAnalysis {
  _id?: string;
  userId?: string;
  resumeId: string;
  overallScore: number;
  summary: string;
  targetRoleAlignment?: {
    score: number;
    role: string;
    feedback: string;
  };
  strengths: IResumeAnalysisStrength[];
  improvements: IResumeAnalysisImprovement[];
  ats: IResumeAnalysisAts;
  sectionScores: IResumeAnalysisSectionScores;
  suggestedChanges: IResumeSuggestedChange[];
  createdAt?: string | Date;
}

export interface IResumeAnalysisResponse {
  analysis: IResumeAnalysis;
}

export interface IResumeAnalysisHistoryResponse {
  history: IResumeAnalysis[];
  latest?: IResumeAnalysis | null;
}

