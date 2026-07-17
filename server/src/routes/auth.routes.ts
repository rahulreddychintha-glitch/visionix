import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { validateRequest } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/register
 * Public route to register a new account.
 */
router.post('/register', registerValidator, validateRequest, AuthController.register);

/**
 * POST /api/auth/login
 * Public route to authenticate and retrieve a JWT.
 */
router.post('/login', loginValidator, validateRequest, AuthController.login);

/**
 * GET /api/auth/me
 * Protected route to fetch current session details.
 */
router.get('/me', authenticate, AuthController.getMe);

/**
 * POST /api/auth/logout
 * Protected route for stateless logout.
 */
router.post('/logout', authenticate, AuthController.logout);

export default router;
