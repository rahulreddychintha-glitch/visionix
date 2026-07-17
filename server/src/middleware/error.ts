import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

interface AppError extends Error {
  statusCode?: number;
  code?: number | string;
}

/**
 * Global Express error handler.
 * Translates known error types into standard API responses.
 * Must be the last middleware registered in app.ts.
 */
export const errorMiddleware = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Visionix] Server Error:', err.message);

  // Mongoose duplicate key (e.g. unique email constraint)
  if (err.code === 11000) {
    sendError(res, 'A record with this value already exists.', [], 409);
    return;
  }

  // Mongoose document validation error
  if (err.name === 'ValidationError') {
    sendError(res, 'Validation error.', [{ message: err.message }], 422);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token.', [], 401);
    return;
  }
  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token has expired. Please log in again.', [], 401);
    return;
  }

  const statusCode = err.statusCode ?? 500;
  const message =
    statusCode === 500 ? 'An internal server error occurred.' : err.message;

  sendError(res, message, [], statusCode);
};
