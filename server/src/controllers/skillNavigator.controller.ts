import { Request, Response, NextFunction } from 'express';
import { SkillNavigatorService } from '../services/skillNavigator.service';
import { sendSuccess, sendError } from '../utils/response';

export class SkillNavigatorController {
  /**
   * GET /api/skill-navigator
   * Retrieve the user's latest skill gap analysis.
   */
  public static getAnalysis = async (
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
      const careerId = req.query.careerId as string | undefined;
      const analysis = await SkillNavigatorService.getLatestAnalysis(userId, careerId);

      sendSuccess(res, 'Skill gap analysis retrieved successfully.', { analysis });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/skill-navigator/analyze
   * Generate or recalculate skill gap analysis for a specific or default career.
   */
  public static analyzeSkills = async (
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
      const { targetCareerId, includeAi } = req.body;
      const analysis = await SkillNavigatorService.analyzeUserSkillGap(
        userId,
        targetCareerId,
        includeAi === true
      );

      sendSuccess(res, 'Skill gap analysis generated successfully.', { analysis }, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/skill-navigator/history
   * Retrieve historical skill gap analyses for progress comparison.
   */
  public static getHistory = async (
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
      const history = await SkillNavigatorService.getAnalysisHistory(userId);

      sendSuccess(res, 'Skill gap history retrieved successfully.', { history });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/skill-navigator/careers
   * Retrieve all career comparisons with user match scores.
   */
  public static getCareers = async (
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
      const comparisons = await SkillNavigatorService.getCareerComparisons(userId);

      sendSuccess(res, 'Career comparisons retrieved successfully.', { comparisons });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/skill-navigator/coach
   * Ask the AI Skill Coach a targeted career question.
   */
  public static askCoach = async (
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
      const { question, careerId } = req.body;
      const coachResponse = await SkillNavigatorService.askSkillCoach(
        userId,
        question,
        careerId
      );

      sendSuccess(res, 'Skill coach response generated.', { ...coachResponse });
    } catch (error) {
      next(error);
    }
  };
}
