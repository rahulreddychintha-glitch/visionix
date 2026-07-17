import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import config from '../config/env';

const router = Router();

/**
 * GET /api/health
 * Deployment verification and uptime monitoring endpoint.
 * Used in Phase 18 for health checks before routing live traffic.
 */
router.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, 'Visionix API is running.', {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: '1.0.0',
  });
});

export default router;
