import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';

const router = Router();

/**
 * Master router — mounts all sub-routers.
 * Add new route modules here as phases progress:
 *   router.use('/profile', profileRoutes);   // Phase 4
 *   router.use('/careers', careerRoutes);    // Phase 6
 *   router.use('/ai', aiRoutes);             // Phase 7
 */
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);

export default router;
