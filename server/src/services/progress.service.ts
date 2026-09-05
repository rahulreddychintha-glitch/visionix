import mongoose from 'mongoose';
import { CareerRoadmap, IMilestone } from '../models/CareerRoadmap';
import { UserProfile } from '../models/UserProfile';
import { SkillGapAnalysis, ISkillGapAnalysisDocument } from '../models/SkillGapAnalysis';
import { SkillNavigatorService } from './skillNavigator.service';
import { LearningProgress } from '../models/LearningProgress';
import { LearningResource, ILearningResourceDocument } from '../models/LearningResource';
import { CareerAssessment } from '../models/CareerAssessment';
import { Resume } from '../models/Resume';
import { Interview } from '../models/Interview';
import { CAREERS_DATA } from '../constants/careers.constants';

export type PillarStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Ready' | 'Active Practice';

export interface ICompletedItem {
  id: string;
  pillar: 'roadmap' | 'skills' | 'courses' | 'assessments' | 'resume' | 'interview';
  title: string;
  subtitle: string;
  date?: string;
  badge?: string;
  score?: number;
}

export interface INextProgressAction {
  pillar: 'roadmap' | 'skills' | 'courses' | 'assessments' | 'resume' | 'interview';
  title: string;
  description: string;
  actionText: string;
  actionRoute: string;
  urgency: 'high' | 'medium' | 'normal';
}

export interface IUnifiedProgressData {
  targetCareer: {
    id: string;
    title: string;
    category: string;
    source: 'roadmap' | 'profile' | 'default';
  } | null;
  overview: {
    activePillarsCount: number; // 0 to 6
    totalPillars: 6;
    overallProgressScore: number; // 0 to 100 deterministic percentage
    calculationExplanation: string;
    pillarsSummary: {
      roadmap: { status: PillarStatus; label: string; metric: string };
      skills: { status: PillarStatus; label: string; metric: string };
      courses: { status: PillarStatus; label: string; metric: string };
      assessments: { status: PillarStatus; label: string; metric: string };
      resume: { status: PillarStatus; label: string; metric: string };
      interview: { status: PillarStatus; label: string; metric: string };
    };
  };
  roadmap: {
    status: PillarStatus;
    hasRoadmap: boolean;
    careerId: string | null;
    careerTitle: string | null;
    progress: number; // 0 to 100 percentage from CareerRoadmap model
    totalMilestones: number;
    completedMilestonesCount: number;
    currentMilestone: {
      id: string;
      title: string;
      description: string;
      skills: string[];
      status: string;
    } | null;
    upcomingMilestones: Array<{
      id: string;
      title: string;
      description: string;
      skills: string[];
    }>;
    completedMilestones: Array<{
      id: string;
      title: string;
      status: string;
      assessmentScore?: number;
    }>;
    route: string;
  };
  skills: {
    status: PillarStatus;
    verifiedSkills: string[];
    developingSkills: string[];
    totalRequired: number;
    existingCount: number;
    missingCount: number;
    coveragePercentage: number;
    criticalMissing: string[];
    hasAnalysis: boolean;
    route: string;
  };
  learning: {
    status: PillarStatus;
    inProgressCount: number;
    completedCount: number;
    bookmarkedCount: number;
    totalStudyMinutes: number;
    streakDays: number;
    inProgressResources: Array<{
      resourceId: string;
      title: string;
      provider: string;
      type: string;
      thumbnail?: string;
      lastAccessed?: string;
    }>;
    completedResources: Array<{
      resourceId: string;
      title: string;
      provider: string;
      type: string;
      thumbnail?: string;
      completedAt?: string;
    }>;
    route: string;
  };
  assessments: {
    status: PillarStatus;
    totalCompleted: number;
    passedCount: number;
    averageScore: number | null;
    recentAssessments: Array<{
      id: string;
      title: string;
      type: string;
      score: number;
      passed: boolean;
      date: string;
    }>;
    route: string;
  };
  resume: {
    status: PillarStatus;
    resumeCount: number;
    hasResume: boolean;
    latestResume: {
      id: string;
      title: string;
      targetRole: string;
      updatedAt: string;
    } | null;
    route: string;
  };
  interview: {
    status: PillarStatus;
    totalCompleted: number;
    averageScore: number | null;
    bestScore: number | null;
    questionsAnswered: number;
    recentSessions: Array<{
      id: string;
      targetRole: string;
      interviewType: string;
      score?: number;
      date: string;
    }>;
    route: string;
  };
  completed: {
    totalCompletedCount: number;
    items: ICompletedItem[];
  };
  nextAction: INextProgressAction | null;
}

