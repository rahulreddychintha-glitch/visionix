import { Router } from 'express';
import { YoutubeController } from '../controllers/youtube.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protect search endpoint with authentication
router.use(authenticate);

/**
 * GET /api/youtube/search
 * Search career development and skill tutorials on YouTube
 */
router.get('/search', YoutubeController.search);

export default router;
