import mongoose from 'mongoose';
import { ProgressService, IUnifiedProgressData, PillarStatus } from './progress.service';

export type ReadinessStage =
  | 'Getting Started'
  | 'Building Foundation'
  | 'Progressing Well'
  | 'Advanced Preparation';

export interface ICareerReadinessContributor {
  id: 'skills' | 'learning' | 'roadmap' | 'assessments' | 'resume' | 'interview';
  name: string;
  score: number; // 0 - 100
  weight: number; // e.g. 25, 15, 10
  weightedScore: number;
  status: PillarStatus;
  summary: string;
  detail: string;
  route: string;
  metrics: Record<string, any>;
}

export interface IReadinessGap {
  id: string;
  contributor: 'skills' | 'learning' | 'roadmap' | 'assessments' | 'resume' | 'interview';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  actionLabel: string;
  actionRoute: string;
}

export interface IReadinessStrength {
  id: string;
  contributor: 'skills' | 'learning' | 'roadmap' | 'assessments' | 'resume' | 'interview';
  title: string;
  description: string;
}

export interface ICareerReadinessData {
  targetCareer: {
    id: string;
    title: string;
    source: 'roadmap' | 'profile' | 'default' | 'none';
    category?: string;
    salaryRange?: string;
    demandLevel?: string;
  } | null;
  overallScore: number; // 0 - 100
  readinessStage: ReadinessStage;
  stageDescription: string;
  disclaimer: string;
  contributors: ICareerReadinessContributor[];
  strongAreas: IReadinessStrength[];
  areasNeedingAttention: IReadinessGap[];
  whyThisResult: string;
  nextAction: {
    contributor: string;
    title: string;
    description: string;
    actionLabel: string;
    actionRoute: string;
  };
  lastUpdated: string;
}

export class CareerReadinessService {
  /**
   * Deterministically calculates career preparation readiness using authoritative
   * Visionix progress data across the 6 core dimensions.
   */
  public static async getCareerReadiness(
    userId: string,
    careerId?: string
  ): Promise<ICareerReadinessData> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    // 1. Fetch unified progress from authoritative models
    const progressData: IUnifiedProgressData = await ProgressService.getUnifiedProgress(
      userId,
      careerId
    );

    const {
      targetCareer,
      roadmap,
      skills,
      learning,
      assessments,
      resume,
      interview,
      nextAction: unifiedNextAction,
    } = progressData;

    // 2. Deterministic Contributor Score Calculations (0 - 100)
    // -------------------------------------------------------------

    // Pillar 1: Skills Readiness (Weight: 25%)
    let skillsScore = 0;
    let skillsSummary = 'No skills verified';
    let skillsDetail = 'Verify technical skills to build domain readiness.';
    if (skills.totalRequired > 0) {
      skillsScore = Math.min(100, Math.max(0, skills.coveragePercentage));
      skillsSummary = `${skills.verifiedSkills.length} of ${skills.totalRequired} required skills verified (${skillsScore}%)`;
      if (skills.criticalMissing.length > 0) {
        skillsDetail = `Critical gaps: ${skills.criticalMissing.slice(0, 3).join(', ')}`;
      } else {
        skillsDetail = 'Strong coverage across core required competencies.';
      }
    } else if (skills.verifiedSkills.length > 0) {
      skillsScore = Math.min(100, skills.verifiedSkills.length * 25);
      skillsSummary = `${skills.verifiedSkills.length} profile skills verified`;
      skillsDetail = 'Skills verified through assessments.';
    }

    // Pillar 2: Roadmap Readiness (Weight: 25%)
    let roadmapScore = 0;
    let roadmapSummary = 'No active roadmap';
    let roadmapDetail = 'Start your career roadmap to track structured milestones.';
    if (roadmap.totalMilestones > 0) {
      roadmapScore = Math.min(100, Math.max(0, roadmap.progress));
      roadmapSummary = `${roadmap.completedMilestonesCount} of ${roadmap.totalMilestones} milestones completed (${roadmapScore}%)`;
      if (roadmap.currentMilestone) {
        roadmapDetail = `Active milestone: ${roadmap.currentMilestone.title}`;
      } else if (roadmapScore === 100) {
        roadmapDetail = 'All roadmap milestones completed.';
      }
    }

    // Pillar 3: Learning / Coursework Readiness (Weight: 15%)
    let learningScore = 0;
    let learningSummary = 'No coursework activity';
    let learningDetail = 'Explore curated courses in the Learning Hub to gain structured knowledge.';
    const totalCoursesEngaged = learning.completedCount + learning.inProgressCount;
    if (totalCoursesEngaged > 0) {
      learningScore = Math.min(
        100,
        learning.completedCount * 35 + learning.inProgressCount * 15
      );
      learningSummary = `${learning.completedCount} completed, ${learning.inProgressCount} in progress`;
      if (learning.streakDays > 0) {
        learningDetail = `${learning.totalStudyMinutes} mins study time, ${learning.streakDays}-day streak.`;
      } else {
        learningDetail = `${learning.completedCount} course(s) successfully finished.`;
      }
    }

