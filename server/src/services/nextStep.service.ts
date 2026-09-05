import mongoose from 'mongoose';
import { ProgressService, IUnifiedProgressData } from './progress.service';
import { UserProfile } from '../models/UserProfile';

export type NextActionType =
  | 'explore_careers'
  | 'create_roadmap'
  | 'complete_milestone'
  | 'continue_learning'
  | 'close_skill_gap'
  | 'take_assessment'
  | 'build_resume'
  | 'practice_interview'
  | 'explore_career_paths';

export interface INextStepPrimaryAction {
  actionType: NextActionType;
  title: string;
  description: string;
  reason: string;
  destination: string;
  navigationState?: Record<string, any>;
  relevantId?: string;
  priority: 'critical' | 'high' | 'medium' | 'normal';
  badgeText: string;
  ctaText: string;
}

export interface ICurrentPosition {
  education: {
    level: string;
    streamOrBranch?: string;
    institution?: string;
    yearOrClass?: string;
  };
  targetCareer: {
    id: string;
    title: string;
    category: string;
  } | null;
  roadmapState: {
    hasRoadmap: boolean;
    progressPercentage: number;
    currentMilestoneTitle?: string;
    totalMilestones: number;
    completedMilestones: number;
  };
  keyProgress: {
    verifiedSkillsCount: number;
    totalRequiredSkills: number;
    skillCoveragePercentage: number;
    inProgressCoursesCount: number;
    completedCoursesCount: number;
    assessmentsPassedCount: number;
    resumeStatus: string;
    interviewSessionsCount: number;
  };
}

export interface IWhyThisNextStepFactor {
  id: string;
  title: string;
  status: 'attention' | 'in_progress' | 'ready' | 'not_started';
  detail: string;
}

export interface ISecondaryAction {
  id: string;
  title: string;
  description: string;
  destination: string;
  navigationState?: Record<string, any>;
  ctaText: string;
  iconName: 'Compass' | 'GitBranch' | 'Route' | 'BookOpen' | 'FileEdit' | 'Mic' | 'Target';
}

export interface INextStepData {
  isNewStudent: boolean;
  isCompletedStudent: boolean;
  primaryAction: INextStepPrimaryAction;
  whyThisStep: {
    headline: string;
    factors: IWhyThisNextStepFactor[];
  };
  currentPosition: ICurrentPosition;
  secondaryActions: ISecondaryAction[];
  safetyDisclaimer: string;
}

export class NextStepService {
  /**
   * Evaluates the student's real, persisted state across all 6 core Visionix pillars
   * via ProgressService and UserProfile, deterministically recommending the single
   * most impactful next action.
   */
  public static async getNextStep(userId: string, careerIdParam?: string): Promise<INextStepData> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Fetch authoritative unified progress and user profile concurrently
    const [progress, userProfile] = await Promise.all([
      ProgressService.getUnifiedProgress(userId, careerIdParam),
      UserProfile.findOne({ userId: userObjectId }),
    ]);

    const { targetCareer, roadmap, skills, learning, assessments, resume, interview } = progress;

    // 2. Resolve Current Position context
    const educationLevel =
      userProfile?.education?.level ||
      userProfile?.education?.studentStatus ||
      'Student';
    const streamOrBranch =
      userProfile?.education?.branchSpecialization ||
      userProfile?.education?.stream ||
      undefined;
    const institution = userProfile?.education?.institution || undefined;
    const yearOrClass =
      userProfile?.education?.currentClass ||
      userProfile?.education?.studyYear ||
      (userProfile?.education?.graduationYear ? `Class of ${userProfile.education.graduationYear}` : undefined);

    const currentPosition: ICurrentPosition = {
      education: {
        level: educationLevel,
        streamOrBranch,
        institution,
        yearOrClass,
      },
      targetCareer: targetCareer
        ? {
            id: targetCareer.id,
            title: targetCareer.title,
            category: targetCareer.category,
          }
        : null,
      roadmapState: {
        hasRoadmap: roadmap.hasRoadmap,
        progressPercentage: roadmap.progress,
        currentMilestoneTitle: roadmap.currentMilestone?.title,
        totalMilestones: roadmap.totalMilestones,
        completedMilestones: roadmap.completedMilestonesCount,
      },
      keyProgress: {
        verifiedSkillsCount: skills.verifiedSkills.length,
        totalRequiredSkills: skills.totalRequired,
        skillCoveragePercentage: skills.coveragePercentage,
        inProgressCoursesCount: learning.inProgressCount,
        completedCoursesCount: learning.completedCount,
        assessmentsPassedCount: assessments.passedCount,
        resumeStatus: resume.status,
        interviewSessionsCount: interview.totalCompleted,
      },
    };

