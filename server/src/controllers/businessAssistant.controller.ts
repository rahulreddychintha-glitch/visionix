import { Request, Response, NextFunction } from 'express';
import { BusinessAssistantService } from '../services/businessAssistant.service';
import { sendSuccess, sendError } from '../utils/response';

export class BusinessAssistantController {
  /**
   * POST /api/business/assistant/chat
   * Chat with the context-aware startup mentor.
   */
  public static chat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const { message, roadmapId, businessIdeaId, history } = req.body;

      const result = await BusinessAssistantService.chatWithAssistant(
        req.user.sub,
        message,
        roadmapId,
        businessIdeaId,
        history
      );

      sendSuccess(res, 'AI reply generated.', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/business/assistant/validate
   * Evaluates and validates a startup idea.
   */
  public static validateIdea = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const { businessIdeaId, roadmapId, title, description } = req.body;

      const validation = await BusinessAssistantService.validateBusinessIdea(
        req.user.sub,
        businessIdeaId,
        roadmapId,
        title,
        description
      );

      sendSuccess(res, 'Idea validation evaluation completed.', { validation });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/business/assistant/pitch
   * Generates a pitch or structured business plan draft.
   */
  public static generatePitch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const { pitchType, roadmapId, businessIdeaId } = req.body;

      const pitch = await BusinessAssistantService.generatePitch(
        req.user.sub,
        pitchType,
        roadmapId,
        businessIdeaId
      );

      sendSuccess(res, 'Pitch content generated.', { pitch });
    } catch (error) {
      next(error);
    }
  };
}