    // Pillar 4: Assessments Readiness (Weight: 15%)
    let assessmentsScore = 0;
    let assessmentsSummary = 'No assessments taken';
    let assessmentsDetail = 'Complete milestone and skill quizzes to validate your knowledge.';
    if (assessments.totalCompleted > 0) {
      const rawAvg = assessments.averageScore || 70;
      assessmentsScore = Math.min(100, Math.max(0, rawAvg));
      assessmentsSummary = `${assessments.passedCount} of ${assessments.totalCompleted} passed, avg score ${assessmentsScore}%`;
      assessmentsDetail = 'Formal validation of milestone concepts and technical topics.';
    }

    // Pillar 5: Resume Readiness (Weight: 10%)
    let resumeScore = 0;
    let resumeSummary = 'Resume not created';
    let resumeDetail = 'Build a tailored resume showcasing your skills and education.';
    if (resume.status === 'Ready') {
      resumeScore = 100;
      resumeSummary = 'Resume portfolio ready';
      resumeDetail = 'Targeted resume prepared with contact info, education, and skills.';
    } else if (resume.status === 'In Progress') {
      resumeScore = 50;
      resumeSummary = 'Resume in progress';
      resumeDetail = 'Draft created; complete remaining sections to finalize.';
    }

    // Pillar 6: Interview Preparation Readiness (Weight: 10%)
    let interviewScore = 0;
    let interviewSummary = 'No mock interviews practiced';
    let interviewDetail = 'Practice simulated technical and behavioral interviews.';
    if (interview.status === 'Active Practice' || interview.totalCompleted > 0) {
      const avgInt = interview.averageScore || 75;
      interviewScore = Math.min(100, Math.max(60, avgInt));
      interviewSummary = `${interview.totalCompleted} session(s) completed, avg score ${interviewScore}%`;
      interviewDetail = `${interview.questionsAnswered} questions practiced across mock sessions.`;
    } else if (interview.status === 'In Progress') {
      interviewScore = 40;
      interviewSummary = 'Interview session in progress';
      interviewDetail = 'Complete your pending mock interview session.';
    }

    // 3. Compile Contributors
    const contributors: ICareerReadinessContributor[] = [
      {
        id: 'skills',
        name: 'Skills & Competencies',
        score: skillsScore,
        weight: 25,
        weightedScore: Math.round((skillsScore * 25) / 100),
        status: skills.status,
        summary: skillsSummary,
        detail: skillsDetail,
        route: '/skill-gap',
        metrics: {
          verifiedCount: skills.verifiedSkills.length,
          totalRequired: skills.totalRequired,
          coveragePercentage: skills.coveragePercentage,
          criticalMissingCount: skills.criticalMissing.length,
        },
      },
      {
        id: 'roadmap',
        name: 'Career Roadmap',
        score: roadmapScore,
        weight: 25,
        weightedScore: Math.round((roadmapScore * 25) / 100),
        status: roadmap.status,
        summary: roadmapSummary,
        detail: roadmapDetail,
        route: '/roadmap',
        metrics: {
          progress: roadmap.progress,
          completedMilestones: roadmap.completedMilestonesCount,
          totalMilestones: roadmap.totalMilestones,
          currentMilestone: roadmap.currentMilestone?.title || null,
        },
      },
      {
        id: 'learning',
        name: 'Courses & Coursework',
        score: learningScore,
        weight: 15,
        weightedScore: Math.round((learningScore * 15) / 100),
        status: learning.status,
        summary: learningSummary,
        detail: learningDetail,
        route: '/learning-hub',
        metrics: {
          completedCount: learning.completedCount,
          inProgressCount: learning.inProgressCount,
          totalStudyMinutes: learning.totalStudyMinutes,
          streakDays: learning.streakDays,
        },
      },
      {
        id: 'assessments',
        name: 'Assessments & Quizzes',
        score: assessmentsScore,
        weight: 15,
        weightedScore: Math.round((assessmentsScore * 15) / 100),
        status: assessments.status,
        summary: assessmentsSummary,
        detail: assessmentsDetail,
        route: '/roadmap',
        metrics: {
          totalCompleted: assessments.totalCompleted,
          passedCount: assessments.passedCount,
          averageScore: assessments.averageScore,
        },
      },
      {
        id: 'resume',
        name: 'Resume Portfolio',
        score: resumeScore,
        weight: 10,
        weightedScore: Math.round((resumeScore * 10) / 100),
        status: resume.status,
        summary: resumeSummary,
        detail: resumeDetail,
        route: '/resume',
        metrics: {
          hasResume: resume.hasResume,
          resumeCount: resume.resumeCount,
          status: resume.status,
        },
      },
      {
        id: 'interview',
        name: 'Interview Preparation',
        score: interviewScore,
        weight: 10,
        weightedScore: Math.round((interviewScore * 10) / 100),
        status: interview.status,
        summary: interviewSummary,
        detail: interviewDetail,
        route: '/interview',
        metrics: {
          totalCompleted: interview.totalCompleted,
          averageScore: interview.averageScore,
          questionsAnswered: interview.questionsAnswered,
        },
      },
    ];

