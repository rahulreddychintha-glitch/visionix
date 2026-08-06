import { body } from 'express-validator';

/**
 * Validator for onboarding profile data upsert.
 * Required fields are strictly checked ONLY when completing onboarding (onboarding.completed is true).
 * Exactly 7 fields are required:
 * - personal.fullName
 * - education.level
 * - education.studentStatus
 * - education.stream
 * - careerGoals.dreamCareer
 * - careerGoals.preferredIndustries
 * - careerGoals.careerObjectives
 * All other fields are optional.
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
    .optional({ checkFalsy: true }),

  body('personal.gender')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Gender must be a string'),

  body('personal.country')
    .optional({ checkFalsy: true })
    .isString(),

  body('personal.state')
    .optional({ checkFalsy: true })
    .isString(),

  body('personal.city')
    .optional({ checkFalsy: true })
    .isString(),

  // ─── Education ─────────────────────────────────────────────────────────────
  body('education.level')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Education level is required'),

  body('education.studentStatus')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Student status / user role is required'),

  body('education.institution')
    .optional({ checkFalsy: true })
    .isString(),

  body('education.stream')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Academic stream / field is required'),

  body('education.branchSpecialization')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Branch specialization must be a string'),

  body('education.currentOccupation')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Current occupation must be a string'),

  body('education.higherEducationPlans')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Higher education plans must be a string'),

  body('education.graduationYear')
    .optional({ checkFalsy: true }),

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

  body('skills.certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array of strings'),

  body('skills.portfolioLinks')
    .optional()
    .isObject()
    .withMessage('Portfolio links must be an object'),

  body('experience.yearsOfExperience')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Years of experience must be a string'),

  body('experience.currentRole')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Current role must be a string'),

  // ─── Career Goals ──────────────────────────────────────────────────────────
  body('careerGoals.dreamCareer')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Dream career is required'),

  body('careerGoals.preferredIndustries')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .isArray({ min: 1 })
    .withMessage('Target industry is required'),

  body('careerGoals.salaryGoal')
    .optional({ checkFalsy: true }),

  body('careerGoals.careerObjectives')
    .if((value, { req }) => req.body.onboarding?.completed === true)
    .notEmpty()
    .withMessage('Primary goal is required'),

  body('careerGoals.preferredJobType')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Preferred job type must be a string'),

  body('careerGoals.preferredLocation')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Preferred location must be a string'),

  body('careerGoals.longTermAspirations')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Long term aspirations must be a string'),

  // ─── Learning Preferences ──────────────────────────────────────────────────
  body('learningPreferences.learningStyle')
    .optional({ checkFalsy: true }),

  body('learningPreferences.weeklyStudyTime')
    .optional({ checkFalsy: true }),

  body('learningPreferences.preferredResources')
    .optional()
    .isArray()
    .withMessage('Preferred resources must be an array of strings'),

  // ─── Work Preferences ──────────────────────────────────────────────────────
  body('workPreferences.remoteHybridOffice')
    .optional({ checkFalsy: true }),

  body('workPreferences.startupEnterprise')
    .optional({ checkFalsy: true }),

  body('workPreferences.teamSize')
    .optional({ checkFalsy: true }),

  // ─── Onboarding Metadata ────────────────────────────────────────────────────
  body('onboarding.currentStep')
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage('Current step must be an integer between 0 and 6'),
];
