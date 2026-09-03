import mongoose from 'mongoose';
import { LearningResource, ILearningResourceDocument, ResourceDifficulty } from '../models/LearningResource';
import { LearningProgress, ILearningProgressDocument } from '../models/LearningProgress';
import { CURATED_LEARNING_RESOURCES } from '../constants/learningResources.constants';
import { PersonalizationService, IPersonalizationContext } from './personalization.service';
import { SkillNavigatorService } from './skillNavigator.service';
import { RoadmapService } from './roadmap.service';
import { CAREERS_DATA } from '../constants/careers.constants';

export interface ILearningHubFilterParams {
  search?: string;
  career?: string;
  skill?: string;
  educationLevel?: string;
  resourceType?: string;
  difficulty?: string;
  topicCategory?: string;
  provider?: string;
}

export interface IEnrichedLearningResource {
  resourceId: string;
  title: string;
  description: string;
  url: string;
  provider: string;
  type: string;
  thumbnail?: string;
  channel?: string;
  careerIds: string[];
  skills: string[];
  educationLevels: string[];
  topicCategory: string;
  difficulty: ResourceDifficulty;
  duration?: string;
  tags: string[];
  relevanceScore?: number;
  relevanceReason?: string;
  isBookmarked: boolean;
  progressStatus: 'not_started' | 'in_progress' | 'completed';
  startedAt?: string;
  completedAt?: string | null;
  roadmapMilestone?: {
    stageNumber: number;
    stageTitle: string;
    milestoneTitle: string;
  };
}

export class LearningHubService {
  private static isSeeded = false;

  /**
   * Helper: Ensure curated high-quality resources are present in database
   */
  public static async seedCuratedResources(): Promise<void> {
    if (this.isSeeded) return;

    try {
      for (const res of CURATED_LEARNING_RESOURCES) {
        await LearningResource.findOneAndUpdate(
          { resourceId: res.resourceId },
          { ...res },
          { upsert: true, new: true }
        );
      }
      this.isSeeded = true;
    } catch (err) {
      console.warn('[LearningHubService] Failed to upsert curated resources:', err);
    }
  }

  /**
   * Retrieves comprehensive, deterministic, personalized Learning Hub 2.0 data
   */
  public static async getPersonalizedLearningHubData(
    userId: string,
    filters: ILearningHubFilterParams = {}
  ): Promise<{
    targetCareer: { id: string; title: string; category: string } | null;
    educationContext: { level?: string; stream?: string; branchSpecialization?: string } | null;
    recommendedNextStep: {
      milestoneTitle: string;
      targetSkill: string;
      reason: string;
      resource: IEnrichedLearningResource | null;
    } | null;
    priorityMissingSkills: Array<{ name: string; count: number; priority: string }>;
    recommendedResources: IEnrichedLearningResource[];
    catalog: IEnrichedLearningResource[];
    continueLearning: IEnrichedLearningResource[];
    completedLearning: IEnrichedLearningResource[];
    bookmarkedResources: IEnrichedLearningResource[];
    availableFilters: {
      careers: Array<{ id: string; title: string }>;
      skills: string[];
      categories: string[];
      resourceTypes: string[];
      difficulties: string[];
      providers: string[];
    };
  }> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Ensure initial seeding of canonical resources
    await this.seedCuratedResources();

    // 2. Fetch all relevant contextual data concurrently
    const [pContext, skillGapDoc, activeRoadmap, progressDoc, dbResources] = await Promise.all([
      PersonalizationService.getPersonalizationContext(userId),
      SkillNavigatorService.getLatestAnalysis(userId).catch(() => null),
      RoadmapService.getRoadmap(userId).catch(() => null),
      LearningProgress.findOne({ userId: userObjectId }),
      LearningResource.find({}).sort({ createdAt: -1 }),
    ]);

    // 3. Resolve Target Career
    const targetCareer = SkillNavigatorService.resolveTargetCareer(undefined, pContext);

    // 4. Resolve Education Stage
    const educationLevel = pContext.educationLevel || 'undergraduate';

    // 5. Extract Missing & Priority Skills from Phase 23 Skill Gap Analysis
    const missingSkills = skillGapDoc?.missingSkills || [];
    const missingSkillNames = missingSkills.map((s) => s.skillName);
    const criticalSkills = missingSkills.filter((s) => s.priority === 'Critical' || s.priority === 'High').map((s) => s.skillName);

    // 6. Extract Active Roadmap Milestone & Skills
    let currentMilestone: any = null;
    let currentMilestoneStageNumber = 1;
    let currentMilestoneStageTitle = '';
    if (activeRoadmap && activeRoadmap.stages) {
      for (let i = 0; i < activeRoadmap.stages.length; i++) {
        const stage = activeRoadmap.stages[i];
        const found = stage.milestones.find(
          (m: any) => !m.completed && m.status !== 'Completed & Verified' && m.status !== 'Completed — Review Recommended'
        );
        if (found) {
          currentMilestone = found;
          currentMilestoneStageNumber = i + 1;
          currentMilestoneStageTitle = stage.title;
          break;
        }
      }
    }

