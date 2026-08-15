import { Request, Response, NextFunction } from 'express';
import { StartupRoadmapService } from '../services/startupRoadmap.service';
import { sendSuccess, sendError } from '../utils/response';

export class StartupRoadmapController {
  /**
   * POST /api/business/roadmaps/generate
   * Generates a startup roadmap from a curated business idea.
   */
  public static generateRoadmap = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const { businessIdeaId } = req.body;
      if (!businessIdeaId) {
        sendError(res, 'businessIdeaId is required.', [], 400);
        return;
      }

      const roadmap = await StartupRoadmapService.generateRoadmapFromBusinessIdea(
        req.user.sub,
        businessIdeaId
      );
      sendSuccess(res, 'Startup roadmap generated successfully.', { roadmap }, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/business/roadmaps
   * Retrieves all roadmaps owned by the user.
   */
  public static getRoadmaps = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const roadmaps = await StartupRoadmapService.getRoadmaps(req.user.sub);
      sendSuccess(res, 'Roadmaps retrieved successfully.', { roadmaps });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/business/roadmaps/:id
   * Retrieves a single roadmap by ID.
   */
  public static getRoadmapById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const roadmap = await StartupRoadmapService.getRoadmapById(req.user.sub, req.params.id);
      if (!roadmap) {
        sendError(res, 'Roadmap not found.', [], 404);
        return;
      }

      sendSuccess(res, 'Roadmap retrieved successfully.', { roadmap });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/business/roadmaps/:id
   * Updates basic fields of a roadmap.
   */
  public static updateRoadmap = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const roadmap = await StartupRoadmapService.updateRoadmap(
        req.user.sub,
        req.params.id,
        req.body
      );
      if (!roadmap) {
        sendError(res, 'Roadmap not found or access denied.', [], 404);
        return;
      }

      sendSuccess(res, 'Roadmap updated successfully.', { roadmap });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/business/roadmaps/:id
   * Deletes a roadmap.
   */
  public static deleteRoadmap = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const deleted = await StartupRoadmapService.deleteRoadmap(req.user.sub, req.params.id);
      if (!deleted) {
        sendError(res, 'Roadmap not found or access denied.', [], 404);
        return;
      }

      sendSuccess(res, 'Roadmap deleted successfully.', {});
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/business/roadmaps/:id/milestones/:milestoneId/tasks
   * Adds a task to a milestone.
   */
  public static addTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const roadmap = await StartupRoadmapService.addTask(
        req.user.sub,
        req.params.id,
        req.params.milestoneId,
        req.body
      );

      sendSuccess(res, 'Task added successfully.', { roadmap }, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/business/roadmaps/:id/milestones/:milestoneId/tasks/:taskId
   * Updates or toggles a task.
   */
  public static updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const roadmap = await StartupRoadmapService.updateTask(
        req.user.sub,
        req.params.id,
        req.params.milestoneId,
        req.params.taskId,
        req.body
      );

      sendSuccess(res, 'Task updated successfully.', { roadmap });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/business/roadmaps/:id/milestones/:milestoneId/tasks/:taskId
   * Deletes a task from a milestone.
   */
  public static deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const roadmap = await StartupRoadmapService.deleteTask(
        req.user.sub,
        req.params.id,
        req.params.milestoneId,
        req.params.taskId
      );

      sendSuccess(res, 'Task deleted successfully.', { roadmap });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/business/roadmaps/:id/next-steps
   * Retrieves prioritized next actions.
   */
  public static getNextSteps = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const nextSteps = await StartupRoadmapService.getRecommendedNextSteps(
        req.user.sub,
        req.params.id
      );

      sendSuccess(res, 'Recommended next steps retrieved.', { nextSteps });
    } catch (error) {
      next(error);
    }
  };
}
