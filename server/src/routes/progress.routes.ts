import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protect all unified progress endpoints
router.use(authenticate);

/**
 * GET /api/progress
 * Retrieves unified progress aggregation across Skills, Courses, Roadmap, Assessments, Resume, and Interview
 */
router.get('/', ProgressController.getUnifiedProgress);

export default router;
