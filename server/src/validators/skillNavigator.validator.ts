import { body, query } from 'express-validator';
import { validateRequest } from '../middleware/validate';

export const analyzeSkillGapValidator = [
  body('targetCareerId')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Target career ID must not exceed 100 characters.'),
  body('includeAi')
    .optional()
    .isBoolean()
    .withMessage('includeAi must be a boolean.'),
  validateRequest,
];

export const getSkillGapValidator = [
  query('careerId')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Career ID must not exceed 100 characters.'),
  validateRequest,
];

export const skillCoachValidator = [
  body('question')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Question is required.')
    .isLength({ min: 2, max: 1000 })
    .withMessage('Question must be between 2 and 1000 characters.'),
  body('careerId')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Career ID must not exceed 100 characters.'),
  validateRequest,
];
