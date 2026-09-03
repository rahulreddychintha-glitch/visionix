import mongoose from 'mongoose';
import { LearningResource, ILearningResourceDocument, ResourceDifficulty } from '../models/LearningResource';
import { LearningProgress } from '../models/LearningProgress';
import { PersonalizationService } from './personalization.service';
import { SkillNavigatorService } from './skillNavigator.service';
import { RoadmapService } from './roadmap.service';
import { LearningHubService } from './learningHub.service';
import { CAREERS_DATA } from '../constants/careers.constants';

export interface ICourseFilterOptions {
  careerId?: string;
  skill?: string;
  difficulty?: string;
  provider?: string;
  search?: string;
  resourceType?: string;
}

export interface IRecommendedCourseItem {
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
  relevanceScore: number;
  recommendationReason: string;
  priorityLevel: 'Critical' | 'High' | 'Medium' | 'Supporting' | 'General';
  primaryTargetSkill: string;
  coveredMissingSkills: string[];
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

export interface ISkillBasedCourseGroup {
  skillName: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Supporting';
  status: 'Missing' | 'Developing' | 'Target Required';
  coursesCount: number;
  courses: IRecommendedCourseItem[];
}

export interface ICourseRecommendationsResponse {
  hasTargetCareer: boolean;
  is100PercentCovered: boolean;
  targetCareer: {
    id: string;
    title: string;
    category: string;
    salaryRange?: string;
    demandLevel?: string;
  } | null;
  educationStage: string;
  summary: {
    totalRecommended: number;
    totalGapsTargeted: number;
    totalMissingGaps: number;
    coveragePercentage: number;
    topMissingSkill: string | null;
  };
  topPriorityCourses: IRecommendedCourseItem[];
  skillBasedRecommendations: ISkillBasedCourseGroup[];
  allRecommendedCourses: IRecommendedCourseItem[];
  availableFilters: {
    skills: string[];
    difficulties: string[];
    providers: string[];
    categories: string[];
    careers: Array<{ id: string; title: string }>;
  };
}

export class CourseRecommendationService {
  /**
   * Deterministically generates personalized course recommendations connecting
   * Profile -> Target Career -> Required Skills -> Skill Gap -> Missing Skills -> Courses -> Progress.
   */
  public static async getCourseRecommendations(
    userId: string,
    options: ICourseFilterOptions = {}
  ): Promise<ICourseRecommendationsResponse> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Ensure resources are seeded
    await LearningHubService.seedCuratedResources();

    // 2. Fetch context concurrently
    const [pContext, skillGapDoc, activeRoadmap, progressDoc, dbResources] = await Promise.all([
      PersonalizationService.getPersonalizationContext(userId),
      SkillNavigatorService.getLatestAnalysis(userId).catch(() => null),
      RoadmapService.getRoadmap(userId).catch(() => null),
      LearningProgress.findOne({ userId: userObjectId }),
      LearningResource.find({}).sort({ createdAt: -1 }),
    ]);

    // 3. Resolve Target Career
    const targetCareer = SkillNavigatorService.resolveTargetCareer(options.careerId, pContext);
    const educationLevel = pContext.educationLevel || 'undergraduate';

    // 4. Extract Missing Skills and Priority from Phase 23 Skill Gap Analysis
    const missingSkills = skillGapDoc?.missingSkills || [];
    const coveragePercentage = skillGapDoc?.summary?.coveragePercentage ?? 0;
    const is100PercentCovered = Boolean(skillGapDoc && coveragePercentage === 100 && missingSkills.length === 0);

