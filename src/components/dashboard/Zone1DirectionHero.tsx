import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Play, 
  Compass, 
  Award, 
  Target,
  ArrowRight,
  Layers
} from 'lucide-react';

interface Zone1DirectionHeroProps {
  fullName: string;
  education?: any;
  careerRecommendation?: {
    title: string;
    description: string;
    matchPercentage: number;
    salaryRange: string;
    difficulty: string;
    estimatedTime: string;
    expectedGrowth: string;
    learningProgress: number;
    topSkills?: string[];
  };
  activeMilestone?: {
    title: string;
    phase?: string;
    progress?: number;
    duration?: string;
  };
}

export const formatEducationBadge = (education?: any): string => {
  if (!education || !education.level) return '🎓 Student Profile';
  const lvl = (education.level || '').toLowerCase().trim();
  
  if (lvl === 'school' || lvl.startsWith('school')) {
    return `🎓 School • ${education.currentClass || 'Classes 6–10'}`;
  }
  if (lvl === 'intermediate' || lvl.startsWith('intermediate')) {
    const stream = education.stream ? ` • ${education.stream}` : '';
    const year = education.studyYear ? ` (${education.studyYear})` : '';
    return `🎓 Intermediate${stream}${year}`;
  }
  if (lvl === 'diploma' || lvl.startsWith('diploma') || lvl === 'polytechnic') {
    const branch = education.stream ? ` • ${education.stream}` : '';
    const year = education.studyYear ? ` (${education.studyYear})` : '';
    return `🎓 Diploma${branch}${year}`;
  }
  if (lvl === 'undergraduate' || lvl.startsWith('undergraduate') || lvl === 'bachelors_degree') {
    const degree = education.stream ? ` • ${education.stream}` : '';
    const spec = education.branchSpecialization ? ` (${education.branchSpecialization})` : '';
    const year = education.studyYear ? ` • ${education.studyYear}` : '';
    return `🎓 Undergraduate${degree}${spec}${year}`;
  }
  if (lvl === 'postgraduate' || lvl.startsWith('postgraduate') || lvl === 'masters_degree' || lvl === 'mba') {
    const degree = education.stream ? ` • ${education.stream}` : '';
    return `🎓 Postgraduate${degree}`;
  }
  if (lvl === 'doctorate_phd') {
    return `🎓 Doctorate (PhD) • Research`;
  }
  return `🎓 ${education.level}`;
};

export const Zone1DirectionHero: React.FC<Zone1DirectionHeroProps> = ({
  fullName,
  education,
  careerRecommendation,
  activeMilestone
}) => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = fullName?.split(' ')[0] || 'Rahul';
  const targetCareer = careerRecommendation?.title || 'Software & AI Engineer';
  const matchScore = careerRecommendation?.matchPercentage || 94;
  const progress = careerRecommendation?.learningProgress || 25;
  const milestoneTitle = activeMilestone?.title || 'Phase 1: Core Foundations & Coding Basics';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%'
      }}
    >
      {/* ─── Top Greeting & Stage Header ───────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            margin: 0
          }}>
            {getGreeting()}, {firstName} 👋
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginTop: '4px',
            marginBottom: 0
          }}>
            Here is your daily career direction and next immediate action.
          </p>
        </div>

        {/* Education Stage & Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '99px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#60a5fa'
          }}>
            <span>{formatEducationBadge(education)}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: 'rgba(168, 85, 247, 0.08)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '99px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#c084fc'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#a855f7',
              boxShadow: '0 0 8px #a855f7'
            }} />
            <span>Target Direction Synced</span>
          </div>
        </div>
      </div>

      {/* ─── Master Zone 1 Action & Direction Card ─────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '16px',
        width: '100%',
        alignItems: 'stretch'
      }}>
        {/* Left Card: Target Career Direction */}
        <div className="premiumCard" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '18px 20px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.03) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.18)',
          borderRadius: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#c084fc'
              }}>
                Target Career Direction
              </span>
              <span style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '99px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}>
                {matchScore}% Match
              </span>
            </div>

            <h2 style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '0 0 6px 0'
            }}>
              {targetCareer}
            </h2>

            <p style={{
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              margin: '0 0 10px 0'
            }}>
              {careerRecommendation?.description || 'Your tailored pathway calibrated based on your current education level, subject strengths, and long-term career aspirations.'}
            </p>

            {/* Career Metrics Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {careerRecommendation?.salaryRange && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  padding: '3px 8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ color: '#10b981' }}>₹</span>
                  <span>{careerRecommendation.salaryRange}</span>
                </div>
              )}
              {careerRecommendation?.expectedGrowth && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  padding: '3px 8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)'
                }}>
                  <TrendingUp size={12} style={{ color: '#3b82f6' }} />
                  <span>{careerRecommendation.expectedGrowth}</span>
                </div>
              )}
              {careerRecommendation?.difficulty && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  padding: '3px 8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)'
                }}>
                  <Award size={12} style={{ color: '#f59e0b' }} />
                  <span>{careerRecommendation.difficulty}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => navigate('/roadmap')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                border: 'none',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Layers size={13} /> View Roadmap
            </button>
            <button
              type="button"
              onClick={() => navigate('/explore')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Compass size={13} /> Explore Careers
            </button>
          </div>
        </div>

        {/* Right Card: Immediate Next Action */}
        <div className="premiumCard" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '18px 20px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.03) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.18)',
          borderRadius: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Target size={13} /> What Should I Do Now?
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Active Milestone
              </span>
            </div>

            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              margin: '0 0 6px 0'
            }}>
              {milestoneTitle}
            </h3>

            <p style={{
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              margin: '0 0 10px 0'
            }}>
              Complete your recommended learning modules and verify key competencies with the milestone skill assessment.
            </p>

            {/* Milestone Progress Bar */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Milestone Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{progress}% Complete</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                  borderRadius: '99px',
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => navigate('/learning')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Play size={13} /> Resume Learning
            </button>
            <button
              type="button"
              onClick={() => navigate('/interview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Mock Interview <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