export class ProgressService {
  /**
   * Aggregates authenticated user's real progress across all 6 core systems:
   * Skills, Courses, Career Roadmap, Assessments, Resume, and Interview Preparation.
   *
   * Strictly read-only, non-fabricating, zero artificial AI duplication.
   */
  public static async getUnifiedProgress(userId: string, careerIdParam?: string): Promise<IUnifiedProgressData> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Fetch data from all 7 authoritative models in parallel
    const [
      roadmapDoc,
      userProfile,
      learningProgressDoc,
      assessmentsDocs,
      resumesDocs,
      interviewsDocs,
    ] = await Promise.all([
      careerIdParam
        ? CareerRoadmap.findOne({ userId: userObjectId, careerId: careerIdParam })
        : CareerRoadmap.findOne({ userId: userObjectId }).sort({ updatedAt: -1 }),
      UserProfile.findOne({ userId: userObjectId }),
      LearningProgress.findOne({ userId: userObjectId }),
      CareerAssessment.find({ userId: userObjectId, completed: true }).sort({ updatedAt: -1 }),
      Resume.find({ userId: userObjectId }).sort({ updatedAt: -1 }),
      Interview.find({ userId: userObjectId }).sort({ completedAt: -1, createdAt: -1 }),
    ]);

    // 2. Resolve Target Career
    let targetCareer: IUnifiedProgressData['targetCareer'] = null;

    if (roadmapDoc) {
      targetCareer = {
        id: roadmapDoc.careerId,
        title: roadmapDoc.careerTitle,
        category: 'Active Roadmap Career',
        source: 'roadmap',
      };
    } else if (userProfile?.careerGoals?.dreamCareer) {
      const dream = userProfile.careerGoals.dreamCareer;
      const matchedMeta = CAREERS_DATA.find(
        (c) => c.title.toLowerCase() === dream.toLowerCase() || c.id.toLowerCase() === dream.toLowerCase()
      );
      targetCareer = {
        id: matchedMeta?.id || dream.toLowerCase().replace(/\s+/g, '_'),
        title: matchedMeta?.title || dream,
        category: matchedMeta?.category || 'Goal Profile Career',
        source: 'profile',
      };
    }

    // 3. Skills & Phase 23 Skill Gap Analysis
    // Fetch latest skill gap analysis document if target career is known
    let skillGapDoc: ISkillGapAnalysisDocument | null = null;
    try {
      skillGapDoc = await SkillNavigatorService.getLatestAnalysis(userId, targetCareer?.id);
    } catch (_err) {
      // Graceful fallback to raw query
      skillGapDoc = await SkillGapAnalysis.findOne({ userId: userObjectId }).sort({ updatedAt: -1 });
    }

    // Extract verified skills (strictly authoritative from UserProfile and Roadmap)
    const verifiedSkillsList: string[] = [];
    if (userProfile?.skills?.verifiedSkills) {
      userProfile.skills.verifiedSkills.forEach((s: any) => {
        const name = typeof s === 'string' ? s : s?.name;
        if (name && !verifiedSkillsList.includes(name)) {
          verifiedSkillsList.push(name);
        }
      });
    }

    const developingSkillsList: string[] = [];
    if (skillGapDoc?.currentSkills?.developing) {
      skillGapDoc.currentSkills.developing.forEach((s) => {
        if (!developingSkillsList.includes(s) && !verifiedSkillsList.includes(s)) {
          developingSkillsList.push(s);
        }
      });
    }

