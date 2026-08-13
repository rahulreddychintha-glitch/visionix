import { Request, Response, NextFunction } from 'express';
import { PersonalizationService } from '../services/personalization.service';
import { RecommendationService } from '../services/recommendation.service';
import { YoutubeService } from '../services/youtube.service';
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
   * GET /api/personalization/youtube
   * Fetch personalized YouTube learning videos based on the user's specialization and dream career.
   */
  public static getPersonalizedVideos = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const context = await PersonalizationService.getPersonalizationContext(userId);

      const specText = context.specialization ? context.specialization.replace(/_/g, ' ') : '';
      const dreamCareer = context.dreamCareer && context.dreamCareer !== 'Career Explorer' ? context.dreamCareer : '';
      const discipline = context.discipline && context.discipline !== 'General Studies' ? context.discipline : '';

      let query = '';
      if (dreamCareer) {
        query = `${dreamCareer} ${specText} tutorial`;
      } else if (discipline) {
        query = `${discipline} ${specText} course overview`;
      } else {
        query = 'professional career development skills';
      }

      const videos = await YoutubeService.searchVideos(query, 2);

      const mappedVideos = videos.map((v) => ({
        id: v.videoId,
        title: v.title,
        channel: v.channelTitle,
        duration: '15 mins',
        views: '100K+ views',
        publishedAt: v.publishedAt,
        thumbnail: v.thumbnail,
      }));

      sendSuccess(res, 'Personalized YouTube videos retrieved successfully.', mappedVideos);
    } catch {
      sendSuccess(res, 'YouTube search failed.', []);
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
