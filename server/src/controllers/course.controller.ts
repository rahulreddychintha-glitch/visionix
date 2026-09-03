import { Request, Response, NextFunction } from 'express';
import { CourseRecommendationService, ICourseFilterOptions } from '../services/courseRecommendation.service';
import { LearningResource } from '../models/LearningResource';
import { sendSuccess, sendError } from '../utils/response';

export class CourseController {
  /**
   * GET /api/courses/recommendations
   * Retrieves personalized course recommendations driven by Phase 23 Skill Gap & Target Career
   */
  public static getRecommendedCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const options: ICourseFilterOptions = {
        careerId: req.query.careerId as string | undefined,
        skill: req.query.skill as string | undefined,
        difficulty: req.query.difficulty as string | undefined,
        provider: req.query.provider as string | undefined,
        search: req.query.search as string | undefined,
        resourceType: req.query.resourceType as string | undefined,
      };

      const result = await CourseRecommendationService.getCourseRecommendations(userId, options);

      sendSuccess(res, 'Course recommendations retrieved successfully.', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/courses/:resourceId
   * Retrieves verified course details
   */
  public static getCourseDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { resourceId } = req.params;
      if (!resourceId) {
        sendError(res, 'Resource ID is required.', [], 400);
        return;
      }

      const resource = await LearningResource.findOne({ resourceId });
      if (!resource) {
        sendError(res, 'Course resource not found.', [], 404);
        return;
      }

      sendSuccess(res, 'Course details retrieved successfully.', resource);
    } catch (error) {
      next(error);
    }
  };
}
