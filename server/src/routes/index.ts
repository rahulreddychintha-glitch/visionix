import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import aiRoutes from './ai.routes';
import personalizationRoutes from './personalization.routes';
import careerRoutes from './career.routes';
import roadmapRoutes from './roadmap.routes';
import youtubeRoutes from './youtube.routes';
import learningRoutes from './learning.routes';
import resumeRoutes from './resume.routes';
import resumeAnalysisRoutes from './resumeAnalysis.routes';
import interviewRoutes from './interview.routes';
import businessRoutes from './business.routes';
import skillNavigatorRoutes from './skillNavigator.routes';
import settingsRoutes from './settings.routes';
import educationPathwayRoutes from './educationPathway.routes';
import courseRoutes from './course.routes';

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
router.use('/roadmap', roadmapRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/learning-hub', learningRoutes);
router.use('/courses', courseRoutes);
router.use('/resume', resumeRoutes);
router.use('/resume-analysis', resumeAnalysisRoutes);
router.use('/interview', interviewRoutes);
router.use('/business', businessRoutes);
router.use('/skill-navigator', skillNavigatorRoutes);
router.use('/skill-gap', skillNavigatorRoutes);
router.use('/settings', settingsRoutes);
router.use('/education-pathways', educationPathwayRoutes);

export default router;