    const criticalMissingSkills: string[] = (skillGapDoc?.missingSkills || [])
      .filter((s) => s.priority === 'Critical' || s.priority === 'High')
      .map((s) => s.skillName);

    const totalRequiredSkills = skillGapDoc?.summary?.totalRequired || (verifiedSkillsList.length + criticalMissingSkills.length);
    const missingSkillsCount = skillGapDoc?.summary?.missingCount ?? criticalMissingSkills.length;
    const skillCoveragePercentage = skillGapDoc?.summary?.coveragePercentage ?? (
      totalRequiredSkills > 0 ? Math.round((verifiedSkillsList.length / totalRequiredSkills) * 100) : 0
    );

    let skillsStatus: PillarStatus = 'Not Started';
    if (verifiedSkillsList.length > 0 || skillCoveragePercentage >= 75) {
      skillsStatus = 'Completed';
    } else if (developingSkillsList.length > 0 || (userProfile?.skills?.technicalSkills && userProfile.skills.technicalSkills.length > 0)) {
      skillsStatus = 'In Progress';
    }

    // 4. Learning Resources & LearningProgress
    const inProgressResourceIds: string[] = [];
    const completedResourceIds: string[] = [...(learningProgressDoc?.completedResources || [])];

    (learningProgressDoc?.resources || []).forEach((r) => {
      if (r.status === 'in_progress' && !inProgressResourceIds.includes(r.resourceId)) {
        inProgressResourceIds.push(r.resourceId);
      } else if (r.status === 'completed' && !completedResourceIds.includes(r.resourceId)) {
        completedResourceIds.push(r.resourceId);
      }
    });

    // Lookup metadata for resources
    const allTrackedIds = Array.from(new Set([...inProgressResourceIds, ...completedResourceIds]));
    const resourceMetadataList: ILearningResourceDocument[] = allTrackedIds.length > 0
      ? await LearningResource.find({ resourceId: { $in: allTrackedIds } })
      : [];

    const metaMap = new Map<string, ILearningResourceDocument>();
    resourceMetadataList.forEach((rm) => metaMap.set(rm.resourceId, rm));

    const inProgressResources = inProgressResourceIds.map((id) => {
      const meta = metaMap.get(id);
      const tracking = learningProgressDoc?.resources.find((r) => r.resourceId === id);
      return {
        resourceId: id,
        title: meta?.title || `Learning Resource #${id}`,
        provider: meta?.provider || 'Curated',
        type: meta?.type || 'Course / Video',
        thumbnail: meta?.thumbnail,
        lastAccessed: tracking?.lastAccessed ? tracking.lastAccessed.toISOString() : undefined,
      };
    });

    const completedResources = completedResourceIds.map((id) => {
      const meta = metaMap.get(id);
      const tracking = learningProgressDoc?.resources.find((r) => r.resourceId === id);
      return {
        resourceId: id,
        title: meta?.title || `Completed Resource #${id}`,
        provider: meta?.provider || 'Curated',
        type: meta?.type || 'Course / Tutorial',
        thumbnail: meta?.thumbnail,
        completedAt: tracking?.completedAt ? tracking.completedAt.toISOString() : undefined,
      };
    });

    let learningStatus: PillarStatus = 'Not Started';
    if (completedResources.length > 0) {
      learningStatus = 'Completed';
    } else if (inProgressResources.length > 0 || (learningProgressDoc?.totalStudyMinutes || 0) > 0) {
      learningStatus = 'In Progress';
    }

    // 5. Career Roadmap & Milestones
    let roadmapStatus: PillarStatus = 'Not Started';
    let roadmapProgressVal = 0;
    let flatMilestones: IMilestone[] = [];
    let completedMilestonesList: IMilestone[] = [];
    let currentMilestoneItem: IMilestone | null = null;
    let upcomingMilestonesList: IMilestone[] = [];

