import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { ProgressService } from '../services/progress.service';
import type { IUnifiedProgressData, PillarStatus } from '../types/progress.types';
import {
  Target,
  Compass,
  CheckCircle,
  BookOpen,
  Award,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Clock,
  Layers,
  Check,
} from 'lucide-react';
import styles from './MyProgressPage.module.css';

export const MyProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<IUnifiedProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completedFilter, setCompletedFilter] = useState<string>('all');

  const fetchProgress = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
        ProgressService.clearCache();
      } else {
        setLoading(true);
      }
      setError(null);

      const progressData = await ProgressService.getUnifiedProgress();
      setData(progressData);
    } catch (err: any) {
      console.error('Failed to load unified progress:', err);
      setError(err?.response?.data?.message || err?.message || 'Unable to load your progress data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const getStatusClass = (status: PillarStatus) => {
    switch (status) {
      case 'Completed':
        return styles.statusCompleted;
      case 'Ready':
        return styles.statusReady;
      case 'Active Practice':
        return styles.statusActivePractice;
      case 'In Progress':
        return styles.statusInProgress;
      case 'Not Started':
      default:
        return styles.statusNotStarted;
    }
  };

  // Radial calculation for the overall score
  const overallScore = data?.overview?.overallProgressScore || 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  // Filter completed items
  const filteredCompletedItems = data?.completed?.items.filter((item) => {
    if (completedFilter === 'all') return true;
    return item.pillar === completedFilter;
  }) || [];

  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div className="glow-accent" style={{ top: '10%', left: '15%', opacity: 0.1 }} />
      <div className="glow-accent-secondary" style={{ bottom: '15%', right: '15%', opacity: 0.1 }} />

      <div className={styles.container}>
        {/* Top Header */}
        <header className={styles.header}>
          <div className={styles.headerTitleArea}>
            <h1 className="text-heading">My Progress</h1>
            <p className={styles.subtitle}>
              Track your authentic journey across your career roadmap, verified skills, learning courses, assessments, resume, and interview preparation.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {data?.targetCareer ? (
              <div className={styles.targetCareerBadge} title={`Target Career: ${data.targetCareer.title}`}>
                <Compass size={16} />
                <span>Target: {data.targetCareer.title}</span>
              </div>
            ) : (
              <button
                className={styles.noCareerBadge}
                onClick={() => navigate('/explore')}
                title="Select a career to generate your personalized journey"
              >
                <Compass size={16} />
                <span>No Target Career · Explore Careers</span>
              </button>
            )}

            <button
              onClick={() => fetchProgress(true)}
              disabled={refreshing || loading}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 10px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
              }}
              title="Refresh progress data"
            >
              <RefreshCw size={14} className={refreshing ? 'spinning' : ''} />
              <span style={{ display: 'none' }}>Refresh</span>
            </button>
          </div>
        </header>

        {/* Loading State */}
        {loading && !data && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Aggregating your progress from all active systems...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !data && (
          <div className={styles.errorCard}>
            <div className={styles.errorLeft}>
              <AlertCircle size={32} style={{ color: '#ef4444' }} />
              <div className={styles.errorText}>
                <h3 className={styles.errorTitle}>Failed to Load Progress</h3>
                <p className={styles.errorDesc}>{error}</p>
              </div>
            </div>
            <button className={styles.retryButton} onClick={() => fetchProgress()}>
              Retry
            </button>
          </div>
        )}

        {/* Main Content when data is ready */}
        {data && (
          <>
            {/* 1. CURRENT POSITION HERO BANNER */}
            <section className={styles.positionBanner} aria-label="Current Position">
              <div className={styles.bannerLeft}>
                <div className={styles.bannerTagline}>
                  <Target size={15} />
                  <span>Where Am I Right Now?</span>
                </div>

                <h2 className={styles.bannerMainHeading}>
                  {data.targetCareer
                    ? `${data.targetCareer.title}`
                    : 'Exploring Career Opportunities'}
                </h2>

                <div className={styles.bannerHighlights}>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightLabel}>Active Stage</span>
                    <span className={styles.highlightValue}>
                      {data.roadmap.currentMilestone
                        ? data.roadmap.currentMilestone.title
                        : (data.roadmap.hasRoadmap ? 'Completed' : 'Not Started')}
                    </span>
                  </div>

                  <div className={styles.highlightItem}>
                    <span className={styles.highlightLabel}>Roadmap Done</span>
                    <span className={styles.highlightValue} style={{ color: '#a78bfa' }}>
                      {data.roadmap.progress}%
                    </span>
                  </div>

                  <div className={styles.highlightItem}>
                    <span className={styles.highlightLabel}>Skills Verified</span>
                    <span className={styles.highlightValue} style={{ color: '#10b981' }}>
                      {data.skills.verifiedSkills.length} verified
                    </span>
                  </div>

                  <div className={styles.highlightItem}>
                    <span className={styles.highlightLabel}>Courses Done</span>
                    <span className={styles.highlightValue} style={{ color: '#06b6d4' }}>
                      {data.learning.completedCount} completed
                    </span>
                  </div>

                  <div className={styles.highlightItem}>
                    <span className={styles.highlightLabel}>Active Pillars</span>
                    <span className={styles.highlightValue} style={{ color: '#f59e0b' }}>
                      {data.overview.activePillarsCount} of 6
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.bannerRight}>
                <div className={styles.scoreVisualWrapper}>
                  <svg className={styles.circleSvg} viewBox="0 0 90 90">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <circle className={styles.circleBg} cx="45" cy="45" r={radius} />
                    <circle
                      className={styles.circleValue}
                      cx="45"
                      cy="45"
                      r={radius}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className={styles.scoreContent}>
                    <span className={styles.scoreNumber}>{overallScore}%</span>
                    <span className={styles.scoreLabel}>Pillar Index</span>
                  </div>
                </div>

                <p className={styles.scoreExplanation} title={data.overview.calculationExplanation}>
                  Deterministic progress across all 6 core career dimensions.
                </p>
              </div>
            </section>

            {/* 2. WHAT SHOULD I DO NEXT? */}
            {data.nextAction && (
              <section className={styles.nextActionCard} aria-label="Next Recommended Action">
                <div className={styles.nextActionLeft}>
                  <div className={styles.nextActionIconWrapper}>
                    <Sparkles size={22} />
                  </div>
                  <div className={styles.nextActionContent}>
                    <span className={styles.nextActionLabel}>What Should I Do Next?</span>
                    <h3 className={styles.nextActionTitle}>{data.nextAction.title}</h3>
                    <p className={styles.nextActionDesc}>{data.nextAction.description}</p>
                  </div>
                </div>

                <button
                  className={styles.nextActionButton}
                  onClick={() => navigate(data.nextAction!.actionRoute)}
                >
                  <span>{data.nextAction.actionText}</span>
                  <ArrowRight size={16} />
                </button>
              </section>
            )}

            {/* 3. SIX CORE PROGRESS PILLARS */}
            <section aria-label="Core Progress Dimensions">
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>
                    <Layers size={18} style={{ color: 'var(--color-primary)' }} />
                    <span>Progress by Career Dimension</span>
                  </h2>
                  <p className={styles.sectionSubtitle}>
                    Real-time status synchronized with each underlying source of truth.
                  </p>
                </div>
              </div>

              <div className={styles.pillarsGrid} style={{ marginTop: '14px' }}>
                {/* 1. CAREER ROADMAP */}
                <div className={styles.pillarCard}>
                  <div className={styles.pillarCardTop}>
                    <div className={styles.pillarHeaderLeft}>
                      <div className={styles.pillarIconWrapper} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
                        <Target size={18} />
                      </div>
                      <h3 className={styles.pillarName}>Career Roadmap</h3>
                    </div>
                    <span className={`${styles.statusBadge} ${getStatusClass(data.roadmap.status)}`}>
                      {data.roadmap.status}
                    </span>
                  </div>

                  <div className={styles.pillarMetric}>
                    {data.roadmap.hasRoadmap ? (
                      <span>
                        <strong>{data.roadmap.progress}% Completed</strong> · {data.roadmap.completedMilestonesCount} of {data.roadmap.totalMilestones} milestones
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>No roadmap generated yet. Select a career to initialize your milestones.</span>
                    )}
                  </div>

                  <div className={styles.pillarContentPreview}>
                    {data.roadmap.currentMilestone ? (
                      <>
                        <div style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase' }}>
                          Current Milestone
                        </div>
                        <div className={styles.previewItemTitle}>{data.roadmap.currentMilestone.title}</div>
                        <div className={styles.previewItemSubtitle}>{data.roadmap.currentMilestone.description}</div>
                      </>
                    ) : data.roadmap.hasRoadmap ? (
                      <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={14} />
                        <span>All roadmap milestones completed!</span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Generate your roadmap to unlock milestones.</span>
                    )}
                  </div>

                  <div className={styles.pillarFooter}>
                    <button className={styles.pillarLink} onClick={() => navigate(data.roadmap.route)}>
                      <span>View Career Roadmap</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* 2. SKILLS COMPETENCY */}
                <div className={styles.pillarCard}>
                  <div className={styles.pillarCardTop}>
                    <div className={styles.pillarHeaderLeft}>
                      <div className={styles.pillarIconWrapper} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                        <BookOpen size={18} />
                      </div>
                      <h3 className={styles.pillarName}>Skills & Competency</h3>
                    </div>
                    <span className={`${styles.statusBadge} ${getStatusClass(data.skills.status)}`}>
                      {data.skills.status}
                    </span>
                  </div>

                  <div className={styles.pillarMetric}>
                    <span>
                      <strong>{data.skills.verifiedSkills.length} Verified</strong> · {data.skills.coveragePercentage}% match coverage ({data.skills.missingCount} gaps)
                    </span>
                  </div>

                  <div className={styles.pillarContentPreview}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Verified Competencies ({data.skills.verifiedSkills.length})
                    </div>
                    {data.skills.verifiedSkills.length > 0 ? (
                      <div className={styles.pillsRow}>
                        {data.skills.verifiedSkills.slice(0, 4).map((s) => (
                          <span key={s} className={styles.skillPill}>{s}</span>
                        ))}
                        {data.skills.verifiedSkills.length > 4 && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                            +{data.skills.verifiedSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Take milestone or skill assessments to verify skills.</span>
                    )}
                  </div>

                  <div className={styles.pillarFooter}>
                    <button className={styles.pillarLink} onClick={() => navigate(data.skills.route)}>
                      <span>Analyze Skill Gap</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* 3. COURSES & LEARNING */}
                <div className={styles.pillarCard}>
                  <div className={styles.pillarCardTop}>
                    <div className={styles.pillarHeaderLeft}>
                      <div className={styles.pillarIconWrapper} style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                        <Clock size={18} />
                      </div>
                      <h3 className={styles.pillarName}>Courses & Learning</h3>
                    </div>
                    <span className={`${styles.statusBadge} ${getStatusClass(data.learning.status)}`}>
                      {data.learning.status}
                    </span>
                  </div>

                  <div className={styles.pillarMetric}>
                    <span>
                      <strong>{data.learning.completedCount} Completed</strong> · {data.learning.inProgressCount} in progress
                      {data.learning.streakDays > 0 && ` · ${data.learning.streakDays}d streak`}
                    </span>
                  </div>

                  <div className={styles.pillarContentPreview}>
                    {data.learning.inProgressResources.length > 0 ? (
                      <>
                        <div style={{ fontSize: '0.7rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>
                          Currently In Progress
                        </div>
                        <div className={styles.previewItemTitle}>{data.learning.inProgressResources[0].title}</div>
                        <div className={styles.previewItemSubtitle}>
                          {data.learning.inProgressResources[0].provider} · {data.learning.inProgressResources[0].type}
                        </div>
                      </>
                    ) : data.learning.completedResources.length > 0 ? (
                      <>
                        <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                          Recently Completed
                        </div>
                        <div className={styles.previewItemTitle}>{data.learning.completedResources[0].title}</div>
                        <div className={styles.previewItemSubtitle}>{data.learning.completedResources[0].provider}</div>
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Explore curated courses in the Learning Hub to start mastering skills.</span>
                    )}
                  </div>

                  <div className={styles.pillarFooter}>
                    <button className={styles.pillarLink} onClick={() => navigate(data.learning.route)}>
                      <span>Open Learning Hub</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* 4. ASSESSMENTS */}
                <div className={styles.pillarCard}>
                  <div className={styles.pillarCardTop}>
                    <div className={styles.pillarHeaderLeft}>
                      <div className={styles.pillarIconWrapper} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                        <Award size={18} />
                      </div>
                      <h3 className={styles.pillarName}>Skill Assessments</h3>
                    </div>
                    <span className={`${styles.statusBadge} ${getStatusClass(data.assessments.status)}`}>
                      {data.assessments.status}
                    </span>
                  </div>

                  <div className={styles.pillarMetric}>
                    {data.assessments.totalCompleted > 0 ? (
                      <span>
                        <strong>{data.assessments.passedCount} Passed</strong> · {data.assessments.totalCompleted} attempted ({data.assessments.averageScore}% avg score)
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>No assessments attempted yet. Validate milestone competence.</span>
                    )}
                  </div>

                  <div className={styles.pillarContentPreview}>
                    {data.assessments.recentAssessments.length > 0 ? (
                      <>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                          Latest Assessment Result
                        </div>
                        <div className={styles.previewItemTitle}>{data.assessments.recentAssessments[0].title}</div>
                        <div className={styles.previewItemSubtitle}>
                          Score: {data.assessments.recentAssessments[0].score}% ·{' '}
                          <span style={{ color: data.assessments.recentAssessments[0].passed ? '#10b981' : '#f59e0b' }}>
                            {data.assessments.recentAssessments[0].passed ? 'Passed' : 'Needs Review'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Pass quizzes on milestones or skills to earn verified badges.</span>
                    )}
                  </div>

                  <div className={styles.pillarFooter}>
                    <button className={styles.pillarLink} onClick={() => navigate(data.assessments.route)}>
                      <span>Go to Assessments</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* 5. RESUME */}
                <div className={styles.pillarCard}>
                  <div className={styles.pillarCardTop}>
                    <div className={styles.pillarHeaderLeft}>
                      <div className={styles.pillarIconWrapper} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                        <FileText size={18} />
                      </div>
                      <h3 className={styles.pillarName}>Resume Portfolio</h3>
                    </div>
                    <span className={`${styles.statusBadge} ${getStatusClass(data.resume.status)}`}>
                      {data.resume.status}
                    </span>
                  </div>

                  <div className={styles.pillarMetric}>
                    {data.resume.hasResume ? (
                      <span>
                        <strong>{data.resume.resumeCount} Resume{data.resume.resumeCount > 1 ? 's' : ''}</strong> · {data.resume.status === 'Ready' ? 'Tailored and ready for applications' : 'Draft in progress'}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>No resume created yet. Build an ATS-friendly resume.</span>
                    )}
                  </div>

                  <div className={styles.pillarContentPreview}>
                    {data.resume.latestResume ? (
                      <>
                        <div style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>
                          Active Resume
                        </div>
                        <div className={styles.previewItemTitle}>{data.resume.latestResume.title}</div>
                        <div className={styles.previewItemSubtitle}>Role: {data.resume.latestResume.targetRole}</div>
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Auto-populate with your verified skills and academic record.</span>
                    )}
                  </div>

                  <div className={styles.pillarFooter}>
                    <button className={styles.pillarLink} onClick={() => navigate(data.resume.route)}>
                      <span>Open Resume Builder</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* 6. INTERVIEW PREPARATION */}
                <div className={styles.pillarCard}>
                  <div className={styles.pillarCardTop}>
                    <div className={styles.pillarHeaderLeft}>
                      <div className={styles.pillarIconWrapper} style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
                        <MessageSquare size={18} />
                      </div>
                      <h3 className={styles.pillarName}>Interview Preparation</h3>
                    </div>
                    <span className={`${styles.statusBadge} ${getStatusClass(data.interview.status)}`}>
                      {data.interview.status}
                    </span>
                  </div>

                  <div className={styles.pillarMetric}>
                    {data.interview.totalCompleted > 0 ? (
                      <span>
                        <strong>{data.interview.totalCompleted} Session{data.interview.totalCompleted > 1 ? 's' : ''} Practiced</strong> · {data.interview.averageScore}% avg score ({data.interview.questionsAnswered} questions)
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Practice AI mock interviews for technical and behavioral questions.</span>
                    )}
                  </div>

                  <div className={styles.pillarContentPreview}>
                    {data.interview.recentSessions.length > 0 ? (
                      <>
                        <div style={{ fontSize: '0.7rem', color: '#f472b6', fontWeight: 700, textTransform: 'uppercase' }}>
                          Recent Mock Session
                        </div>
                        <div className={styles.previewItemTitle}>{data.interview.recentSessions[0].targetRole}</div>
                        <div className={styles.previewItemSubtitle}>
                          Type: {data.interview.recentSessions[0].interviewType} · Score: {data.interview.recentSessions[0].score || 'Done'}%
                        </div>
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Generate mock interview questions tailored to your target career.</span>
                    )}
                  </div>

                  <div className={styles.pillarFooter}>
                    <button className={styles.pillarLink} onClick={() => navigate(data.interview.route)}>
                      <span>Start Interview Prep</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. WHAT HAVE I COMPLETED? */}
            <section className={styles.completedSection} aria-label="Completed Checkpoints">
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>
                    <CheckCircle size={18} style={{ color: '#10b981' }} />
                    <span>What Have I Completed?</span>
                  </h2>
                  <p className={styles.sectionSubtitle}>
                    Official record of milestones, verified skills, courses, assessments, and mock sessions achieved.
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className={styles.filterRow}>
                {[
                  { id: 'all', label: `All (${data.completed.totalCompletedCount})` },
                  { id: 'roadmap', label: 'Milestones' },
                  { id: 'skills', label: 'Verified Skills' },
                  { id: 'courses', label: 'Courses' },
                  { id: 'assessments', label: 'Assessments' },
                  { id: 'resume', label: 'Resume' },
                  { id: 'interview', label: 'Interviews' },
                ].map((f) => (
                  <button
                    key={f.id}
                    className={`${styles.filterBtn} ${completedFilter === f.id ? styles.filterBtnActive : ''}`}
                    onClick={() => setCompletedFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Completed List or Empty State */}
              {filteredCompletedItems.length > 0 ? (
                <div className={styles.completedGrid}>
                  {filteredCompletedItems.map((item) => (
                    <div key={item.id} className={styles.completedItemCard}>
                      <Check className={styles.completedItemIcon} size={18} />
                      <div className={styles.completedItemInfo}>
                        <div className={styles.completedItemTitle}>{item.title}</div>
                        <div className={styles.completedItemSubtitle}>{item.subtitle}</div>
                        {item.badge && <span className={styles.completedItemBadge}>{item.badge}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <CheckCircle size={40} style={{ color: 'var(--text-muted)' }} />
                  <h3 className={styles.emptyTitle}>
                    {completedFilter === 'all'
                      ? 'No Completed Checkpoints Yet'
                      : `No ${completedFilter} completions yet`}
                  </h3>
                  <p className={styles.emptyText}>
                    {completedFilter === 'all'
                      ? 'Complete roadmap milestones, finish learning courses, or verify skills via assessments to build your official track record.'
                      : 'Take action in this area to complete checkpoints and record your achievements.'}
                  </p>
                  {data.nextAction && (
                    <button
                      className={styles.emptyButton}
                      onClick={() => navigate(data.nextAction!.actionRoute)}
                    >
                      <span>Take Action: {data.nextAction.title}</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyProgressPage;
