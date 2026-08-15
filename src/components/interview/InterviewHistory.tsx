import React, { useState } from 'react';
import type { IInterview } from '../../types/interview.types';
import {
  RotateCcw,
  Trash2,
  BookOpen,
  Plus,
  Clock,
} from 'lucide-react';
import styles from '../../pages/InterviewPage.module.css';

interface InterviewHistoryProps {
  interviews: IInterview[];
  onSelectInterview: (interview: IInterview) => void;
  onRetry: (interviewId: string) => void;
  onDelete: (interviewId: string) => Promise<void>;
  onStartNew: () => void;
}

export const InterviewHistory: React.FC<InterviewHistoryProps> = ({
  interviews,
  onSelectInterview,
  onRetry,
  onDelete,
  onStartNew,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (interviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this interview record? This action cannot be undone.')) {
      return;
    }
    try {
      setDeletingId(interviewId);
      await onDelete(interviewId);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (interviews.length === 0) {
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
        <Clock size={40} style={{ color: '#818cf8', margin: '0 auto 16px auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f3f4f6', margin: '0 0 8px 0' }}>
          No Interview Sessions Recorded
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.5, margin: '0 0 24px 0' }}>
          Your completed and in-progress interview practice history will appear here with detailed performance grades
          and weak-area analytics.
        </p>
        <button className={styles.btnPrimary} onClick={onStartNew}>
          <Plus size={16} /> Start Your First Interview
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f3f4f6', margin: '0 0 4px 0' }}>
            Interview History & Attempts
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#9ca3af', margin: 0 }}>
            Review past evaluations, retake previous configurations, or track your score progression over time.
          </p>
        </div>

        <button className={styles.btnPrimary} onClick={onStartNew}>
          <Plus size={16} /> New Interview
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {interviews.map((int) => {
          const score = int.overallScore || 0;
          const scoreColor = getScoreColor(score);
          const isCompleted = int.status === 'completed';

          return (
            <div
              key={int._id}
              style={{
                background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
                border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
                borderRadius: '14px',
                padding: '18px 22px',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              {/* Left Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: `2px solid ${isCompleted ? scoreColor : '#6b7280'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(15, 23, 42, 0.6)',
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: isCompleted ? scoreColor : '#9ca3af', lineHeight: 1 }}>
                    {isCompleted ? `${score}` : '—'}
                  </span>
                  {isCompleted && <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>/100</span>}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
                      {int.targetRole}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#818cf8',
                        textTransform: 'uppercase',
                      }}
                    >
                      {int.interviewType}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isCompleted ? '#34d399' : '#fbbf24',
                        fontWeight: 600,
                      }}
                    >
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: '#9ca3af', alignItems: 'center' }}>
                    <span>{int.difficulty}</span>
                    <span>•</span>
                    <span>{int.questionCount} Questions</span>
                    <span>•</span>
                    <span>{new Date(int.createdAt).toLocaleDateString()} at {new Date(int.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className={styles.btnSecondary}
                  onClick={() => onSelectInterview(int)}
                  style={{ padding: '7px 14px', fontSize: '0.84rem' }}
                >
                  <BookOpen size={14} /> {isCompleted ? 'View Evaluation' : 'Resume Session'}
                </button>

                <button
                  className={styles.btnSecondary}
                  onClick={() => onRetry(int._id)}
                  title="Retake this interview with a fresh question set"
                  style={{ padding: '7px 12px', fontSize: '0.84rem' }}
                >
                  <RotateCcw size={14} /> Retake
                </button>

                <button
                  className={styles.btnDanger}
                  onClick={() => handleDelete(int._id)}
                  disabled={deletingId === int._id}
                  title="Delete interview session"
                  style={{ padding: '7px 10px' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
