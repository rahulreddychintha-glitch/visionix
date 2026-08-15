import { Request, Response, NextFunction } from 'express';
import { ResumeAnalysisService } from '../services/resumeAnalysis.service';
import { sendSuccess, sendError } from '../utils/response';

export class ResumeAnalysisController {
  /**
   * POST /api/resume/:id/analyze
   * Trigger AI-powered resume auditing for the specified resume.
   */
  public static analyzeResume = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const resumeId = req.params.id;

      const analysis = await ResumeAnalysisService.analyzeResume(userId, resumeId);
      sendSuccess(res, 'Resume analysis generated successfully.', { analysis });
    } catch (error: any) {
      if (error?.message?.includes('access denied') || error?.message?.includes('not found')) {
        sendError(res, error.message, [], 404);
        return;
      }
      next(error);
    }
  };

  /**
   * GET /api/resume/:id/analysis
   * Retrieve all previous analysis records for the specified resume.
   */
  public static getAnalysisHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const resumeId = req.params.id;

      const history = await ResumeAnalysisService.getAnalysisHistory(userId, resumeId);
      const latest = history.length > 0 ? history[0] : null;

      sendSuccess(res, 'Resume analysis history retrieved.', { history, latest });
    } catch (error) {
      next(error);
    }
  };
}
