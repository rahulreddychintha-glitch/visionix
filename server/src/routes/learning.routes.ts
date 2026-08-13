import { Router } from 'express';
import { LearningController } from '../controllers/learning.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protect all learning hub endpoints with authentication
router.use(authenticate);

/**
 * GET /api/learning-hub
 * Retrieve personalized Learning Hub context and resources
 */
router.get('/', LearningController.getLearningHubData);

/**
 * POST /api/learning-hub/start
 * Initiate progress tracking for a verified resource
 */
router.post('/start', LearningController.startResource);

/**
 * POST /api/learning-hub/progress
 * Update progress tracking status (e.g. completed)
 */
router.post('/progress', LearningController.updateProgress);

/**
 * POST /api/learning-hub/bookmark
 * Toggle bookmark status for a resource
 */
router.post('/bookmark', LearningController.toggleBookmark);

export default router;
