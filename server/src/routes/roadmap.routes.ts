import { Router } from 'express';
import { RoadmapController } from '../controllers/roadmap.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protect all roadmap endpoints with authentication
router.use(authenticate);

/**
 * GET /api/roadmap
 * Fetch active roadmap for the user
 */
router.get('/', RoadmapController.getRoadmap);

/**
 * GET /api/roadmap/assessment/history
 * Fetch past completed assessment attempts for the user
 */
router.get('/assessment/history', RoadmapController.getAssessmentHistory);

/**
 * POST /api/roadmap/generate
 * Generate or regenerate a roadmap for a career ID
 */
router.post('/generate', RoadmapController.generateRoadmap);

/**
 * POST /api/roadmap/toggle-milestone
 * Complete or uncomplete a milestone
 */
router.post('/toggle-milestone', RoadmapController.toggleMilestone);

/**
 * POST /api/roadmap/start-milestone
 * Transition milestone to 'In Progress' status
 */
router.post('/start-milestone', RoadmapController.startMilestone);

/**
 * POST /api/roadmap/assessment/generate
 * Generates quiz questions for a milestone
 */
router.post('/assessment/generate', RoadmapController.generateAssessment);

/**
 * POST /api/roadmap/assessment/submit
 * Submits and scores quiz answers
 */
router.post('/assessment/submit', RoadmapController.submitAssessment);

/**
 * POST /api/roadmap/assessment/skill/generate
 * Generates quiz questions for a standalone skill
 */
router.post('/assessment/skill/generate', RoadmapController.generateSkillAssessment);

/**
 * POST /api/roadmap/assessment/skill/submit
 * Submits and scores standalone skill quiz answers
 */
router.post('/assessment/skill/submit', RoadmapController.submitSkillAssessment);

/**
 * POST /api/roadmap/assessment/skill/reset
 * Resets uncompleted attempts for a skill
 */
router.post('/assessment/skill/reset', RoadmapController.resetSkillAssessment);

export default router;
