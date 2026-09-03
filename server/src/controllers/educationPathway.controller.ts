import { Request, Response, NextFunction } from 'express';
import { EducationPathwayService } from '../services/educationPathway.service';
import { sendSuccess } from '../utils/response';

export class EducationPathwayController {
  /**
   * GET /api/education-pathways
   * Returns the standalone Indian Education Progression Tree, searchable nodes catalog,
   * comparison presets, and the authenticated student's "YOU ARE HERE" location (if logged in).
   */
  public static getPathways = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.sub;
      const data = await EducationPathwayService.getEducationPathways(userId);

      sendSuccess(res, 'Education pathways and progression tree retrieved successfully.', data);
    } catch (error) {
      next(error);
    }
  };
}