    // 3. Build transparent "Why this is your next step" factors
    const factors: IWhyThisNextStepFactor[] = [];

    factors.push({
      id: 'career_goal',
      title: 'Target Career',
      status: targetCareer ? 'ready' : 'attention',
      detail: targetCareer
        ? `Focused on ${targetCareer.title} (${targetCareer.category}).`
        : 'No target career selected yet.',
    });

    factors.push({
      id: 'roadmap_status',
      title: 'Career Roadmap',
      status: roadmap.hasRoadmap
        ? roadmap.completedMilestonesCount === roadmap.totalMilestones && roadmap.totalMilestones > 0
          ? 'ready'
          : 'in_progress'
        : 'not_started',
      detail: roadmap.hasRoadmap
        ? `${roadmap.progress}% completed (${roadmap.completedMilestonesCount}/${roadmap.totalMilestones} checkpoints reached).`
        : 'Roadmap has not been created yet.',
    });

    factors.push({
      id: 'skills_coverage',
      title: 'Skills Competency',
      status: skills.coveragePercentage >= 80 ? 'ready' : skills.criticalMissing.length > 0 ? 'attention' : 'in_progress',
      detail: `${skills.verifiedSkills.length} verified skills with ${skills.coveragePercentage}% target role coverage.`,
    });

    factors.push({
      id: 'learning_progress',
      title: 'Coursework & Learning',
      status: learning.inProgressCount > 0 ? 'in_progress' : learning.completedCount > 0 ? 'ready' : 'not_started',
      detail: `${learning.completedCount} completed course${learning.completedCount === 1 ? '' : 's'} · ${learning.inProgressCount} in progress.`,
    });

    factors.push({
      id: 'assessments_status',
      title: 'Skill Assessments',
      status: assessments.totalCompleted > 0 ? 'ready' : 'not_started',
      detail: assessments.totalCompleted > 0
        ? `${assessments.passedCount}/${assessments.totalCompleted} assessments passed (${assessments.averageScore || 0}% avg).`
        : 'No skill verification assessments attempted yet.',
    });

    factors.push({
      id: 'resume_interview',
      title: 'Career Assets & Practice',
      status: resume.status === 'Ready' && interview.totalCompleted > 0 ? 'ready' : 'in_progress',
      detail: `Resume is ${resume.status.toLowerCase()} · ${interview.totalCompleted} mock interview session${interview.totalCompleted === 1 ? '' : 's'}.`,
    });

    // 4. Deterministic Primary Next Action Priority Resolution
    let primaryAction: INextStepPrimaryAction;
    let isNewStudent = false;
    let isCompletedStudent = false;
    let whyHeadline = '';

