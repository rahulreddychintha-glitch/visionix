import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendError } from '../utils/response';

/**
 * Middleware to check validation results from express-validator.
 * Formats validation errors into standard API error payload and returns 400.
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => {
      // In express-validator, if type is field, field path is err.path. Otherwise default param
      const field = err.type === 'field' ? err.path : undefined;
      return {
        field,
        message: err.msg,
      };
    });

    sendError(res, 'Validation failed.', formattedErrors, 400);
    return;
  }
  next();
};
