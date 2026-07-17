import { ITokenPayload } from '../interfaces/auth.interface';

/**
 * Augments the Express Request type to include the authenticated user payload.
 * After authenticate() middleware runs, req.user is always an ITokenPayload.
 */
declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}
