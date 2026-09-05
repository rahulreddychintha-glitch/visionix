import { Request, Response } from 'express';
import { NextStepService } from '../services/nextStep.service';

export class NextStepController {
  /**
   * GET /api/next-step
   * Returns deterministic, single-priority next action, current position,
   * factor breakdown, and secondary actions for the authenticated student.
   */
  public static async getNextStep(req: Request, res: Response): Promise<void> {
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

      const nextStepData = await NextStepService.getNextStep(userId, careerId);

      res.status(200).json({
        success: true,
        data: nextStepData,
      });
    } catch (error: any) {
      console.error('Error in NextStepController.getNextStep:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error evaluating your next step.',
      });
    }
  }
}
