import { Request, Response, NextFunction } from 'express';
import { PersonalizationService } from '../services/personalization.service';
import { RecommendationService } from '../services/recommendation.service';
import { UserPreferences } from '../models/UserPreferences';
import { sendSuccess, sendError } from '../utils/response';

export class PersonalizationController {
  /**
   * GET /api/personalization
   * Retrieve full personalized context and computed recommendations for current user.
   */
  public static getPersonalizationData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const context = await PersonalizationService.getPersonalizationContext(userId);
      const recommendations = await RecommendationService.generateRecommendations(context);

      sendSuccess(res, 'Personalization context and recommendations retrieved successfully.', {
        context,
        recommendations,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/preferences
   * Retrieve current user preferences.
   */
  public static getPreferences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      let prefs = await UserPreferences.findOne({ userId });

      if (!prefs) {
        prefs = new UserPreferences({ userId });
        await prefs.save();
      }

      sendSuccess(res, 'User preferences retrieved successfully.', prefs);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/preferences
   * Update user preferences safely.
   */
  public static updatePreferences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const { theme, language, emailNotifications, pushNotifications, weeklyReport } = req.body;

      let prefs = await UserPreferences.findOne({ userId });
      if (!prefs) {
        prefs = new UserPreferences({ userId });
      }

      if (theme !== undefined) prefs.theme = theme;
      if (language !== undefined) prefs.language = language;
      if (emailNotifications !== undefined) prefs.emailNotifications = emailNotifications;
      if (pushNotifications !== undefined) prefs.pushNotifications = pushNotifications;
      if (weeklyReport !== undefined) prefs.weeklyReport = weeklyReport;

      const savedPrefs = await prefs.save();
      sendSuccess(res, 'User preferences updated successfully.', savedPrefs);
    } catch (error) {
      next(error);
    }
  };
}
