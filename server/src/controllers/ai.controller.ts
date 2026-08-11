import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AiService } from '../services/ai.service';
import { sendSuccess, sendError } from '../utils/response';

export class AiController {
  /**
   * POST /api/ai/chat
   * Process interactive user chat message with Visionix AI.
   */
  public static chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => {
          const field = err.type === 'field' ? err.path : undefined;
          return {
            field,
            message: err.msg,
          };
        });
        sendError(res, 'Validation error', formattedErrors, 400);
        return;
      }

      const userId = req.user.sub;
      const { message, sessionId, careerId } = req.body;

      const result = await AiService.processChatMessage({
        userId,
        message,
        sessionId,
        careerId,
      });

      sendSuccess(res, 'AI response generated successfully.', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/ai/history
   * Retrieve active sessions or message history for current user.
   */
  public static getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const sessionId = req.query['sessionId'] as string | undefined;

      const historyData = await AiService.getChatHistory(userId, sessionId);
      sendSuccess(res, 'AI chat history retrieved successfully.', historyData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/ai/history
   * Clear AI conversation history for current user.
   */
  public static clearHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      await AiService.clearChatHistory(userId);
      sendSuccess(res, 'AI chat history cleared successfully.', { cleared: true });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/ai/history/:sessionId
   * Delete a specific chat session for the current user.
   */
  public static deleteSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const { sessionId } = req.params;

      if (!sessionId) {
        sendError(res, 'Session ID is required.', [], 400);
        return;
      }

      const result = await AiService.deleteChatSession(userId, sessionId);
      if (!result) {
        sendError(res, 'Chat session not found or does not belong to you.', [], 404);
        return;
      }

      sendSuccess(res, 'AI chat session deleted successfully.', {
        deleted: true,
        sessionId,
      });
    } catch (error) {
      next(error);
    }
  };
}
