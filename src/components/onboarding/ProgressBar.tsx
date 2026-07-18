import React from 'react';
import styles from '../../pages/OnboardingPage.module.css';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Steps are 0 (Welcome) to 5 (Learning & Work Preferences)
  // Percent calculation: maps 0 to 5 into 0% to 100%
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressLabel}>
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{percent}% Completed</span>
      </div>
      <div className={styles.progressTrack}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Onboarding progress: ${percent}%`}
        />
      </div>
    </div>
  );
};