    // 4. Overall Readiness Score (Weighted sum out of 100)
    const overallScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          skillsScore * 0.25 +
          roadmapScore * 0.25 +
          learningScore * 0.15 +
          assessmentsScore * 0.15 +
          resumeScore * 0.10 +
          interviewScore * 0.10
        )
      )
    );

    // 5. Readiness Stage (Safe preparation terminology — NEVER employment guarantee!)
    let readinessStage: ReadinessStage = 'Getting Started';
    let stageDescription = 'Beginning your career preparation journey.';
    if (overallScore >= 75) {
      readinessStage = 'Advanced Preparation';
      stageDescription = 'Comprehensive preparation across all key evaluation areas.';
    } else if (overallScore >= 50) {
      readinessStage = 'Progressing Well';
      stageDescription = 'Strong momentum with steady progress across preparation milestones.';
    } else if (overallScore >= 25) {
      readinessStage = 'Building Foundation';
      stageDescription = 'Actively building core skills and foundational coursework.';
    }

    // 6. Identify Strong Areas (Contributors with solid progress)
    const strongAreas: IReadinessStrength[] = [];
    if (skills.verifiedSkills.length > 0) {
      strongAreas.push({
        id: 'str_skills',
        contributor: 'skills',
        title: 'Verified Technical Competencies',
        description: `Successfully verified: ${skills.verifiedSkills.slice(0, 4).join(', ')}.`,
      });
    }
    if (roadmap.completedMilestonesCount > 0) {
      strongAreas.push({
        id: 'str_roadmap',
        contributor: 'roadmap',
        title: 'Roadmap Milestones Completed',
        description: `${roadmap.completedMilestonesCount} structured career milestones completed.`,
      });
    }
    if (learning.completedCount > 0) {
      strongAreas.push({
        id: 'str_learning',
        contributor: 'learning',
        title: 'Coursework Finished',
        description: `${learning.completedCount} learning resource(s) successfully completed.`,
      });
    }
    if (assessments.passedCount > 0) {
      strongAreas.push({
        id: 'str_assessments',
        contributor: 'assessments',
        title: 'Validated Assessment Performance',
        description: `${assessments.passedCount} assessments passed with average score of ${assessmentsScore}%.`,
      });
    }
    if (resume.status === 'Ready') {
      strongAreas.push({
        id: 'str_resume',
        contributor: 'resume',
        title: 'Tailored Resume Ready',
        description: 'Professional resume prepared with complete sections and contact information.',
      });
    }
    if (interview.totalCompleted > 0) {
      strongAreas.push({
        id: 'str_interview',
        contributor: 'interview',
        title: 'Active Mock Interview Practice',
        description: `${interview.totalCompleted} interview session(s) completed (${interviewScore}% avg).`,
      });
    }

    // 7. Identify "What Needs Attention?" (Gaps ranked by priority)
    const areasNeedingAttention: IReadinessGap[] = [];

    // Target career missing
    if (!targetCareer) {
      areasNeedingAttention.push({
        id: 'gap_career',
        contributor: 'roadmap',
        title: 'Choose Target Career Direction',
        description: 'Select a target career to unlock career-specific skill gaps and tailored learning.',
        priority: 'High',
        actionLabel: 'Explore Careers',
        actionRoute: '/explore',
      });
    }

    // Critical missing skills
    if (skills.criticalMissing.length > 0) {
      areasNeedingAttention.push({
        id: 'gap_skills_critical',
        contributor: 'skills',
        title: `Address ${skills.criticalMissing.length} Critical Skill Gap(s)`,
        description: `Prioritize learning: ${skills.criticalMissing.slice(0, 3).join(', ')}.`,
        priority: 'High',
        actionLabel: 'View Skill Gaps',
        actionRoute: '/skill-gap',
      });
    }

    // Incomplete active milestone
    if (roadmap.currentMilestone) {
      areasNeedingAttention.push({
        id: 'gap_roadmap_milestone',
        contributor: 'roadmap',
        title: `Complete Active Milestone: ${roadmap.currentMilestone.title}`,
        description: 'Milestone is in progress. Complete related learning and pass milestone verification.',
        priority: 'High',
        actionLabel: 'Go to Milestone',
        actionRoute: '/roadmap',
      });
    } else if (roadmap.totalMilestones === 0) {
      areasNeedingAttention.push({
        id: 'gap_no_roadmap',
        contributor: 'roadmap',
        title: 'Generate Career Roadmap',
        description: 'Create your step-by-step roadmap to guide milestones and assessments.',
        priority: 'High',
        actionLabel: 'Create Roadmap',
        actionRoute: '/roadmap',
      });
    }

    // Coursework gap
    if (learning.completedCount === 0) {
      areasNeedingAttention.push({
        id: 'gap_learning_none',
        contributor: 'learning',
        title: 'Start Recommended Coursework',
        description: 'Complete targeted courses to build the domain knowledge required for your career.',
        priority: 'Medium',
        actionLabel: 'Open Learning Hub',
        actionRoute: '/learning-hub',
      });
    } else if (learning.inProgressCount > 0) {
      const firstActive = learning.inProgressResources[0];
      areasNeedingAttention.push({
        id: 'gap_learning_active',
        contributor: 'learning',
        title: `Finish Course: ${firstActive?.title || 'In-Progress Course'}`,
        description: 'Continue studying to convert in-progress courses into completed knowledge.',
        priority: 'Medium',
        actionLabel: 'Continue Learning',
        actionRoute: '/learning-hub',
      });
    }

    // Assessments gap
    if (assessments.totalCompleted === 0) {
      areasNeedingAttention.push({
        id: 'gap_assessments_none',
        contributor: 'assessments',
        title: 'Take Your First Skill Assessment',
        description: 'Validate your competencies through milestone quizzes and skill evaluations.',
        priority: 'Medium',
        actionLabel: 'Take Quiz',
        actionRoute: '/roadmap',
      });
    }

    // Resume gap
    if (resume.status === 'Not Started') {
      areasNeedingAttention.push({
        id: 'gap_resume_none',
        contributor: 'resume',
        title: 'Create Professional Resume',
        description: 'Build a formatted resume to showcase your background, skills, and projects.',
        priority: 'Medium',
        actionLabel: 'Build Resume',
        actionRoute: '/resume',
      });
    } else if (resume.status === 'In Progress') {
      areasNeedingAttention.push({
        id: 'gap_resume_progress',
        contributor: 'resume',
        title: 'Finalize Your Resume',
        description: 'Complete contact details, education, and technical skills sections.',
        priority: 'Low',
        actionLabel: 'Edit Resume',
        actionRoute: '/resume',
      });
    }

    // Interview gap
    if (interview.status === 'Not Started') {
      areasNeedingAttention.push({
        id: 'gap_interview_none',
        contributor: 'interview',
        title: 'Begin Interview Practice',
        description: 'Complete mock technical and behavioral interview sessions to practice communication.',
        priority: 'Low',
        actionLabel: 'Practice Interview',
        actionRoute: '/interview',
      });
    }

    // 8. "Why This Result?" Explanation
    const targetCareerName = targetCareer?.title || 'your chosen field';
    const whyThisResult =
      `Career Readiness reflects your ongoing preparation toward ${targetCareerName}. ` +
      `It combines verified skills (25%), roadmap milestones (25%), coursework (15%), ` +
      `assessments (15%), resume readiness (10%), and mock interview practice (10%). ` +
      `This indicator highlights concrete preparation progress and areas needing attention. ` +
      `It is not an employment prediction or guarantee of hiring.`;

    // 9. Contextual Next Action
    let nextAction = {
      contributor: 'explore',
      title: 'Choose a Target Career',
      description: 'Select your target career path to personalize your roadmap, skill gaps, and readiness metrics.',
      actionLabel: 'Explore Careers',
      actionRoute: '/explore',
    };

    if (areasNeedingAttention.length > 0) {
      const topGap = areasNeedingAttention[0];
      nextAction = {
        contributor: topGap.contributor,
        title: topGap.title,
        description: topGap.description,
        actionLabel: topGap.actionLabel,
        actionRoute: topGap.actionRoute,
      };
    } else if (unifiedNextAction) {
      nextAction = {
        contributor: unifiedNextAction.pillar,
        title: unifiedNextAction.title,
        description: unifiedNextAction.description,
        actionLabel: unifiedNextAction.actionText,
        actionRoute: unifiedNextAction.actionRoute,
      };
    }

    const disclaimer =
      'Career Readiness is a preparation indicator tracking your personal learning progress across skills, coursework, roadmap milestones, assessments, resume, and interview prep. It does not predict or guarantee employment, job offers, or hiring outcomes.';

    return {
      targetCareer,
      overallScore,
      readinessStage,
      stageDescription,
      disclaimer,
      contributors,
      strongAreas,
      areasNeedingAttention,
      whyThisResult,
      nextAction,
      lastUpdated: new Date().toISOString(),
    };
  }
}
