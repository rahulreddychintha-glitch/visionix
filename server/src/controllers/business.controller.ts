import { Request, Response, NextFunction } from 'express';
import { BusinessService } from '../services/business.service';
import { sendSuccess, sendError } from '../utils/response';

export class BusinessController {
  // ==========================================
  // 1. BUSINESS IDEAS CONTROLLERS
  // ==========================================

  /**
   * GET /api/business/ideas
   * Get business ideas with filtering and pagination.
   */
  public static getBusinessIdeas = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        industry: req.query.industry as string | undefined,
        difficulty: req.query.difficulty as any,
        startupPotential: req.query.startupPotential as any,
        businessModel: req.query.businessModel as any,
        skills: req.query.skills as string | undefined,
        sortBy: req.query.sortBy as any,
        search: req.query.search as string | undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
      };

      const result = await BusinessService.getBusinessIdeas(filters);
      sendSuccess(res, 'Business ideas retrieved successfully.', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/business/ideas/:id
   * Get a specific business idea by ID.
   */
  public static getBusinessIdeaById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const idea = await BusinessService.getBusinessIdeaById(req.params.id);
      if (!idea) {
        sendError(res, 'Business idea not found.', [], 404);
        return;
      }
      sendSuccess(res, 'Business idea retrieved successfully.', { idea });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/business/ideas/:id/save
   * Save a business idea to the user's saved list.
   */
  public static saveBusinessIdea = async (
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
      const profile = await BusinessService.saveBusinessIdea(userId, req.params.id);
      sendSuccess(res, 'Business idea saved successfully.', { profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/business/ideas/:id/save
   * Remove a saved business idea from the user's saved list.
   */
  public static removeSavedBusinessIdea = async (
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
      const profile = await BusinessService.removeSavedBusinessIdea(userId, req.params.id);
      sendSuccess(res, 'Business idea removed from saved list.', { profile });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // 2. OPPORTUNITIES CONTROLLERS (PHASE 14.3)
  // ==========================================

  /**
   * GET /api/business/opportunities
   * Get business opportunities with filtering and pagination.
   */
  public static getBusinessOpportunities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        opportunityType: req.query.opportunityType as any,
        category: req.query.category as string | undefined,
        industry: req.query.industry as string | undefined,
        location: req.query.location as string | undefined,
        isOnline: req.query.isOnline !== undefined ? req.query.isOnline === 'true' : undefined,
        difficulty: req.query.difficulty as any,
        skills: req.query.skills as string | undefined,
        sortBy: req.query.sortBy as any,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
      };

      const result = await BusinessService.getBusinessOpportunities(filters);
      sendSuccess(res, 'Business opportunities retrieved successfully.', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/business/opportunities/recommended
   * Get recommended opportunities for the authenticated user.
   */
  public static getRecommendedOpportunities = async (
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
      const recommendations = await BusinessService.getRecommendedOpportunities(userId);
      sendSuccess(res, 'Recommended opportunities retrieved successfully.', { opportunities: recommendations });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/business/opportunities/saved
   * Get saved opportunities for the authenticated user.
   */
  public static getSavedBusinessOpportunities = async (
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
      const saved = await BusinessService.getSavedBusinessOpportunities(userId);
      sendSuccess(res, 'Saved opportunities retrieved successfully.', { opportunities: saved });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/business/opportunities/:id
   * Get a specific opportunity by ID.
   */
  public static getBusinessOpportunityById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const opportunity = await BusinessService.getBusinessOpportunityById(req.params.id);
      if (!opportunity) {
        sendError(res, 'Business opportunity not found.', [], 404);
        return;
      }
      sendSuccess(res, 'Business opportunity retrieved successfully.', { opportunity });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/business/opportunities/:id/save
   * Save an opportunity to the user's bookmarks.
   */
  public static saveBusinessOpportunity = async (
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
      const profile = await BusinessService.saveBusinessOpportunity(userId, req.params.id);
      sendSuccess(res, 'Opportunity saved successfully.', { profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/business/opportunities/:id/save
   * Remove a saved opportunity from the user's bookmarks.
   */
  public static removeSavedBusinessOpportunity = async (
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
      const profile = await BusinessService.removeSavedBusinessOpportunity(userId, req.params.id);
      sendSuccess(res, 'Opportunity removed from saved list.', { profile });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // 3. BUSINESS PROFILE CONTROLLERS
  // ==========================================

  /**
   * GET /api/business/profile
   * Get the authenticated user's Business Profile.
   */
  public static getBusinessProfile = async (
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
      const profile = await BusinessService.getBusinessProfile(userId);
      sendSuccess(res, 'Business profile retrieved successfully.', { profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/business/profile
   * Create or initialize the authenticated user's Business Profile.
   */
  public static createBusinessProfile = async (
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
      const profile = await BusinessService.updateBusinessProfile(userId, req.body);
      sendSuccess(res, 'Business profile created successfully.', { profile }, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/business/profile
   * Update the authenticated user's Business Profile.
   */
  public static updateBusinessProfile = async (
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
      const profile = await BusinessService.updateBusinessProfile(userId, req.body);
      sendSuccess(res, 'Business profile updated successfully.', { profile });
    } catch (error) {
      next(error);
    }
  };
}
