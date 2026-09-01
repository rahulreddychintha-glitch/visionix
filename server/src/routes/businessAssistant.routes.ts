import { Router } from 'express';
import { BusinessAssistantController } from '../controllers/businessAssistant.controller';
import { authenticate } from '../middleware/auth';
import { aiRateLimiter } from '../middleware/rateLimit';
import {
  assistantChatValidator,
  validateIdeaValidator,
  pitchGeneratorValidator,
} from '../validators/businessAssistant.validator';

const router = Router();

// All AI assistant routes require authentication and AI rate limiting
router.use(authenticate);
router.use(aiRateLimiter);


/**
 * POST /api/business/assistant/chat
 * Chat with context-aware startup mentor.
 */
router.post('/chat', assistantChatValidator, BusinessAssistantController.chat);

/**
 * POST /api/business/assistant/validate
 * Evaluate and validate startup idea.
 */
router.post('/validate', validateIdeaValidator, BusinessAssistantController.validateIdea);

/**
 * POST /api/business/assistant/pitch
 * Generate pitch drafts and outlines.
 */
router.post('/pitch', pitchGeneratorValidator, BusinessAssistantController.generatePitch);

export default router;
