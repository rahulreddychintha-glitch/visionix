import { Request, Response, NextFunction } from 'express';
import { ProgressService } from '../services/progress.service';
import { sendSuccess, sendError } from '../utils/response';

export class ProgressController {
  /**
   * GET /api/progress
   * Retrieves unified, authoritative progress across Skills, Courses,
   * Roadmap, Assessments, Resume, and Interview Preparation.
   */
  public static getUnifiedProgress = async (
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
      const careerId = typeof req.query.careerId === 'string' ? req.query.careerId : undefined;

      const progress = await ProgressService.getUnifiedProgress(userId, careerId);

      sendSuccess(res, 'Unified progress retrieved successfully.', { progress });
    } catch (error) {
      next(error);
    }
  };
}