    // If no target career selected, return structured graceful state
    if (!targetCareer) {
      const allSkillsSet = new Set<string>();
      const allCategoriesSet = new Set<string>();
      const allProvidersSet = new Set<string>();
      const allDifficultiesSet = new Set<string>();

      const generalCourses: IRecommendedCourseItem[] = dbResources.slice(0, 10).map((r) => {
        r.skills.forEach((s) => allSkillsSet.add(s));
        allCategoriesSet.add(r.topicCategory);
        allProvidersSet.add(r.provider);
        allDifficultiesSet.add(r.difficulty);

        return {
          resourceId: r.resourceId,
          title: r.title,
          description: r.description,
          url: r.url,
          provider: r.provider,
          type: r.type,
          thumbnail: r.thumbnail,
          channel: r.channel,
          careerIds: r.careerIds,
          skills: r.skills,
          educationLevels: r.educationLevels,
          topicCategory: r.topicCategory,
          difficulty: r.difficulty,
          duration: r.duration,
          tags: r.tags,
          relevanceScore: 10,
          recommendationReason: 'Select a target career to get personalized skill-gap course recommendations.',
          priorityLevel: 'General',
          primaryTargetSkill: r.skills[0] || 'General Skill',
          coveredMissingSkills: [],
          isBookmarked: Boolean(progressDoc?.bookmarkedResources?.includes(r.resourceId)),
          progressStatus: 'not_started',
        };
      });

      return {
        hasTargetCareer: false,
        is100PercentCovered: false,
        targetCareer: null,
        educationStage: educationLevel,
        summary: {
          totalRecommended: generalCourses.length,
          totalGapsTargeted: 0,
          totalMissingGaps: 0,
          coveragePercentage: 0,
          topMissingSkill: null,
        },
        topPriorityCourses: generalCourses.slice(0, 3),
        skillBasedRecommendations: [],
        allRecommendedCourses: generalCourses,
        availableFilters: {
          skills: Array.from(allSkillsSet).sort(),
          difficulties: ['Beginner', 'Intermediate', 'Advanced'],
          providers: Array.from(allProvidersSet).sort(),
          categories: Array.from(allCategoriesSet).sort(),
          careers: CAREERS_DATA.slice(0, 15).map((c) => ({ id: c.id, title: c.title })),
        },
      };
    }

    // 5. Build user progress & bookmark maps
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

    // 6. Extract Active Roadmap Milestone for Milestone Linking
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

    // 7. Deterministic Course Scoring & Reason Generation
    const scoredCourses: IRecommendedCourseItem[] = dbResources.map((res: ILearningResourceDocument) => {
      let score = 0;
      const coveredMissingSkills: string[] = [];
      let highestPriority: 'Critical' | 'High' | 'Medium' | 'Supporting' | 'General' = 'General';
      let primaryTargetSkill = res.skills[0] || 'Core Skill';

      // Check against missing skills
      for (const ms of missingSkills) {
        if (res.skills.some((sk) => SkillNavigatorService.isSkillMatch(sk, ms.skillName))) {
          coveredMissingSkills.push(ms.skillName);
          if (ms.priority === 'Critical') {
            highestPriority = 'Critical';
            primaryTargetSkill = ms.skillName;
          } else if (ms.priority === 'High' && highestPriority !== 'Critical') {
            highestPriority = 'High';
            primaryTargetSkill = ms.skillName;
          } else if (ms.priority === 'Medium' && highestPriority === 'General') {
            highestPriority = 'Medium';
            primaryTargetSkill = ms.skillName;
          } else if (ms.priority === 'Supporting' && highestPriority === 'General') {
            highestPriority = 'Supporting';
            primaryTargetSkill = ms.skillName;
          }
        }
      }

      // Priority Weighting
      if (highestPriority === 'Critical') {
        score += 60;
      } else if (highestPriority === 'High') {
        score += 45;
      } else if (highestPriority === 'Medium') {
        score += 30;
      } else if (highestPriority === 'Supporting') {
        score += 20;
      }

      // Multi-gap bonus: +15 for each additional missing skill covered
      if (coveredMissingSkills.length > 1) {
        score += (coveredMissingSkills.length - 1) * 15;
      }

      // Target Career Required Skill (+20)
      if (targetCareer.skills && res.skills.some((sk) => targetCareer.skills.some((tcs) => SkillNavigatorService.isSkillMatch(sk, tcs)))) {
        score += 20;
      }

      // Target Career Match (+15)
      if (res.careerIds.includes(targetCareer.id)) {
        score += 15;
      }

      // Education Stage Relevance (+10)
      if (res.educationLevels && res.educationLevels.includes(educationLevel.toLowerCase())) {
        score += 10;
      }

      // 100% Skill Coverage Case
      if (is100PercentCovered && res.careerIds.includes(targetCareer.id)) {
        score += 50;
      }

      // Deterministic Recommendation Reason
      let recommendationReason = '';
      if (is100PercentCovered) {
        recommendationReason = `Advanced specialization course for ${targetCareer.title}.`;
      } else if (coveredMissingSkills.length > 1) {
        recommendationReason = `Covers ${coveredMissingSkills.length} skills you need: ${coveredMissingSkills.join(', ')}.`;
      } else if (highestPriority === 'Critical') {
        recommendationReason = `Recommended because ${primaryTargetSkill} is a Critical missing skill for ${targetCareer.title}.`;
      } else if (highestPriority === 'High') {
        recommendationReason = `Recommended because ${primaryTargetSkill} is a High-priority skill gap for ${targetCareer.title}.`;
      } else if (highestPriority === 'Medium' || highestPriority === 'Supporting') {
        recommendationReason = `Builds necessary competency in ${primaryTargetSkill} for your target career.`;
      } else if (res.careerIds.includes(targetCareer.id)) {
        recommendationReason = `Recommended core curriculum for ${targetCareer.title}.`;
      } else {
        recommendationReason = `Foundational course matching your education stage.`;
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
        recommendationReason,
        priorityLevel: highestPriority,
        primaryTargetSkill,
        coveredMissingSkills,
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

    // 8. Filter Processing
    let filteredCourses = scoredCourses.slice();

    if (options.search && options.search.trim().length > 0) {
      const q = options.search.toLowerCase().trim();
      filteredCourses = filteredCourses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)) ||
          c.provider.toLowerCase().includes(q) ||
          c.topicCategory.toLowerCase().includes(q)
      );
    }

