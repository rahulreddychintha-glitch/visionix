import { Router } from 'express';
import { SkillNavigatorController } from '../controllers/skillNavigator.controller';
import { authenticate } from '../middleware/auth';
import {
  analyzeSkillGapValidator,
  getSkillGapValidator,
  skillCoachValidator,
} from '../validators/skillNavigator.validator';

const router = Router();

/**
 * GET /api/skill-navigator
 * Retrieve latest skill gap analysis.
 */
router.get('/', authenticate, getSkillGapValidator, SkillNavigatorController.getAnalysis);

/**
 * POST /api/skill-navigator/analyze
 * Generate or recalculate skill gap analysis.
 */
router.post('/analyze', authenticate, analyzeSkillGapValidator, SkillNavigatorController.analyzeSkills);

/**
 * GET /api/skill-navigator/history
 * Retrieve historical skill gap analyses.
 */
router.get('/history', authenticate, SkillNavigatorController.getHistory);

/**
 * GET /api/skill-navigator/careers
 * Retrieve career comparisons.
 */
router.get('/careers', authenticate, SkillNavigatorController.getCareers);

/**
 * POST /api/skill-navigator/coach
 * Query AI Skill Coach.
 */
router.post('/coach', authenticate, skillCoachValidator, SkillNavigatorController.askCoach);

export default router;
