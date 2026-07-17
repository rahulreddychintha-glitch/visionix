import { Response } from 'express';

interface SuccessPayload<T = unknown> {
  success: true;
  message: string;
  data: T;
}

interface ErrorPayload {
  success: false;
  message: string;
  errors: Array<{ field?: string; message: string }>;
}

/**
 * Sends a standardised success response.
 * Every successful endpoint must use this function — never build response objects manually.
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200
): Response<SuccessPayload<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardised error response.
 * Every error endpoint must use this function — never build response objects manually.
 */
export const sendError = (
  res: Response,
  message: string,
  errors: Array<{ field?: string; message: string }> = [],
  statusCode = 400
): Response<ErrorPayload> => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
