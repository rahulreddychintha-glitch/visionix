import React from 'react';
import type { IInterviewProgress } from '../../types/interview.types';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  HelpCircle,
  Zap,
  BarChart2,
} from 'lucide-react';
import styles from '../../pages/InterviewPage.module.css';

interface InterviewProgressProps {
  progress: IInterviewProgress | null;
  onPracticeWeakArea: (topic: string) => void;
}

export const InterviewProgressView: React.FC<InterviewProgressProps> = ({
  progress,
  onPracticeWeakArea,
}) => {
  const hasData = (progress?.totalCompleted || 0) > 0;

  if (!hasData) {
    return (
      <div
        style={{
          background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
          border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          maxWidth: '640px',
          margin: '20px auto',
        }}
      >
        <BarChart2 size={42} style={{ color: '#818cf8', margin: '0 auto 16px auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f3f4f6', margin: '0 0 8px 0' }}>
          No Interview Progress Data Yet
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
          Complete your first AI interview practice session to start generating cumulative performance curves and weak
          area analytics.
        </p>
      </div>
    );
  }

  const {
    totalCompleted = 0,
    averageScore = 0,
    bestScore = 0,
    questionsAnswered = 0,
    recentScores = [],
    weakAreas = [],
    interviewTypeBreakdown = {},
  } = progress!;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
            borderRadius: '14px',
            padding: '20px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#818cf8', marginBottom: '8px' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Completed Sessions</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f3f4f6' }}>{totalCompleted}</div>
        </div>

        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
            borderRadius: '14px',
            padding: '20px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399', marginBottom: '8px' }}>
            <TrendingUp size={18} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Average Score</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: getScoreColor(averageScore) }}>
            {averageScore}%
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
            borderRadius: '14px',
            padding: '20px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fbbf24', marginBottom: '8px' }}>
            <Award size={18} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Best Score</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: getScoreColor(bestScore) }}>
            {bestScore}%
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
            borderRadius: '14px',
            padding: '20px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#22d3ee', marginBottom: '8px' }}>
            <HelpCircle size={18} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Questions Answered</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f3f4f6' }}>{questionsAnswered}</div>
        </div>
      </div>

      {/* 2. Score Progression Timeline */}
      {recentScores.length > 0 && (
        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#818cf8' }} /> Recent Score Progression
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '160px', padding: '10px 0' }}>
            {recentScores.slice(-10).map((s, idx) => {
              const heightPercent = Math.max(15, s.score);
              const color = getScoreColor(s.score);
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    gap: '6px',
                  }}
                  title={`${s.role} (${s.type}): ${s.score}% on ${new Date(s.date).toLocaleDateString()}`}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color }}>{s.score}%</span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${heightPercent}%`,
                      backgroundColor: color,
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <span style={{ fontSize: '0.68rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                    #{recentScores.length - idx}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Mode Breakdown & Weak Areas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Practice Mode Breakdown */}
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
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
            Sessions by Practice Mode
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { type: 'mock', label: 'Full Mock Interviews' },
              { type: 'technical', label: 'Technical Deep-Dives' },
              { type: 'behavioral', label: 'Behavioral & STAR' },
              { type: 'resume_based', label: 'Resume-Based Interviews' },
              { type: 'mixed', label: 'Mixed Practice Sessions' },
            ].map((m) => {
              const count = (interviewTypeBreakdown as any)[m.type] || 0;
              const percent = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;
              return (
                <div key={m.type} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#d1d5db' }}>{m.label}</span>
                    <span style={{ color: '#9ca3af', fontWeight: 700 }}>
                      {count} ({percent}%)
                    </span>
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
                        width: `${percent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Weak Areas */}
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
            <Zap size={18} /> Top Growth Targets
          </h3>

          {weakAreas.length === 0 ? (
            <p style={{ fontSize: '0.86rem', color: '#9ca3af', margin: 0 }}>
              No critical weak areas identified yet. Keep practicing to maintain high performance!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {weakAreas.map((w, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f3f4f6' }}>{w.topic}</div>
                    <div style={{ fontSize: '0.76rem', color: '#9ca3af' }}>{w.recommendation}</div>
                  </div>

                  <button
                    className={styles.btnSecondary}
                    style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                    onClick={() => onPracticeWeakArea(w.topic)}
                  >
                    Practice
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