    // 7. Index user progress & bookmarks
    const userProgressMap = new Map<string, { status: 'in_progress' | 'completed'; startedAt?: string; completedAt?: string | null }>();
    if (progressDoc && progressDoc.resources) {
      progressDoc.resources.forEach((r) => {
        userProgressMap.set(r.resourceId, {
          status: r.status,
          startedAt: r.startedAt ? r.startedAt.toISOString() : undefined,
          completedAt: r.completedAt ? r.completedAt.toISOString() : null,
        });
      });
    }

    const bookmarkedSet = new Set<string>(progressDoc?.bookmarkedResources || []);

    // 8. Calculate Deterministic Relevance for Every Resource
    const allEnrichedResources: IEnrichedLearningResource[] = dbResources.map((res: ILearningResourceDocument) => {
      let score = 0;
      let reason = 'General foundational learning resource';

      // Phase 23 Critical / High Missing Skill (+50)
      const matchesCriticalSkill = res.skills.some((sk) =>
        criticalSkills.some((cs) => SkillNavigatorService.isSkillMatch(sk, cs))
      );
      if (matchesCriticalSkill) {
        score += 50;
        const matchedSkillName = res.skills.find((sk) => criticalSkills.some((cs) => SkillNavigatorService.isSkillMatch(sk, cs))) || res.skills[0];
        reason = `Directly targets high-priority missing skill: ${matchedSkillName}`;
      }

      // Active Roadmap Milestone Skill (+40)
      if (currentMilestone && currentMilestone.skills) {
        const matchesMilestone = res.skills.some((sk) =>
          currentMilestone.skills.some((ms: string) => SkillNavigatorService.isSkillMatch(sk, ms))
        );
        if (matchesMilestone) {
          score += 40;
          if (!matchesCriticalSkill) {
            reason = `Required by current roadmap milestone: "${currentMilestone.title}"`;
          }
        }
      }

      // Target Career Match (+30)
      if (targetCareer && res.careerIds.includes(targetCareer.id)) {
        score += 30;
        if (!matchesCriticalSkill && !reason.includes('roadmap')) {
          reason = `Mapped core learning resource for ${targetCareer.title}`;
        }
      }

      // Target Career Required Skill (+20)
      if (targetCareer && targetCareer.skills) {
        const matchesReqSkill = res.skills.some((sk) =>
          targetCareer.skills.some((tcs) => SkillNavigatorService.isSkillMatch(sk, tcs))
        );
        if (matchesReqSkill) {
          score += 20;
        }
      }

      // Education Stage Match (+15)
      if (res.educationLevels && res.educationLevels.includes(educationLevel.toLowerCase())) {
        score += 15;
      }

      // Profile Self-Reported Skills (+10)
      const userProfileSkills = pContext.skills?.technicalSkills || [];
      if (res.skills.some((sk) => userProfileSkills.some((ups: string) => SkillNavigatorService.isSkillMatch(sk, ups)))) {
        score += 10;
      }

      const prog = userProgressMap.get(res.resourceId);
      const isBookmarked = bookmarkedSet.has(res.resourceId);

      return {
        resourceId: res.resourceId,
        title: res.title,
        description: res.description,
        url: res.url,
        provider: res.provider,
        type: res.type,
        thumbnail: res.thumbnail,
        channel: res.channel,
        careerIds: res.careerIds || [],
        skills: res.skills || [],
        educationLevels: res.educationLevels || [],
        topicCategory: res.topicCategory || 'General Learning',
        difficulty: res.difficulty || 'Beginner',
        duration: res.duration || '',
        tags: res.tags || [],
        relevanceScore: score,
        relevanceReason: reason,
        isBookmarked,
        progressStatus: prog ? prog.status : 'not_started',
        startedAt: prog?.startedAt,
        completedAt: prog?.completedAt,
        roadmapMilestone: currentMilestone && currentMilestone.skills && res.skills.some((sk) => currentMilestone.skills.includes(sk))
          ? {
              stageNumber: currentMilestoneStageNumber,
              stageTitle: currentMilestoneStageTitle,
              milestoneTitle: currentMilestone.title,
            }
          : undefined,
      };
    });

    // 9. Recommended Next Step (Top #1 Resource)
    let recommendedNextStep: any = null;
    const sortedByRelevance = allEnrichedResources.slice().sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    const topRecommendedResource = sortedByRelevance.length > 0 ? sortedByRelevance[0] : null;

