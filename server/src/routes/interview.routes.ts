import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authenticate } from '../middleware/auth';
import {
  generateInterviewValidator,
  evaluateInterviewValidator,
  interviewIdParamValidator,
} from '../validators/interview.validator';

const router = Router();

/**
 * POST /api/interview/generate
 * Generate an AI-powered interview session.
 */
router.post('/generate', authenticate, generateInterviewValidator, InterviewController.generateInterview);

/**
 * GET /api/interview
 * Retrieve all interview sessions for the authenticated user.
 */
router.get('/', authenticate, InterviewController.getInterviews);

/**
 * GET /api/interview/progress
 * Retrieve cumulative interview analytics for the authenticated user.
 */
router.get('/progress', authenticate, InterviewController.getProgress);

/**
 * GET /api/interview/:id
 * Retrieve a specific interview session by ID.
 */
router.get('/:id', authenticate, interviewIdParamValidator, InterviewController.getInterview);

/**
 * POST /api/interview/:id/evaluate
 * Submit answers for AI evaluation and scoring.
 */
router.post('/:id/evaluate', authenticate, evaluateInterviewValidator, InterviewController.evaluateInterview);

/**
 * POST /api/interview/:id/retry
 * Retry an interview or practice weak areas in a fresh session.
 */
router.post('/:id/retry', authenticate, interviewIdParamValidator, InterviewController.retryInterview);

/**
 * DELETE /api/interview/:id
 * Delete an interview session.
 */
router.delete('/:id', authenticate, interviewIdParamValidator, InterviewController.deleteInterview);

export default router;
