import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { NextStepController } from '../controllers/nextStep.controller';

const router = Router();

// Your Next Step requires authentication
router.use(authenticate);

// GET /api/next-step
router.get('/', NextStepController.getNextStep);

export default router;
