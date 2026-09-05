import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Target,
  Compass,
  FileText,
  BookOpen,
  Award,
  HelpCircle,
  ArrowRight,
  Info,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { CareerReadinessService } from '../services/careerReadiness.service';
import type {
  ICareerReadinessData,
  ICareerReadinessContributor,
  ReadinessStage,
} from '../types/careerReadiness.types';
import styles from './CareerReadinessPage.module.css';

export const CareerReadinessPage: React.FC = () => {
  const [data, setData] = useState<ICareerReadinessData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReadiness = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      if (isRefresh) {
        CareerReadinessService.clearCache();
      }

      const res = await CareerReadinessService.getCareerReadiness();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load career readiness data:', err);
      setError(
        err.response?.data?.message || err.message || 'Failed to load career readiness data.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  const getStageClass = (stage: ReadinessStage) => {
    switch (stage) {
      case 'Getting Started':
        return styles.stageGettingStarted;
      case 'Building Foundation':
        return styles.stageBuildingFoundation;
      case 'Progressing Well':
        return styles.stageProgressingWell;
      case 'Advanced Preparation':
        return styles.stageAdvancedPreparation;
      default:
        return styles.stageGettingStarted;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Progress':
        return styles.statusInProgress;
      case 'Completed':
        return styles.statusCompleted;
      case 'Ready':
        return styles.statusReady;
      case 'Active Practice':
        return styles.statusActivePractice;
      default:
        return styles.statusNotStarted;
    }
  };

  const getContributorIcon = (id: string) => {
    switch (id) {
      case 'skills':
        return <Target size={16} />;
      case 'roadmap':
        return <TrendingUp size={16} />;
      case 'learning':
        return <BookOpen size={16} />;
      case 'assessments':
        return <Award size={16} />;
      case 'resume':
        return <FileText size={16} />;
      case 'interview':
        return <HelpCircle size={16} />;
      default:
        return <ShieldCheck size={16} />;
    }
  };

  const getPriorityClass = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return styles.priorityHigh;
      case 'Medium':
        return styles.priorityMedium;
      case 'Low':
        return styles.priorityLow;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
            Evaluating career preparation progress across skills, coursework, roadmap, and portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorBanner}>
            <AlertTriangle size={24} style={{ marginBottom: 8 }} />
            <p style={{ margin: 0, fontWeight: 600 }}>{error || 'Could not load Career Readiness.'}</p>
            <button className={styles.retryBtn} onClick={() => fetchReadiness(true)}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    targetCareer,
    overallScore,
    readinessStage,
    stageDescription,
    contributors,
    strongAreas,
    areasNeedingAttention,
    whyThisResult,
    nextAction,
    disclaimer,
  } = data;

  // Gauge calculations (Radius = 52, Circumference = 326.72)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className={styles.container}>
      {/* 1. Header & Career Context */}
      <header className={styles.header}>
        <div className={styles.headerTitleArea}>
          <h1>Career Readiness</h1>
          <p className={styles.subtitle}>
            See how your current skills, learning, roadmap, assessments, resume, and interview
            preparation contribute to your career preparation progress.
          </p>
        </div>

        <div className={styles.headerActions}>
          {targetCareer ? (
            <div className={styles.targetCareerBadge}>
              <Target size={15} />
              <span>Target: {targetCareer.title}</span>
            </div>
          ) : (
            <Link to="/explore" className={styles.noCareerBadge}>
              <Compass size={15} />
              <span>Choose Target Career</span>
            </Link>
          )}

          <button
            className={styles.refreshButton}
            onClick={() => fetchReadiness(true)}
            disabled={refreshing}
            aria-label="Refresh career readiness"
          >
            <RotateCw size={14} className={refreshing ? styles.spinning : ''} />
            <span>{refreshing ? 'Evaluating...' : 'Refresh'}</span>
          </button>
        </div>
      </header>

      {/* 2. Hero Section: Overall Readiness + Contextual Next Action */}
      <div className={styles.heroSection}>
        {/* Overall Readiness Card */}
        <div className={styles.overallCard}>
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          <div className={styles.gaugeWrapper}>
            <svg className={styles.gaugeSvg} viewBox="0 0 130 130">
              <circle className={styles.gaugeBg} cx="65" cy="65" r={radius} />
              <circle
                className={styles.gaugeProgress}
                cx="65"
                cy="65"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className={styles.gaugeCenter}>
              <span className={styles.gaugePercent}>{overallScore}%</span>
              <span className={styles.gaugeLabel}>Readiness</span>
            </div>
          </div>

          <div className={styles.overallInfo}>
            <div className={styles.overallHeaderRow}>
              <h2 className={styles.overallCardTitle}>Preparation Level</h2>
              <span className={`${styles.stageBadge} ${getStageClass(readinessStage)}`}>
                {readinessStage}
              </span>
            </div>
            <p className={styles.overallDesc}>{stageDescription}</p>
            <div className={styles.nonGuaranteeNotice}>
              Progress indicator • Not an employment guarantee
            </div>
          </div>
        </div>

        {/* Priority "What Should I Work On Next?" Card */}
        <div className={styles.nextActionCard}>
          <div className={styles.nextActionHeader}>
            <span className={styles.nextActionTag}>
              <Sparkles size={14} />
              Recommended Next Action
            </span>
          </div>
          <div className={styles.nextActionBody}>
            <h3 className={styles.nextActionTitle}>{nextAction.title}</h3>
            <p className={styles.nextActionDesc}>{nextAction.description}</p>
          </div>
          <Link to={nextAction.actionRoute} className={styles.nextActionBtn}>
            <span>{nextAction.actionLabel}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* 3. Readiness Contributors (6 Core Areas) */}
      <section>
        <div className={styles.sectionTitleRow}>
          <h2 className={styles.sectionTitle}>
            <ShieldCheck size={18} color="#a78bfa" />
            Readiness Contributors
          </h2>
          <span className={styles.sectionSubtitle}>
            Weighted breakdown across 6 career dimensions
          </span>
        </div>

        <div className={styles.contributorsGrid}>
          {contributors.map((contributor: ICareerReadinessContributor) => (
            <div key={contributor.id} className={styles.contributorCard}>
              <div className={styles.contributorTop}>
                <div className={styles.contributorNameRow}>
                  <div className={styles.contributorIcon}>
                    {getContributorIcon(contributor.id)}
                  </div>
                  <h3 className={styles.contributorName}>{contributor.name}</h3>
                </div>
                <span className={styles.weightBadge}>{contributor.weight}% Weight</span>
              </div>

              <div className={styles.scoreRow}>
                <span className={styles.contributorScore}>{contributor.score}%</span>
                <span className={`${styles.statusPill} ${getStatusClass(contributor.status)}`}>
                  {contributor.status}
                </span>
              </div>

              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${contributor.score}%` }}
                />
              </div>

              <p className={styles.contributorSummary}>{contributor.summary}</p>

              <Link to={contributor.route} className={styles.contributorLink}>
                <span>Manage {contributor.name.split(' ')[0]}</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Two Column Section: What Needs Attention? & Strong Areas */}
      <div className={styles.twoColumnSection}>
        {/* Left Column: What Needs Attention? */}
        <div className={styles.attentionCard}>
          <div className={styles.sectionTitleRow}>
            <h2 className={styles.sectionTitle}>
              <AlertTriangle size={17} color="#f59e0b" />
              What Needs Attention?
            </h2>
            <span className={styles.sectionSubtitle}>Prioritized readiness gaps</span>
          </div>

          {areasNeedingAttention.length === 0 ? (
            <div className={styles.emptyGaps}>
              <CheckCircle2 size={24} style={{ marginBottom: 6 }} />
              <p style={{ margin: 0 }}>All core readiness areas have substantial progress!</p>
            </div>
          ) : (
            <div className={styles.gapList}>
              {areasNeedingAttention.map((gap) => (
                <div key={gap.id} className={styles.gapItem}>
                  <div className={styles.gapItemInfo}>
                    <div className={styles.gapHeader}>
                      <h4 className={styles.gapTitle}>{gap.title}</h4>
                      <span className={`${styles.priorityBadge} ${getPriorityClass(gap.priority)}`}>
                        {gap.priority}
                      </span>
                    </div>
                    <p className={styles.gapDesc}>{gap.description}</p>
                  </div>
                  <Link to={gap.actionRoute} className={styles.gapActionBtn}>
                    <span>{gap.actionLabel}</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Strong Areas & Why This Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Strong Areas */}
          <div className={styles.strongCard}>
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>
                <CheckCircle2 size={17} color="#34d399" />
                Strong Areas
              </h2>
              <span className={styles.sectionSubtitle}>Verified achievements</span>
            </div>

            {strongAreas.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: 0 }}>
                Complete coursework, roadmap milestones, or verify skills to highlight strong areas.
              </p>
            ) : (
              <div className={styles.strengthList}>
                {strongAreas.map((strength) => (
                  <div key={strength.id} className={styles.strengthItem}>
                    <CheckCircle2 size={15} className={styles.strengthIcon} />
                    <div>
                      <h4 className={styles.strengthTitle}>{strength.title}</h4>
                      <p className={styles.strengthDesc}>{strength.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Why This Result? */}
          <div className={styles.whyCard}>
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>
                <Info size={17} color="#a78bfa" />
                Why This Result?
              </h2>
            </div>
            <p className={styles.whyText}>{whyThisResult}</p>
            <div className={styles.weightsList}>
              <div className={styles.weightItem}>
                <span className={styles.weightLabel}>Skills</span>
                <span className={styles.weightValue}>25%</span>
              </div>
              <div className={styles.weightItem}>
                <span className={styles.weightLabel}>Roadmap</span>
                <span className={styles.weightValue}>25%</span>
              </div>
              <div className={styles.weightItem}>
                <span className={styles.weightLabel}>Courses</span>
                <span className={styles.weightValue}>15%</span>
              </div>
              <div className={styles.weightItem}>
                <span className={styles.weightLabel}>Assessments</span>
                <span className={styles.weightValue}>15%</span>
              </div>
              <div className={styles.weightItem}>
                <span className={styles.weightLabel}>Resume</span>
                <span className={styles.weightValue}>10%</span>
              </div>
              <div className={styles.weightItem}>
                <span className={styles.weightLabel}>Interview</span>
                <span className={styles.weightValue}>10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Safety & Product Language Disclaimer */}
      <footer className={styles.safetyCard}>
        <Info size={18} className={styles.safetyIcon} />
        <p className={styles.safetyText}>
          {disclaimer ||
            'Career Readiness is a preparation indicator tracking your personal learning progress across skills, coursework, roadmap milestones, assessments, resume, and interview prep. It does not predict or guarantee employment, job offers, or hiring outcomes.'}
        </p>
      </footer>
    </div>
  );
};

export default CareerReadinessPage;
