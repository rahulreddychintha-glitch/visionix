import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ResumeService } from '../services/resume.service';
import { sendSuccess, sendError } from '../utils/response';

const formatValidationErrors = (errors: ReturnType<typeof validationResult>) => {
  return errors.array().map((err) => {
    const field = err.type === 'field' ? err.path : undefined;
    return {
      field,
      message: err.msg,
    };
  });
};

export class ResumeController {
  /**
   * GET /api/resume
   * List all resumes owned by the authenticated user.
   */
  public static getResumes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const resumes = await ResumeService.getUserResumes(userId);

      sendSuccess(res, 'Resumes retrieved successfully.', { resumes });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/resume/prefill
   * Retrieve structured prefill data from user profile and verified skills.
   */
  public static getProfilePrefill = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const prefillData = await ResumeService.getProfilePrefillData(userId);

      sendSuccess(res, 'Profile prefill data retrieved.', { prefill: prefillData });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/resume/:id
   * Fetch a single resume by ID.
   */
  public static getResume = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        sendError(res, 'Validation error.', formatValidationErrors(errors), 400);
        return;
      }

      const userId = req.user.sub;
      const resumeId = req.params.id;

      const resume = await ResumeService.getResumeById(userId, resumeId);
      if (!resume) {
        sendError(res, 'Resume not found or unauthorized.', [], 404);
        return;
      }

      sendSuccess(res, 'Resume retrieved successfully.', { resume });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/resume
   * Create a new resume with optional profile prefill.
   */
  public static createResume = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        sendError(res, 'Validation error.', formatValidationErrors(errors), 400);
        return;
      }

      const userId = req.user.sub;
      const prefill = req.query.prefill === 'true' || req.body.prefillFromProfile === true;

      const resume = await ResumeService.createResume(userId, req.body, prefill);
      sendSuccess(res, 'Resume created successfully.', { resume }, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/resume/:id
   * Update an existing resume owned by user.
   */
  public static updateResume = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        sendError(res, 'Validation error.', formatValidationErrors(errors), 400);
        return;
      }

      const userId = req.user.sub;
      const resumeId = req.params.id;

      const updated = await ResumeService.updateResume(userId, resumeId, req.body);
      if (!updated) {
        sendError(res, 'Resume not found or unauthorized to edit.', [], 404);
        return;
      }

      sendSuccess(res, 'Resume updated successfully.', { resume: updated });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/resume/:id
   * Delete an existing resume owned by user.
   */
  public static deleteResume = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        sendError(res, 'Validation error.', formatValidationErrors(errors), 400);
        return;
      }

      const userId = req.user.sub;
      const resumeId = req.params.id;

      const deleted = await ResumeService.deleteResume(userId, resumeId);
      if (!deleted) {
        sendError(res, 'Resume not found or unauthorized to delete.', [], 404);
        return;
      }

      sendSuccess(res, 'Resume deleted successfully.', { success: true });
    } catch (error) {
      next(error);
    }
  };
}
