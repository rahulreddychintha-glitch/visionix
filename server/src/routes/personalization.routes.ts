import { Router } from 'express';
import { PersonalizationController } from '../controllers/personalization.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protect personalization endpoints with authentication
router.use(authenticate);

/**
 * GET /api/personalization
 * Get full normalized context & recommendation engine insights.
 */
router.get('/', PersonalizationController.getPersonalizationData);

/**
 * GET /api/personalization/preferences
 * Get current user preferences.
 */
router.get('/preferences', PersonalizationController.getPreferences);

/**
 * PUT /api/personalization/preferences
 * Update user preferences.
 */
router.put('/preferences', PersonalizationController.updatePreferences);

export default router;
