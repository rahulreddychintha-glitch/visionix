import { body } from 'express-validator';

/**
 * Validator for onboarding profile data upsert.
 * Required fields are strictly checked only when completing onboarding (onboarding.completed is true).
 * Otherwise, partial data is allowed for draft/autosave.
 */
export const saveProfileValidator = [
  // ─── Personal ───────────────────────────────────────────────────────────────
  body('personal.fullName')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),

  body('personal.dateOfBirth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Date of birth must be a valid ISO date string')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Date of birth is required'),

  body('personal.gender')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Gender must be a string'),

  body('personal.country')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Country is required'),

  body('personal.state')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('State is required'),

  body('personal.city')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('City is required'),

  // ─── Education ─────────────────────────────────────────────────────────────
  body('education.level')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Education level is required'),

  body('education.institution')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Institution name is required'),

  body('education.stream')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Stream/major is required'),

  body('education.graduationYear')
    .optional({ checkFalsy: true })
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Graduation year must be a valid year')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Graduation year is required'),

  // ─── Interests ─────────────────────────────────────────────────────────────
  body('interests.careerInterests')
    .optional()
    .isArray()
    .withMessage('Career interests must be an array of strings'),

  body('interests.favouriteSubjects')
    .optional()
    .isArray()
    .withMessage('Favourite subjects must be an array of strings'),

  body('interests.technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array of strings'),

  body('interests.industries')
    .optional()
    .isArray()
    .withMessage('Industries must be an array of strings'),

  // ─── Skills ────────────────────────────────────────────────────────────────
  body('skills.technicalSkills')
    .optional()
    .isArray()
    .withMessage('Technical skills must be an array of strings'),

  body('skills.softSkills')
    .optional()
    .isArray()
    .withMessage('Soft skills must be an array of strings'),

  body('skills.languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array of strings'),

  body('skills.skillLevels')
    .optional()
    .isObject()
    .withMessage('Skill levels must be a map/object of skill names to ratings'),

  // ─── Career Goals ──────────────────────────────────────────────────────────
  body('careerGoals.dreamCareer')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Dream career is required'),

  body('careerGoals.preferredIndustries')
    .optional()
    .isArray()
    .withMessage('Preferred industries must be an array of strings'),

  body('careerGoals.salaryGoal')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Salary goal is required'),

  body('careerGoals.careerObjectives')
    .optional()
    .isString()
    .withMessage('Career objectives must be a string'),

  // ─── Learning Preferences ──────────────────────────────────────────────────
  body('learningPreferences.learningStyle')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Learning style is required'),

  body('learningPreferences.weeklyStudyTime')
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 168 })
    .withMessage('Weekly study time must be between 0 and 168 hours')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Weekly study time is required'),

  body('learningPreferences.preferredResources')
    .optional()
    .isArray()
    .withMessage('Preferred resources must be an array of strings'),

  // ─── Work Preferences ──────────────────────────────────────────────────────
  body('workPreferences.remoteHybridOffice')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Work mode preference (Remote/Hybrid/Office) is required'),

  body('workPreferences.startupEnterprise')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Company preference (Startup/Enterprise) is required'),

  body('workPreferences.teamSize')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Team size preference is required'),

  // ─── Onboarding Metadata ────────────────────────────────────────────────────
  body('onboarding.currentStep')
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage('Current step must be an integer between 0 and 6'),
];
