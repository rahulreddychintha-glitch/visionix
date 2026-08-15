import { body, param } from 'express-validator';

/**
 * Validation rules for creating a new resume.
 */
export const createResumeValidator = [
  body('title')
    .optional()
    .trim()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 120 })
    .withMessage('Title cannot exceed 120 characters'),

  body('targetRole')
    .optional()
    .trim()
    .isString()
    .withMessage('Target role must be a string')
    .isLength({ max: 120 })
    .withMessage('Target role cannot exceed 120 characters'),

  body('templateId')
    .optional()
    .trim()
    .isIn(['modern', 'classic', 'minimal'])
    .withMessage('Template ID must be modern, classic, or minimal'),

  body('personalInfo')
    .optional()
    .isObject()
    .withMessage('Personal info must be an object'),

  body('personalInfo.fullName')
    .optional()
    .trim()
    .isString()
    .withMessage('Full name must be a string')
    .isLength({ max: 100 })
    .withMessage('Full name cannot exceed 100 characters'),

  body('personalInfo.email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Valid email address is required in personal info'),

  body('summary')
    .optional()
    .trim()
    .isString()
    .withMessage('Summary must be a string')
    .isLength({ max: 3000 })
    .withMessage('Summary cannot exceed 3000 characters'),

  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),

  body('experience')
    .optional()
    .isArray()
    .withMessage('Experience must be an array'),

  body('projects')
    .optional()
    .isArray()
    .withMessage('Projects must be an array'),

  body('skills')
    .optional()
    .isObject()
    .withMessage('Skills must be an object'),

  body('certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array'),

  body('achievements')
    .optional()
    .isArray()
    .withMessage('Achievements must be an array'),

  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array'),

  body('customSections')
    .optional()
    .isArray()
    .withMessage('Custom sections must be an array'),
];

/**
 * Validation rules for updating an existing resume.
 */
export const updateResumeValidator = [
  param('id')
    .isMongoId()
    .withMessage('Valid Resume ID is required'),
  ...createResumeValidator,
];

/**
 * Validation rules for resume ID parameter.
 */
export const resumeIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Valid Resume ID is required'),
];
