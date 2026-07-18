import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { saveProfileValidator } from '../validators/profile.validator';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * GET /api/profile/status
 * Get current onboarding status summary.
 */
router.get('/status', authenticate, ProfileController.getStatus);

/**
 * GET /api/profile
 * Get complete onboarding profile.
 */
router.get('/', authenticate, ProfileController.getProfile);

/**
 * POST /api/profile
 * Create or incrementally save onboarding details (draft or final).
 */
router.post('/', authenticate, saveProfileValidator, ProfileController.saveProfile);

export default router;
