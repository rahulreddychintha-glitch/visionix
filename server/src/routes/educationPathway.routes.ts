import { Router } from 'express';
import { EducationPathwayController } from '../controllers/educationPathway.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * GET /api/education-pathways
 * Fetch the complete independent Indian Education Progression Tree.
 * Attaches user context & "YOU ARE HERE" marker if authenticated, or returns the standalone tree for guests.
 */
router.get('/', optionalAuth, EducationPathwayController.getPathways);

export default router;
