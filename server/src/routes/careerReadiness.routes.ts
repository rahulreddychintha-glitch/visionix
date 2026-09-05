import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { CareerReadinessController } from '../controllers/careerReadiness.controller';

const router = Router();

// Career Readiness requires authentication
router.use(authenticate);

// GET /api/career-readiness
router.get('/', CareerReadinessController.getCareerReadiness);

export default router;
