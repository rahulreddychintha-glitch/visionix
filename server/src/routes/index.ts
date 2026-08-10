import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import aiRoutes from './ai.routes';
import personalizationRoutes from './personalization.routes';
import careerRoutes from './career.routes';

const router = Router();

/**
 * Master router — mounts all sub-routers.
 */
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/ai', aiRoutes);
router.use('/personalization', personalizationRoutes);
router.use('/careers', careerRoutes);

export default router;
