import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { DashboardLayout } from '../components/DashboardLayout';
import { Loader2 } from 'lucide-react';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { RoadmapProgress } from '../components/dashboard/RoadmapProgress';
import { AiAssistantCard } from '../components/dashboard/AiAssistantCard';
import { RecommendedCareerCard } from '../components/dashboard/RecommendedCareerCard';
import { ContinueLearning } from '../components/dashboard/ContinueLearning';
import { UpcomingExams } from '../components/dashboard/UpcomingExams';
import { RecommendedSkills } from '../components/dashboard/RecommendedSkills';
import { LearningResources } from '../components/dashboard/LearningResources';
import { Scholarships } from '../components/dashboard/Scholarships';
import { TrendingCareers } from '../components/dashboard/TrendingCareers';
import { DashboardService } from '../services/dashboard.service';
import type { DashboardData } from '../types/dashboard.types';
import layoutStyles from '../components/DashboardLayout.module.css';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, loadProfile } = useProfile();
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Load profile details on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Load dashboard details dynamically through service
  useEffect(() => {
    if (user?.email) {
      setDashboardLoading(true);
      DashboardService.getDashboardData(user.email)
        .then((data) => {
          setDashboardData(data);
        })
        .catch((err) => {
          console.error('Error fetching dashboard data:', err);
        })
        .finally(() => {
          setDashboardLoading(false);
        });
    }
  }, [user]);

  const fullName = user?.fullName || 'Rahul';
  const interests = useMemo(() => profile?.interests?.careerInterests || [], [profile]);

  const isLoading = profileLoading || dashboardLoading;

  if (isLoading && !dashboardData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}>
        <Loader2 className="spin-animation" size={32} style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 10s linear infinite;
        }
      `}</style>

      {/* Ambient background noise overlay */}
      <div className="ambient-noise" />

      {/* Glow background accent blobs */}
      <div className="glow-accent-primary" style={{ width: '450px', height: '450px', top: '10%', left: '15%', opacity: 0.4 }}></div>
      <div className="glow-accent-secondary" style={{ width: '500px', height: '500px', bottom: '15%', right: '10%', opacity: 0.4 }}></div>
      <div className="glow-accent-tertiary" style={{ width: '400px', height: '400px', top: '40%', left: '45%', opacity: 0.3 }}></div>

      {/* Workspace container */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Welcome greeting */}
        <WelcomeSection fullName={fullName} />

        {/* Responsive Dashboard Grid layout with perfect axis alignment */}
        <div className={layoutStyles.dashboardMasterGrid}>
          {/* Row 1: Stats Grid (spans 9) & AI Assistant (spans 3) */}
          <div className={layoutStyles.colSpan9}>
            <MemoizedStatsGrid stats={dashboardData?.stats} />
          </div>
          <div className={layoutStyles.colSpan3}>
            <MemoizedAiAssistantCard assistant={dashboardData?.assistant} />
          </div>

          {/* Row 2: Recommended Career (spans 9) & Career Roadmap (spans 3) */}
          <div className={layoutStyles.colSpan9}>
            <MemoizedRecommendedCareerCard 
              dreamCareer={profile?.careerGoals?.dreamCareer || dashboardData?.careerRecommendation.title} 
              careerDescription={dashboardData?.careerRecommendation.description}
              interests={interests} 
              matchPercentage={dashboardData?.careerRecommendation.matchPercentage}
              salaryRange={dashboardData?.careerRecommendation.salaryRange}
              difficulty={dashboardData?.careerRecommendation.difficulty}
              estimatedTime={dashboardData?.careerRecommendation.estimatedTime}
              expectedGrowth={dashboardData?.careerRecommendation.expectedGrowth}
              learningProgress={dashboardData?.careerRecommendation.learningProgress}
              topSkills={profile?.skills?.technicalSkills}
            />
          </div>
          <div className={layoutStyles.colSpan3}>
            <MemoizedRoadmapProgress milestones={dashboardData?.roadmap} />
          </div>

          {/* Row 3: Continue Learning (4) & Upcoming Exams (4) & Target Skills (4) */}
          <div className={layoutStyles.colSpan4}>
            <MemoizedContinueLearning />
          </div>
          <div className={layoutStyles.colSpan4}>
            <MemoizedUpcomingExams />
          </div>
          <div className={layoutStyles.colSpan4}>
            <MemoizedRecommendedSkills />
          </div>

          {/* Row 4: Learning Resources (4) & Scholarships (4) & Trending Careers (4) */}
          <div className={layoutStyles.colSpan4}>
            <MemoizedLearningResources resources={dashboardData?.learningResources} />
          </div>
          <div className={layoutStyles.colSpan4}>
            <MemoizedScholarships scholarships={dashboardData?.scholarships} />
          </div>
          <div className={layoutStyles.colSpan4}>
            <MemoizedTrendingCareers careers={dashboardData?.trendingCareers} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Performance Optimizations: Memoize expensive sub-widgets to prevent unnecessary renders
const MemoizedStatsGrid = React.memo(StatsGrid);
const MemoizedRoadmapProgress = React.memo(RoadmapProgress);
const MemoizedAiAssistantCard = React.memo(AiAssistantCard);
const MemoizedRecommendedCareerCard = React.memo(RecommendedCareerCard);
const MemoizedContinueLearning = React.memo(ContinueLearning);
const MemoizedUpcomingExams = React.memo(UpcomingExams);
const MemoizedRecommendedSkills = React.memo(RecommendedSkills);
const MemoizedLearningResources = React.memo(LearningResources);
const MemoizedScholarships = React.memo(Scholarships);
const MemoizedTrendingCareers = React.memo(TrendingCareers);
