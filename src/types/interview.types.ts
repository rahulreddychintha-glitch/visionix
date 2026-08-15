export type InterviewType = 'mock' | 'technical' | 'behavioral' | 'resume_based' | 'mixed';
export type InterviewDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned';

export interface IInterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  focusArea: string;
}

export interface IStarAssessment {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface IInterviewAnswer {
  questionId: string;
  answer: string;
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  starAssessment?: IStarAssessment;
}

export interface ICategoryScores {
  technical: number;
  communication: number;
  problemSolving: number;
  roleAlignment: number;
  clarity: number;
}

export interface IWeakArea {
  topic: string;
  score: number;
  recommendation: string;
}

export interface IInterview {
  _id: string;
  userId: string;
  resumeId?: string;
  targetRole: string;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  questionCount: number;
  focusAreas: string[];
  timerSeconds: number;
  timeSpentSeconds: number;
  status: InterviewStatus;
  questions: IInterviewQuestion[];
  answers: IInterviewAnswer[];
  overallScore?: number;
  categoryScores?: ICategoryScores;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  weakAreas?: IWeakArea[];
  createdAt: string | Date;
  completedAt?: string | Date;
}

export interface IInterviewProgress {
  totalCompleted: number;
  averageScore: number;
  bestScore: number;
  questionsAnswered: number;
  recentScores: {
    id: string;
    date: string | Date;
    score: number;
    type: InterviewType;
    role: string;
    difficulty: string;
  }[];
  weakAreas: IWeakArea[];
  interviewTypeBreakdown: Record<string, number>;
}

export interface IGenerateInterviewRequest {
  targetRole: string;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  questionCount: number;
  focusAreas?: string[];
  timerSeconds?: number;
  resumeId?: string;
}

export interface IEvaluateInterviewRequest {
  answers: { questionId: string; answer: string }[];
  timeSpentSeconds?: number;
}

export interface IInterviewSingleResponse {
  interview: IInterview;
}

export interface IInterviewListResponse {
  interviews: IInterview[];
}

export interface IInterviewProgressResponse {
  progress: IInterviewProgress;
}
