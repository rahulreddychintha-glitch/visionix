import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validate';

export const generateInterviewValidator = [
  body('targetRole')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Target role is required.')
    .isLength({ max: 100 })
    .withMessage('Target role must not exceed 100 characters.'),
  body('interviewType')
    .isIn(['mock', 'technical', 'behavioral', 'resume_based', 'mixed'])
    .withMessage('Interview type must be mock, technical, behavioral, resume_based, or mixed.'),
  body('difficulty')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced.'),
  body('questionCount')
    .isIn([5, 10, 15])
    .withMessage('Question count must be 5, 10, or 15.'),
  body('focusAreas')
    .optional()
    .isArray()
    .withMessage('Focus areas must be an array of strings.'),
  body('focusAreas.*')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each focus area must be at most 50 characters.'),
  body('timerSeconds')
    .optional()
    .isIn([0, 30, 60, 90, 120])
    .withMessage('Timer must be 0, 30, 60, 90, or 120 seconds.'),
  body('resumeId')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Invalid resume ID format.'),
  validateRequest,
];

export const evaluateInterviewValidator = [
  param('id').isMongoId().withMessage('Invalid interview ID format.'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers array is required with at least 1 answer.'),
  body('answers.*.questionId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Question ID is required for each answer.'),
  body('answers.*.answer')
    .isString()
    .withMessage('Answer text must be a string.'),
  body('timeSpentSeconds')
    .optional()
    .isNumeric()
    .withMessage('Time spent must be a number.'),
  validateRequest,
];

export const interviewIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid interview ID format.'),
  validateRequest,
];
