import mongoose from 'mongoose';
import {
  BusinessIdea,
  IBusinessIdeaDocument,
  BusinessDifficulty,
  StartupPotential,
  BusinessModelType,
} from '../models/BusinessIdea';
import {
  BusinessOpportunity,
  IBusinessOpportunityDocument,
  OpportunityType,
  OpportunityDifficulty,
} from '../models/BusinessOpportunity';
import {
  BusinessProfile,
  IBusinessProfileDocument,
  IBusinessProfile,
} from '../models/BusinessProfile';
import { PersonalizationService } from './personalization.service';

export interface IBusinessIdeaFilters {
  category?: string;
  industry?: string;
  difficulty?: BusinessDifficulty;
  startupPotential?: StartupPotential;
  businessModel?: BusinessModelType;
  skills?: string;
  sortBy?: 'best_match' | 'newest' | 'potential' | 'difficulty' | 'alphabetical';
  search?: string;
  page?: number;
  limit?: number;
}

export interface IBusinessOpportunityFilters {
  search?: string;
  opportunityType?: OpportunityType;
  category?: string;
  industry?: string;
  location?: string;
  isOnline?: boolean;
  difficulty?: OpportunityDifficulty;
  skills?: string;
  sortBy?: 'best_match' | 'deadline' | 'newest' | 'featured' | 'alphabetical';
  page?: number;
  limit?: number;
}

