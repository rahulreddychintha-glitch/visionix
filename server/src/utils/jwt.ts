import jwt from 'jsonwebtoken';
import config from '../config/env';
import { ITokenPayload } from '../interfaces/auth.interface';

/**
 * Signs a JWT with the given payload.
 * Uses config.JWT_SECRET and config.JWT_EXPIRY.
 */
export const signToken = (payload: ITokenPayload): string => {
  // We omit iat and exp from signing because jsonwebtoken adds them or can throw if we include expired values
  const cleanPayload = {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  };
  
  return jwt.sign(cleanPayload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY as any,
  });
};

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws if the token is invalid or expired.
 */
export const verifyToken = (token: string): ITokenPayload => {
  return jwt.verify(token, config.JWT_SECRET) as ITokenPayload;
};
