import React, { useState, useEffect, useRef } from 'react';
import type { IInterview } from '../../types/interview.types';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
} from 'lucide-react';
import styles from '../../pages/InterviewPage.module.css';

interface InterviewPlayerProps {
  interview: IInterview;
  onQuit: () => void;
  onSubmit: (answers: { questionId: string; answer: string }[], timeSpentSeconds: number) => Promise<void>;
}

export const InterviewPlayer: React.FC<InterviewPlayerProps> = ({
  interview,
  onQuit,
  onSubmit,
}) => {
  const { questions = [], timerSeconds = 0 } = interview;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answersMap, setAnswersMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    (interview.answers || []).forEach((a) => {
      map[a.questionId] = a.answer;
    });
    return map;
  });

  // Time tracking
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(timerSeconds);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex] || null;
  const currentAnswer = currentQuestion ? answersMap[currentQuestion.id] || '' : '';

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Total session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Per-question timer (if timerSeconds > 0)
  useEffect(() => {
    if (timerSeconds > 0) {
      setQuestionTimeLeft(timerSeconds);
      const interval = setInterval(() => {
        setQuestionTimeLeft((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, timerSeconds]);

  // Focus textarea on index change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentIndex]);

  const handleAnswerChange = (val: string) => {
    if (!currentQuestion) return;
    setAnswersMap((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      setSubmitting(true);
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        answer: (answersMap[q.id] || '').trim(),
      }));
      await onSubmit(formattedAnswers, elapsedSeconds);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const answeredCount = Object.values(answersMap).filter((a) => a.trim().length > 0).length;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (!currentQuestion) {
    return (
      <div className={styles.loadingWrapper}>
        <p>No questions available in this interview session.</p>
        <button className={styles.btnSecondary} onClick={onQuit}>
          Return to Dashboard
        </button>
      </div>
    );
  }

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
          padding: '12px 20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className={styles.btnSecondary}
            onClick={() => {
              if (window.confirm('Are you sure you want to pause and exit this interview? Your answers are preserved in this session.')) {
                onQuit();
              }
            }}
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
          >
            <ArrowLeft size={14} /> Exit
          </button>
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f3f4f6' }}>
              {interview.targetRole}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#9ca3af', marginLeft: '8px' }}>
              ({interview.interviewType.toUpperCase()})
            </span>
          </div>
        </div>

        {/* Timers & Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {timerSeconds > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: questionTimeLeft <= 10 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                border: `1px solid ${questionTimeLeft <= 10 ? '#ef4444' : 'rgba(99, 102, 241, 0.3)'}`,
                color: questionTimeLeft <= 10 ? '#fca5a5' : '#c7d2fe',
                fontSize: '0.84rem',
                fontWeight: 700,
              }}
            >
              <Clock size={14} />
              <span>{formatTime(questionTimeLeft)}</span>
            </div>
          )}

          <div style={{ fontSize: '0.84rem', color: '#9ca3af' }}>
            Total Elapsed: <strong>{formatTime(elapsedSeconds)}</strong>
          </div>
        </div>
      </div>

      {/* 2. Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#9ca3af' }}>
          <span>
            Question <strong>{currentIndex + 1}</strong> of <strong>{questions.length}</strong>
          </span>
          <span>{progressPercent}% Completed</span>
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
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* 3. Question Card */}
      <div
        style={{
          background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
          border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
          borderRadius: '16px',
          padding: '28px',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {/* Metadata Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            {currentQuestion.category}
          </span>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            {currentQuestion.difficulty}
          </span>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            {currentQuestion.focusArea}
          </span>
        </div>

        {/* Question Text */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#f3f4f6',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {currentQuestion.question}
        </h3>

        {/* Answer Textarea */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#9ca3af' }}>
            <span>Your Response:</span>
            <span>{currentAnswer.length} characters</span>
          </div>

          <textarea
            ref={textareaRef}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your structured answer here. For technical questions, include core concepts and trade-offs. For behavioral questions, consider structuring your response with STAR (Situation, Task, Action, Result)..."
            style={{
              width: '100%',
              minHeight: '220px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '14px',
              color: '#f3f4f6',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'vertical',
              transition: 'border-color 0.2s',
            }}
          />
        </div>
      </div>

      {/* 4. Question Navigation Bar & Number Pills */}
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
        <button
          className={styles.btnSecondary}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={16} /> Previous
        </button>

        {/* Question Jump Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {questions.map((q, idx) => {
            const hasAns = (answersMap[q.id] || '').trim().length > 0;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: isCurrent
                    ? '2px solid #818cf8'
                    : hasAns
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isCurrent
                    ? 'rgba(99, 102, 241, 0.3)'
                    : hasAns
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(15, 23, 42, 0.5)',
                  color: isCurrent ? '#ffffff' : hasAns ? '#6ee7b7' : '#9ca3af',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={`Question ${idx + 1} (${hasAns ? 'Answered' : 'Unanswered'})`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {currentIndex < questions.length - 1 ? (
          <button className={styles.btnPrimary} onClick={handleNext}>
            Next Question <ArrowRight size={16} />
          </button>
        ) : (
          <button
            className={styles.btnPrimary}
            onClick={() => setShowConfirmModal(true)}
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <Send size={15} /> Finish & Submit
          </button>
        )}
      </div>

      {/* 5. Submission Confirmation Modal */}
      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              <CheckCircle2 size={22} style={{ color: '#10b981' }} />
              Confirm Interview Submission
            </h3>
            <p className={styles.modalText}>
              You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
            </p>

            {answeredCount < questions.length && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#fbbf24',
                  fontSize: '0.84rem',
                }}
              >
                <AlertTriangle size={16} />
                <span>You have {questions.length - answeredCount} unanswered question(s). Unanswered questions will receive a score of 0.</span>
              </div>
            )}

            <p className={styles.modalText}>
              Ready to submit your responses for server-side Gemini AI evaluation and feedback?
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
              >
                Review Answers
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleConfirmSubmit}
                disabled={submitting}
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                <Send size={15} />
                Confirm & Evaluate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
