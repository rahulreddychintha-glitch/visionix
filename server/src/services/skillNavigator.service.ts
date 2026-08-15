import mongoose from 'mongoose';
import config from '../config/env';
import {
  SkillGapAnalysis,
  ISkillGapAnalysisDocument,
  ISkillGapDetail,
  IPrioritySkill,
  INextStepItem,
  ICareerComparisonItem,
  IAiSkillInsight,
} from '../models/SkillNavigator';
import { PersonalizationService, IPersonalizationContext } from './personalization.service';
import { CAREERS_DATA, CAREER_SKILL_MAPPING, CareerMetadata } from '../constants/careers.constants';
import { CareerRoadmap } from '../models/CareerRoadmap';

export class SkillNavigatorService {
  /**
   * Helper: Normalize skill string for accurate and safe comparison
   */
  private static normalizeSkill(skill: string): string {
    return skill
      .toLowerCase()
      .trim()
      .replace(/\.js$/i, '')
      .replace(/\s+/g, ' ');
  }

  /**
   * Helper: Check if two skill strings match with normalized alias awareness
   */
  private static isSkillMatch(skillA: string, skillB: string): boolean {
    const a = this.normalizeSkill(skillA);
    const b = this.normalizeSkill(skillB);
    if (a === b) return true;
    if (a.length > 2 && b.length > 2 && (a.includes(b) || b.includes(a))) return true;

    // Common synonyms
    const synonyms: Record<string, string[]> = {
      'react': ['reactjs', 'react native', 'frontend framework'],
      'node': ['nodejs', 'node js', 'backend'],
      'python': ['python3', 'python programming'],
      'machine learning': ['ml', 'deep learning', 'artificial intelligence', 'ai'],
      'artificial intelligence': ['ai', 'machine learning', 'deep learning'],
      'ui/ux': ['ui designer', 'ux designer', 'figma', 'user experience', 'user interface'],
      'data science': ['data analysis', 'data analytics', 'data scientist'],
      'cloud': ['cloud computing', 'aws', 'azure', 'gcp', 'cloud engineer'],
      'cybersecurity': ['information security', 'network security', 'ethical hacking'],
      'project management': ['agile', 'scrum', 'leadership', 'product management'],
    };

    for (const [key, synList] of Object.entries(synonyms)) {
      if ((a === key || synList.includes(a)) && (b === key || synList.includes(b))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Resolves target career metadata from targetCareerId or user personalization context
   */
  public static resolveTargetCareer(
    targetCareerId?: string,
    pContext?: IPersonalizationContext
  ): CareerMetadata {
    if (targetCareerId) {
      const found = CAREERS_DATA.find(
        (c) => c.id === targetCareerId || this.normalizeSkill(c.title) === this.normalizeSkill(targetCareerId)
      );
      if (found) return found;
    }

    if (pContext) {
      // 1. Check selected career in roadmap/progress
      if (pContext.careerProgress?.selectedCareer) {
        const found = CAREERS_DATA.find(
          (c) => c.id === pContext.careerProgress?.selectedCareer ||
                 this.normalizeSkill(c.title) === this.normalizeSkill(pContext.careerProgress?.selectedCareer || '')
        );
        if (found) return found;
      }

      // 2. Check dream career in profile
      if (pContext.dreamCareer && pContext.dreamCareer !== 'Not Specified') {
        const found = CAREERS_DATA.find(
          (c) => c.id === pContext.dreamCareer ||
                 this.normalizeSkill(c.title) === this.normalizeSkill(pContext.dreamCareer) ||
                 this.isSkillMatch(c.title, pContext.dreamCareer)
        );
        if (found) return found;
      }

      // 3. Check career interests
      if (pContext.interests?.careerInterests?.length > 0) {
        const firstInterest = pContext.interests.careerInterests[0];
        const found = CAREERS_DATA.find(
          (c) => this.normalizeSkill(c.title) === this.normalizeSkill(firstInterest) ||
                 this.isSkillMatch(c.title, firstInterest)
        );
        if (found) return found;
      }
    }

    // Default fallback to first career
    return CAREERS_DATA.find((c) => c.id === 'software_engineer') || CAREERS_DATA[0];
  }

  /**
   * Retrieves the latest analysis for a user or computes fresh if none exists
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

    // If no existing analysis saved yet, run initial analysis without calling AI automatically
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
   * Deterministically computes skill gap analysis and optionally enhances with Gemini AI
   */
  public static async analyzeUserSkillGap(
    userId: string,
    targetCareerId?: string,
    includeAi: boolean = false
  ): Promise<ISkillGapAnalysisDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    // 1. Fetch real personalization context (Single Source of Truth)
    const pContext = await PersonalizationService.getPersonalizationContext(userId);

    // 2. Resolve target career
    const targetCareer = this.resolveTargetCareer(targetCareerId, pContext);

    // 3. Extract verified skills (STRICTLY READ-ONLY from Phase 12)
    const rawVerifiedSkills = pContext.skills?.verifiedSkills || [];
    const verifiedSkillsList = rawVerifiedSkills.map((vs: any) => ({
      name: typeof vs === 'string' ? vs : vs.name,
      score: vs.score || 100,
      verifiedAt: vs.verifiedAt ? new Date(vs.verifiedAt) : new Date(),
      source: vs.source || 'milestone_assessment',
    }));

    const verifiedSkillNames = verifiedSkillsList.map((vs) => vs.name);

    // Profile self-reported technical & soft skills
    const profileTechSkills = pContext.skills?.technicalSkills || [];
    const profileSoftSkills = pContext.skills?.softSkills || [];
    const profileInterests = pContext.interests?.technologies || [];
    const allProfileSkills = Array.from(new Set([...profileTechSkills, ...profileSoftSkills, ...profileInterests]));

    // 4. Extract developing skills from active roadmaps
    const activeRoadmaps = await CareerRoadmap.find({ userId: new mongoose.Types.ObjectId(userId) });
    const developingSkillSet = new Set<string>();
    activeRoadmaps.forEach((roadmap) => {
      roadmap.stages?.forEach((stage) => {
        stage.milestones?.forEach((milestone) => {
          if (!milestone.completed && milestone.status === 'In Progress' && milestone.skills) {
            milestone.skills.forEach((sk) => developingSkillSet.add(sk));
          }
        });
      });
    });
    const developingSkills = Array.from(developingSkillSet);

    // 5. Retrieve required skills for target role
    const mappingSkills = CAREER_SKILL_MAPPING[targetCareer.id] || [];
    const targetRequiredSkills = Array.from(new Set([...targetCareer.skills, ...mappingSkills]));
    const requiredSkillsCount = targetRequiredSkills.length || 1;

    // 6. Deterministic Skill Gap Mapping
    const skillGaps: ISkillGapDetail[] = [];
    let verifiedMatchesCount = 0;
    let profileMatchesCount = 0;
    let developingMatchesCount = 0;
    let missingMatchesCount = 0;

    targetRequiredSkills.forEach((reqSkill, index) => {
      // Check if verified
      const isVerified = verifiedSkillNames.some((vs) => this.isSkillMatch(vs, reqSkill));
      // Check if in profile
      const isInProfile = allProfileSkills.some((ps) => this.isSkillMatch(ps, reqSkill));
      // Check if developing
      const isDeveloping = developingSkills.some((ds) => this.isSkillMatch(ds, reqSkill));

      let status: ISkillGapDetail['status'] = 'Missing';
      let priority: ISkillGapDetail['priority'] = 'High';
      let currentLevel = 'None';
      let requiredLevel = index < 2 ? 'Advanced' : 'Proficient';
      let whyItMatters = `Essential core competence for ${targetCareer.title} responsibilities and industry workflows.`;
      let recommendedAction = `Begin foundational study and practical exercises for ${reqSkill}.`;
      let actionType: ISkillGapDetail['actionType'] = 'learning';
      let actionRoute = '/courses';

      if (isVerified) {
        status = 'Verified';
        priority = 'Low';
        currentLevel = 'Advanced (Verified)';
        whyItMatters = `You have proven expertise in ${reqSkill} through official Visionix milestone assessment.`;
        recommendedAction = `Keep practicing ${reqSkill} in advanced portfolio projects and technical interview rounds.`;
        actionType = 'interview';
        actionRoute = '/interview';
        verifiedMatchesCount++;
      } else if (isInProfile && !isDeveloping) {
        status = 'Strong';
        priority = 'Medium';
        currentLevel = 'Intermediate (Self-Reported)';
        whyItMatters = `${reqSkill} is part of your profile stack. Taking a verification assessment validates your proficiency for recruiters.`;
        recommendedAction = `Verify ${reqSkill} through a standalone skill assessment.`;
        actionType = 'assessment';
        actionRoute = '/exams';
        profileMatchesCount++;
      } else if (isDeveloping) {
        status = 'Developing';
        priority = 'High';
        currentLevel = 'In Progress';
        whyItMatters = `${reqSkill} is currently in your roadmap milestones. Completing this unlocks next-stage career readiness.`;
        recommendedAction = `Continue active roadmap tasks and pass the milestone exam for ${reqSkill}.`;
        actionType = 'roadmap';
        actionRoute = '/roadmap';
        developingMatchesCount++;
      } else {
        // Missing skill
        status = 'Missing';
        priority = index < 3 ? 'High' : 'Medium';
        currentLevel = 'Not Started';
        whyItMatters = `${reqSkill} is actively required in industry roles for ${targetCareer.title}.`;
        recommendedAction = `Explore courses and YouTube video walkthroughs on ${reqSkill}.`;
        actionType = 'learning';
        actionRoute = '/courses';
        missingMatchesCount++;
      }

      skillGaps.push({
        skillName: reqSkill,
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
      });
    });

    // 7. Deterministic Readiness Score Formula
    // Base skill coverage calculation:
    // Verified = 1.0 weight, Profile = 0.7 weight, Developing = 0.35 weight, Missing = 0.0
    const weightedPoints =
      verifiedMatchesCount * 1.0 +
      profileMatchesCount * 0.7 +
      developingMatchesCount * 0.35;

    const skillCoveragePercent = (weightedPoints / requiredSkillsCount) * 80;

    // Educational stream alignment (Max 15 pts)
    let eduScore = 0;
    const discipline = pContext.discipline || '';
    if (discipline && discipline !== 'Not Specified') {
      const lowerStream = discipline.toLowerCase();
      const lowerCategory = targetCareer.category.toLowerCase();
      const lowerTitle = targetCareer.title.toLowerCase();
      if (lowerCategory.includes(lowerStream) || lowerStream.includes(lowerCategory)) {
        eduScore = 15;
      } else if (lowerTitle.includes(lowerStream) || lowerStream.includes(lowerTitle)) {
        eduScore = 12;
      } else {
        eduScore = 5;
      }
    }

    // Ambition / Dream career alignment (Max 5 pts)
    const dreamBonus =
      pContext.dreamCareer &&
      (this.normalizeSkill(pContext.dreamCareer) === this.normalizeSkill(targetCareer.title) ||
        this.isSkillMatch(pContext.dreamCareer, targetCareer.title))
        ? 5
        : 0;

    const readinessScore = Math.min(
      100,
      Math.max(0, Math.round(skillCoveragePercent + eduScore + dreamBonus))
    );

    // 8. Ranked Priority Skills
    const prioritySkills: IPrioritySkill[] = skillGaps
      .filter((sg) => sg.status !== 'Verified')
      .sort((a, b) => {
        const pOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
        const sOrder: Record<string, number> = {
          'Developing': 4,
          'Needs Improvement': 3,
          'Missing': 2,
          'Strong': 1,
          'Verified': 0,
        };
        const pDiff = (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
        if (pDiff !== 0) return pDiff;
        return (sOrder[b.status] || 0) - (sOrder[a.status] || 0);
      })
      .slice(0, 5)
      .map((sg) => ({
        skillName: sg.skillName,
        priority: sg.priority,
        status: sg.status,
        reason:
          sg.status === 'Developing'
            ? 'Active roadmap skill in progress. Completing this unlocks immediate career points.'
            : sg.status === 'Strong'
            ? 'Already listed in your profile. Take an assessment to earn official verification.'
            : `Core required skill for ${targetCareer.title}. High impact on career readiness.`,
        quickAction:
          sg.status === 'Strong'
            ? 'Verify Skill'
            : sg.status === 'Developing'
            ? 'Continue Roadmap'
            : 'Start Learning',
        actionRoute: sg.actionRoute,
        actionType: sg.actionType,
      }));

    // 9. Highlights: Biggest Skill Gap, Biggest Opportunity, Quick Win
    const missingSkillItems = skillGaps.filter((sg) => sg.status === 'Missing');
    const strongUnverified = skillGaps.filter((sg) => sg.status === 'Strong' && !sg.isVerified);
    const developingItems = skillGaps.filter((sg) => sg.status === 'Developing');

    const biggestSkillGap =
      missingSkillItems.length > 0
        ? missingSkillItems[0].skillName
        : 'All core career skills are present or in progress!';

    const biggestOpportunity =
      missingSkillItems.length > 1
        ? missingSkillItems[1].skillName
        : missingSkillItems[0]?.skillName || targetRequiredSkills[0] || 'Advanced Specialization';

    const quickWin =
      strongUnverified.length > 0
        ? `Verify "${strongUnverified[0].skillName}" through a quick assessment`
        : developingItems.length > 0
        ? `Complete active roadmap milestone for "${developingItems[0].skillName}"`
        : `Explore an intro module for "${targetRequiredSkills[0]}"`;

    // 10. Personalized Next Steps (Directly linking to existing Visionix systems)
    const nextSteps: INextStepItem[] = [];

    // Step 1: Learning Action for missing/developing skill
    if (missingSkillItems.length > 0) {
      nextSteps.push({
        id: `step_learn_${missingSkillItems[0].skillName.toLowerCase().replace(/\s+/g, '_')}`,
        title: `Learn ${missingSkillItems[0].skillName}`,
        description: `Explore curated courses, structured chapters, and interactive guides in Learning Hub.`,
        actionType: 'learning',
        targetRoute: '/courses',
        targetSkill: missingSkillItems[0].skillName,
        actionText: 'View Learning Resource',
        priority: 'High',
      });
    }

    // Step 2: Assessment Action for verification
    const assessTarget = strongUnverified[0] || developingItems[0] || missingSkillItems[0];
    if (assessTarget) {
      nextSteps.push({
        id: `step_assess_${assessTarget.skillName.toLowerCase().replace(/\s+/g, '_')}`,
        title: `Take Assessment for ${assessTarget.skillName}`,
        description: `Pass a focused skill quiz to earn an official Phase 12 Verified Skill credential.`,
        actionType: 'assessment',
        targetRoute: '/exams',
        targetSkill: assessTarget.skillName,
        actionText: 'Take Assessment',
        priority: 'High',
      });
    }

    // Step 3: Interview Preparation
    nextSteps.push({
      id: `step_interview_${targetCareer.id}`,
      title: `Practice ${targetCareer.title} Technical Interview`,
      description: `Test your domain knowledge against AI-evaluated real-world interview scenarios.`,
      actionType: 'interview',
      targetRoute: '/interview',
      targetSkill: targetCareer.title,
      actionText: 'Start Interview Prep',
      priority: 'Medium',
    });

    // Step 4: Roadmap Milestone Continuity
    nextSteps.push({
      id: `step_roadmap_${targetCareer.id}`,
      title: `Advance ${targetCareer.title} Roadmap`,
      description: `Track weekly milestones, complete guided tasks, and level up your career roadmap.`,
      actionType: 'roadmap',
      targetRoute: '/roadmap',
      targetSkill: targetCareer.title,
      actionText: 'Open Career Roadmap',
      priority: 'Medium',
    });

    // Step 5: Resume Alignment
    nextSteps.push({
      id: `step_resume_${targetCareer.id}`,
      title: `Update Resume for ${targetCareer.title}`,
      description: `Showcase your verified skills and target role competencies on your ATS-optimized resume.`,
      actionType: 'project',
      targetRoute: '/resume',
      targetSkill: 'Resume Optimization',
      actionText: 'Optimize Resume',
      priority: 'Low',
    });

    // 11. Multi-Career Comparisons (Across CAREERS_DATA)
    const careerComparisons: ICareerComparisonItem[] = CAREERS_DATA.map((career) => {
      const cReqSkills = CAREER_SKILL_MAPPING[career.id] || career.skills;
      const cVerifiedCount = cReqSkills.filter((sk) =>
        verifiedSkillNames.some((vs) => this.isSkillMatch(vs, sk))
      ).length;
      const cProfileCount = cReqSkills.filter((sk) =>
        allProfileSkills.some((ps) => this.isSkillMatch(ps, sk))
      ).length;
      const cMissing = cReqSkills.filter(
        (sk) =>
          !verifiedSkillNames.some((vs) => this.isSkillMatch(vs, sk)) &&
          !allProfileSkills.some((ps) => this.isSkillMatch(ps, sk))
      );

      const cWeighted = cVerifiedCount * 1.0 + cProfileCount * 0.7;
      const cScore = Math.min(
        100,
        Math.max(10, Math.round((cWeighted / (cReqSkills.length || 1)) * 80 + (career.category === targetCareer.category ? 15 : 5)))
      );

      return {
        careerId: career.id,
        title: career.title,
        category: career.category,
        matchScore: cScore,
        strongSkillsCount: cVerifiedCount + cProfileCount,
        missingSkillsCount: cMissing.length,
        topMissingSkill: cMissing[0] || undefined,
        demandLevel: career.demandLevel || 'High',
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // 12. Optional Gemini AI Analysis (only when requested, avoiding automatic quota burn on load)
    let aiAnalysis: IAiSkillInsight | undefined = undefined;

    if (includeAi) {
      aiAnalysis = await this.generateAiSkillInsight(
        pContext,
        targetCareer,
        readinessScore,
        skillGaps,
        prioritySkills,
        verifiedSkillNames
      );
    }

    // 13. Save analysis document to MongoDB
    const analysisDoc = new SkillGapAnalysis({
      userId: new mongoose.Types.ObjectId(userId),
      targetCareerId: targetCareer.id,
      targetCareerTitle: targetCareer.title,
      targetCategory: targetCareer.category,
      readinessScore,
      requiredSkillsCount,
      strongSkillsCount: verifiedMatchesCount + profileMatchesCount,
      developingSkillsCount: developingMatchesCount,
      missingSkillsCount: missingMatchesCount,
      biggestSkillGap,
      biggestOpportunity,
      quickWin,
      currentSkills: {
        verified: verifiedSkillsList,
        profile: allProfileSkills,
        developing: developingSkills,
      },
      skillGaps,
      prioritySkills,
      nextSteps,
      careerComparisons: careerComparisons.slice(0, 15), // Save top 15 relevant comparisons
      aiAnalysis,
    });

    await analysisDoc.save();
    return analysisDoc;
  }

  /**
   * Generates factual, anti-hallucination Gemini AI skill insights
   */
  private static async generateAiSkillInsight(
    pContext: IPersonalizationContext,
    targetCareer: CareerMetadata,
    readinessScore: number,
    skillGaps: ISkillGapDetail[],
    prioritySkills: IPrioritySkill[],
    verifiedSkills: string[]
  ): Promise<IAiSkillInsight> {
    const missing = skillGaps.filter((sg) => sg.status === 'Missing').map((sg) => sg.skillName);
    const developing = skillGaps.filter((sg) => sg.status === 'Developing').map((sg) => sg.skillName);
    const strong = skillGaps.filter((sg) => sg.status === 'Strong').map((sg) => sg.skillName);

    // Fallback deterministic generator
    const deterministicFallback: IAiSkillInsight = {
      summary: `Your current skill profile matches ${readinessScore}% of the requirements for ${targetCareer.title}. You have strong ground in ${strong.slice(0, 2).join(', ') || 'foundational concepts'}${verifiedSkills.length > 0 ? ` and verified proof in ${verifiedSkills.slice(0, 2).join(', ')}` : ''}.`,
      missingSkillsInsight: missing.length > 0
        ? `Your primary skill gaps are ${missing.slice(0, 3).join(', ')}. Acquiring these will significantly boost your career readiness.`
        : 'You have covered the primary foundational skills. Focus on deep project execution and interview preparation.',
      whyItMattersInsight: `In the modern ${targetCareer.category} landscape, ${prioritySkills[0]?.skillName || targetCareer.skills[0]} is a critical differentiator for entry and mid-level roles.`,
      recommendedActionPlan: `1. Study ${missing[0] || 'advanced patterns'} in Learning Hub.\n2. Verify proficiency through a focused skill assessment in Quizzes & Assessments.\n3. Practice mock technical interviews to prepare for industry rounds.`,
      generatedAt: new Date(),
      aiProviderUsed: 'deterministic_fallback',
    };

    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.trim().length === 0) {
      return deterministicFallback;
    }

    const systemPrompt = `You are Visionix AI Skill Gap Consultant.
Analyze the user's authentic skill data against the target career "${targetCareer.title}".
Return your analysis in strict, valid JSON format matching this schema:
{
  "summary": "2-3 concise sentences summarizing their current standing and readiness.",
  "missingSkillsInsight": "2-3 sentences explaining exactly what they are missing and why it holds them back.",
  "whyItMattersInsight": "2-3 sentences explaining industry demand for their top priority skills.",
  "recommendedActionPlan": "A numbered 3-step practical action plan."
}

CRITICAL ANTI-HALLUCINATION RULES:
1. Never invent user experience, degrees, companies, projects, or certifications they do not have.
2. Verified skills are ONLY: [${verifiedSkills.join(', ') || 'None verified yet'}]. Never mark unverified skills as verified.
3. Keep recommendations strictly actionable and aligned with real target career requirements.
4. Output RAW JSON ONLY with no extra commentary or markdown code blocks.`;

    const userPayload = {
      targetCareer: targetCareer.title,
      category: targetCareer.category,
      readinessScore: `${readinessScore}%`,
      verifiedSkills: verifiedSkills,
      profileSkills: pContext.skills?.technicalSkills || [],
      missingSkills: missing,
      developingSkills: developing,
      prioritySkills: prioritySkills.map((p) => p.skillName),
      fieldOfStudy: pContext.discipline || 'General',
    };

    const modelName = 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.GEMINI_API_KEY}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: JSON.stringify(userPayload) }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        console.warn('[SkillNavigator AI] Gemini returned non-200 status:', response.status);
        return deterministicFallback;
      }

      const data: any = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return deterministicFallback;

      const parsed = JSON.parse(rawText);
      return {
        summary: parsed.summary || deterministicFallback.summary,
        missingSkillsInsight: parsed.missingSkillsInsight || deterministicFallback.missingSkillsInsight,
        whyItMattersInsight: parsed.whyItMattersInsight || deterministicFallback.whyItMattersInsight,
        recommendedActionPlan: parsed.recommendedActionPlan || deterministicFallback.recommendedActionPlan,
        generatedAt: new Date(),
        aiProviderUsed: 'gemini',
      };
    } catch (err: any) {
      console.error('[SkillNavigator AI] Gemini request error:', err?.message || err);
      return deterministicFallback;
    }
  }

  /**
   * AI Skill Coach - Answers targeted user questions using real context and anti-hallucination prompt
   */
  public static async askSkillCoach(
    userId: string,
    question: string,
    careerId?: string
  ): Promise<{ answer: string; suggestedQuestions: string[]; aiProviderUsed: string }> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const pContext = await PersonalizationService.getPersonalizationContext(userId);
    const targetCareer = this.resolveTargetCareer(careerId, pContext);
    const verifiedSkills = (pContext.skills?.verifiedSkills || []).map((vs: any) =>
      typeof vs === 'string' ? vs : vs.name
    );

    const defaultSuggestedQuestions = [
      `What should I learn next for ${targetCareer.title}?`,
      `Why is ${targetCareer.skills[0] || 'this skill'} important for my career?`,
      `How can I earn a verified skill badge in Visionix?`,
      `Give me a project idea to practice ${targetCareer.skills[1] || targetCareer.skills[0]}`,
    ];

    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.trim().length === 0) {
      return {
        answer: `As your Visionix Skill Coach for **${targetCareer.title}**, based on your profile in **${pContext.discipline || 'your domain'}**, your most strategic next step is to focus on **${targetCareer.skills[0]}**. You can study core modules in the Learning Hub, build hands-on exercises, and take a verification quiz in Quizzes & Assessments to earn an official verified badge.`,
        suggestedQuestions: defaultSuggestedQuestions,
        aiProviderUsed: 'unconfigured',
      };
    }