    // Priority 1: No target career
    if (!targetCareer) {
      isNewStudent = true;
      primaryAction = {
        actionType: 'explore_careers',
        title: 'Discover & Choose Your Target Career',
        description: 'Explore verified career pathways across technology, healthcare, business, and creative fields to ground your learning journey.',
        reason: 'Selecting a target career is the essential first step needed to generate your personalized roadmap, tailored skill gaps, and curated courses.',
        destination: '/explore',
        priority: 'critical',
        badgeText: 'Essential First Step',
        ctaText: 'Explore Careers',
      };
      whyHeadline = 'You need an anchor career to unlock custom roadmaps, skill benchmarks, and course paths.';
    }
    // Priority 2: Selected career but no roadmap created
    else if (!roadmap.hasRoadmap) {
      primaryAction = {
        actionType: 'create_roadmap',
        title: `Create Roadmap for ${targetCareer.title}`,
        description: `Establish structured milestones and learning checkpoints to guide your journey toward becoming a ${targetCareer.title}.`,
        reason: `You have selected ${targetCareer.title} as your goal. Creating your roadmap will provide clear, step-by-step guidance without guesswork.`,
        destination: '/roadmap',
        navigationState: { careerId: targetCareer.id, careerTitle: targetCareer.title },
        priority: 'critical',
        badgeText: 'Career Roadmap',
        ctaText: 'Create Roadmap',
      };
      whyHeadline = `You have set your sights on ${targetCareer.title}. Creating your roadmap gives you a clear milestone checklist.`;
    }
    // Priority 3: Active roadmap milestone in progress
    else if (roadmap.currentMilestone) {
      primaryAction = {
        actionType: 'complete_milestone',
        title: `Continue Milestone: ${roadmap.currentMilestone.title}`,
        description: roadmap.currentMilestone.description || `Work through the core learning tasks of this checkpoint in your ${targetCareer.title} roadmap.`,
        reason: `This is your current active checkpoint (${roadmap.progress}% overall roadmap completed). Advancing here moves you directly forward toward your goal.`,
        destination: '/roadmap',
        navigationState: { careerId: targetCareer.id, milestoneId: roadmap.currentMilestone.id },
        relevantId: roadmap.currentMilestone.id,
        priority: 'high',
        badgeText: 'Active Milestone',
        ctaText: 'Continue Milestone',
      };
      whyHeadline = `You are actively progressing on your ${targetCareer.title} roadmap. Completing this checkpoint is your most impactful task.`;
    }
    // Priority 4: Active in-progress course
    else if (learning.inProgressResources.length > 0) {
      const currentCourse = learning.inProgressResources[0];
      primaryAction = {
        actionType: 'continue_learning',
        title: `Resume Course: ${currentCourse.title}`,
        description: `Pick up where you left off with ${currentCourse.provider} to strengthen your domain expertise.`,
        reason: `You have an active course in progress. Finishing modules builds practical knowledge towards your target role.`,
        destination: '/learning-hub',
        relevantId: currentCourse.resourceId,
        priority: 'high',
        badgeText: 'Course in Progress',
        ctaText: 'Resume Course',
      };
      whyHeadline = `Finishing your active course will solidify your competencies and prepare you for subsequent milestones.`;
    }
    // Priority 5: Critical/high-priority skill gap
    else if (skills.criticalMissing.length > 0) {
      const topSkill = skills.criticalMissing[0];
      primaryAction = {
        actionType: 'close_skill_gap',
        title: `Close Critical Skill Gap: ${topSkill}`,
        description: `${topSkill} is a high-priority competency identified for ${targetCareer.title}.`,
        reason: `Your skill coverage is currently at ${skills.coveragePercentage}%. Closing this gap removes a major roadblock for internships and job readiness.`,
        destination: '/skill-gap',
        navigationState: { careerId: targetCareer.id },
        relevantId: topSkill,
        priority: 'high',
        badgeText: 'Critical Skill Gap',
        ctaText: 'Review Skill Gap',
      };
      whyHeadline = `${topSkill} was identified as a critical requirement for ${targetCareer.title}.`;
    }
    // Priority 6: Required skill assessment pending
    else if (assessments.totalCompleted === 0 && (skills.verifiedSkills.length > 0 || roadmap.progress > 0)) {
      primaryAction = {
        actionType: 'take_assessment',
        title: `Take Skill Assessment for ${targetCareer.title}`,
        description: `Validate your technical capabilities through an interactive checkpoint to earn verified skill credentials.`,
        reason: `Demonstrating your capabilities through objective assessments validates your readiness on your career pathway.`,
        destination: '/roadmap',
        priority: 'medium',
        badgeText: 'Skill Validation',
        ctaText: 'Take Assessment',
      };
      whyHeadline = `You have built foundational skills. Taking a benchmark assessment objectively validates your competency.`;
    }
    // Priority 7: Resume not started or incomplete draft
    else if (resume.status === 'Not Started' || resume.status === 'In Progress') {
      const isDraft = resume.status === 'In Progress';
      primaryAction = {
        actionType: 'build_resume',
        title: isDraft ? `Complete Your ${targetCareer.title} Resume` : `Build Your Resume for ${targetCareer.title}`,
        description: `Create an ATS-friendly resume pre-filled with your verified skills and academic background.`,
        reason: `Having a polished, tailored resume ready is essential as you prepare for internships, competitions, and job applications.`,
        destination: '/resume',
        priority: 'medium',
        badgeText: 'Resume Portfolio',
        ctaText: isDraft ? 'Complete Resume' : 'Build Resume',
      };
      whyHeadline = `A tailored resume translates your coursework and skills into professional credentials.`;
    }
    // Priority 8: Interview practice not started
    else if (interview.status === 'Not Started' || interview.totalCompleted === 0) {
      primaryAction = {
        actionType: 'practice_interview',
        title: `Practice an AI Mock Interview for ${targetCareer.title}`,
        description: `Test your domain knowledge and communication skills with an interactive mock interview tailored to your target role.`,
        reason: `Practicing realistic interview questions builds confidence and highlights areas for improvement before real evaluations.`,
        destination: '/interview',
        priority: 'medium',
        badgeText: 'Interview Practice',
        ctaText: 'Practice Interview',
      };
      whyHeadline = `Interactive mock interviews test your technical readiness and verbal communication in a stress-free environment.`;
    }
    // Priority 9: Advanced / completed student state
    else {
      isCompletedStudent = true;
      primaryAction = {
        actionType: 'explore_career_paths',
        title: 'Explore Alternative & Backup Career Paths',
        description: `You have completed core preparation for ${targetCareer.title}. Explore related specializations and strategic pivot options.`,
        reason: `With solid progress across your roadmap and verified skills, exploring alternative and backup paths broadens your career options.`,
        destination: '/career-paths',
        priority: 'normal',
        badgeText: 'Advanced Preparation',
        ctaText: 'Explore Career Paths',
      };
      whyHeadline = `You have demonstrated strong readiness for ${targetCareer.title}. Exploring adjacent career paths broadens your horizons.`;
    }

