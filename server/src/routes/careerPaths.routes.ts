import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { CareerPathsController } from '../controllers/careerPaths.controller';

const router = Router();

// Career Paths requires authentication
router.use(authenticate);

// GET /api/career-paths
router.get('/', CareerPathsController.getCareerPaths);

export default router;
