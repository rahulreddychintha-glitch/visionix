import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate';

export const updatePreferencesValidator = [
  body('theme')
    .optional()
    .isIn(['dark', 'light', 'system'])
    .withMessage('Theme must be dark, light, or system.'),
  body('language')
    .optional()
    .isString()
    .isLength({ max: 10 })
    .withMessage('Language code is invalid.'),
  body('emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('emailNotifications must be a boolean.'),
  body('pushNotifications')
    .optional()
    .isBoolean()
    .withMessage('pushNotifications must be a boolean.'),
  body('weeklyReport')
    .optional()
    .isBoolean()
    .withMessage('weeklyReport must be a boolean.'),
  body('careerUpdates')
    .optional()
    .isBoolean()
    .withMessage('careerUpdates must be a boolean.'),
  body('learningReminders')
    .optional()
    .isBoolean()
    .withMessage('learningReminders must be a boolean.'),
  body('assessmentReminders')
    .optional()
    .isBoolean()
    .withMessage('assessmentReminders must be a boolean.'),
  body('interviewReminders')
    .optional()
    .isBoolean()
    .withMessage('interviewReminders must be a boolean.'),
  body('businessUpdates')
    .optional()
    .isBoolean()
    .withMessage('businessUpdates must be a boolean.'),
  body('aiRecommendationsEnabled')
    .optional()
    .isBoolean()
    .withMessage('aiRecommendationsEnabled must be a boolean.'),
  body('aiPersonalizedSuggestions')
    .optional()
    .isBoolean()
    .withMessage('aiPersonalizedSuggestions must be a boolean.'),
  body('aiLearningAssistance')
    .optional()
    .isBoolean()
    .withMessage('aiLearningAssistance must be a boolean.'),
  validateRequest,
];

export const updateAccountProfileValidator = [
  body('fullName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters.'),
  body('personal')
    .optional()
    .isObject()
    .withMessage('Personal information must be an object.'),
  body('education')
    .optional()
    .isObject()
    .withMessage('Education information must be an object.'),
  body('experience')
    .optional()
    .isObject()
    .withMessage('Experience information must be an object.'),
  body('careerGoals')
    .optional()
    .isObject()
    .withMessage('Career goals information must be an object.'),
  validateRequest,
];

export const changePasswordValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address.'),
  body('oldPassword')
    .isString()
    .notEmpty()
    .withMessage('Current password is required.'),
  body('newPassword')
    .isString()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long.'),
  body('confirmPassword')
    .isString()
    .notEmpty()
    .withMessage('Password confirmation is required.')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New password and confirm password do not match.');
      }
      return true;
    }),
  validateRequest,
];

export const deleteAccountValidator = [
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required to confirm account deletion.'),
  validateRequest,
];
