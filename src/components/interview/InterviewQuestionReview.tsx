import React, { useState } from 'react';
import type { IInterview } from '../../types/interview.types';
import {
  ArrowLeft,
  Star,
} from 'lucide-react';
import styles from '../../pages/InterviewPage.module.css';

interface InterviewQuestionReviewProps {
  interview: IInterview;
  onBackToResults: () => void;
}

export const InterviewQuestionReview: React.FC<InterviewQuestionReviewProps> = ({
  interview,
  onBackToResults,
}) => {
  const { questions = [], answers = [] } = interview;
  const [filter, setFilter] = useState<'all' | 'needs_work' | 'strong'>('all');

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const filteredQuestions = questions.filter((q) => {
    const ans = answers.find((a) => a.questionId === q.id);
    const score = ans?.score || 0;
    if (filter === 'strong') return score >= 80;
    if (filter === 'needs_work') return score < 70;
    return true;
  });

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
          border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
          borderRadius: '12px',
          padding: '14px 20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <button className={styles.btnSecondary} onClick={onBackToResults}>
          <ArrowLeft size={16} /> Back to Summary
        </button>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: `All (${questions.length})` },
            { id: 'strong', label: 'Strong (≥80%)' },
            { id: 'needs_work', label: 'Needs Work (<70%)' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id as any)}
              style={{
                background: filter === f.id ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.5)',
                border: `1px solid ${filter === f.id ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                color: filter === f.id ? '#c7d2fe' : '#9ca3af',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredQuestions.map((q, idx) => {
          const ans = answers.find((a) => a.questionId === q.id);
          const score = ans?.score || 0;
          const scoreColor = getScoreColor(score);
          const isBehavioral = q.category === 'behavioral' || Boolean(ans?.starAssessment);

          return (
            <div
              key={q.id}
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
              {/* Question Header & Score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
                      Question {idx + 1} • {q.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>• {q.difficulty}</span>
                    <span style={{ fontSize: '0.75rem', color: '#34d399' }}>• {q.focusArea}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6', margin: 0, lineHeight: 1.45 }}>
                    {q.question}
                  </h3>
                </div>

                <div
                  style={{
                    background: `${scoreColor}15`,
                    border: `1px solid ${scoreColor}44`,
                    borderRadius: '8px',
                    padding: '6px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                    {score}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>/ 100</span>
                </div>
              </div>

              {/* User Answer */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>
                  Your Submitted Response:
                </div>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: ans?.answer ? '#f3f4f6' : '#9ca3af',
                    fontStyle: ans?.answer ? 'normal' : 'italic',
                    lineHeight: 1.55,
                    margin: 0,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {ans?.answer || '(No answer provided)'}
                </p>
              </div>

              {/* AI Evaluation & Feedback */}
              {ans?.feedback && (
                <div
                  style={{
                    background: 'rgba(99, 102, 241, 0.06)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase' }}>
                    AI Evaluation Analysis:
                  </div>
                  <p style={{ fontSize: '0.86rem', color: '#e0e7ff', lineHeight: 1.5, margin: 0 }}>
                    {ans.feedback}
                  </p>
                </div>
              )}

              {/* STAR Assessment (For Behavioral Questions) */}
              {isBehavioral && ans?.starAssessment && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star size={15} style={{ color: '#fbbf24' }} /> STAR Method Breakdown
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                    {[
                      { label: 'Situation (S)', val: ans.starAssessment.situation },
                      { label: 'Task (T)', val: ans.starAssessment.task },
                      { label: 'Action (A)', val: ans.starAssessment.action },
                      { label: 'Result (R)', val: ans.starAssessment.result },
                    ].map((item, starIdx) => {
                      const isPresent = item.val?.toLowerCase().includes('present');
                      return (
                        <div
                          key={starIdx}
                          style={{
                            background: 'rgba(15, 23, 42, 0.4)',
                            border: `1px solid ${isPresent ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            borderRadius: '6px',
                            padding: '8px 10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                          }}
                        >
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#9ca3af' }}>{item.label}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isPresent ? '#6ee7b7' : '#fca5a5' }}>
                            {item.val || 'Missing'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              {((ans?.strengths && ans.strengths.length > 0) || (ans?.improvements && ans.improvements.length > 0)) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  {ans.strengths && ans.strengths.length > 0 && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', padding: '10px 12px' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                        What Went Well:
                      </span>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', fontSize: '0.82rem', color: '#d1fae5', lineHeight: 1.4 }}>
                        {ans.strengths.map((s, sIdx) => (
                          <li key={sIdx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {ans.improvements && ans.improvements.length > 0 && (
                    <div style={{ background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px', padding: '10px 12px' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>
                        Recommended Next Step:
                      </span>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', fontSize: '0.82rem', color: '#fde68a', lineHeight: 1.4 }}>
                        {ans.improvements.map((imp, impIdx) => (
                          <li key={impIdx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
