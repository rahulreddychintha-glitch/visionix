import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validate';

export const createRoadmapValidator = [
  body('title').isString().trim().notEmpty().withMessage('Roadmap title is required.').isLength({ max: 120 }),
  body('description').optional().isString().trim().isLength({ max: 1000 }),
  body('businessIdeaId').optional().isMongoId().withMessage('Invalid business idea ID format.'),
  body('industry').optional().isString().trim().isLength({ max: 60 }),
  body('businessModel').optional().isString().trim().isLength({ max: 60 }),
  body('founderRole').optional().isString().trim().isLength({ max: 60 }),
  validateRequest,
];

export const updateRoadmapValidator = [
  param('id').isMongoId().withMessage('Invalid roadmap ID.'),
  body('title').optional().isString().trim().isLength({ max: 120 }),
  body('description').optional().isString().trim().isLength({ max: 1000 }),
  body('status').optional().isIn(['planning', 'active', 'paused', 'completed']),
  body('currentStage').optional().isString().trim().isLength({ max: 80 }),
  validateRequest,
];

export const roadmapIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid roadmap ID.'),
  validateRequest,
];

export const updateMilestoneValidator = [
  param('id').isMongoId().withMessage('Invalid roadmap ID.'),
  param('milestoneId').isString().trim().notEmpty().withMessage('Milestone ID is required.'),
  body('status').optional().isIn(['locked', 'upcoming', 'active', 'completed']),
  body('notes').optional().isString().trim().isLength({ max: 2000 }),
  validateRequest,
];

export const taskValidator = [
  param('id').isMongoId().withMessage('Invalid roadmap ID.'),
  param('milestoneId').isString().trim().notEmpty().withMessage('Milestone ID is required.'),
  body('title').isString().trim().notEmpty().withMessage('Task title is required.').isLength({ max: 150 }),
  body('description').optional().isString().trim().isLength({ max: 1000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('estimatedMinutes').optional().isInt({ min: 5, max: 10000 }),
  validateRequest,
];

export const updateTaskValidator = [
  param('id').isMongoId().withMessage('Invalid roadmap ID.'),
  param('milestoneId').isString().trim().notEmpty().withMessage('Milestone ID is required.'),
  param('taskId').isString().trim().notEmpty().withMessage('Task ID is required.'),
  body('title').optional().isString().trim().isLength({ max: 150 }),
  body('description').optional().isString().trim().isLength({ max: 1000 }),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('estimatedMinutes').optional().isInt({ min: 5, max: 10000 }),
  validateRequest,
];

export const taskIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid roadmap ID.'),
  param('milestoneId').isString().trim().notEmpty().withMessage('Milestone ID is required.'),
  param('taskId').isString().trim().notEmpty().withMessage('Task ID is required.'),
  validateRequest,
];
