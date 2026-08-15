import React from 'react';
import type { IInterview, IInterviewProgress, InterviewType } from '../../types/interview.types';
import {
  Sparkles,
  Award,
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Target,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Zap,
  HelpCircle,
} from 'lucide-react';
import styles from '../../pages/InterviewPage.module.css';

interface InterviewHomeProps {
  targetRole: string;
  progress: IInterviewProgress | null;
  recentInterviews: IInterview[];
  onStartSetup: (type: InterviewType, focusAreas?: string[]) => void;
  onReviewInterview: (interview: IInterview) => void;
  onRetryInterview: (interviewId: string, focusWeakAreas?: boolean) => void;
}

export const InterviewHome: React.FC<InterviewHomeProps> = ({
  targetRole,
  progress,
  recentInterviews,
  onStartSetup,
  onReviewInterview,
  onRetryInterview,
}) => {
  const hasHistory = (progress?.totalCompleted || 0) > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. Target Role & Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(126, 58, 242, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} style={{ color: '#818cf8' }} />
            <span style={{ fontSize: '0.84rem', color: '#c7d2fe', fontWeight: 600, textTransform: 'uppercase' }}>
              Target Role Focus
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            {targetRole || 'General Career Preparation'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#9ca3af', margin: 0 }}>
            {targetRole
              ? `Practice tailored questions generated specifically for ${targetRole} benchmarks.`
              : 'Set a target role in your profile to unlock customized role-specific interview simulations.'}
          </p>
        </div>

        <button
          className={styles.btnPrimary}
          onClick={() => onStartSetup('mock')}
          style={{ padding: '10px 22px', fontSize: '0.92rem' }}
        >
          <Sparkles size={16} />
          Start Full Mock Interview
        </button>
      </div>

      {/* 2. Progress Overview Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.6))',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f3f4f6' }}>
              {progress?.totalCompleted || 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Interviews Completed</div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.6))',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f3f4f6' }}>
              {progress?.averageScore ? `${progress.averageScore}%` : '—'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Average Score</div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.6))',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f3f4f6' }}>
              {progress?.bestScore ? `${progress.bestScore}%` : '—'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Best Score</div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.6))',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(6, 148, 162, 0.15)',
              color: '#22d3ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HelpCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f3f4f6' }}>
              {progress?.questionsAnswered || 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Questions Answered</div>
          </div>
        </div>
      </div>

      {/* 3. Quick Start Interview Mode Cards */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6', margin: '0 0 16px 0' }}>
          Select Practice Mode
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px',
          }}
        >
          {/* Mock Interview */}
          <div
            style={{
              background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
              border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
              borderRadius: '14px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => onStartSetup('mock')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
                Full Mock Interview
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                Simulate a real-world multi-stage interview combining technical fundamentals, problem-solving, and role
                fit.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#818cf8', fontSize: '0.84rem', fontWeight: 600, gap: '4px' }}>
              Start Simulation <ArrowRight size={14} />
            </div>
          </div>

          {/* Technical Practice */}
          <div
            style={{
              background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
              border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
              borderRadius: '14px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => onStartSetup('technical')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
                Technical Deep-Dive
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                Sharpen technical concepts, coding mechanics, system design, and architecture for your target discipline.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#60a5fa', fontSize: '0.84rem', fontWeight: 600, gap: '4px' }}>
              Start Technical <ArrowRight size={14} />
            </div>
          </div>

          {/* Behavioral Practice */}
          <div
            style={{
              background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
              border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
              borderRadius: '14px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => onStartSetup('behavioral')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
                Behavioral & STAR Method
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                Practice leadership, conflict resolution, and teamwork questions evaluated with the structured STAR method.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#34d399', fontSize: '0.84rem', fontWeight: 600, gap: '4px' }}>
              Start Behavioral <ArrowRight size={14} />
            </div>
          </div>

          {/* Resume-Based Interview */}
          <div
            style={{
              background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
              border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
              borderRadius: '14px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => onStartSetup('resume_based')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
                Resume-Based Interview
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                Get cross-examined on your actual projects, claimed technologies, and authentic employment history.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24', fontSize: '0.84rem', fontWeight: 600, gap: '4px' }}>
              Start Resume Q&A <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Identified Weak Areas (If Any) */}
      {progress?.weakAreas && progress.weakAreas.length > 0 && (
        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} style={{ color: '#fbbf24' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
                Focus Opportunity: Identified Weak Areas
              </h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Based on recent evaluation scores &lt; 70%</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
            }}
          >
            {progress.weakAreas.map((w, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f3f4f6' }}>{w.topic}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f87171' }}>{w.score}% avg</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: 0, lineHeight: 1.4 }}>
                    {w.recommendation}
                  </p>
                </div>

                <button
                  className={styles.btnSecondary}
                  style={{ padding: '5px 10px', fontSize: '0.78rem', justifyContent: 'center' }}
                  onClick={() => onStartSetup('technical', [w.topic])}
                >
                  <RotateCcw size={13} /> Practice {w.topic}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Recent Completed Interviews */}
      {recentInterviews.length > 0 && (
        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
              Recent Practice Sessions
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentInterviews.slice(0, 5).map((int) => (
              <div
                key={int._id}
                style={{
                  background: 'rgba(15, 23, 42, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: `2px solid ${
                        int.status === 'completed'
                          ? (int.overallScore || 0) >= 80
                            ? '#10b981'
                            : (int.overallScore || 0) >= 60
                            ? '#f59e0b'
                            : '#ef4444'
                          : '#6b7280'
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      color: '#f3f4f6',
                    }}
                  >
                    {int.status === 'completed' ? `${int.overallScore || 0}` : '—'}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f3f4f6' }}>
                      {int.targetRole} — {int.interviewType.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span>{int.difficulty}</span>
                      <span>•</span>
                      <span>{int.questionCount} Questions</span>
                      <span>•</span>
                      <span>{new Date(int.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {int.status === 'completed' ? (
                    <button
                      className={styles.btnSecondary}
                      style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                      onClick={() => onReviewInterview(int)}
                    >
                      View Results
                    </button>
                  ) : (
                    <button
                      className={styles.btnPrimary}
                      style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                      onClick={() => onReviewInterview(int)}
                    >
                      Resume Session
                    </button>
                  )}
                  <button
                    className={styles.btnSecondary}
                    style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                    onClick={() => onRetryInterview(int._id)}
                    title="Start new practice session with same configuration"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Truthful Empty State if user has 0 interviews */}
      {!hasHistory && (
        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.45))',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '32px 24px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '0.9rem',
          }}
        >
          <Clock size={32} style={{ color: '#818cf8', margin: '0 auto 12px auto' }} />
          <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#f3f4f6' }}>
            No interview history recorded yet.
          </p>
          <p style={{ margin: 0, fontSize: '0.84rem' }}>
            Complete your first AI interview practice session above to start tracking your performance benchmarks.
          </p>
        </div>
      )}
    </div>
  );
};
