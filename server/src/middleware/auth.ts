import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { Role } from '../constants/auth.constants';

/**
 * Authentication guard middleware.
 * Verifies JWT token and attaches decoded payload to req.user.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       sendError(res, 'Access denied. No token provided.', [], 401);
       return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
       sendError(res, 'Access denied. Invalid token format.', [], 401);
       return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid or expired token.';
    sendError(res, message, [], 401);
  }
};

/**
 * Optional authentication middleware.
 * Attempts to authenticate if a token is present, but doesn't fail if not.
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = verifyToken(token);
        req.user = decoded;
      }
    }
    next();
  } catch {
    // Fail silently for optional auth, just proceed without req.user
    next();
  }
};

/**
 * Role authorization guard middleware.
 * Restricts access to specified roles only.
 * MUST be registered after authenticate().
 */
export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
       sendError(res, 'Authentication required for this operation.', [], 401);
       return;
    }

    if (!roles.includes(req.user.role as Role)) {
       sendError(res, 'Access forbidden. Insufficient permissions.', [], 403);
       return;
    }

    next();
  };
};