    if (roadmapDoc && roadmapDoc.stages) {
      roadmapProgressVal = roadmapDoc.progress || 0;
      flatMilestones = roadmapDoc.stages.flatMap((s) => s.milestones);

      completedMilestonesList = flatMilestones.filter(
        (m) => m.completed || m.status === 'Completed & Verified' || m.status === 'Completed — Review Recommended'
      );

      const firstUncompletedIdx = flatMilestones.findIndex(
        (m) => !m.completed && m.status !== 'Completed & Verified' && m.status !== 'Completed — Review Recommended'
      );

      if (firstUncompletedIdx !== -1) {
        currentMilestoneItem = flatMilestones[firstUncompletedIdx];
        upcomingMilestonesList = flatMilestones.slice(firstUncompletedIdx + 1, firstUncompletedIdx + 4);
      }

      if (roadmapProgressVal === 100 || (flatMilestones.length > 0 && completedMilestonesList.length === flatMilestones.length)) {
        roadmapStatus = 'Completed';
      } else if (completedMilestonesList.length > 0 || currentMilestoneItem) {
        roadmapStatus = 'In Progress';
      }
    }

    // 6. Assessments
    const totalAssessmentsCompleted = assessmentsDocs.length;
    const passedAssessments = assessmentsDocs.filter((a) => a.passed);
    const assessmentScores = assessmentsDocs.map((a) => a.score).filter((s) => typeof s === 'number');
    const averageAssessmentScore = assessmentScores.length > 0
      ? Math.round(assessmentScores.reduce((acc, curr) => acc + curr, 0) / assessmentScores.length)
      : null;

    let assessmentsStatus: PillarStatus = 'Not Started';
    if (totalAssessmentsCompleted > 0) {
      assessmentsStatus = 'Completed';
    } else if (flatMilestones.some((m) => m.assessmentAttempted)) {
      assessmentsStatus = 'In Progress';
    }

    const recentAssessments = assessmentsDocs.slice(0, 5).map((a) => ({
      id: a._id.toString(),
      title: a.assessmentType === 'standalone_skill' ? `${a.skillName} Assessment` : `Milestone Assessment`,
      type: a.assessmentType === 'standalone_skill' ? 'Skill Assessment' : 'Milestone Assessment',
      score: a.score,
      passed: a.passed,
      date: (a.updatedAt || a.createdAt).toISOString(),
    }));

    // 7. Resume
    const resumeCount = resumesDocs.length;
    let resumeStatus: PillarStatus = 'Not Started';
    let latestResume: IUnifiedProgressData['resume']['latestResume'] = null;

    if (resumeCount > 0) {
      const topResume = resumesDocs[0];
      latestResume = {
        id: topResume._id.toString(),
        title: topResume.title,
        targetRole: topResume.targetRole || 'Not specified',
        updatedAt: topResume.updatedAt.toISOString(),
      };

      // Check completeness: has personal contact + education or experience + skills
      const hasContact = Boolean(topResume.personalInfo?.fullName && topResume.personalInfo?.email);
      const hasExperienceOrEdu = (topResume.education?.length || 0) > 0 || (topResume.experience?.length || 0) > 0;
      const hasSkills = (topResume.skills?.technical?.length || 0) > 0;

      if (hasContact && hasExperienceOrEdu && hasSkills) {
        resumeStatus = 'Ready';
      } else {
        resumeStatus = 'In Progress';
      }
    }

    // 8. Interview Preparation
    const completedInterviews = interviewsDocs.filter((i) => i.status === 'completed');
    const inProgressInterviews = interviewsDocs.filter((i) => i.status === 'in_progress');
    const interviewScores = completedInterviews.map((i) => i.overallScore).filter((s): s is number => typeof s === 'number');
    const avgInterviewScore = interviewScores.length > 0
      ? Math.round(interviewScores.reduce((a, b) => a + b, 0) / interviewScores.length)
      : null;
    const bestInterviewScore = interviewScores.length > 0 ? Math.max(...interviewScores) : null;
    const questionsAnsweredCount = completedInterviews.reduce((acc, curr) => acc + (curr.answers?.length || 0), 0);