export interface IBusinessIdeaListResult {
  ideas: IBusinessIdeaDocument[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IBusinessOpportunityListResult {
  opportunities: IBusinessOpportunityDocument[];
  total: number;
  page: number;
  totalPages: number;
}

export class BusinessService {
  // ==========================================
  // 1. BUSINESS IDEAS
  // ==========================================

  /**
   * Retrieves business ideas with filtering and pagination.
   */
  public static async getBusinessIdeas(filters: IBusinessIdeaFilters = {}): Promise<IBusinessIdeaListResult> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const query: any = { isActive: true };

    if (filters.category && filters.category.trim().length > 0) {
      query.category = { $regex: new RegExp(`^${filters.category.trim()}$`, 'i') };
    }

    if (filters.industry && filters.industry.trim().length > 0) {
      query.industry = { $regex: new RegExp(`^${filters.industry.trim()}$`, 'i') };
    }

    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }

    if (filters.startupPotential) {
      query.startupPotential = filters.startupPotential;
    }

    if (filters.businessModel) {
      query.businessModel = filters.businessModel;
    }

    if (filters.skills && filters.skills.trim().length > 0) {
      const skillsArray = filters.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (skillsArray.length > 0) {
        query.requiredSkills = { $in: skillsArray.map((s) => new RegExp(`^${s}$`, 'i')) };
      }
    }

    if (filters.search && filters.search.trim().length > 0) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { problem: searchRegex },
        { solution: searchRegex },
        { tags: searchRegex },
        { requiredSkills: searchRegex },
      ];
    }

    // Determine sort object
    let sortObj: any = { createdAt: -1 };
    if (filters.sortBy === 'alphabetical') {
      sortObj = { title: 1 };
    } else if (filters.sortBy === 'newest') {
      sortObj = { createdAt: -1 };
    } else if (filters.sortBy === 'potential') {
      sortObj = { startupPotential: 1, createdAt: -1 };
    } else if (filters.sortBy === 'difficulty') {
      sortObj = { difficulty: 1, createdAt: -1 };
    }

    const [ideas, total] = await Promise.all([
      BusinessIdea.find(query).sort(sortObj).skip(skip).limit(limit),
      BusinessIdea.countDocuments(query),
    ]);

    return {
      ideas,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Retrieves a single business idea by ID.
   */
  public static async getBusinessIdeaById(id: string): Promise<IBusinessIdeaDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return BusinessIdea.findOne({ _id: id, isActive: true });
  }

  // ==========================================
  // 2. BUSINESS OPPORTUNITIES (PHASE 14.3)
  // ==========================================

  /**
   * Retrieves business opportunities with filtering and pagination.
   */
  public static async getBusinessOpportunities(
    filters: IBusinessOpportunityFilters = {}
  ): Promise<IBusinessOpportunityListResult> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const query: any = { isOpen: true };

    if (filters.opportunityType) {
      query.opportunityType = filters.opportunityType;
    }

    if (filters.category && filters.category.trim().length > 0) {
      query.category = { $regex: new RegExp(`^${filters.category.trim()}$`, 'i') };
    }

    if (filters.industry && filters.industry.trim().length > 0) {
      query.industries = { $regex: new RegExp(`^${filters.industry.trim()}$`, 'i') };
    }

    if (filters.location && filters.location.trim().length > 0) {
      query.location = { $regex: new RegExp(filters.location.trim(), 'i') };
    }

    if (typeof filters.isOnline === 'boolean') {
      query.isOnline = filters.isOnline;
    }

    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }

    if (filters.skills && filters.skills.trim().length > 0) {
      const skillsArray = filters.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (skillsArray.length > 0) {
        query.requiredSkills = { $in: skillsArray.map((s) => new RegExp(`^${s}$`, 'i')) };
      }
    }

    if (filters.search && filters.search.trim().length > 0) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { organization: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { industries: searchRegex },
        { tags: searchRegex },
        { requiredSkills: searchRegex },
      ];
    }

    // Determine sort object
    let sortObj: any = { featured: -1, createdAt: -1 };
    if (filters.sortBy === 'deadline') {
      // Show closest deadline first, null deadlines at the end
      sortObj = { deadline: 1, createdAt: -1 };
    } else if (filters.sortBy === 'newest') {
      sortObj = { createdAt: -1 };
    } else if (filters.sortBy === 'featured') {
      sortObj = { featured: -1, createdAt: -1 };
    } else if (filters.sortBy === 'alphabetical') {
      sortObj = { title: 1 };
    }

    const [opportunities, total] = await Promise.all([
      BusinessOpportunity.find(query).sort(sortObj).skip(skip).limit(limit),
      BusinessOpportunity.countDocuments(query),
    ]);

    return {
      opportunities,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Retrieves a single business opportunity by ID.
   */
  public static async getBusinessOpportunityById(id: string): Promise<IBusinessOpportunityDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return BusinessOpportunity.findOne({ _id: id, isOpen: true });
  }

  /**
   * Retrieves recommended opportunities for the authenticated user.
   */
  public static async getRecommendedOpportunities(
    userId: string
  ): Promise<IBusinessOpportunityDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    // Get user personalization & business profile
    const [pContext, businessProfile] = await Promise.all([
      PersonalizationService.getPersonalizationContext(userId).catch(() => null),
      BusinessProfile.findOne({ userId }),
    ]);

    const industries = [
      ...(businessProfile?.interestedIndustries || []),
      ...((pContext?.interests as any)?.industries || []),
      ...((pContext?.careerGoals as any)?.preferredIndustries || []),
    ].filter(Boolean);

    const query: any = { isOpen: true };
    if (industries.length > 0) {
      query.$or = [
        { industries: { $in: industries.map((ind) => new RegExp(`^${ind}$`, 'i')) } },
        { featured: true },
      ];
    }

    const recommendations = await BusinessOpportunity.find(query)
      .sort({ featured: -1, deadline: 1, createdAt: -1 })
      .limit(10);

    return recommendations;
  }

  /**
   * Retrieves saved opportunities for the user.
   */
  public static async getSavedBusinessOpportunities(
    userId: string
  ): Promise<IBusinessOpportunityDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const profile = await BusinessProfile.findOne({ userId }).populate('savedOpportunities');
    if (!profile || !profile.savedOpportunities) {
      return [];
    }

    return profile.savedOpportunities as any;
  }

  /**
   * Saves an opportunity to the user's saved collection.
   */
  public static async saveBusinessOpportunity(
    userId: string,
    opportunityId: string
  ): Promise<IBusinessProfileDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(opportunityId)) {
      throw new Error('Invalid ID format.');
    }

    const opp = await BusinessOpportunity.findOne({ _id: opportunityId, isOpen: true });
    if (!opp) {
      throw new Error('Business opportunity not found or closed.');
    }

    const updated = await BusinessProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $addToSet: { savedOpportunities: new mongoose.Types.ObjectId(opportunityId) } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate('savedBusinessIdeas')
      .populate('savedOpportunities');

    return updated;
  }

  /**
   * Removes a saved opportunity from the user's collection.
   */
  public static async removeSavedBusinessOpportunity(
    userId: string,
    opportunityId: string
  ): Promise<IBusinessProfileDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(opportunityId)) {
      throw new Error('Invalid ID format.');
    }

    const updated = await BusinessProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $pull: { savedOpportunities: new mongoose.Types.ObjectId(opportunityId) } },
      { new: true, upsert: true }
    )
      .populate('savedBusinessIdeas')
      .populate('savedOpportunities');

    return updated;
  }

  // ==========================================
  // 3. BUSINESS PROFILE MANAGEMENT
  // ==========================================

  /**
   * Retrieves the user's business profile with populated saved ideas and opportunities.
   */
  public static async getBusinessProfile(userId: string): Promise<IBusinessProfileDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    let profile = await BusinessProfile.findOne({ userId })
      .populate('savedBusinessIdeas')
      .populate('savedOpportunities');

    if (!profile) {
      profile = await BusinessProfile.create({
        userId: new mongoose.Types.ObjectId(userId),
        interestedIndustries: [],
        interests: [],
        preferredBusinessTypes: [],
        entrepreneurshipExperience: 'Exploring',
        goals: [],
        availableTime: '5–10 hours/week',
        preferredStartupStage: 'Exploring',
        savedBusinessIdeas: [],
        savedOpportunities: [],
        onboardingCompleted: false,
      });
    }

    return profile;
  }

  /**
   * Creates or updates the user's business profile.
   */
  public static async updateBusinessProfile(
    userId: string,
    data: Partial<IBusinessProfile>
  ): Promise<IBusinessProfileDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const updatePayload: any = { ...data };
    delete updatePayload.userId;
    delete updatePayload._id;

    const profile = await BusinessProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: updatePayload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate('savedBusinessIdeas')
      .populate('savedOpportunities');

    return profile;
  }

  /**
   * Saves a business idea to the user's saved collection.
   */
  public static async saveBusinessIdea(
    userId: string,
    ideaId: string
  ): Promise<IBusinessProfileDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ideaId)) {
      throw new Error('Invalid ID format.');
    }

    const idea = await BusinessIdea.findOne({ _id: ideaId, isActive: true });
    if (!idea) {
      throw new Error('Business idea not found.');
    }

    const updated = await BusinessProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $addToSet: { savedBusinessIdeas: new mongoose.Types.ObjectId(ideaId) } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate('savedBusinessIdeas')
      .populate('savedOpportunities');

    return updated;
  }

  /**
   * Removes a saved business idea from the user's collection.
   */
  public static async removeSavedBusinessIdea(
    userId: string,
    ideaId: string
  ): Promise<IBusinessProfileDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ideaId)) {
      throw new Error('Invalid ID format.');
    }

    const updated = await BusinessProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $pull: { savedBusinessIdeas: new mongoose.Types.ObjectId(ideaId) } },
      { new: true, upsert: true }
    )
      .populate('savedBusinessIdeas')
      .populate('savedOpportunities');

    return updated;
  }
}
