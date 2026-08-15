import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';
import { sendSuccess, sendError } from '../utils/response';

export class SettingsController {
  /**
   * GET /api/settings
   * Retrieve user settings, account details, and preferences.
   */
  public static getSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const settings = await SettingsService.getSettings(req.user.sub);
      sendSuccess(res, 'Settings retrieved successfully.', { settings });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/settings
   * Update appearance, notification preferences, and AI settings.
   */
  public static updatePreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const updated = await SettingsService.updatePreferences(req.user.sub, req.body);
      sendSuccess(res, 'Preferences updated successfully.', { preferences: updated });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/settings/profile
   * Update name and profile data safely.
   */
  public static updateAccountProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      await SettingsService.updateAccountProfile(req.user.sub, req.body);
      sendSuccess(res, 'Account profile updated successfully.', {});
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/settings/password
   * Change user password.
   */
  public static changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const { email, oldPassword, newPassword, confirmPassword } = req.body;
      await SettingsService.changePassword(
        req.user.sub,
        email,
        oldPassword,
        newPassword,
        confirmPassword
      );
      sendSuccess(res, 'Password changed successfully.', {});
    } catch (error: any) {
      sendError(res, error.message || 'Failed to change password.', [], 400);
    }
  };

  /**
   * GET /api/settings/export
   * Export all user data as JSON archive.
   */
  public static exportUserData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const archive = await SettingsService.exportUserData(req.user.sub);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="visionix_data_export_${req.user.sub}_${Date.now()}.json"`
      );
      res.status(200).send(JSON.stringify(archive, null, 2));
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/settings/account
   * Permanently delete user account and all associated data.
   */
  public static deleteAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const { password } = req.body;
      await SettingsService.deleteAccount(req.user.sub, password);
      sendSuccess(res, 'Account and all associated data permanently deleted.', {});
    } catch (error: any) {
      sendError(res, error.message || 'Failed to delete account.', [], 400);
    }
  };
}