    if (options.skill && options.skill !== 'All') {
      filteredCourses = filteredCourses.filter((c) =>
        c.skills.some((s) => SkillNavigatorService.isSkillMatch(s, options.skill!))
      );
    }

    if (options.difficulty && options.difficulty !== 'All') {
      filteredCourses = filteredCourses.filter((c) => c.difficulty === options.difficulty);
    }

    if (options.provider && options.provider !== 'All') {
      filteredCourses = filteredCourses.filter((c) => c.provider === options.provider);
    }

    if (options.resourceType && options.resourceType !== 'All') {
      filteredCourses = filteredCourses.filter((c) => c.type === options.resourceType);
    }

    // Sort by relevance score descending
    filteredCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // 9. Extract "Start With These" (Top Priority Courses)
    // Prioritize uncompleted courses targeting Critical and High missing gaps
    const topPriorityCourses = scoredCourses
      .filter((c) => c.progressStatus !== 'completed' && (c.priorityLevel === 'Critical' || c.priorityLevel === 'High' || c.relevanceScore >= 40))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    // 10. Group by Missing Skills (Skill-Based Recommendations)
    const skillBasedRecommendations: ISkillBasedCourseGroup[] = missingSkills.map((ms) => {
      const matchingCourses = scoredCourses
        .filter((c) => c.skills.some((sk) => SkillNavigatorService.isSkillMatch(sk, ms.skillName)))
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      return {
        skillName: ms.skillName,
        priority: ms.priority as any,
        status: 'Missing' as const,
        coursesCount: matchingCourses.length,
        courses: matchingCourses.slice(0, 4),
      };
    }).filter((grp) => grp.coursesCount > 0);

    // 11. Extract Targeted Gaps count
    const targetedGapsSet = new Set<string>();
    scoredCourses.forEach((c) => c.coveredMissingSkills.forEach((s) => targetedGapsSet.add(s)));

    // 12. Filter options extraction
    const allSkillsSet = new Set<string>();
    const allCategoriesSet = new Set<string>();
    const allProvidersSet = new Set<string>();
    const allDifficultiesSet = new Set<string>();

    scoredCourses.forEach((c) => {
      c.skills.forEach((s) => allSkillsSet.add(s));
      allCategoriesSet.add(c.topicCategory);
      allProvidersSet.add(c.provider);
      allDifficultiesSet.add(c.difficulty);
    });

    return {
      hasTargetCareer: true,
      is100PercentCovered,
      targetCareer: {
        id: targetCareer.id,
        title: targetCareer.title,
        category: targetCareer.category,
        salaryRange: targetCareer.salaryRange,
        demandLevel: targetCareer.demandLevel,
      },
      educationStage: educationLevel,
      summary: {
        totalRecommended: filteredCourses.length,
        totalGapsTargeted: targetedGapsSet.size,
        totalMissingGaps: missingSkills.length,
        coveragePercentage,
        topMissingSkill: missingSkills.length > 0 ? missingSkills[0].skillName : null,
      },
      topPriorityCourses,
      skillBasedRecommendations,
      allRecommendedCourses: filteredCourses,
      availableFilters: {
        skills: Array.from(allSkillsSet).sort(),
        difficulties: ['Beginner', 'Intermediate', 'Advanced'],
        providers: Array.from(allProvidersSet).sort(),
        categories: Array.from(allCategoriesSet).sort(),
        careers: CAREERS_DATA.slice(0, 15).map((c) => ({ id: c.id, title: c.title })),
      },
    };
  }
}