    let interviewStatus: PillarStatus = 'Not Started';
    if (completedInterviews.length > 0) {
      interviewStatus = 'Active Practice';
    } else if (inProgressInterviews.length > 0) {
      interviewStatus = 'In Progress';
    }

    const recentInterviewSessions = completedInterviews.slice(0, 5).map((i) => ({
      id: i._id.toString(),
      targetRole: i.targetRole,
      interviewType: i.interviewType,
      score: i.overallScore,
      date: (i.completedAt || i.createdAt).toISOString(),
    }));

    // 9. Unified Completed Checkpoints Aggregation
    const completedItems: ICompletedItem[] = [];

    // Completed roadmap milestones
    completedMilestonesList.forEach((m) => {
      completedItems.push({
        id: `milestone-${m.id}`,
        pillar: 'roadmap',
        title: m.title,
        subtitle: m.description,
        badge: m.status === 'Completed & Verified' ? 'Verified Milestone' : 'Milestone Completed',
        score: m.assessmentScore,
      });
    });

    // Completed learning resources
    completedResources.forEach((r) => {
      completedItems.push({
        id: `course-${r.resourceId}`,
        pillar: 'courses',
        title: r.title,
        subtitle: `${r.provider} · ${r.type}`,
        badge: 'Course Completed',
        date: r.completedAt,
      });
    });

    // Verified skills
    verifiedSkillsList.forEach((s) => {
      completedItems.push({
        id: `skill-${s}`,
        pillar: 'skills',
        title: s,
        subtitle: 'Skill Competency Verified via Assessment',
        badge: 'Verified Skill',
      });
    });

    // Completed assessments
    assessmentsDocs.forEach((a) => {
      completedItems.push({
        id: `assessment-${a._id}`,
        pillar: 'assessments',
        title: a.assessmentType === 'standalone_skill' ? `${a.skillName} Assessment` : 'Milestone Assessment',
        subtitle: `Score: ${a.score}% · ${a.passed ? 'Passed' : 'Completed'}`,
        badge: a.passed ? 'Passed' : 'Attempted',
        score: a.score,
        date: (a.updatedAt || a.createdAt).toISOString(),
      });
    });

    // Completed resume
    if (resumeStatus === 'Ready' && latestResume) {
      completedItems.push({
        id: `resume-${latestResume.id}`,
        pillar: 'resume',
        title: latestResume.title,
        subtitle: `Tailored for ${latestResume.targetRole}`,
        badge: 'Resume Ready',
        date: latestResume.updatedAt,
      });
    }

    // Completed interview sessions
    completedInterviews.forEach((i) => {
      completedItems.push({
        id: `interview-${i._id}`,
        pillar: 'interview',
        title: `${i.targetRole} Mock Interview`,
        subtitle: `Type: ${i.interviewType} · Score: ${i.overallScore || 'Evaluated'}%`,
        badge: 'Session Practiced',
        score: i.overallScore,
        date: (i.completedAt || i.createdAt).toISOString(),
      });
    });

    // 10. Deterministic "What's Next" unfinished item selection
    let nextAction: INextProgressAction | null = null;

