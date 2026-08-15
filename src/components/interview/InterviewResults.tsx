import React from 'react';
import type { IInterview } from '../../types/interview.types';
import {
  Award,
  TrendingUp,
  Zap,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Plus,
} from 'lucide-react';
import styles from '../../pages/InterviewPage.module.css';

interface InterviewResultsProps {
  interview: IInterview;
  onReviewQuestions: () => void;
  onRetry: (focusWeakAreas?: boolean) => void;
  onNewInterview: () => void;
}

export const InterviewResults: React.FC<InterviewResultsProps> = ({
  interview,
  onReviewQuestions,
  onRetry,
  onNewInterview,
}) => {
  const overallScore = interview.overallScore || 0;
  const categoryScores = interview.categoryScores || {
    technical: overallScore,
    communication: overallScore,
    problemSolving: overallScore,
    roleAlignment: overallScore,
    clarity: overallScore,
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 85) return 'Exceptional Candidate Poise';
    if (score >= 75) return 'Strong Role Readiness';
    if (score >= 60) return 'Competent with Growth Opportunities';
    return 'Targeted Practice Recommended';
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}m ${remainder}s`;
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Hero Score Banner */}
      <div
        style={{
          background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
          border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
          borderRadius: '16px',
          padding: '32px',
          backdropFilter: 'blur(12px)',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Award size={18} style={{ color: '#818cf8' }} />
              <span style={{ fontSize: '0.82rem', color: '#c7d2fe', fontWeight: 600, textTransform: 'uppercase' }}>
                Interview Evaluation Completed
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
              {interview.targetRole} — {interview.interviewType.toUpperCase()}
            </h2>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: '#9ca3af', marginTop: '6px' }}>
              <span>Difficulty: {interview.difficulty}</span>
              <span>•</span>
              <span>{interview.questions?.length || 0} Questions</span>
              <span>•</span>
              <span>Time: {formatTime(interview.timeSpentSeconds || 0)}</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px 24px',
            }}
          >
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                border: `4px solid ${getScoreColor(overallScore)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                boxShadow: `0 0 20px ${getScoreColor(overallScore)}33`,
              }}
            >
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f3f4f6', lineHeight: 1 }}>
                {overallScore}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>/ 100</span>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>
                Performance Rating
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: getScoreColor(overallScore) }}>
                {getPerformanceGrade(overallScore)}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Feedback */}
        {interview.feedback && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', marginBottom: '6px' }}>
              Executive AI Feedback
            </div>
            <p style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.55, margin: 0 }}>
              {interview.feedback}
            </p>
          </div>
        )}
      </div>

      {/* 2. Category Scores Breakdown (5 Categories) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '14px',
        }}
      >
        {[
          { label: 'Technical Depth', score: categoryScores.technical },
          { label: 'Communication', score: categoryScores.communication },
          { label: 'Problem Solving', score: categoryScores.problemSolving },
          { label: 'Role Alignment', score: categoryScores.roleAlignment },
          { label: 'Clarity & Delivery', score: categoryScores.clarity },
        ].map((cat, idx) => {
          const color = getScoreColor(cat.score);
          return (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card, rgba(30, 41, 59, 0.6))',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600 }}>{cat.label}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color }}>{cat.score}%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${cat.score}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: '9999px',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Strengths & Improvements Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Strengths */}
        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#6ee7b7', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> Demonstrated Strengths
          </h3>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#d1d5db', fontSize: '0.88rem', lineHeight: 1.5 }}>
            {(interview.strengths || []).map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} /> Growth Opportunities
          </h3>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#d1d5db', fontSize: '0.88rem', lineHeight: 1.5 }}>
            {(interview.improvements || []).map((imp, idx) => (
              <li key={idx}>{imp}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Identified Weak Areas (if present) */}
      {interview.weakAreas && interview.weakAreas.length > 0 && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} /> Weak Area Diagnosis
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#9ca3af', margin: 0 }}>
                Specific topics where responses scored under 70% during this interview.
              </p>
            </div>

            <button
              className={styles.btnPrimary}
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '8px 16px', fontSize: '0.86rem' }}
              onClick={() => onRetry(true)}
            >
              <RotateCcw size={15} /> Practice These Weak Areas
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {interview.weakAreas.map((w, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f3f4f6' }}>{w.topic}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f87171' }}>{w.score}%</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: 0, lineHeight: 1.4 }}>
                  {w.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Navigation & Next Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
          border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
          borderRadius: '12px',
          padding: '16px 24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <button className={styles.btnSecondary} onClick={onNewInterview}>
          <Plus size={16} /> New Interview
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={styles.btnSecondary} onClick={() => onRetry(false)}>
            <RotateCcw size={16} /> Retake Session
          </button>
          <button className={styles.btnPrimary} onClick={onReviewQuestions}>
            <BookOpen size={16} /> Review Questions ({interview.questions?.length || 0})
          </button>
        </div>
      </div>
    </div>
  );
};
