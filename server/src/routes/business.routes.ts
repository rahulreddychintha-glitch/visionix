import { Router } from 'express';
import { BusinessController } from '../controllers/business.controller';
import startupRoadmapRoutes from './startupRoadmap.routes';
import businessAssistantRoutes from './businessAssistant.routes';
import { authenticate } from '../middleware/auth';
import {
  businessProfileValidator,
  businessIdParamValidator,
  businessIdeaQueryValidator,
  opportunityQueryValidator,
} from '../validators/business.validator';

const router = Router();

// ==========================================
// 1. BUSINESS IDEAS (PHASE 14.1 / 14.2)
// ==========================================

/**
 * GET /api/business/ideas
 * Get business ideas with filtering and pagination.
 */
router.get('/ideas', businessIdeaQueryValidator, BusinessController.getBusinessIdeas);

/**
 * GET /api/business/ideas/:id
 * Get a specific business idea by ID.
 */
router.get('/ideas/:id', businessIdParamValidator, BusinessController.getBusinessIdeaById);

/**
 * POST /api/business/ideas/:id/save
 * Save a business idea.
 */
router.post('/ideas/:id/save', authenticate, businessIdParamValidator, BusinessController.saveBusinessIdea);

/**
 * DELETE /api/business/ideas/:id/save
 * Remove a saved business idea.
 */
router.delete('/ideas/:id/save', authenticate, businessIdParamValidator, BusinessController.removeSavedBusinessIdea);

// ==========================================
// 2. OPPORTUNITIES (PHASE 14.3)
// ==========================================

/**
 * GET /api/business/opportunities/recommended
 * Get personalized recommended opportunities for user.
 */
router.get('/opportunities/recommended', authenticate, BusinessController.getRecommendedOpportunities);

/**
 * GET /api/business/opportunities/saved
 * Get saved opportunities for authenticated user.
 */
router.get('/opportunities/saved', authenticate, BusinessController.getSavedBusinessOpportunities);

/**
 * GET /api/business/opportunities
 * Get business opportunities with filtering and pagination.
 */
router.get('/opportunities', opportunityQueryValidator, BusinessController.getBusinessOpportunities);

/**
 * GET /api/business/opportunities/:id
 * Get a specific opportunity by ID.
 */
router.get('/opportunities/:id', businessIdParamValidator, BusinessController.getBusinessOpportunityById);

/**
 * POST /api/business/opportunities/:id/save
 * Save an opportunity.
 */
router.post('/opportunities/:id/save', authenticate, businessIdParamValidator, BusinessController.saveBusinessOpportunity);

/**
 * DELETE /api/business/opportunities/:id/save
 * Remove a saved opportunity.
 */
router.delete('/opportunities/:id/save', authenticate, businessIdParamValidator, BusinessController.removeSavedBusinessOpportunity);

// ==========================================
// 3. STARTUP ROADMAP & MILESTONES (PHASE 14.4)
// ==========================================
router.use('/roadmaps', startupRoadmapRoutes);

// ==========================================
// 4. AI BUSINESS ASSISTANT & PITCH (PHASE 14.4)
// ==========================================
router.use('/assistant', businessAssistantRoutes);

// ==========================================
// 5. BUSINESS PROFILE (PHASE 14.1)
// ==========================================

/**
 * GET /api/business/profile
 * Get the authenticated user's Business Profile.
 */
router.get('/profile', authenticate, BusinessController.getBusinessProfile);

/**
 * POST /api/business/profile
 * Create the authenticated user's Business Profile.
 */
router.post('/profile', authenticate, businessProfileValidator, BusinessController.createBusinessProfile);

/**
 * PUT /api/business/profile
 * Update the authenticated user's Business Profile.
 */
router.put('/profile', authenticate, businessProfileValidator, BusinessController.updateBusinessProfile);

export default router;