    if (!targetCareer) {
      nextAction = {
        pillar: 'roadmap',
        title: 'Choose Your Target Career',
        description: 'Discover and select a career to generate your personalized learning journey and roadmap.',
        actionText: 'Explore Careers',
        actionRoute: '/explore',
        urgency: 'high',
      };
    } else if (currentMilestoneItem) {
      nextAction = {
        pillar: 'roadmap',
        title: `Continue Milestone: ${currentMilestoneItem.title}`,
        description: currentMilestoneItem.description || `Advance your ${targetCareer.title} roadmap by tackling this active checkpoint.`,
        actionText: 'View in Roadmap',
        actionRoute: '/roadmap',
        urgency: 'high',
      };
    } else if (inProgressResources.length > 0) {
      nextAction = {
        pillar: 'courses',
        title: `Continue Course: ${inProgressResources[0].title}`,
        description: `Pick up where you left off with ${inProgressResources[0].provider} to deepen your subject matter mastery.`,
        actionText: 'Open Learning Hub',
        actionRoute: '/learning-hub',
        urgency: 'medium',
      };
    } else if (criticalMissingSkills.length > 0) {
      nextAction = {
        pillar: 'skills',
        title: `Close Skill Gap: ${criticalMissingSkills[0]}`,
        description: `${criticalMissingSkills[0]} is an essential competency identified for ${targetCareer.title}.`,
        actionText: 'Review Skill Gap',
        actionRoute: '/skill-gap',
        urgency: 'high',
      };
    } else if (resumeStatus === 'Not Started') {
      nextAction = {
        pillar: 'resume',
        title: `Create Your Resume for ${targetCareer.title}`,
        description: 'Draft an ATS-friendly resume pre-filled with your verified skills and academic background.',
        actionText: 'Build Resume',
        actionRoute: '/resume',
        urgency: 'normal',
      };
    } else if (interviewStatus === 'Not Started') {
      nextAction = {
        pillar: 'interview',
        title: `Practice an Interview for ${targetCareer.title}`,
        description: 'Test your interview readiness with an interactive AI mock session tailored to your domain.',
        actionText: 'Start Interview Prep',
        actionRoute: '/interview',
        urgency: 'normal',
      };
    } else if (upcomingMilestonesList.length > 0) {
      nextAction = {
        pillar: 'roadmap',
        title: `Next Milestone: ${upcomingMilestonesList[0].title}`,
        description: 'Prepare for the next stage on your career pathway.',
        actionText: 'Open Roadmap',
        actionRoute: '/roadmap',
        urgency: 'normal',
      };
    }

    // 11. Deterministic and Explainable Overall Progress Score
    // Calculate pillar weights and completion strictly from actual data
    const pillarScores = {
      roadmap: roadmapProgressVal, // 0 to 100%
      skills: skillCoveragePercentage, // 0 to 100%
      courses: completedResources.length > 0 ? 100 : (inProgressResources.length > 0 ? 40 : 0),
      assessments: totalAssessmentsCompleted > 0 ? Math.min(100, totalAssessmentsCompleted * 25) : 0,
      resume: resumeStatus === 'Ready' ? 100 : (resumeStatus === 'In Progress' ? 50 : 0),
      interview: interviewStatus === 'Active Practice' ? 100 : (interviewStatus === 'In Progress' ? 50 : 0),
    };

    // Active pillars count
    const activePillars = [
      roadmapStatus !== 'Not Started',
      skillsStatus !== 'Not Started',
      learningStatus !== 'Not Started',
      assessmentsStatus !== 'Not Started',
      resumeStatus !== 'Not Started',
      interviewStatus !== 'Not Started',
    ].filter(Boolean).length;

    // Explainable deterministic weighted average:
    // Roadmap (25%), Skills (25%), Courses (15%), Assessments (15%), Resume (10%), Interview (10%)
    const overallProgressScore = Math.round(
      pillarScores.roadmap * 0.25 +
      pillarScores.skills * 0.25 +
      pillarScores.courses * 0.15 +
      pillarScores.assessments * 0.15 +
      pillarScores.resume * 0.10 +
      pillarScores.interview * 0.10
    );

    const calculationExplanation =
      'Calculated deterministically from actual activity across all 6 career pillars: ' +
      `Roadmap Progress (${pillarScores.roadmap}%), ` +
      `Skill Coverage (${pillarScores.skills}%), ` +
      `Courses (${completedResources.length} completed), ` +
      `Assessments (${totalAssessmentsCompleted} attempts), ` +
      `Resume (${resumeStatus}), and ` +
      `Interview Preparation (${interviewStatus}).`;

