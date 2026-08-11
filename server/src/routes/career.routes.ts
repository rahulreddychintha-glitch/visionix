import { Router } from 'express';
import { CareerController } from '../controllers/career.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protect all career explorer endpoints with authentication
router.use(authenticate);

/**
 * GET /api/careers
 * List all careers with search, filter, and relevance sorting
 */
router.get('/', CareerController.listCareers);

/**
 * GET /api/careers/recommended
 * List personalized recommendations
 */
router.get('/recommended', CareerController.listRecommendedCareers);

/**
 * GET /api/careers/saved
 * List all bookmarked careers
 */
router.get('/saved', CareerController.getSavedCareers);

/**
 * POST /api/careers/:id/recommendation-explanation
 * Generate natural-language explanation for why a career is recommended
 */
router.post('/:id/recommendation-explanation', CareerController.getRecommendationExplanation);

/**
 * GET /api/careers/:id
 * Retrieve details of a single career
 */
router.get('/:id', CareerController.getCareerById);

/**
 * POST /api/careers/:id/save
 * Bookmark/save a career
 */
router.post('/:id/save', CareerController.saveCareer);

/**
 * DELETE /api/careers/:id/save
 * Remove a career bookmark
 */
router.delete('/:id/save', CareerController.unsaveCareer);

export default router;