    if (currentMilestone) {
      recommendedNextStep = {
        milestoneTitle: currentMilestone.title,
        targetSkill: currentMilestone.skills?.[0] || 'Active Skill',
        reason: `Recommended because "${currentMilestone.title}" is your active roadmap milestone.`,
        resource: topRecommendedResource,
      };
    } else if (topRecommendedResource) {
      recommendedNextStep = {
        milestoneTitle: topRecommendedResource.skills[0] || 'Recommended Focus',
        targetSkill: topRecommendedResource.skills[0] || 'Core Skill',
        reason: topRecommendedResource.relevanceReason || 'Top recommended resource for your target path.',
        resource: topRecommendedResource,
      };
    }

    // 10. Filter Processing
    let filteredCatalog = allEnrichedResources.slice();

    if (filters.search && filters.search.trim().length > 0) {
      const q = filters.search.toLowerCase().trim();
      filteredCatalog = filteredCatalog.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.skills.some((s) => s.toLowerCase().includes(q)) ||
        r.careerIds.some((c) => c.toLowerCase().includes(q)) ||
        r.provider.toLowerCase().includes(q) ||
        r.topicCategory.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.career && filters.career !== 'All') {
      filteredCatalog = filteredCatalog.filter((r) => r.careerIds.includes(filters.career!));
    }

    if (filters.skill && filters.skill !== 'All') {
      filteredCatalog = filteredCatalog.filter((r) =>
        r.skills.some((s) => SkillNavigatorService.isSkillMatch(s, filters.skill!))
      );
    }

    if (filters.educationLevel && filters.educationLevel !== 'All') {
      filteredCatalog = filteredCatalog.filter((r) =>
        r.educationLevels.includes(filters.educationLevel!.toLowerCase())
      );
    }

    if (filters.resourceType && filters.resourceType !== 'All') {
      filteredCatalog = filteredCatalog.filter((r) => r.type === filters.resourceType);
    }

    if (filters.difficulty && filters.difficulty !== 'All') {
      filteredCatalog = filteredCatalog.filter((r) => r.difficulty === filters.difficulty);
    }

    if (filters.topicCategory && filters.topicCategory !== 'All') {
      filteredCatalog = filteredCatalog.filter((r) => r.topicCategory === filters.topicCategory);
    }

    if (filters.provider && filters.provider !== 'All') {
      filteredCatalog = filteredCatalog.filter((r) => r.provider === filters.provider);
    }

    // Sort by relevance score descending by default
    filteredCatalog.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    // 11. Priority Missing Skills summary list
    const priorityMissingSkills = missingSkills.slice(0, 8).map((ms) => {
      const count = allEnrichedResources.filter((r) =>
        r.skills.some((s) => SkillNavigatorService.isSkillMatch(s, ms.skillName))
      ).length;
      return {
        name: ms.skillName,
        count,
        priority: ms.priority,
      };
    });

    // 12. Continue & Completed Lists
    const continueLearning = allEnrichedResources.filter((r) => r.progressStatus === 'in_progress');
    const completedLearning = allEnrichedResources.filter((r) => r.progressStatus === 'completed');
    const bookmarkedResources = allEnrichedResources.filter((r) => r.isBookmarked);

    // 13. Top Recommended (Unstarted high relevance resources)
    const recommendedResources = allEnrichedResources
      .filter((r) => r.progressStatus !== 'completed')
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, 6);

    // 14. Extract available filter values
    const allSkillsSet = new Set<string>();
    const allCategoriesSet = new Set<string>();
    const allTypesSet = new Set<string>();
    const allDifficultiesSet = new Set<string>();
    const allProvidersSet = new Set<string>();

    allEnrichedResources.forEach((r) => {
      r.skills.forEach((s) => allSkillsSet.add(s));
      allCategoriesSet.add(r.topicCategory);
      allTypesSet.add(r.type);
      allDifficultiesSet.add(r.difficulty);
      allProvidersSet.add(r.provider);
    });

    const careerFilterOptions = CAREERS_DATA.slice(0, 15).map((c) => ({ id: c.id, title: c.title }));

    return {
      targetCareer: targetCareer ? { id: targetCareer.id, title: targetCareer.title, category: targetCareer.category } : null,
      educationContext: {
        level: pContext.educationLevel,
        stream: pContext.discipline,
        branchSpecialization: pContext.specialization,
      },
      recommendedNextStep,
      priorityMissingSkills,
      recommendedResources,
      catalog: filteredCatalog,
      continueLearning,
      completedLearning,
      bookmarkedResources,
      availableFilters: {
        careers: careerFilterOptions,
        skills: Array.from(allSkillsSet).sort(),
        categories: Array.from(allCategoriesSet).sort(),
        resourceTypes: Array.from(allTypesSet).sort(),
        difficulties: Array.from(allDifficultiesSet).sort(),
        providers: Array.from(allProvidersSet).sort(),
      },
    };
  }
}
