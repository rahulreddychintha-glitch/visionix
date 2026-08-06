import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { calculateProfileStrength } from '../../utils/profileStrength';
import styles from '../../pages/OnboardingPage.module.css';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  formData?: any;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, formData }) => {
  const percent = Math.round((currentStep / totalSteps) * 100);

  const strength = useMemo(() => {
    return calculateProfileStrength(formData);
  }, [formData]);


  return (
    <div className={styles.progressContainer} style={{ marginBottom: '28px' }}>
      {/* Top Header: Step Tracker & Live AI Profile Strength Widget */}
      <div
        className={styles.progressLabel}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px'
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Step {currentStep} of {totalSteps}
        </span>

        {/* Premium Redesigned AI Profile Strength Widget */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px 20px',
            background: 'rgba(9, 10, 16, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            minWidth: '280px',
            fontSize: '0.85rem',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
          aria-live="polite"
          aria-label={`AI Profile Strength: ${strength.score} percent`}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Sparkles size={14} />
              AI Profile
            </span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{strength.score}% Complete</span>
          </div>

          <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '99px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${strength.score}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)', borderRadius: '99px' }}
            />
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Excellent progress. You&apos;re almost ready. Complete the remaining steps to unlock personalized recommendations.
          </div>
        </motion.div>
      </div>

      {/* Steps Check Timeline Sequence */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px 16px',
        padding: '12px 20px',
        background: 'rgba(255, 255, 255, 0.01)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        {[
          { label: 'About You', step: 1 },
          { label: 'Education', step: 2 },
          { label: 'Career', step: 3 },
          { label: 'AI Assistant', step: 4 },
          { label: 'Review', step: 5 }
        ].map((s, idx) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              {isCompleted ? (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ color: '#10b981', fontWeight: 'bold' }}
                >
                  ✓
                </motion.span>
              ) : isCurrent ? (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  style={{ color: '#8b5cf6' }}
                >
                  🟣
                </motion.span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>○</span>
              )}
              <span style={{
                fontWeight: isCurrent ? 600 : 400,
                color: isCurrent ? 'var(--text-primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)'
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Progress Track */}
      <div className={styles.progressTrack}>
        <motion.div
          className={styles.progressBar}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Onboarding step progress: ${percent}%`}
        />
      </div>
    </div>
  );
};

