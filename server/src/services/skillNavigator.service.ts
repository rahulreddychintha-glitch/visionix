import mongoose from 'mongoose';
import {
  SkillGapAnalysis,
  ISkillGapAnalysisDocument,
  ISkillGapDetail,
  IPrioritySkill,
  INextStepItem,
  ICareerComparisonItem,
  SkillPriorityLevel,
} from '../models/SkillGapAnalysis';
import { PersonalizationService, IPersonalizationContext } from './personalization.service';
import { CAREERS_DATA, CAREER_SKILL_MAPPING, CareerMetadata } from '../constants/careers.constants';
import { CareerRoadmap } from '../models/CareerRoadmap';
import { LearningResource } from '../models/LearningResource';
import { LearningProgress } from '../models/LearningProgress';

export class SkillNavigatorService {
  /**
   * Helper: Normalize skill string for accurate and safe comparison
   */
  public static normalizeSkill(skill: string): string {
    return skill
      .toLowerCase()
      .trim()
      .replace(/\.js$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  /**
   * Helper: Check if two skill strings match with normalized alias and synonym awareness
   */
  public static isSkillMatch(skillA: string, skillB: string): boolean {
    const a = this.normalizeSkill(skillA);
    const b = this.normalizeSkill(skillB);
    if (a === b) return true;
    if (a.length > 2 && b.length > 2 && (a.includes(b) || b.includes(a))) return true;

    // Standardized synonym dictionary
    const synonyms: Record<string, string[]> = {
      'react': ['reactjs', 'react native', 'frontend framework', 'react component'],
      'node': ['nodejs', 'node js', 'backend', 'express'],
      'python': ['python3', 'python programming', 'python data'],
      'javascript': ['js', 'ecmascript', 'typescript', 'frontend'],
      'machine learning': ['ml', 'deep learning', 'artificial intelligence', 'ai', 'neural networks'],
      'artificial intelligence': ['ai', 'machine learning', 'deep learning', 'genai'],
      'data science': ['data analysis', 'data analytics', 'data scientist', 'statistical modeling'],
      'sql': ['mysql', 'postgresql', 'database', 'sqlite', 'rdbms'],
      'ui/ux': ['ui designer', 'ux designer', 'figma', 'user experience', 'user interface', 'prototyping'],
      'cloud': ['cloud computing', 'aws', 'azure', 'gcp', 'cloud engineer', 'devops'],
      'cybersecurity': ['information security', 'network security', 'ethical hacking', 'infosec', 'penetration testing'],
      'project management': ['agile', 'scrum', 'leadership', 'product management', 'jira'],
      'accounting': ['financial accounting', 'tally', 'bookkeeping', 'statutory audit', 'ledger'],
      'finance': ['financial analysis', 'financial modeling', 'corporate finance', 'valuation'],
      'clinical diagnosis': ['patient care', 'medicine', 'clinical medicine', 'patient diagnosis', 'clinical assessment'],
      'surgery': ['surgical skills', 'oral surgery', 'manual precision', 'operative surgery'],
      'law': ['legal drafting', 'constitutional law', 'corporate law', 'courtroom advocacy', 'litigation'],
      'cad': ['autocad', 'solidworks', 'revit', '3d modeling', 'catia']
    };

    for (const [key, synList] of Object.entries(synonyms)) {
      if ((a === key || synList.includes(a)) && (b === key || synList.includes(b))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Resolves target career metadata from targetCareerId or user personalization context.
   * Returns null if user has not chosen or specified any target career.
   */
  public static resolveTargetCareer(
    targetCareerId?: string,
    pContext?: IPersonalizationContext
  ): CareerMetadata | null {
    if (targetCareerId && targetCareerId.trim().length > 0) {
      const norm = this.normalizeSkill(targetCareerId);
      const found = CAREERS_DATA.find(
        (c) => c.id === targetCareerId || 
               this.normalizeSkill(c.id) === norm ||
               this.normalizeSkill(c.title) === norm
      );
      if (found) return found;
    }

    if (pContext) {
      // 1. Check selected career in roadmap / progress
      if (pContext.careerProgress?.selectedCareer) {
        const sel = pContext.careerProgress.selectedCareer;
        const norm = this.normalizeSkill(sel);
        const found = CAREERS_DATA.find(
          (c) => c.id === sel ||
                 this.normalizeSkill(c.id) === norm ||
                 this.normalizeSkill(c.title) === norm
        );
        if (found) return found;
      }

      // 2. Check dream career in profile
      if (
        pContext.dreamCareer && 
        pContext.dreamCareer !== 'Not Specified' && 
        pContext.dreamCareer !== 'Career Explorer'
      ) {
        const norm = this.normalizeSkill(pContext.dreamCareer);
        const found = CAREERS_DATA.find(
          (c) => c.id === pContext.dreamCareer ||
                 this.normalizeSkill(c.id) === norm ||
                 this.normalizeSkill(c.title) === norm ||
                 this.isSkillMatch(c.title, pContext.dreamCareer)
        );
        if (found) return found;
      }

      // 3. Check career interests
      if (pContext.interests?.careerInterests?.length > 0) {
        const firstInterest = pContext.interests.careerInterests[0];
        const norm = this.normalizeSkill(firstInterest);
        const found = CAREERS_DATA.find(
          (c) => c.id === firstInterest ||
                 this.normalizeSkill(c.id) === norm ||
                 this.normalizeSkill(c.title) === norm ||
                 this.isSkillMatch(c.title, firstInterest)
        );
        if (found) return found;
      }
    }

    return null;
  }

  /**
   * Deterministically assigns skill category and priority level
   */
  public static assignSkillCategoryAndPriority(
    skillName: string,
    index: number,
    _career?: CareerMetadata
  ): { category: ISkillGapDetail['category']; priority: SkillPriorityLevel } {
    const norm = this.normalizeSkill(skillName);

    // Soft / Professional skills
    const softKeywords = ['communication', 'teamwork', 'leadership', 'empathy', 'active listening', 'presentation', 'time management', 'public speaking', 'negotiation', 'ethics'];
    if (softKeywords.some(k => norm.includes(k))) {
      return { category: 'Professional', priority: 'Supporting' };
    }

    // Tooling & Frameworks
    const toolKeywords = ['git', 'excel', 'figma', 'tally', 'sap', 'autocad', 'solidworks', 'revit', 'docker', 'blender', 'react', 'sql', 'linux', 'matlab', 'plc'];
    if (toolKeywords.some(k => norm.includes(k))) {
      return { category: 'Tooling', priority: 'Medium' };
    }

    // Foundational core domain skills (First 2 in career mapping or core pillars)
    if (index < 2) {
      return { category: 'Foundational', priority: 'Critical' };
    }

    // Technical skills
    return { category: 'Technical', priority: 'High' };
  }

  /**
   * Retrieves the latest analysis for a user or computes fresh
   */
  public static async getLatestAnalysis(
    userId: string,
    careerId?: string
  ): Promise<ISkillGapAnalysisDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const query: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (careerId) {
      query.targetCareerId = careerId;
    }

    const existing = await SkillGapAnalysis.findOne(query).sort({ createdAt: -1 });
    if (existing) {
      return existing;
    }

    // Run initial deterministic analysis
    return this.analyzeUserSkillGap(userId, careerId, false);
  }

  /**
   * Retrieves history of analyses for progress tracking
   */
  public static async getAnalysisHistory(
    userId: string,
    limit: number = 10
  ): Promise<ISkillGapAnalysisDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    return SkillGapAnalysis.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /**
   * Retrieves career comparisons across all available careers
   */
  public static async getCareerComparisons(userId: string): Promise<ICareerComparisonItem[]> {
    const pContext = await PersonalizationService.getPersonalizationContext(userId);
    const profileTech = pContext.skills?.technicalSkills || [];
    const profileSoft = pContext.skills?.softSkills || [];
    const verified = (pContext.skills?.verifiedSkills || []).map((vs: any) => typeof vs === 'string' ? vs : vs.name);
    const allUserSkills = Array.from(new Set([...profileTech, ...profileSoft, ...verified]));

    return CAREERS_DATA.slice(0, 12).map((career) => {
      const mappingSkills = CAREER_SKILL_MAPPING[career.id] || [];
      const reqSkills = Array.from(new Set([...career.skills, ...mappingSkills]));
      
      const strongCount = reqSkills.filter(req => 
        allUserSkills.some(userSkill => this.isSkillMatch(userSkill, req))
      ).length;

      const missingCount = reqSkills.length - strongCount;
      const matchScore = reqSkills.length > 0 ? Math.round((strongCount / reqSkills.length) * 100) : 0;
      const topMissing = reqSkills.find(req => !allUserSkills.some(userSkill => this.isSkillMatch(userSkill, req)));

      return {
        careerId: career.id,
        title: career.title,
        category: career.category,
        matchScore,
        strongSkillsCount: strongCount,
        missingSkillsCount: missingCount,
        topMissingSkill: topMissing || 'None',
        demandLevel: career.demandLevel || 'High',
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Deterministically computes the skill gap analysis and connects to learning and roadmaps.
   */
  public static async analyzeUserSkillGap(
    userId: string,
    targetCareerId?: string,
    _includeAi: boolean = false
  ): Promise<ISkillGapAnalysisDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Fetch real personalization context
    const pContext = await PersonalizationService.getPersonalizationContext(userId);

    // 2. Resolve target career
    const targetCareer = this.resolveTargetCareer(targetCareerId, pContext);

    // 3. Handle Edge Case: No Target Career Selected
    if (!targetCareer) {
      const emptyDoc = new SkillGapAnalysis({
        userId: userObjectId,
        hasTargetCareer: false,
        targetCareerId: '',
        targetCareerTitle: 'No Target Career Selected',
        targetCategory: '',
        readinessScore: 0,
        summary: {
          totalRequired: 0,
          existingCount: 0,
          missingCount: 0,
          coveragePercentage: 0,
          coverageText: 'Choose a target career to see your skill gap.',
        },
        requiredSkillsCount: 0,
        strongSkillsCount: 0,
        developingSkillsCount: 0,
        missingSkillsCount: 0,
        biggestSkillGap: 'No target career selected',
        biggestOpportunity: 'Choose a career to identify required skills',
        quickWin: 'Select a career from Career Explorer',
        currentSkills: {
          verified: (pContext.skills?.verifiedSkills || []).map((vs: any) => ({
            name: typeof vs === 'string' ? vs : vs.name,
            score: vs.score || 100,
            verifiedAt: vs.verifiedAt ? new Date(vs.verifiedAt) : new Date(),
            source: vs.source || 'profile',
          })),
          profile: pContext.skills?.technicalSkills || [],
          developing: [],
        },
        skillGaps: [],
        existingSkills: [],
        requiredSkills: [],
        missingSkills: [],
        prioritySkills: [],
        recommendedNextSkill: null,
        nextSteps: [],
        careerComparisons: await this.getCareerComparisons(userId),
      });

      return emptyDoc;
    }

    // 4. Extract student's existing skills
    const rawVerifiedSkills = pContext.skills?.verifiedSkills || [];
    const verifiedSkillsList = rawVerifiedSkills.map((vs: any) => ({
      name: typeof vs === 'string' ? vs : vs.name,
      score: vs.score || 100,
      verifiedAt: vs.verifiedAt ? new Date(vs.verifiedAt) : new Date(),
      source: vs.source || 'milestone_assessment',
    }));
    const verifiedSkillNames = verifiedSkillsList.map((vs) => vs.name);

    const profileTechSkills = pContext.skills?.technicalSkills || [];
    const profileSoftSkills = pContext.skills?.softSkills || [];
    const profileInterests = pContext.interests?.technologies || [];
    const allProfileSkills = Array.from(new Set([...profileTechSkills, ...profileSoftSkills, ...profileInterests]));

    // 5. Extract active roadmap milestones & developing skills
    const [activeRoadmaps, learningProgress, learningResources] = await Promise.all([
      CareerRoadmap.find({ userId: userObjectId }),
      LearningProgress.findOne({ userId: userObjectId }),
      LearningResource.find({}).limit(50),
    ]);

    const roadmapMilestoneMap = new Map<string, { stageNumber: number; stageTitle: string; milestoneTitle: string; status: string }>();
    const developingSkillSet = new Set<string>();

    activeRoadmaps.forEach((roadmap) => {
      roadmap.stages?.forEach((stage, stageIndex) => {
        stage.milestones?.forEach((milestone) => {
          if (milestone.skills) {
            milestone.skills.forEach((sk) => {
              roadmapMilestoneMap.set(this.normalizeSkill(sk), {
                stageNumber: stageIndex + 1,
                stageTitle: stage.title,
                milestoneTitle: milestone.title,
                status: milestone.status || 'Not Started',
              });
              if (!milestone.completed && milestone.status === 'In Progress') {
                developingSkillSet.add(sk);
              }
            });
          }
        });
      });
    });
    const developingSkills = Array.from(developingSkillSet);

    // 6. Retrieve required skills for target career
    const mappingSkills = CAREER_SKILL_MAPPING[targetCareer.id] || [];
    const targetRequiredSkills = Array.from(new Set([...targetCareer.skills, ...mappingSkills]));
    const totalRequired = targetRequiredSkills.length || 1;

    // 7. Deterministic Skill Comparison & Classification
    const skillGaps: ISkillGapDetail[] = [];
    const existingSkills: ISkillGapDetail[] = [];
    const requiredSkills: ISkillGapDetail[] = [];
    const missingSkills: ISkillGapDetail[] = [];

    targetRequiredSkills.forEach((reqSkill, index) => {
      const isVerified = verifiedSkillNames.some((vs) => this.isSkillMatch(vs, reqSkill));
      const isInProfile = allProfileSkills.some((ps) => this.isSkillMatch(ps, reqSkill));
      const isDeveloping = developingSkills.some((ds) => this.isSkillMatch(ds, reqSkill));

      const { category, priority } = this.assignSkillCategoryAndPriority(reqSkill, index, targetCareer);

      let status: ISkillGapDetail['status'] = 'Missing';
      let currentLevel = 'Not Started';
      let requiredLevel = priority === 'Critical' ? 'Advanced' : 'Proficient';
      let whyItMatters = `Essential core competence for ${targetCareer.title} responsibilities and industry workflows.`;
      let recommendedAction = `Begin foundational study and practical exercises for ${reqSkill}.`;
      let actionType: ISkillGapDetail['actionType'] = 'learning';
      let actionRoute = `/learning?query=${encodeURIComponent(reqSkill)}`;

      if (isVerified) {
        status = 'Verified';
        currentLevel = 'Advanced (Verified)';
        whyItMatters = `You have proven expertise in ${reqSkill} through official Visionix verification.`;
        recommendedAction = `Keep practicing ${reqSkill} in advanced portfolio projects and technical interview rounds.`;
        actionType = 'interview';
        actionRoute = '/interview';
      } else if (isInProfile && !isDeveloping) {
        status = 'Strong';
        currentLevel = 'Intermediate (Self-Reported)';
        whyItMatters = `${reqSkill} is in your profile stack. Taking a skill assessment validates your proficiency for recruiters.`;
        recommendedAction = `Verify ${reqSkill} through a standalone skill assessment.`;
        actionType = 'assessment';
        actionRoute = '/interview';
      } else if (isDeveloping) {
        status = 'Developing';
        currentLevel = 'In Progress';
        whyItMatters = `${reqSkill} is currently in your roadmap milestones. Completing this unlocks next-stage career readiness.`;
        recommendedAction = `Continue active roadmap tasks and pass the milestone exam for ${reqSkill}.`;
        actionType = 'roadmap';
        actionRoute = '/roadmap';
      }

      // Check roadmap milestone link
      const matchedMilestone = roadmapMilestoneMap.get(this.normalizeSkill(reqSkill));

      // Check learning resource link
      const matchedResource = learningResources.find(res => 
        this.isSkillMatch(res.title, reqSkill) || this.isSkillMatch(res.description || '', reqSkill)
      );

      const skillItem: ISkillGapDetail = {
        id: reqSkill.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        skillName: reqSkill,
        category,
        status,
        priority,
        currentLevel,
        requiredLevel,
        whyItMatters,
        isVerified,
        recommendedAction,
        actionType,
        actionRoute,
        hasAssessment: true,
        hasLearningResource: true,
        roadmapMilestone: matchedMilestone,
        learningResource: matchedResource ? {
          title: matchedResource.title,
          url: matchedResource.url,
          provider: matchedResource.provider,
          type: matchedResource.type,
          thumbnail: matchedResource.thumbnail,
        } : {
          title: `${reqSkill} Foundations & Masterclass`,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(reqSkill + ' tutorial for beginners')}`,
          provider: 'YouTube Learning',
          type: 'Video Tutorial',
        },
        learningProgressPercent: learningProgress?.totalStudyMinutes ? Math.min(100, Math.round(learningProgress.totalStudyMinutes / 10)) : undefined,
      };

      skillGaps.push(skillItem);
      requiredSkills.push(skillItem);

      if (status === 'Verified' || status === 'Strong') {
        existingSkills.push(skillItem);
      } else {
        missingSkills.push(skillItem);
      }
    });

    // 8. Deterministic Priority Skills (Missing skills sorted by priority weight)
    const priorityWeight: Record<SkillPriorityLevel, number> = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Supporting: 1,
    };

    const prioritySkills: IPrioritySkill[] = missingSkills
      .slice()
      .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
      .map((item) => ({
        id: item.id,
        skillName: item.skillName,
        category: item.category,
        priority: item.priority,
        status: item.status,
        reason: item.whyItMatters,
        quickAction: item.recommendedAction,
        actionRoute: item.actionRoute,
        actionType: item.actionType,
        learningResource: item.learningResource,
        roadmapMilestone: item.roadmapMilestone,
      }));

    // Top Recommended Next Skill
    const recommendedNextSkill = missingSkills.length > 0 
      ? missingSkills.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])[0]
      : null;

    // 9. Transparent Coverage Calculation
    const existingCount = existingSkills.length;
    const missingCount = missingSkills.length;
    const coveragePercentage = totalRequired > 0 ? Math.round((existingCount / totalRequired) * 100) : 0;
    const coverageText = `${existingCount} of ${totalRequired} mapped career skills covered`;

    // 10. Construct Next Steps Actions
    const nextSteps: INextStepItem[] = [];
    if (recommendedNextSkill) {
      nextSteps.push({
        id: 'step-next-skill',
        title: `Learn ${recommendedNextSkill.skillName}`,
        description: recommendedNextSkill.whyItMatters,
        actionType: 'learning',
        targetRoute: recommendedNextSkill.actionRoute,
        targetSkill: recommendedNextSkill.skillName,
        actionText: 'Start Learning',
        priority: recommendedNextSkill.priority,
      });
    }
    if (missingSkills.length > 1) {
      const secondSkill = missingSkills[1];
      nextSteps.push({
        id: 'step-second-skill',
        title: `Build ${secondSkill.skillName}`,
        description: secondSkill.whyItMatters,
        actionType: 'roadmap',
        targetRoute: '/roadmap',
        targetSkill: secondSkill.skillName,
        actionText: 'View in Roadmap',
        priority: secondSkill.priority,
      });
    }

    const careerComparisons = await this.getCareerComparisons(userId);

    // 11. Save or Update Analysis Document
    const analysisDoc = await SkillGapAnalysis.findOneAndUpdate(
      { userId: userObjectId, targetCareerId: targetCareer.id },
      {
        userId: userObjectId,
        hasTargetCareer: true,
        targetCareerId: targetCareer.id,
        targetCareerTitle: targetCareer.title,
        targetCategory: targetCareer.category,
        salaryRange: targetCareer.salaryRange,
        growthRate: targetCareer.growthRate,
        demandLevel: targetCareer.demandLevel,
        readinessScore: coveragePercentage,
        summary: {
          totalRequired,
          existingCount,
          missingCount,
          coveragePercentage,
          coverageText,
        },
        requiredSkillsCount: totalRequired,
        strongSkillsCount: existingCount,
        developingSkillsCount: developingSkills.length,
        missingSkillsCount: missingCount,
        biggestSkillGap: recommendedNextSkill ? recommendedNextSkill.skillName : 'None',
        biggestOpportunity: `${targetCareer.title} Skill Mastery`,
        quickWin: missingSkills.find(s => s.priority === 'Medium')?.skillName || 'Review Roadmap Milestones',
        currentSkills: {
          verified: verifiedSkillsList,
          profile: profileTechSkills,
          developing: developingSkills,
        },
        skillGaps,
        existingSkills,
        requiredSkills,
        missingSkills,
        prioritySkills,
        recommendedNextSkill,
        nextSteps,
        careerComparisons,
      },
      { new: true, upsert: true }
    );

    return analysisDoc;
  }

  /**
   * AI Skill Coach (Optional query assistant without impacting deterministic gap calculation)
   */
  public static async askSkillCoach(
    userId: string,
    question: string,
    careerId?: string
  ): Promise<{ answer: string; suggestedQuestions: string[]; aiProviderUsed: string }> {
    const analysis = await this.getLatestAnalysis(userId, careerId);
    
    // Deterministic fallback answers if AI is unconfigured
    return {
      answer: `For your target career as a ${analysis.targetCareerTitle}, focusing on missing core skills like ${analysis.biggestSkillGap || 'your primary domain tools'} will significantly boost your readiness. We recommend following the structured steps in your roadmap.`,
      suggestedQuestions: [
        `How do I get started with ${analysis.biggestSkillGap || 'my top missing skill'}?`,
        `What projects can I build to demonstrate ${analysis.targetCareerTitle} skills?`,
        `How does my skill coverage compare to other careers?`,
      ],
      aiProviderUsed: 'deterministic_fallback',
    };
  }
}
