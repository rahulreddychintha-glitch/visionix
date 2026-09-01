import { Router } from 'express';
import { ResumeAnalysisController } from '../controllers/resumeAnalysis.controller';
import { authenticate } from '../middleware/auth';
import { aiRateLimiter } from '../middleware/rateLimit';
import { resumeIdParamValidator } from '../validators/resume.validator';

const router = Router();

/**
 * POST /api/resume-analysis/:id/analyze
 * Trigger AI analysis for the specified resume.
 */
router.post('/:id/analyze', authenticate, aiRateLimiter, resumeIdParamValidator, ResumeAnalysisController.analyzeResume);


/**
 * GET /api/resume-analysis/:id
 * Retrieve analysis history for the specified resume.
 */
router.get('/:id', authenticate, resumeIdParamValidator, ResumeAnalysisController.getAnalysisHistory);

/**
 * GET /api/resume-analysis/:id/history
 * Alias for history.
 */
router.get('/:id/history', authenticate, resumeIdParamValidator, ResumeAnalysisController.getAnalysisHistory);

export default router;