    return {
      targetCareer,
      overview: {
        activePillarsCount: activePillars,
        totalPillars: 6,
        overallProgressScore,
        calculationExplanation,
        pillarsSummary: {
          roadmap: {
            status: roadmapStatus,
            label: 'Career Roadmap',
            metric: roadmapDoc ? `${roadmapProgressVal}% Completed (${completedMilestonesList.length}/${flatMilestones.length})` : 'No Roadmap Created',
          },
          skills: {
            status: skillsStatus,
            label: 'Skills Competency',
            metric: `${verifiedSkillsList.length} Verified · ${skillCoveragePercentage}% Coverage`,
          },
          courses: {
            status: learningStatus,
            label: 'Courses & Learning',
            metric: `${completedResources.length} Completed · ${inProgressResources.length} In Progress`,
          },
          assessments: {
            status: assessmentsStatus,
            label: 'Skill Assessments',
            metric: totalAssessmentsCompleted > 0 ? `${totalAssessmentsCompleted} Taken · ${averageAssessmentScore}% Avg Score` : 'None Attempted',
          },
          resume: {
            status: resumeStatus,
            label: 'Resume Portfolio',
            metric: resumeStatus === 'Ready' ? 'Resume Complete & Ready' : (resumeStatus === 'In Progress' ? 'Draft In Progress' : 'Not Started'),
          },
          interview: {
            status: interviewStatus,
            label: 'Interview Prep',
            metric: completedInterviews.length > 0 ? `${completedInterviews.length} Sessions Practiced` : 'Not Started',
          },
        },
      },
      roadmap: {
        status: roadmapStatus,
        hasRoadmap: Boolean(roadmapDoc),
        careerId: roadmapDoc?.careerId || null,
        careerTitle: roadmapDoc?.careerTitle || null,
        progress: roadmapProgressVal,
        totalMilestones: flatMilestones.length,
        completedMilestonesCount: completedMilestonesList.length,
        currentMilestone: currentMilestoneItem
          ? {
              id: currentMilestoneItem.id,
              title: currentMilestoneItem.title,
              description: currentMilestoneItem.description,
              skills: currentMilestoneItem.skills,
              status: currentMilestoneItem.status || 'In Progress',
            }
          : null,
        upcomingMilestones: upcomingMilestonesList.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          skills: m.skills,
        })),
        completedMilestones: completedMilestonesList.map((m) => ({
          id: m.id,
          title: m.title,
          status: m.status || 'Completed',
          assessmentScore: m.assessmentScore,
        })),
        route: '/roadmap',
      },
      skills: {
        status: skillsStatus,
        verifiedSkills: verifiedSkillsList,
        developingSkills: developingSkillsList,
        totalRequired: totalRequiredSkills,
        existingCount: verifiedSkillsList.length,
        missingCount: missingSkillsCount,
        coveragePercentage: skillCoveragePercentage,
        criticalMissing: criticalMissingSkills,
        hasAnalysis: Boolean(skillGapDoc),
        route: '/skill-gap',
      },
      learning: {
        status: learningStatus,
        inProgressCount: inProgressResources.length,
        completedCount: completedResources.length,
        bookmarkedCount: (learningProgressDoc?.bookmarkedResources || []).length,
        totalStudyMinutes: learningProgressDoc?.totalStudyMinutes || 0,
        streakDays: learningProgressDoc?.streakDays || 0,
        inProgressResources,
        completedResources,
        route: '/learning-hub',
      },
      assessments: {
        status: assessmentsStatus,
        totalCompleted: totalAssessmentsCompleted,
        passedCount: passedAssessments.length,
        averageScore: averageAssessmentScore,
        recentAssessments,
        route: '/roadmap',
      },
      resume: {
        status: resumeStatus,
        resumeCount,
        hasResume: resumeCount > 0,
        latestResume,
        route: '/resume',
      },
      interview: {
        status: interviewStatus,
        totalCompleted: completedInterviews.length,
        averageScore: avgInterviewScore,
        bestScore: bestInterviewScore,
        questionsAnswered: questionsAnsweredCount,
        recentSessions: recentInterviewSessions,
        route: '/interview',
      },
      completed: {
        totalCompletedCount: completedItems.length,
        items: completedItems,
      },
      nextAction,
    };
  }
}
