import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller';
import { ResumeAnalysisController } from '../controllers/resumeAnalysis.controller';
import { authenticate } from '../middleware/auth';
import {
  createResumeValidator,
  updateResumeValidator,
  resumeIdParamValidator,
} from '../validators/resume.validator';

const router = Router();

/**
 * GET /api/resume
 * Retrieve all resumes for the authenticated user.
 */
router.get('/', authenticate, ResumeController.getResumes);

/**
 * GET /api/resume/prefill
 * Retrieve profile prefill data.
 */
router.get('/prefill', authenticate, ResumeController.getProfilePrefill);

/**
 * GET /api/resume/:id
 * Retrieve a specific resume by ID.
 */
router.get('/:id', authenticate, resumeIdParamValidator, ResumeController.getResume);

/**
 * POST /api/resume
 * Create a new resume.
 */
router.post('/', authenticate, createResumeValidator, ResumeController.createResume);

/**
 * PUT /api/resume/:id
 * Update an existing resume.
 */
router.put('/:id', authenticate, updateResumeValidator, ResumeController.updateResume);

/**
 * DELETE /api/resume/:id
 * Delete an existing resume.
 */
router.delete('/:id', authenticate, resumeIdParamValidator, ResumeController.deleteResume);

/**
 * POST /api/resume/:id/analyze
 * Trigger AI analysis for the specified resume.
 */
router.post('/:id/analyze', authenticate, resumeIdParamValidator, ResumeAnalysisController.analyzeResume);

/**
 * GET /api/resume/:id/analysis
 * Retrieve analysis history for the specified resume.
 */
router.get('/:id/analysis', authenticate, resumeIdParamValidator, ResumeAnalysisController.getAnalysisHistory);

export default router;
