import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { DashboardLayout } from '../components/DashboardLayout';
import { Loader2, Sparkles, Compass } from 'lucide-react';
import { Zone1DirectionHero } from '../components/dashboard/Zone1DirectionHero';
import { RoadmapProgress } from '../components/dashboard/RoadmapProgress';
import { ContinueLearning } from '../components/dashboard/ContinueLearning';
import { RecommendedSkills } from '../components/dashboard/RecommendedSkills';
import { YouTubeLearning } from '../components/dashboard/YouTubeLearning';
import { QuickToolsHub } from '../components/dashboard/QuickToolsHub';
import { TrendingCareers } from '../components/dashboard/TrendingCareers';
import { DashboardService } from '../services/dashboard.service';
import type { DashboardData } from '../types/dashboard.types';
import layoutStyles from '../components/DashboardLayout.module.css';

const cleanCareerLabel = (val?: string) => {
  if (!val) return 'Software & AI Engineer';
  if (val.includes('_')) {
    return val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return val;
};

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
  }, [user?.email]);

  const fullName = user?.fullName || profile?.personal?.fullName || 'Rahul';
  const targetCareer = cleanCareerLabel(profile?.careerGoals?.dreamCareer || dashboardData?.careerRecommendation?.title);
  const activeMilestone = dashboardData?.roadmap?.find(m => m.status === 'active') || dashboardData?.roadmap?.[0];

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
        .zoneHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          margin-top: 8px;
        }
        .zoneTitle {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }
        .zoneSubtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 2px 0 0 0;
        }
      `}</style>

      {/* Ambient background noise overlay */}
      <div className="ambient-noise" />

      {/* Glow background accent blobs */}
      <div className="glow-accent-primary" style={{ width: '450px', height: '450px', top: '10%', left: '15%', opacity: 0.35 }}></div>
      <div className="glow-accent-secondary" style={{ width: '500px', height: '500px', bottom: '15%', right: '10%', opacity: 0.35 }}></div>
      <div className="glow-accent-tertiary" style={{ width: '400px', height: '400px', top: '40%', left: '45%', opacity: 0.25 }}></div>

      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* ═══════════════════════════════════════════════════════════════════════
            ZONE 1: WHAT SHOULD I DO NOW? (Current Direction & Immediate Action)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section aria-label="Zone 1: Current Direction and Next Action">
          <MemoizedZone1DirectionHero
            fullName={fullName}
            education={profile?.education}
            careerRecommendation={dashboardData?.careerRecommendation ? {
              ...dashboardData.careerRecommendation,
              title: targetCareer,
              description: dashboardData.careerRecommendation.description || `Tailored learning and career roadmap for ${targetCareer}.`,
              matchPercentage: dashboardData.careerRecommendation.matchPercentage || 94,
              salaryRange: dashboardData.careerRecommendation.salaryRange || '₹8L - ₹24L/yr',
              difficulty: dashboardData.careerRecommendation.difficulty || 'Intermediate',
              estimatedTime: dashboardData.careerRecommendation.estimatedTime || '6 Months',
              expectedGrowth: dashboardData.careerRecommendation.expectedGrowth || '+32% Growth',
              learningProgress: dashboardData.careerRecommendation.learningProgress || 25,
            } : undefined}
            activeMilestone={activeMilestone}
          />
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            ZONE 2: HOW AM I PROGRESSING? (Roadmap, Learning & Skills Readiness)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section aria-label="Zone 2: Progress & Readiness">
          <div className="zoneHeader">
            <div>
              <h2 className="zoneTitle">
                <Sparkles size={18} style={{ color: '#c084fc' }} />
                How Am I Progressing?
              </h2>
              <p className="zoneSubtitle">
                Real-time tracking for roadmap milestones, active courses, and target skill mastery.
              </p>
            </div>
          </div>

          <div className={layoutStyles.dashboardLowerGrid}>
            {/* Card 2A: Career Roadmap & Milestones */}
            <MemoizedRoadmapProgress 
              milestones={dashboardData?.roadmap} 
              trackName={`${targetCareer} Roadmap`}
              currentPhaseName={activeMilestone?.title || 'Phase 1: Core Foundations'}
              overallProgressPercent={dashboardData?.careerRecommendation?.learningProgress || 25}
              estimatedCompletion={profile?.careerGoals?.dreamCareer ? '6 Months' : '6 Months'}
              nextGoalName={dashboardData?.careerRecommendation?.topSkills?.[0] || 'Core Foundations'}
              hoursRemaining="18 Hours"
            />

            {/* Card 2B: Active Course Learning Modules */}
            <MemoizedContinueLearning courses={dashboardData?.continueLearning} />

            {/* Card 2C: Target Skills & Verification */}
            <MemoizedRecommendedSkills skills={dashboardData?.targetSkills} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            ZONE 3: RELEVANT RESOURCES & OPPORTUNITIES (Curated Learning & Tools)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section aria-label="Zone 3: Relevant Resources and Opportunities">
          <div className="zoneHeader">
            <div>
              <h2 className="zoneTitle">
                <Compass size={18} style={{ color: '#60a5fa' }} />
                Curated Resources & Career Accelerators
              </h2>
              <p className="zoneSubtitle">
                High-yield video tutorials, career preparation tools, and high-growth industry insights.
              </p>
            </div>
          </div>

          <div className={layoutStyles.dashboardLowerGrid}>
            {/* Card 3A: YouTube Learning Hub */}
            <MemoizedYouTubeLearning videos={dashboardData?.youtubeVideos} />

            {/* Card 3B: Visionix Career Suite & Quick Tools */}
            <MemoizedQuickToolsHub />

            {/* Card 3C: Trending High-Growth Careers */}
            <MemoizedTrendingCareers careers={dashboardData?.trendingCareers} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

// Memoize sub-widgets to prevent unnecessary re-renders
const MemoizedZone1DirectionHero = React.memo(Zone1DirectionHero);
const MemoizedRoadmapProgress = React.memo(RoadmapProgress);
const MemoizedContinueLearning = React.memo(ContinueLearning);
const MemoizedRecommendedSkills = React.memo(RecommendedSkills);
const MemoizedYouTubeLearning = React.memo(YouTubeLearning);
const MemoizedQuickToolsHub = React.memo(QuickToolsHub);
const MemoizedTrendingCareers = React.memo(TrendingCareers);
