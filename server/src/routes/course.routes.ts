import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protected Course Recommendation Endpoints
router.use(authenticate);

/**
 * GET /api/courses/recommendations
 * Personalized course recommendations driven by Phase 23 Skill Gap Analysis
 */
router.get('/recommendations', CourseController.getRecommendedCourses);

/**
 * GET /api/courses/:resourceId
 * Verified course details
 */
router.get('/:resourceId', CourseController.getCourseDetails);

export default router;
