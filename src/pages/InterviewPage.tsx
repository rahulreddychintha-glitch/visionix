import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { InterviewService } from '../services/interview.service';
import { usePersonalization } from '../hooks/usePersonalization';
import type {
  IInterview,
  IInterviewProgress,
  InterviewType,
  IGenerateInterviewRequest,
} from '../types/interview.types';
import { InterviewHome } from '../components/interview/InterviewHome';
import { InterviewSetup } from '../components/interview/InterviewSetup';
import { InterviewPlayer } from '../components/interview/InterviewPlayer';
import { InterviewResults } from '../components/interview/InterviewResults';
import { InterviewQuestionReview } from '../components/interview/InterviewQuestionReview';
import { InterviewHistory } from '../components/interview/InterviewHistory';
import { InterviewProgressView } from '../components/interview/InterviewProgress';
import {
  Sparkles,
  History,
  TrendingUp,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import styles from './InterviewPage.module.css';

type PageViewMode = 'home' | 'setup' | 'player' | 'evaluating' | 'results' | 'review' | 'history' | 'progress';

export const InterviewPage: React.FC = () => {
  const { personalizationContext } = usePersonalization();

  // Primary data states
  const [interviews, setInterviews] = useState<IInterview[]>([]);
  const [progress, setProgress] = useState<IInterviewProgress | null>(null);
  const [activeInterview, setActiveInterview] = useState<IInterview | null>(null);

  // View mode
  const [viewMode, setViewMode] = useState<PageViewMode>('home');
  const [setupDefaultType, setSetupDefaultType] = useState<InterviewType>('mock');
  const [setupFocusAreas, setSetupFocusAreas] = useState<string[]>([]);

  // Async states
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Extract real user target role and verified skills
  const targetRole = useMemo(() => {
    return (
      (personalizationContext?.careerGoals as any)?.targetRole ||
      personalizationContext?.careerGoals?.dreamCareer ||
      (personalizationContext as any)?.targetRole ||
      'Software Engineer'
    );
  }, [personalizationContext]);

  const verifiedSkillsList = useMemo(() => {
    const rawList = personalizationContext?.skills?.verifiedSkills || [];
    return rawList.map((vs: any) => (typeof vs === 'string' ? vs : vs.name)).filter(Boolean);
  }, [personalizationContext]);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [list, prog] = await Promise.all([
        InterviewService.getInterviews(),
        InterviewService.getProgress(),
      ]);
      setInterviews(list);
      setProgress(prog);
    } catch (err) {
      console.warn('Error loading interview data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 1. Start Setup Handler
  const handleStartSetup = (type: InterviewType, focusAreas: string[] = []) => {
    setSetupDefaultType(type);
    setSetupFocusAreas(focusAreas);
    setViewMode('setup');
    setAlert(null);
  };

  // 2. Generate Interview Handler
  const handleGenerate = async (requestData: IGenerateInterviewRequest) => {
    const created = await InterviewService.generateInterview(requestData);
    setActiveInterview(created);
    setInterviews((prev) => [created, ...prev]);
    setViewMode('player');
    setAlert(null);
  };

  // 3. Submit Answers for AI Evaluation
  const handleSubmitEvaluation = async (
    answers: { questionId: string; answer: string }[],
    timeSpentSeconds: number
  ) => {
    if (!activeInterview) return;
    try {
      setViewMode('evaluating');
      const evaluated = await InterviewService.evaluateInterview(activeInterview._id, {
        answers,
        timeSpentSeconds,
      });

      setActiveInterview(evaluated);
      setInterviews((prev) => prev.map((i) => (i._id === evaluated._id ? evaluated : i)));

      // Reload fresh progress metrics
      const freshProg = await InterviewService.getProgress();
      setProgress(freshProg);

      setViewMode('results');
      setAlert({
        type: 'success',
        message: 'Interview evaluated successfully by Gemini AI.',
      });
    } catch (err: any) {
      console.error('Evaluation failed:', err);
      setViewMode('player');
      setAlert({
        type: 'error',
        message:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to evaluate interview responses. Please try again.',
      });
    }
  };

  // 4. Retry / Practice Weak Areas Handler
  const handleRetry = async (interviewId?: string, focusWeakAreas = false) => {
    const targetId = interviewId || activeInterview?._id;
    if (!targetId) return;

    try {
      setLoading(true);
      const retried = await InterviewService.retryInterview(targetId, focusWeakAreas);
      setActiveInterview(retried);
      setInterviews((prev) => [retried, ...prev]);
      setViewMode('player');
      setAlert(null);
    } catch (err: any) {
      console.error('Retry failed:', err);
      setAlert({
        type: 'error',
        message: 'Failed to start retry session. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // 5. Delete Interview
  const handleDeleteInterview = async (interviewId: string) => {
    await InterviewService.deleteInterview(interviewId);
    setInterviews((prev) => prev.filter((i) => i._id !== interviewId));
    const freshProg = await InterviewService.getProgress();
    setProgress(freshProg);
    if (activeInterview?._id === interviewId) {
      setActiveInterview(null);
      setViewMode('home');
    }
    setAlert({
      type: 'success',
      message: 'Interview session deleted.',
    });
  };

  // 6. Review Existing Interview
  const handleSelectInterviewForReview = (interview: IInterview) => {
    setActiveInterview(interview);
    if (interview.status === 'completed') {
      setViewMode('results');
    } else {
      setViewMode('player');
    }
    setAlert(null);
  };

  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div
        className="glow-accent-primary"
        style={{ width: '500px', height: '500px', top: '8%', right: '12%', opacity: 0.18 }}
      />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrapper}>
            <h1>
              <Sparkles size={26} style={{ color: '#818cf8' }} />
              Interview Preparation
              <span className={styles.badge}>Phase 13.5</span>
            </h1>
            <p className={styles.subtitle}>
              Master technical and behavioral interviews with real-time AI simulations, STAR evaluations, and targeted
              practice.
            </p>
          </div>

          <div className={styles.headerActions}>
            {viewMode !== 'setup' && viewMode !== 'player' && viewMode !== 'evaluating' && (
              <button
                className={styles.btnPrimary}
                onClick={() => handleStartSetup('mock')}
              >
                <Plus size={16} /> New Interview
              </button>
            )}
          </div>
        </div>

        {/* Global Navigation Tabs (When on main screens) */}
        {viewMode !== 'setup' && viewMode !== 'player' && viewMode !== 'evaluating' && (
          <div className={styles.navTabs}>
            <button
              className={`${styles.navTabBtn} ${viewMode === 'home' ? styles.navTabBtnActive : ''}`}
              onClick={() => setViewMode('home')}
            >
              <Sparkles size={15} /> Practice Home
            </button>
            <button
              className={`${styles.navTabBtn} ${viewMode === 'history' ? styles.navTabBtnActive : ''}`}
              onClick={() => setViewMode('history')}
            >
              <History size={15} /> History ({interviews.length})
            </button>
            <button
              className={`${styles.navTabBtn} ${viewMode === 'progress' ? styles.navTabBtnActive : ''}`}
              onClick={() => setViewMode('progress')}
            >
              <TrendingUp size={15} /> Performance Analytics
            </button>
          </div>
        )}

        {/* Alert Notifications */}
        {alert && (
          <div className={`${styles.alert} ${alert.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Dynamic Views */}
        {loading ? (
          <div className={styles.loadingWrapper}>
            <Loader2 size={38} className={styles.spinner} />
            <p>Loading your interview preparation workspace...</p>
          </div>
        ) : viewMode === 'evaluating' ? (
          /* Evaluating Screen */
          <div className={styles.loadingWrapper} style={{ minHeight: '450px' }}>
            <Loader2 size={46} className={styles.spinner} />
            <h3 style={{ color: '#f3f4f6', fontSize: '1.3rem', margin: 0 }}>
              Evaluating Your Answers with Gemini AI...
            </h3>
            <p style={{ maxWidth: '480px', color: '#9ca3af', fontSize: '0.92rem', margin: 0 }}>
              Analyzing technical correctness, communication structure, and STAR methodology alignment. This takes a
              few seconds.
            </p>
          </div>
        ) : viewMode === 'setup' ? (
          /* Interview Setup Screen */
          <InterviewSetup
            defaultType={setupDefaultType}
            defaultTargetRole={targetRole}
            defaultFocusAreas={setupFocusAreas}
            suggestedSkills={verifiedSkillsList}
            onCancel={() => setViewMode('home')}
            onGenerate={handleGenerate}
          />
        ) : viewMode === 'player' && activeInterview ? (
          /* Active Interview Taking Simulator */
          <InterviewPlayer
            interview={activeInterview}
            onQuit={() => setViewMode('home')}
            onSubmit={handleSubmitEvaluation}
          />
        ) : viewMode === 'results' && activeInterview ? (
          /* Evaluation Results Screen */
          <InterviewResults
            interview={activeInterview}
            onReviewQuestions={() => setViewMode('review')}
            onRetry={(focusWeak) => handleRetry(activeInterview._id, focusWeak)}
            onNewInterview={() => handleStartSetup('mock')}
          />
        ) : viewMode === 'review' && activeInterview ? (
          /* Question-by-Question Review Screen */
          <InterviewQuestionReview
            interview={activeInterview}
            onBackToResults={() => setViewMode('results')}
          />
        ) : viewMode === 'history' ? (
          /* History Screen */
          <InterviewHistory
            interviews={interviews}
            onSelectInterview={handleSelectInterviewForReview}
            onRetry={(id) => handleRetry(id, false)}
            onDelete={handleDeleteInterview}
            onStartNew={() => handleStartSetup('mock')}
          />
        ) : viewMode === 'progress' ? (
          /* Performance Analytics Screen */
          <InterviewProgressView
            progress={progress}
            onPracticeWeakArea={(topic) => handleStartSetup('technical', [topic])}
          />
        ) : (
          /* Home Screen */
          <InterviewHome
            targetRole={targetRole}
            progress={progress}
            recentInterviews={interviews}
            onStartSetup={handleStartSetup}
            onReviewInterview={handleSelectInterviewForReview}
            onRetryInterview={(id: string) => handleRetry(id, false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewPage;
