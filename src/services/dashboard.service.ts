import type { DashboardData, LearningResourceData, ScholarshipData } from '../types/dashboard.types';
import { PersonalizationApiService } from './personalization.service';
import { Terminal, Cpu, Database, Award, Layers } from 'lucide-react';

const getSkillIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('python') || lower.includes('code') || lower.includes('programming') || lower.includes('git') || lower.includes('cad') || lower.includes('draw') || lower.includes('design')) {
    return Terminal;
  }
  if (lower.includes('pytorch') || lower.includes('ai') || lower.includes('ml') || lower.includes('learning') || lower.includes('diagnostics') || lower.includes('clinical')) {
    return Cpu;
  }
  if (lower.includes('sql') || lower.includes('database') || lower.includes('db') || lower.includes('modeling') || lower.includes('excel')) {
    return Database;
  }
  if (lower.includes('user') || lower.includes('wireframe') || lower.includes('prototype') || lower.includes('figma')) {
    return Layers;
  }
  return Award;
};

const cleanCareerLabel = (val: string) => {
  if (!val) return 'Career Explorer';
  if (val.includes('_')) {
    return val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return val;
};

export class DashboardService {
  private static dashboardCache = new Map<string, { timestamp: number; data: DashboardData }>();
  private static dashboardPromises = new Map<string, Promise<DashboardData>>();
  private static CACHE_TTL_MS = 30 * 1000; // 30 seconds cache TTL

  /**
   * Fetches dashboard details. Resolves details dynamically by pulling from
   * the backend personalization & recommendation services.
   * Caches in memory and deduplicates concurrent in-flight calls.
   */
  public static async getDashboardData(userEmail: string): Promise<DashboardData> {
    const cacheKey = userEmail || '__default__';
    const now = Date.now();
    const cached = this.dashboardCache.get(cacheKey);
    if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    const pending = this.dashboardPromises.get(cacheKey);
    if (pending) {
      return pending;
    }

    const promise = (async () => {
      try {
        const data = await DashboardService.computeDashboardData(userEmail);
        DashboardService.dashboardCache.set(cacheKey, { timestamp: Date.now(), data });
        return data;
      } finally {
        DashboardService.dashboardPromises.delete(cacheKey);
      }
    })();

    this.dashboardPromises.set(cacheKey, promise);
    return promise;
  }

  private static async computeDashboardData(_userEmail: string): Promise<DashboardData> {
    try {
      // Fetch personalization data (context & recommendations) from backend API
      const personalization = await PersonalizationApiService.getPersonalizationData();

      const ctx = personalization.context;
      const recs = personalization.recommendations;

      const rawDreamCareer = ctx.careerGoals?.dreamCareer || recs.topCareers[0]?.title || 'Career Explorer';
      const dreamCareer = cleanCareerLabel(rawDreamCareer);
      const objectives = ctx.careerGoals?.careerObjectives || recs.topCareers[0]?.reason || 'Build a solid foundation in your chosen career.';
      const techSkills = ctx.skills.technicalSkills || [];
      const salaryGoal = ctx.careerGoals?.salaryGoal || '$75,000/yr';
      const specialization = ctx.specialization || '';
      
      // Calculate verified skills vs self-reported skills
      const verifiedSkills = ctx.skills.verifiedSkills || [];
      const verifiedCount = verifiedSkills.length;
      const skillsCount = techSkills.length;
      const verifiedText = `${verifiedCount} Verified`;
      const verifiedProgressPercent = Math.min(Math.round((verifiedCount / 20) * 100), 100);

      // Real database progress calculation from careerProgress milestones
      let progressPercent = 0;
      if (ctx.careerProgress) {
        const total = ctx.careerProgress.totalMilestones;
        const completed = ctx.careerProgress.completedMilestones?.length || 0;
        progressPercent = total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;
      }
      
      const stats = [
        {
          title: 'AI Career Match',
          value: `${recs.topCareers[0]?.matchScore || 95}%`,
          trend: '↑ 1.8% match fit',
          trendPositive: true,
          subtext: 'Matching target skills progress',
          color: 'var(--color-primary)',
          sparklinePoints: [70, 75, 80, 85, 90, recs.topCareers[0]?.matchScore || 95],
          hasProgress: true,
          progress: recs.topCareers[0]?.matchScore || 95,
          details: [
            { label: 'Confidence', value: (recs.topCareers[0]?.matchScore || 95) >= 90 ? 'High' : 'Medium' },
            { label: 'Based On', value: 'Profile & Target' },
            { label: 'Updated', value: 'Today' },
            { label: 'Rank', value: (recs.topCareers[0]?.matchScore || 95) >= 90 ? 'Top Fit' : 'Recommended' },
            { label: 'Career Path', value: dreamCareer },
            { label: 'Industry', value: recs.topCareers[0]?.category || ctx.discipline || 'General' },
            { label: 'Recommendation', value: (recs.topCareers[0]?.matchScore || 95) >= 90 ? 'Highly Recommended' : 'Recommended' },
            { label: 'Experience', value: ctx.educationLevel || 'Not Specified' }
          ]
        },
        {
          title: 'Current Progress',
          value: `${progressPercent}%`,
          trend: ctx.careerProgress ? '↑ active track' : 'No active tracks',
          trendPositive: !!ctx.careerProgress,
          subtext: 'Of total curriculum completed',
          color: 'var(--color-secondary)',
          sparklinePoints: [0, Math.round(progressPercent / 2), progressPercent],
          hasProgress: true,
          progress: progressPercent,
          details: [
            { label: 'Modules', value: ctx.careerProgress ? `${ctx.careerProgress.completedMilestones?.length || 0} / ${ctx.careerProgress.totalMilestones || 0}` : '0 / 0' },
            { label: 'Learning Hours', value: ctx.learningProgress?.totalStudyMinutes ? `${Math.round(ctx.learningProgress.totalStudyMinutes / 60)} hrs` : '0 hrs' },
            { label: 'Activity', value: ctx.learningProgress?.lastStudyDate ? 'Active' : 'No recent activity' },
            { label: 'Weekly Goal', value: ctx.learningProgress?.streakDays ? `${ctx.learningProgress.streakDays} day streak` : '0 / 5' },
            { label: 'Completed', value: `${progressPercent}%` },
            { label: 'Remaining', value: `${100 - progressPercent}%` },
            { label: 'Next Module', value: recs.skillGap.missingSkills[0] || 'Foundations' },
            { label: 'Daily Target', value: ctx.learningPreferences?.weeklyStudyTime ? `${Math.round(ctx.learningPreferences.weeklyStudyTime / 7 * 60)} mins/day` : 'Not Specified' }
          ]
        },
        {
          title: 'Verified Skills',
          value: verifiedText,
          trend: verifiedCount > 0 ? `+${verifiedCount} verified` : '0 verified',
          trendPositive: verifiedCount > 0,
          subtext: 'Assessed milestone competencies',
          color: 'var(--color-accent)',
          sparklinePoints: [0, Math.round(verifiedCount / 3), Math.round(verifiedCount / 2), verifiedCount],
          hasProgress: verifiedCount > 0,
          progress: verifiedProgressPercent,
          details: [
            { label: 'Latest Verified', value: (verifiedSkills[verifiedSkills.length - 1] as any)?.name || 'None' },
            { label: 'Level', value: ctx.educationLevel || 'Not Specified' },
            { label: 'Verified', value: `${verifiedCount} Skills` },
            { label: 'Self-Reported', value: `${skillsCount} Skills` },
            { label: 'Practice Hours', value: ctx.learningProgress?.totalStudyMinutes ? `${Math.round(ctx.learningProgress.totalStudyMinutes / 60)} hrs` : '0 hrs' },
            { label: 'Projects', value: `${ctx.learningProgress?.completedResources?.length || 0}` },
            { label: 'Next Skill', value: recs.skillGap.missingSkills[0] || 'Explore' },
            { label: 'Skill Score', value: `${recs.topCareers[0]?.matchScore || 95}%` }
          ]
        },
        {
          title: 'Certificates',
          value: `${ctx.skills.certifications?.length || 0} Earned`,
          trend: '0 Pending review',
          trendPositive: false,
          subtext: 'Credentials verified on-chain',
          color: '#10b981',
          sparklinePoints: [0, 0, ctx.skills.certifications?.length || 0],
          hasProgress: (ctx.skills.certifications?.length || 0) > 0,
          progress: (ctx.skills.certifications?.length || 0) > 0 ? Math.min((ctx.skills.certifications?.length || 0) * 20, 100) : 0,
          details: [
            { label: 'Verified', value: `${ctx.skills.certifications?.length || 0}` },
            { label: 'Pending', value: '0' },
            { label: 'Latest', value: ctx.skills.certifications?.[0] || 'None' },
            { label: 'Issued', value: 'Not Specified' },
            { label: 'Total Earned', value: `${ctx.skills.certifications?.length || 0}` },
            { label: 'In Review', value: '0' },
            { label: 'Provider', value: 'Not Specified' },
            { label: 'Next Goal', value: recs.skillGap.missingSkills[0] || 'None' }
          ]
        }
      ];

      // Dynamic AI Assistant message
      const firstName = ctx.name?.split(' ')[0] || 'Student';
      const assistant = {
        messages: [
          {
            sender: 'ai' as const,
            text: `Welcome to Visionix, ${firstName}! Based on your interest in ${dreamCareer}, I've initialized your personalized Career Roadmap. Let's start with foundational courses next.`,
            timestamp: new Date()
          }
        ],
        isOnline: true
      };

      const careerRecommendation = {
        title: dreamCareer,
        description: objectives,
        matchPercentage: recs.topCareers[0]?.matchScore || 95,
        salaryRange: salaryGoal,
        difficulty: 'Beginner',
        estimatedTime: '6 Months',
        expectedGrowth: '+28% Growth',
        learningProgress: progressPercent,
        topSkills: techSkills.slice(0, 3)
      };

      // Dynamic Career Roadmap using real user selections
      const roadmap = [
        {
          title: `Phase 1: Foundations of ${dreamCareer}`,
          duration: 'Month 1 - 2',
          description: `Establish critical baseline competencies, environments, and core toolchains for ${dreamCareer}.`,
          skills: techSkills.slice(0, 2).concat(['Foundations']),
          completed: progressPercent >= 33,
          status: progressPercent >= 33 ? ('completed' as const) : ('active' as const)
        },
        {
          title: `Phase 2: Core ${specialization || 'Domain'} Stack`,
          duration: 'Month 3 - 4',
          description: `Develop comprehensive project architectures and primary framework environments for ${dreamCareer}.`,
          skills: techSkills.slice(2, 5).concat(['Systems Stack']),
          completed: progressPercent >= 66,
          status: progressPercent >= 66 ? ('completed' as const) : (progressPercent >= 33 ? ('active' as const) : ('locked' as const))
        },
        {
          title: `Phase 3: Deployment & Domain Expertise`,
          duration: 'Month 5 - 6',
          description: `Package, deploy, and scale robust production implementations in ${dreamCareer} applications.`,
          skills: techSkills.slice(5).concat(['Deployments', 'Security']),
          completed: progressPercent >= 100,
          status: progressPercent >= 100 ? ('completed' as const) : (progressPercent >= 66 ? ('active' as const) : ('locked' as const))
        }
      ];

      // Trending Careers mapped from recommendation engine
      const trendingCareers = recs.topCareers.map((c) => ({
        title: c.title,
        growth: '+24% Growth',
        matchScore: c.matchScore
      }));

      // Target Skills derived from skill gap analysis (expected vs missing)
      const targetSkills = recs.skillGap.expectedSkills.map((skill) => {
        const isMissing = recs.skillGap.missingSkills.includes(skill);
        return {
          name: skill,
          progress: isMissing ? 40 : 100,
          icon: getSkillIcon(skill),
          color: isMissing ? 'var(--color-secondary)' : 'var(--color-primary)'
        };
      });

      // Secure YouTube video retrieval
      let youtubeVideos: any[] = [];
      try {
        youtubeVideos = await PersonalizationApiService.getPersonalizedVideos();
      } catch (ytErr) {
        console.warn('Failed to load personalized videos from backend, showing empty state:', ytErr);
      }

      // Empty arrays for sections lacking verified database collections (Scholarships, Exams, Continue Learning courses, Learning Resources)
      const learningResources: LearningResourceData[] = [];
      const scholarships: ScholarshipData[] = [];
      const upcomingExams: any[] = [];
      const continueLearning: any[] = [];

      return {
        stats,
        assistant,
        careerRecommendation,
        roadmap,
        learningResources,
        scholarships,
        trendingCareers,
        continueLearning,
        targetSkills,
        youtubeVideos,
        upcomingExams
      };
    } catch (err) {
      console.error('Error fetching dynamic personalization for dashboard:', err);
      // Catch blocks return empty arrays for sections without DB definitions
      return {
        stats: [],
        assistant: { messages: [], isOnline: false },
        careerRecommendation: {
          title: 'Career Explorer',
          description: 'Log in and complete onboarding to start your personalized journey.',
          matchPercentage: 0,
          salaryRange: '',
          difficulty: '',
          estimatedTime: '',
          expectedGrowth: '',
          learningProgress: 0,
          topSkills: []
        },
        roadmap: [],
        learningResources: [],
        scholarships: [],
        trendingCareers: [],
        continueLearning: [],
        targetSkills: [],
        youtubeVideos: [],
        upcomingExams: []
      };
    }
  }

  /**
   * Clear in-memory dashboard cache.
   */
  public static clearCache(): void {
    DashboardService.dashboardCache.clear();
    DashboardService.dashboardPromises.clear();
  }
}

