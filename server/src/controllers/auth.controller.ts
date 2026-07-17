import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

export class AuthController {
  /**
   * Registers a new user and generates a JWT.
   */
  public static register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { fullName, email, password } = req.body;

      const user = await AuthService.registerUser({ fullName, email, password });
      
      // Sign token
      const token = signToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      sendSuccess(
        res,
        'Registration successful.',
        {
          user,
          token,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Authenticates a user and generates a JWT.
   */
  public static login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await AuthService.loginUser({ email, password });

      // Sign token
      const token = signToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      sendSuccess(res, 'Login successful.', {
        user,
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves the current authenticated user's session data.
   */
  public static getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
         sendError(res, 'Not authenticated.', [], 401);
         return;
      }

      const user = await AuthService.getUserById(req.user.sub);
      if (!user) {
         sendError(res, 'User session not found.', [], 404);
         return;
      }

      sendSuccess(res, 'Session retrieved successfully.', { user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logs out the current user (stateless - client clears the token).
   */
  public static logout = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      sendSuccess(res, 'Logged out successfully.', null);
    } catch (error) {
      next(error);
    }
  };
}
