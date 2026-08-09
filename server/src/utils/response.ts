import { Response } from 'express';

interface SuccessPayload<T = unknown> {
  success: true;
  message: string;
  data: T;
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
  statusCode = 400,
  errorDetail?: { code: string; status: number; message: string }
): Response => {
  const payload: any = {
    success: false,
    message,
    errors,
  };
  if (errorDetail) {
    payload.error = errorDetail;
  }
  return res.status(statusCode).json(payload);
};
