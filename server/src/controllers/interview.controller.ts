import { Request, Response, NextFunction } from 'express';
import { InterviewService } from '../services/interview.service';
import { sendSuccess, sendError } from '../utils/response';

export class InterviewController {
  /**
   * POST /api/interview/generate
   * Generate an AI-powered interview session.
   */
  public static generateInterview = async (
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
      const interview = await InterviewService.generateInterview(userId, req.body);
      sendSuccess(res, 'Interview generated successfully.', { interview }, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/interview
   * Retrieve all interview sessions for the authenticated user.
   */
  public static getInterviews = async (
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
      const interviews = await InterviewService.getInterviews(userId);
      sendSuccess(res, 'Interviews retrieved successfully.', { interviews });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/interview/progress
   * Retrieve real interview analytics and progress for the authenticated user.
   */
  public static getProgress = async (
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
      const progress = await InterviewService.getProgress(userId);
      sendSuccess(res, 'Interview progress retrieved successfully.', { progress });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/interview/:id
   * Retrieve a specific interview session by ID.
   */
  public static getInterview = async (
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
      const interview = await InterviewService.getInterview(userId, req.params.id);

      if (!interview) {
        sendError(res, 'Interview session not found or access denied.', [], 404);
        return;
      }

      sendSuccess(res, 'Interview session retrieved successfully.', { interview });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/interview/:id/evaluate
   * Submit answers for server-side Gemini evaluation.
   */
  public static evaluateInterview = async (
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
      const interviewId = req.params.id;
      const { answers, timeSpentSeconds } = req.body;

      const evaluated = await InterviewService.evaluateInterview(
        userId,
        interviewId,
        answers,
        timeSpentSeconds
      );

      sendSuccess(res, 'Interview answers evaluated successfully.', { interview: evaluated });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/interview/:id/retry
   * Retry an interview session or practice identified weak areas.
   */
  public static retryInterview = async (
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
      const interviewId = req.params.id;
      const { focusWeakAreas } = req.body;

      const newInterview = await InterviewService.retryInterview(
        userId,
        interviewId,
        Boolean(focusWeakAreas)
      );

      sendSuccess(res, 'New interview practice session started.', { interview: newInterview }, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/interview/:id
   * Delete an interview session.
   */
  public static deleteInterview = async (
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
      const success = await InterviewService.deleteInterview(userId, req.params.id);

      if (!success) {
        sendError(res, 'Interview not found or could not be deleted.', [], 404);
        return;
      }

      sendSuccess(res, 'Interview session deleted successfully.', { success: true });
    } catch (error) {
      next(error);
    }
  };
}
