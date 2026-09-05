import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Footprints,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Compass,
  GitBranch,
  Route,
  BookOpen,
  FileEdit,
  Mic,
  Target,
  Sparkles,
  Info,
  GraduationCap,
  Layers,
  Award,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { NextStepService } from '../services/nextStep.service';
import type { INextStepData, IWhyThisNextStepFactor } from '../types/nextStep.types';
import styles from './YourNextStepPage.module.css';

export const YourNextStepPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<INextStepData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNextStep = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      if (showRefreshing) {
        NextStepService.clearCache();
      }
      const result = await NextStepService.getNextStep();
      setData(result);
    } catch (err: any) {
      console.error('Failed to load next step data:', err);
      setError(err?.response?.data?.message || err?.message || 'Unable to evaluate your next step. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNextStep();
  }, [fetchNextStep]);

  const handlePrimaryCta = () => {
    if (!data?.primaryAction) return;
    const { destination, navigationState } = data.primaryAction;

    if (navigationState) {
      navigate(destination, { state: navigationState });
    } else {
      navigate(destination);
    }
  };

  const handleSecondaryAction = (destination: string, navigationState?: Record<string, any>) => {
    if (navigationState) {
      navigate(destination, { state: navigationState });
    } else {
      navigate(destination);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass size={18} />;
      case 'GitBranch':
        return <GitBranch size={18} />;
      case 'Route':
        return <Route size={18} />;
      case 'BookOpen':
        return <BookOpen size={18} />;
      case 'FileEdit':
        return <FileEdit size={18} />;
      case 'Mic':
        return <Mic size={18} />;
      case 'Target':
      default:
        return <Target size={18} />;
    }
  };

  const renderFactorStatus = (status: IWhyThisNextStepFactor['status']) => {
    switch (status) {
      case 'ready':
        return (
          <>
            <CheckCircle2 size={16} color="#34d399" className={styles.factorIcon} />
            <span className={`${styles.factorPill} ${styles.pill_ready}`}>Ready</span>
          </>
        );
      case 'in_progress':
        return (
          <>
            <Clock size={16} color="#60a5fa" className={styles.factorIcon} />
            <span className={`${styles.factorPill} ${styles.pill_in_progress}`}>In Progress</span>
          </>
        );
      case 'attention':
        return (
          <>
            <AlertTriangle size={16} color="#fbbf24" className={styles.factorIcon} />
            <span className={`${styles.factorPill} ${styles.pill_attention}`}>Needs Attention</span>
          </>
        );
      case 'not_started':
      default:
        return (
          <>
            <AlertCircle size={16} color="#94a3b8" className={styles.factorIcon} />
            <span className={`${styles.factorPill} ${styles.pill_not_started}`}>Not Started</span>
          </>
        );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <RefreshCw size={36} className={styles.loadingSpinner} />
            <h3>Evaluating Your Next Step...</h3>
            <p className={styles.subtitle}>Analyzing your roadmap checkpoints, skills, and coursework.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <AlertCircle size={40} color="#ef4444" />
            <h3>Could Not Load Your Next Step</h3>
            <p className={styles.subtitle}>{error || 'Something went wrong while retrieving your progress state.'}</p>
            <button className={styles.primaryCta} onClick={() => fetchNextStep()}>
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { isNewStudent, primaryAction, whyThisStep, currentPosition, secondaryActions, safetyDisclaimer } = data;

  return (
    <DashboardLayout>
      <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>
            <Footprints size={28} className={styles.titleIcon} /> Your Next Step
          </h1>
          <p className={styles.subtitle}>
            Your single highest-priority recommended action, calculated from your actual roadmap, skills, and learning progress.
          </p>
        </div>
        <button
          className={styles.refreshButton}
          onClick={() => fetchNextStep(true)}
          disabled={refreshing}
          title="Recalculate your next step"
        >
          <RefreshCw size={14} className={refreshing ? styles.loadingSpinner : ''} />
          {refreshing ? 'Updating...' : 'Refresh'}
        </button>
      </header>

      {/* Hero Section: Primary Next Action */}
      {isNewStudent ? (
        <section className={styles.emptyCard}>
          <div className={styles.emptyIcon}>
            <Compass size={28} />
          </div>
          <h2>Begin by Choosing a Career Goal</h2>
          <p>
            Welcome to Visionix! To unlock your personalized learning journey, milestone roadmap, and skill assessments, start by discovering careers that match your interests.
          </p>
          <button className={styles.primaryCta} onClick={handlePrimaryCta}>
            <Compass size={18} /> {primaryAction.ctaText} <ArrowRight size={16} />
          </button>
        </section>
      ) : (
        <section className={styles.heroCard}>
          <div className={styles.heroMeta}>
            <span className={`${styles.priorityBadge} ${styles[`priority_${primaryAction.priority}`]}`}>
              <Sparkles size={12} /> {primaryAction.badgeText}
            </span>
            {currentPosition.targetCareer && (
              <span className={styles.categoryTag}>
                Goal: {currentPosition.targetCareer.title}
              </span>
            )}
          </div>

          <div className={styles.heroContent}>
            <h2>{primaryAction.title}</h2>
            <p className={styles.heroDescription}>{primaryAction.description}</p>
            <div className={styles.heroReason}>
              <strong>Why now:</strong> {primaryAction.reason}
            </div>
          </div>

          <div className={styles.heroActions}>
            <button className={styles.primaryCta} onClick={handlePrimaryCta}>
              {primaryAction.ctaText} <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* Two Column Layout: Current Position & Why This Step */}
      <div className={styles.middleGrid}>
        {/* Current Position Snapshot */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>
              <GraduationCap size={18} color="#6366f1" /> Current Position
            </h3>
          </div>

          <div className={styles.positionGrid}>
            <div className={styles.positionItem}>
              <span className={styles.positionLabel}>Education</span>
              <span className={styles.positionValue}>{currentPosition.education.level}</span>
              <span className={styles.positionSub}>
                {currentPosition.education.streamOrBranch || currentPosition.education.institution || 'Profile Info'}
              </span>
            </div>

            <div className={styles.positionItem}>
              <span className={styles.positionLabel}>Target Career</span>
              <span className={styles.positionValue}>
                {currentPosition.targetCareer ? currentPosition.targetCareer.title : 'None Selected'}
              </span>
              <span className={styles.positionSub}>
                {currentPosition.targetCareer ? currentPosition.targetCareer.category : 'Needs Career Goal'}
              </span>
            </div>

            <div className={styles.positionItem}>
              <span className={styles.positionLabel}>Roadmap Stage</span>
              <span className={styles.positionValue}>
                {currentPosition.roadmapState.hasRoadmap
                  ? `${currentPosition.roadmapState.progressPercentage}% Completed`
                  : 'No Roadmap'}
              </span>
              <span className={styles.positionSub}>
                {currentPosition.roadmapState.hasRoadmap
                  ? `${currentPosition.roadmapState.completedMilestones} of ${currentPosition.roadmapState.totalMilestones} checkpoints`
                  : 'Create Roadmap to Begin'}
              </span>
            </div>

            <div className={styles.positionItem}>
              <span className={styles.positionLabel}>Active Milestone</span>
              <span className={styles.positionValue} style={{ fontSize: '0.88rem' }}>
                {currentPosition.roadmapState.currentMilestoneTitle || 'None Active'}
              </span>
              <span className={styles.positionSub}>Current Checkpoint</span>
            </div>
          </div>

          <div className={styles.metricsRow}>
            <div className={styles.metricBadge}>
              <Award size={14} color="#818cf8" />
              <span>Skills: <strong>{currentPosition.keyProgress.verifiedSkillsCount} Verified</strong> ({currentPosition.keyProgress.skillCoveragePercentage}% coverage)</span>
            </div>
            <div className={styles.metricBadge}>
              <Layers size={14} color="#34d399" />
              <span>Learning: <strong>{currentPosition.keyProgress.completedCoursesCount} Courses</strong> completed</span>
            </div>
          </div>
        </section>

        {/* Why This Is Your Next Step Factors */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>
              <Info size={18} color="#6366f1" /> Why This Is Your Next Step
            </h3>
          </div>

          <p className={styles.whyHeadline}>{whyThisStep.headline}</p>

          <div className={styles.factorsList}>
            {whyThisStep.factors.map((factor) => (
              <div key={factor.id} className={styles.factorRow}>
                <div className={styles.factorContent}>
                  <div className={styles.factorTitleRow}>
                    <span className={styles.factorTitle}>{factor.title}</span>
                    <div>{renderFactorStatus(factor.status)}</div>
                  </div>
                  <span className={styles.factorDetail}>{factor.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Secondary Actions */}
      {secondaryActions && secondaryActions.length > 0 && (
        <section className={styles.secondarySection}>
          <div className={styles.secondaryHeader}>
            <div>
              <h3>Other Useful Actions</h3>
              <p className={styles.secondarySubtitle}>
                Additional areas to explore alongside your primary next step.
              </p>
            </div>
          </div>

          <div className={styles.secondaryGrid}>
            {secondaryActions.map((action) => (
              <div key={action.id} className={styles.secondaryCard}>
                <div className={styles.secondaryCardTop}>
                  <div className={styles.secondaryIconWrap}>
                    {renderIcon(action.iconName)}
                  </div>
                  <div className={styles.secondaryInfo}>
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                </div>
                <button
                  className={styles.secondaryButton}
                  onClick={() => handleSecondaryAction(action.destination, action.navigationState)}
                >
                  <span>{action.ctaText}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Safety / Expectation Note */}
      <footer className={styles.safetyFooter}>
        <Info size={16} />
        <span>{safetyDisclaimer}</span>
      </footer>
      </div>
    </DashboardLayout>
  );
};

export default YourNextStepPage;
