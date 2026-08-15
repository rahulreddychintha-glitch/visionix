import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth';
import {
  updatePreferencesValidator,
  updateAccountProfileValidator,
  changePasswordValidator,
  deleteAccountValidator,
} from '../validators/settings.validator';

const router = Router();

/**
 * GET /api/settings
 * Retrieve settings and preferences.
 */
router.get('/', authenticate, SettingsController.getSettings);

/**
 * PUT /api/settings
 * Update preferences.
 */
router.put('/', authenticate, updatePreferencesValidator, SettingsController.updatePreferences);

/**
 * PUT /api/settings/profile
 * Update account & profile info safely.
 */
router.put('/profile', authenticate, updateAccountProfileValidator, SettingsController.updateAccountProfile);

/**
 * PUT /api/settings/password
 * Change password.
 */
router.put('/password', authenticate, changePasswordValidator, SettingsController.changePassword);

/**
 * GET /api/settings/export
 * Download all user data archive.
 */
router.get('/export', authenticate, SettingsController.exportUserData);

/**
 * DELETE /api/settings/account
 * Delete account with password confirmation.
 */
router.delete('/account', authenticate, deleteAccountValidator, SettingsController.deleteAccount);

export default router;
