import { Router } from 'express';
import { body } from 'express-validator';
import { AiController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All AI routes are protected by authentication middleware
router.use(authenticate);

/**
 * POST /api/ai/chat
 * Interactive conversation with Visionix AI Assistant.
 */
router.post(
  '/chat',
  [
    body('message')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Message text is required.')
      .isLength({ max: 2000 })
      .withMessage('Message must not exceed 2000 characters.'),
    body('sessionId')
      .optional()
      .isString()
      .trim(),
  ],
  AiController.chat
);

/**
 * GET /api/ai/history
 * Fetch active sessions or session messages for current user.
 */
router.get('/history', AiController.getHistory);

/**
 * DELETE /api/ai/history
 * Reset / clear conversation history for current user.
 */
router.delete('/history', AiController.clearHistory);

/**
 * DELETE /api/ai/history/:sessionId
 * Delete a specific chat session for the current user.
 */
router.delete('/history/:sessionId', AiController.deleteSession);

export default router;
