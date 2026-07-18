import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { UserProfile } from '../models/UserProfile';
import { User } from '../models/User';
import { sendSuccess, sendError } from '../utils/response';

export class ProfileController {
  /**
   * GET /api/profile/status
   * Retrieve lightweight status on user onboarding.
   */
  public static getStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const user = await User.findById(userId);
      const profile = await UserProfile.findOne({ userId });

      sendSuccess(res, 'Onboarding status retrieved.', {
        isOnboarded: user ? user.isOnboarded : false,
        currentStep: profile ? profile.onboarding.currentStep : 0,
        completed: profile ? profile.onboarding.completed : false,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/profile
   * Retrieve full user profile. Pre-populates with standard defaults if none exists.
   */
  public static getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const user = await User.findById(userId);
      const profile = await UserProfile.findOne({ userId });

      if (!profile) {
        // Return default initialized profile layout to prevent client binding issues
        sendSuccess(res, 'Default profile pre-initialized.', {
          personal: {
            fullName: user ? user.fullName : '',
            dateOfBirth: null,
            gender: '',
            country: '',
            state: '',
            city: '',
          },
          education: {
            level: '',
            institution: '',
            stream: '',
            graduationYear: null,
          },
          interests: {
            careerInterests: [],
            favouriteSubjects: [],
            technologies: [],
            industries: [],
          },
          skills: {
            technicalSkills: [],
            softSkills: [],
            languages: [],
            skillLevels: {},
          },
          careerGoals: {
            dreamCareer: '',
            preferredIndustries: [],
            salaryGoal: '',
            careerObjectives: '',
          },
          learningPreferences: {
            learningStyle: '',
            weeklyStudyTime: null,
            preferredResources: [],
          },
          workPreferences: {
            remoteHybridOffice: '',
            startupEnterprise: '',
            teamSize: '',
          },
          onboarding: {
            currentStep: 0,
            completed: false,
            lastSavedAt: new Date(),
          },
        });
        return;
      }

      sendSuccess(res, 'User profile retrieved successfully.', profile);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/profile
   * Create or update user onboarding profile (incremental draft saves supported).
   */
  public static saveProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => {
          const field = err.type === 'field' ? err.path : undefined;
          return {
            field,
            message: err.msg,
          };
        });
        sendError(res, 'Validation failed.', formattedErrors, 400);
        return;
      }

      const userId = req.user.sub;
      let profile = await UserProfile.findOne({ userId });

      if (!profile) {
        profile = new UserProfile({ userId });
      }

      const body = req.body;

      // Incremental updates: update only sections/subsections passed in the payload
      if (body.personal) {
        profile.personal = {
          ...profile.personal,
          ...body.personal,
        };
      }
      if (body.education) {
        profile.education = {
          ...profile.education,
          ...body.education,
        };
      }
      if (body.interests) {
        profile.interests = {
          ...profile.interests,
          ...body.interests,
        };
      }
      if (body.skills) {
        const currentSkills = profile.skills || { technicalSkills: [], softSkills: [], languages: [], skillLevels: new Map() };
        profile.skills = {
          technicalSkills: body.skills.technicalSkills ?? currentSkills.technicalSkills,
          softSkills: body.skills.softSkills ?? currentSkills.softSkills,
          languages: body.skills.languages ?? currentSkills.languages,
          skillLevels: body.skills.skillLevels 
            ? new Map(Object.entries(body.skills.skillLevels))
            : currentSkills.skillLevels,
        };
      }
      if (body.careerGoals) {
        profile.careerGoals = {
          ...profile.careerGoals,
          ...body.careerGoals,
        };
      }
      if (body.learningPreferences) {
        profile.learningPreferences = {
          ...profile.learningPreferences,
          ...body.learningPreferences,
        };
      }
      if (body.workPreferences) {
        profile.workPreferences = {
          ...profile.workPreferences,
          ...body.workPreferences,
        };
      }
      if (body.onboarding) {
        profile.onboarding = {
          ...profile.onboarding,
          ...body.onboarding,
        };
      }

      // Update timestamps and save completion indicators
      profile.onboarding.lastSavedAt = new Date();

      const isCompleting = body.onboarding?.completed === true;

      if (isCompleting) {
        profile.onboarding.completed = true;
        profile.onboarding.completedAt = new Date();
        
        // Update user record state immediately
        await User.findByIdAndUpdate(userId, { isOnboarded: true });
      }

      const savedProfile = await profile.save();

      sendSuccess(
        res,
        isCompleting ? 'Onboarding profile completed successfully.' : 'Onboarding profile saved.',
        savedProfile
      );
    } catch (error) {
      next(error);
    }
  };
}