    // 5. Select 3-4 non-duplicative secondary actions
    const candidateSecondaryActions: ISecondaryAction[] = [
      {
        id: 'career_paths',
        title: 'Alternative & Backup Paths',
        description: 'Discover closely related specializations and backup pivots.',
        destination: '/career-paths',
        ctaText: 'Explore Paths',
        iconName: 'GitBranch',
      },
      {
        id: 'skill_gap',
        title: 'Skill Gap Analysis',
        description: 'Inspect required competencies vs your verified skills.',
        destination: '/skill-gap',
        navigationState: targetCareer ? { careerId: targetCareer.id } : undefined,
        ctaText: 'Inspect Skills',
        iconName: 'Target',
      },
      {
        id: 'learning_hub',
        title: 'Learning Hub',
        description: 'Browse curated courses and learning resources.',
        destination: '/learning-hub',
        ctaText: 'Browse Courses',
        iconName: 'BookOpen',
      },
      {
        id: 'resume',
        title: 'Resume Builder',
        description: 'Draft and polish your ATS-optimized professional resume.',
        destination: '/resume',
        ctaText: 'Open Resume',
        iconName: 'FileEdit',
      },
      {
        id: 'interview',
        title: 'Mock Interview Prep',
        description: 'Practice interactive AI-guided interview sessions.',
        destination: '/interview',
        ctaText: 'Practice Now',
        iconName: 'Mic',
      },
      {
        id: 'whats_next',
        title: "What's Next?",
        description: 'Review overarching academic and career milestones.',
        destination: '/whats-next',
        ctaText: 'View Steps',
        iconName: 'Route',
      },
      {
        id: 'explore',
        title: 'Explore Careers',
        description: 'Browse 300+ career options across diverse industries.',
        destination: '/explore',
        ctaText: 'Explore Careers',
        iconName: 'Compass',
      },
    ];

    // Filter out candidates whose destination matches the primary action destination
    const secondaryActions = candidateSecondaryActions
      .filter((action) => action.destination !== primaryAction.destination)
      .slice(0, 4);

    return {
      isNewStudent,
      isCompletedStudent,
      primaryAction,
      whyThisStep: {
        headline: whyHeadline,
        factors,
      },
      currentPosition,
      secondaryActions,
      safetyDisclaimer:
        'Recommendations are calculated deterministically from your current profile, roadmap, and learning activity to guide your next step. They do not constitute a guarantee of employment, admission, or career outcomes.',
    };
  }
}
