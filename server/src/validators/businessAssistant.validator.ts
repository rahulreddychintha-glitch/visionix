import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate';

export const assistantChatValidator = [
  body('message')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Prompt message is required.')
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters.'),
  body('roadmapId')
    .optional()
    .isMongoId()
    .withMessage('Invalid roadmap ID format.'),
  body('businessIdeaId')
    .optional()
    .isMongoId()
    .withMessage('Invalid business idea ID format.'),
  body('history')
    .optional()
    .isArray({ max: 30 })
    .withMessage('Conversation history must be an array of at most 30 messages.'),
  validateRequest,
];

export const validateIdeaValidator = [
  body('businessIdeaId')
    .optional()
    .isMongoId()
    .withMessage('Invalid business idea ID format.'),
  body('roadmapId')
    .optional()
    .isMongoId()
    .withMessage('Invalid roadmap ID format.'),
  body('title')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 150 }),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 2000 }),
  validateRequest,
];

export const pitchGeneratorValidator = [
  body('pitchType')
    .isIn(['one_liner', 'elevator', 'pitch_deck', 'business_plan'])
    .withMessage('Invalid pitch type. Must be one_liner, elevator, pitch_deck, or business_plan.'),
  body('roadmapId')
    .optional()
    .isMongoId()
    .withMessage('Invalid roadmap ID format.'),
  body('businessIdeaId')
    .optional()
    .isMongoId()
    .withMessage('Invalid business idea ID format.'),
  validateRequest,
];
