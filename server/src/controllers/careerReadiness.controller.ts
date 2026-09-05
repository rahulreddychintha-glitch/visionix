import { Request, Response } from 'express';
import { CareerReadinessService } from '../services/careerReadiness.service';

export class CareerReadinessController {
  /**
   * GET /api/career-readiness
   * Returns deterministic career preparation readiness data for the authenticated user.
   */
  public static async getCareerReadiness(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.sub || (req as any).user?.userId || (req as any).user?._id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: User identity not found in token.',
        });
        return;
      }

      const careerId = typeof req.query.careerId === 'string' ? req.query.careerId : undefined;

      const readiness = await CareerReadinessService.getCareerReadiness(userId, careerId);

      res.status(200).json({
        success: true,
        data: {
          readiness,
        },
      });
    } catch (error: any) {
      console.error('Error in CareerReadinessController.getCareerReadiness:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error calculating career readiness.',
      });
    }
  }
}
