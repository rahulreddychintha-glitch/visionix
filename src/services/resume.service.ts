import api from './api';
import type {
  IResume,
  IResumeListResponse,
  IResumeSingleResponse,
  IProfilePrefillResponse,
  IResumeAnalysis,
  IResumeAnalysisResponse,
  IResumeAnalysisHistoryResponse,
} from '../types/resume.types';

export class ResumeService {
  /**
   * Retrieve all resumes for the authenticated user.
   */
  public static async getResumes(): Promise<IResume[]> {
    const response = await api.get<{ success: boolean; data: IResumeListResponse }>('/resume');
    return response.data.data.resumes;
  }

  /**
   * Retrieve a single resume by ID.
   */
  public static async getResume(id: string): Promise<IResume> {
    const response = await api.get<{ success: boolean; data: IResumeSingleResponse }>(`/resume/${id}`);
    return response.data.data.resume;
  }

  /**
   * Retrieve profile prefill data.
   */
  public static async getProfilePrefill(): Promise<Partial<IResume>> {
    const response = await api.get<{ success: boolean; data: IProfilePrefillResponse }>('/resume/prefill');
    return response.data.data.prefill;
  }

  /**
   * Create a new resume.
   */
  public static async createResume(data: Partial<IResume> = {}, prefillFromProfile = false): Promise<IResume> {
    const response = await api.post<{ success: boolean; data: IResumeSingleResponse }>('/resume', data, {
      params: { prefill: prefillFromProfile ? 'true' : 'false' },
    });
    return response.data.data.resume;
  }

  /**
   * Update an existing resume.
   */
  public static async updateResume(id: string, data: Partial<IResume>): Promise<IResume> {
    const response = await api.put<{ success: boolean; data: IResumeSingleResponse }>(`/resume/${id}`, data);
    return response.data.data.resume;
  }

  /**
   * Delete an existing resume.
   */
  public static async deleteResume(id: string): Promise<boolean> {
    const response = await api.delete<{ success: boolean }>(`/resume/${id}`);
    return response.data.success;
  }

  /**
   * Trigger AI Resume Analysis using Gemini infrastructure.
   */
  public static async analyzeResume(resumeId: string): Promise<IResumeAnalysis> {
    const response = await api.post<{ success: boolean; data: IResumeAnalysisResponse }>(
      `/resume/${resumeId}/analyze`
    );
    return response.data.data.analysis;
  }

  /**
   * Retrieve previous analysis history for a resume.
   */
  public static async getAnalysisHistory(resumeId: string): Promise<{ history: IResumeAnalysis[]; latest?: IResumeAnalysis | null }> {
    const response = await api.get<{ success: boolean; data: IResumeAnalysisHistoryResponse }>(
      `/resume/${resumeId}/analysis`
    );
    return response.data.data;
  }
}

