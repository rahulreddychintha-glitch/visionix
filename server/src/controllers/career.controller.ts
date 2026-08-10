import { Request, Response, NextFunction } from 'express';
import { CAREERS_DATA } from '../constants/careers.constants';
import { SavedCareer } from '../models/SavedCareer';
import { PersonalizationService } from '../services/personalization.service';
import { sendSuccess, sendError } from '../utils/response';

export class CareerController {
  /**
   * GET /api/careers
   * List all careers. Supports search, category filtering, and returns deterministic relevance tags based on user profile.
   */
  public static listCareers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const { search, category } = req.query;

      // 1. Fetch user personalization context to determine relevance tags deterministically
      let userContext: any = null;
      try {
        userContext = await PersonalizationService.getPersonalizationContext(userId);
      } catch (err) {
        console.warn('Could not load personalization context in listCareers:', err);
      }

      // 2. Fetch user's saved career IDs to set the "saved" flag
      const savedDocs = await SavedCareer.find({ userId });
      const savedIds = new Set(savedDocs.map((doc) => doc.careerId));

      // 3. Filter and map careers
      let filteredCareers = [...CAREERS_DATA];

      // Filter by Category
      if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
        filteredCareers = filteredCareers.filter(
          (c) => c.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Filter by Search Query (title, category, or skills)
      if (search && typeof search === 'string') {
        const query = search.toLowerCase().trim();
        filteredCareers = filteredCareers.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.category.toLowerCase().includes(query) ||
            c.skills.some((s) => s.toLowerCase().includes(query))
        );
      }

      // 4. Populate relevance tag and saved flag
      const dreamCareer = userContext?.careerGoals?.dreamCareer || '';
      const interests = userContext?.interests?.careerInterests || [];
      const userDiscipline = userContext?.discipline || '';

      const result = filteredCareers.map((c) => {
        let relevanceTag: 'Dream Career' | 'Interested' | 'Relevant' | null = null;
        
        // Deterministic check: Matches user's specified dream career
        if (dreamCareer && c.title.toLowerCase() === dreamCareer.toLowerCase()) {
          relevanceTag = 'Dream Career';
        }
        // Deterministic check: Matches user's onboarding interests
        else if (interests.some((interest: string) => interest.toLowerCase() === c.title.toLowerCase())) {
          relevanceTag = 'Interested';
        }
        // Deterministic check: Matches category to user discipline/stream
        else if (
          userDiscipline &&
          (c.category.toLowerCase().includes(userDiscipline.toLowerCase()) ||
            userDiscipline.toLowerCase().includes(c.category.toLowerCase()))
        ) {
          relevanceTag = 'Relevant';
        }

        return {
          ...c,
          saved: savedIds.has(c.id),
          relevanceTag,
        };
      });

      // Sort result: Dream Career first, then Interested, then Relevant, then others
      result.sort((a, b) => {
        const priority = { 'Dream Career': 3, 'Interested': 2, 'Relevant': 1, null: 0 };
        const scoreA = priority[a.relevanceTag as keyof typeof priority] || 0;
        const scoreB = priority[b.relevanceTag as keyof typeof priority] || 0;
        return scoreB - scoreA;
      });

      sendSuccess(res, 'Careers listed successfully.', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/careers/saved
   * Get all bookmarked careers for the authenticated user.
   */
  public static getSavedCareers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const savedDocs = await SavedCareer.find({ userId });
      const savedIds = new Set(savedDocs.map((doc) => doc.careerId));

      const result = CAREERS_DATA.filter((c) => savedIds.has(c.id)).map((c) => ({
        ...c,
        saved: true,
      }));

      sendSuccess(res, 'Saved careers retrieved successfully.', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/careers/:id
   * Get detailed information for a single career by ID.
   */
  public static getCareerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const { id } = req.params;
      const userId = req.user.sub;

      const career = CAREERS_DATA.find((c) => c.id === id);
      if (!career) {
        sendError(res, 'Career not found.', [], 404);
        return;
      }

      const isSaved = await SavedCareer.exists({ userId, careerId: id });

      sendSuccess(res, 'Career details retrieved successfully.', {
        ...career,
        saved: !!isSaved,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/careers/:id/save
   * Bookmark a career.
   */
  public static saveCareer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const { id } = req.params;
      const userId = req.user.sub;

      const career = CAREERS_DATA.find((c) => c.id === id);
      if (!career) {
        sendError(res, 'Career not found.', [], 404);
        return;
      }

      // Save bookmark (using upsert/findAndUpdate or try-catch for duplicate keys)
      await SavedCareer.findOneAndUpdate(
        { userId, careerId: id },
        { userId, careerId: id },
        { upsert: true, new: true }
      );

      sendSuccess(res, 'Career bookmarked successfully.', { careerId: id, saved: true });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/careers/:id/save
   * Remove a bookmarked career.
   */
  public static unsaveCareer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const { id } = req.params;
      const userId = req.user.sub;

      await SavedCareer.findOneAndDelete({ userId, careerId: id });

      sendSuccess(res, 'Career removed from bookmarks successfully.', { careerId: id, saved: false });
    } catch (error) {
      next(error);
    }
  };
}
