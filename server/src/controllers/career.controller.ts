import { Request, Response, NextFunction } from 'express';
import { CAREERS_DATA } from '../constants/careers.constants';
import { SavedCareer } from '../models/SavedCareer';
import { PersonalizationService } from '../services/personalization.service';
import { RecommendationService } from '../services/recommendation.service';
import { AiService } from '../services/ai.service';
import { MatchService } from '../services/match.service';
import { sendSuccess, sendError } from '../utils/response';
import config from '../config/env';

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

        let match = null;
        let courseRelevance = null;
        if (userContext) {
          match = MatchService.calculateMatch(c, userContext);
          courseRelevance = RecommendationService.evaluateCourseRelevance(c, userContext);
        }

        return {
          ...c,
          saved: savedIds.has(c.id),
          relevanceTag,
          courseRelevance,
          match
        };
      });

      // Sort result: Dream Career first, then Interested, then Relevant, then others
      result.sort((a, b) => {
        const priority = { 'Dream Career': 3, 'Interested': 2, 'Relevant': 1, null: 0 };
        const scoreA = priority[a.relevanceTag as keyof typeof priority] || 0;
        const scoreB = priority[b.relevanceTag as keyof typeof priority] || 0;
        return scoreB - scoreA;
      });

      sendSuccess(res, 'Careers listed successfully.', {
        careers: result,
        isMockMode: config.CAREER_DATA_MODE === 'mock',
      });
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

      sendSuccess(res, 'Saved careers retrieved successfully.', {
        careers: result,
        isMockMode: config.CAREER_DATA_MODE === 'mock',
      });
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

  /**
   * GET /api/careers/recommended
   * List personalized recommended careers based on user profile.
   */
  public static listRecommendedCareers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const { search, category } = req.query;

      // 1. Fetch user personalization context
      let userContext: any = null;
      try {
        userContext = await PersonalizationService.getPersonalizationContext(userId);
      } catch (err) {
        console.warn('Could not load personalization context in listRecommendedCareers:', err);
      }

      if (!userContext) {
        sendSuccess(res, 'Personalization profile missing. Cannot recommend.', {
          careers: [],
          isProfileComplete: false,
          isMockMode: config.CAREER_DATA_MODE === 'mock'
        });
        return;
      }

      // 2. Fetch recommendations from deterministic layer
      const recs = await RecommendationService.getRecommendedCareers(userContext);
      if (!recs.isProfileComplete) {
        sendSuccess(res, 'Profile incomplete. Complete onboarding first.', {
          careers: [],
          isProfileComplete: false,
          isMockMode: config.CAREER_DATA_MODE === 'mock'
        });
        return;
      }

      // 3. Fetch user's saved career IDs
      const savedDocs = await SavedCareer.find({ userId });
      const savedIds = new Set(savedDocs.map((doc) => doc.careerId));

      // 4. Apply search & category query filters on top of recommended list
      let filtered = [...recs.careers];

      if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
        filtered = filtered.filter(
          (c) => c.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (search && typeof search === 'string') {
        const query = search.toLowerCase().trim();
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.category.toLowerCase().includes(query) ||
            c.skills.some((s: string) => s.toLowerCase().includes(query))
        );
      }

      // 5. Map saved status and relevance tags
      const dreamCareer = userContext?.careerGoals?.dreamCareer || '';
      const interests = userContext?.interests?.careerInterests || [];
      const userDiscipline = userContext?.discipline || '';

      const result = filtered.map((c) => {
        let relevanceTag: 'Dream Career' | 'Interested' | 'Relevant' | null = null;
        
        if (dreamCareer && c.title.toLowerCase() === dreamCareer.toLowerCase()) {
          relevanceTag = 'Dream Career';
        } else if (interests.some((interest: string) => interest.toLowerCase() === c.title.toLowerCase())) {
          relevanceTag = 'Interested';
        } else if (
          userDiscipline &&
          (c.category.toLowerCase().includes(userDiscipline.toLowerCase()) ||
            userDiscipline.toLowerCase().includes(c.category.toLowerCase()))
        ) {
          relevanceTag = 'Relevant';
        }

        let match = null;
        if (userContext) {
          match = MatchService.calculateMatch(c, userContext);
        }

        return {
          ...c,
          saved: savedIds.has(c.id),
          relevanceTag,
          match
        };
      });

      sendSuccess(res, 'Recommended careers retrieved successfully.', {
        careers: result,
        isProfileComplete: true,
        isMockMode: config.CAREER_DATA_MODE === 'mock'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/careers/:id/recommendation-explanation
   * Retrieve natural-language reasoning for a recommendation.
   */
  public static getRecommendationExplanation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const userContext = await PersonalizationService.getPersonalizationContext(userId);
      const explanation = await AiService.generateRecommendationExplanation(career, userContext);

      sendSuccess(res, 'AI recommendation explanation generated successfully.', {
        explanation
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/careers/:id/match
   * Evaluate user profile compatibility against a target career.
   */
  public static getCareerMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const userContext = await PersonalizationService.getPersonalizationContext(userId);
      const match = MatchService.calculateMatch(career, userContext);

      sendSuccess(res, 'Career match calculated successfully.', {
        match
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/careers/:id/match/explanation
   * Generate natural-language analysis for a career match.
   */
  public static getCareerMatchExplanation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const userContext = await PersonalizationService.getPersonalizationContext(userId);
      const match = MatchService.calculateMatch(career, userContext);
      const explanation = await AiService.generateMatchExplanation(career, match, userContext);

      sendSuccess(res, 'Career match explanation generated successfully.', {
        explanation
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/careers/compare or GET /api/careers/compare?ids=c1,c2,c3
   * Compare 1 to 3 careers side-by-side with rich metadata and course relevance.
   */
  public static compareCareers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      let careerIds: string[] = [];

      if (req.body?.careerIds && Array.isArray(req.body.careerIds)) {
        careerIds = req.body.careerIds;
      } else if (req.query?.ids && typeof req.query.ids === 'string') {
        careerIds = req.query.ids.split(',').map((s) => s.trim()).filter(Boolean);
      } else if (req.query?.careerIds) {
        careerIds = Array.isArray(req.query.careerIds)
          ? req.query.careerIds as string[]
          : (req.query.careerIds as string).split(',').map((s) => s.trim()).filter(Boolean);
      }

      if (!careerIds || careerIds.length === 0) {
        sendError(res, 'Please select at least 1 career to compare.', [], 400);
        return;
      }

      if (careerIds.length > 3) {
        sendError(res, 'Maximum 3 careers can be compared at once.', [], 400);
        return;
      }

      // Deduplicate careerIds
      careerIds = Array.from(new Set(careerIds));

      // Fetch user personalization context
      let userContext: any = null;
      try {
        userContext = await PersonalizationService.getPersonalizationContext(userId);
      } catch (err) {
        console.warn('Could not load personalization context in compareCareers:', err);
      }

      // Fetch saved careers
      const savedDocs = await SavedCareer.find({ userId });
      const savedIds = new Set(savedDocs.map((doc) => doc.careerId));

      // Resolve career objects from CAREERS_DATA
      const careers = careerIds.map((id) => {
        const found = CAREERS_DATA.find((c) => c.id === id || c.title.toLowerCase() === id.toLowerCase().replace(/_/g, ' '));
        return found || null;
      }).filter(Boolean);

      if (careers.length === 0) {
        sendError(res, 'None of the requested careers could be found.', [], 404);
        return;
      }

      // Build comparison list
      const comparisonList = careers.map((c: any) => {
        const courseRelevance = userContext
          ? RecommendationService.evaluateCourseRelevance(c, userContext)
          : {
              relevanceLevel: 'Relevant' as const,
              relevanceTag: 'Career Pathway',
              isStronglyRelevant: false,
              reason: 'Explore career details and requirements.',
              relevantSubjects: [],
              entranceRequirements: [],
              learningRequirements: []
            };

        const match = userContext ? MatchService.calculateMatch(c, userContext) : null;

        return {
          id: c.id,
          title: c.title,
          category: c.category,
          description: c.description,
          education: c.education,
          responsibilities: c.responsibilities || [],
          skills: c.skills || [],
          salaryRange: c.salaryRange,
          growthRate: c.growthRate,
          demandLevel: c.demandLevel,
          saved: savedIds.has(c.id),
          isTargetCareer: userContext?.dreamCareer?.toLowerCase() === c.title.toLowerCase(),
          courseRelevance,
          match
        };
      });

      // Compute shared skills and unique skills across compared careers
      const allSkillsSets = comparisonList.map((c) => new Set(c.skills.map((s: string) => s.toLowerCase())));
      
      const sharedSkills = comparisonList.length > 1
        ? comparisonList[0].skills.filter((skill: string) =>
            allSkillsSets.every((set) => set.has(skill.toLowerCase()))
          )
        : comparisonList[0].skills;

      const uniqueSkillsByCareer: Record<string, string[]> = {};
      comparisonList.forEach((c) => {
        const otherSets = allSkillsSets.filter((_, idx) => comparisonList[idx].id !== c.id);
        if (otherSets.length === 0) {
          uniqueSkillsByCareer[c.id] = c.skills;
        } else {
          uniqueSkillsByCareer[c.id] = c.skills.filter(
            (s: string) => !otherSets.some((os) => os.has(s.toLowerCase()))
          );
        }
      });

      sendSuccess(res, 'Career comparison retrieved successfully.', {
        careers: comparisonList,
        sharedSkills,
        uniqueSkillsByCareer,
        userEducation: userContext ? {
          level: userContext.educationLevel,
          stream: userContext.discipline,
          specialization: userContext.specialization,
          currentClass: userContext.currentClass,
          studyYear: userContext.studyYear
        } : null
      });
    } catch (error) {
      next(error);
    }
  };
}
