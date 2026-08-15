import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validate';

export const businessProfileValidator = [
  body('interestedIndustries')
    .optional()
    .isArray()
    .withMessage('Interested industries must be an array of strings.'),
  body('interestedIndustries.*')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Industry name cannot exceed 60 characters.'),

  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array of strings.'),
  body('interests.*')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Interest item cannot exceed 60 characters.'),

  body('preferredBusinessTypes')
    .optional()
    .isArray()
    .withMessage('Preferred business types must be an array.'),

  body('entrepreneurshipExperience')
    .optional()
    .isIn(['Beginner', 'Exploring', 'Some Experience', 'Experienced'])
    .withMessage('Experience must be Beginner, Exploring, Some Experience, or Experienced.'),

  body('goals')
    .optional()
    .isArray()
    .withMessage('Goals must be an array of strings.'),

  body('availableTime')
    .optional()
    .isIn(['Less than 5 hours/week', '5–10 hours/week', '10–20 hours/week', '20+ hours/week'])
    .withMessage('Invalid available time selection.'),

  body('preferredStartupStage')
    .optional()
    .isIn(['Exploring', 'Idea', 'Validation', 'MVP', 'Early Launch', 'Growth'])
    .withMessage('Invalid startup stage selection.'),

  body('currentStartupIdea')
    .optional()
    .isObject()
    .withMessage('Current startup idea must be an object.'),
  body('currentStartupIdea.title')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 120 })
    .withMessage('Idea title cannot exceed 120 characters.'),
  body('currentStartupIdea.description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Idea description cannot exceed 1000 characters.'),
  body('currentStartupIdea.stage')
    .optional()
    .isIn(['Exploring', 'Idea', 'Validation', 'MVP', 'Early Launch', 'Growth'])
    .withMessage('Invalid idea stage.'),
  body('currentStartupIdea.targetMarket')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Target market cannot exceed 200 characters.'),

  body('onboardingCompleted')
    .optional()
    .isBoolean()
    .withMessage('onboardingCompleted must be a boolean.'),

  validateRequest,
];

export const businessIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid ID format.'),
  validateRequest,
];

export const businessIdeaQueryValidator = [
  query('category')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Category filter too long.'),
  query('industry')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Industry filter too long.'),
  query('difficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty filter.'),
  query('startupPotential')
    .optional()
    .isIn(['High', 'Medium', 'Niche'])
    .withMessage('Invalid startup potential filter.'),
  query('businessModel')
    .optional()
    .isIn(['B2B', 'B2C', 'B2B2C', 'Marketplace', 'SaaS', 'Subscription', 'Other'])
    .withMessage('Invalid business model filter.'),
  query('skills')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Skills query parameter too long.'),
  query('sortBy')
    .optional()
    .isIn(['best_match', 'newest', 'potential', 'difficulty', 'alphabetical'])
    .withMessage('Invalid sort parameter.'),
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query cannot exceed 100 characters.'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100.'),
  validateRequest,
];

export const opportunityQueryValidator = [
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query cannot exceed 100 characters.'),
  query('opportunityType')
    .optional()
    .isIn([
      'grant',
      'hackathon',
      'incubator',
      'accelerator',
      'competition',
      'fellowship',
      'startup_program',
      'scholarship',
      'founder_resource',
      'other',
    ])
    .withMessage('Invalid opportunity type filter.'),
  query('category')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Category filter too long.'),
  query('industry')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Industry filter too long.'),
  query('location')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Location filter too long.'),
  query('isOnline')
    .optional()
    .isBoolean()
    .withMessage('isOnline must be a boolean.'),
  query('difficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty filter.'),
  query('skills')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Skills query parameter too long.'),
  query('sortBy')
    .optional()
    .isIn(['best_match', 'deadline', 'newest', 'featured', 'alphabetical'])
    .withMessage('Invalid sort parameter.'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100.'),
  validateRequest,
];
