import { Request, Response } from 'express';
import { CareerPathsService } from '../services/careerPaths.service';

export class CareerPathsController {
  /**
   * GET /api/career-paths
   * Returns deterministic Alternative Careers and Backup Career Paths for the authenticated student.
   */
  public static async getCareerPaths(req: Request, res: Response): Promise<void> {
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

      const careerPaths = await CareerPathsService.getCareerPaths(userId, careerId);

      res.status(200).json({
        success: true,
        data: {
          careerPaths,
        },
      });
    } catch (error: any) {
      console.error('Error in CareerPathsController.getCareerPaths:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error evaluating career paths.',
      });
    }
  }
}