    const systemPrompt = `You are Visionix AI Skill Coach.
You provide personalized, concise, and highly practical skill advice for the user.

USER CONTEXT:
- Target Career: ${targetCareer.title} (${targetCareer.category})
- Required Career Skills: ${targetCareer.skills.join(', ')}
- Field of Study: ${pContext.discipline || 'General'}
- User Profile Skills: ${pContext.skills?.technicalSkills?.join(', ') || 'None specified'}
- Phase 12 Verified Skills: ${verifiedSkills.join(', ') || 'None verified yet'}

STRICT ANTI-HALLUCINATION RULES:
1. Never claim the user has experience, degrees, projects, or verified skills they do not have.
2. Verified skills are strictly read-only and limited to the list above.
3. If information is missing, state clearly that it is not in their profile.
4. Keep replies encouraging, direct, and structured with concise bullet points where appropriate (max 180 words).`;

    const modelName = 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.GEMINI_API_KEY}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: question }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini coach request failed with status ${response.status}`);
      }

      const data: any = await response.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer generated.';

      return {
        answer: answer.trim(),
        suggestedQuestions: defaultSuggestedQuestions,
        aiProviderUsed: 'gemini',
      };
    } catch (err: any) {
      console.error('[SkillCoach] AI error:', err?.message || err);
      return {
        answer: `Based on your target career as a **${targetCareer.title}**, prioritizing **${targetCareer.skills[0]}** and completing assessments in Quizzes & Assessments will provide the fastest path to verified career readiness.`,
        suggestedQuestions: defaultSuggestedQuestions,
        aiProviderUsed: 'fallback',
      };
    }
  }

  /**
   * Retrieves available career list with user match scores for career comparison
   */
  public static async getCareerComparisons(userId: string): Promise<ICareerComparisonItem[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const pContext = await PersonalizationService.getPersonalizationContext(userId);
    const verifiedSkillNames = (pContext.skills?.verifiedSkills || []).map((vs: any) =>
      typeof vs === 'string' ? vs : vs.name
    );
    const allProfileSkills = [
      ...(pContext.skills?.technicalSkills || []),
      ...(pContext.skills?.softSkills || []),
      ...(pContext.interests?.technologies || []),
    ];

    return CAREERS_DATA.map((career) => {
      const cReqSkills = CAREER_SKILL_MAPPING[career.id] || career.skills;
      const cVerifiedCount = cReqSkills.filter((sk) =>
        verifiedSkillNames.some((vs) => this.isSkillMatch(vs, sk))
      ).length;
      const cProfileCount = cReqSkills.filter((sk) =>
        allProfileSkills.some((ps) => this.isSkillMatch(ps, sk))
      ).length;
      const cMissing = cReqSkills.filter(
        (sk) =>
          !verifiedSkillNames.some((vs) => this.isSkillMatch(vs, sk)) &&
          !allProfileSkills.some((ps) => this.isSkillMatch(ps, sk))
      );

      const cWeighted = cVerifiedCount * 1.0 + cProfileCount * 0.7;
      const cScore = Math.min(
        100,
        Math.max(10, Math.round((cWeighted / (cReqSkills.length || 1)) * 80 + 10))
      );

      return {
        careerId: career.id,
        title: career.title,
        category: career.category,
        matchScore: cScore,
        strongSkillsCount: cVerifiedCount + cProfileCount,
        missingSkillsCount: cMissing.length,
        topMissingSkill: cMissing[0] || undefined,
        demandLevel: career.demandLevel || 'High',
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }
}
