import React from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import styles from '../../pages/OnboardingPage.module.css';

interface NavigationButtonsProps {
  onPrev?: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isLoading: boolean;
  nextText?: string;
  prevText?: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrev,
  onNext,
  isFirstStep,
  isLastStep,
  isLoading,
  nextText = 'Continue',
  prevText = 'Back'
}) => {
  return (
    <div className={styles.navigation}>
      {!isFirstStep && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onPrev}
          disabled={isLoading}
          style={{ padding: '10px 24px' }}
        >
          <ArrowLeft size={16} />
          <span>{prevText}</span>
        </button>
      )}

      <button
        type="button"
        className={`btn btn-primary ${isFirstStep ? 'w-full' : ''}`}
        onClick={onNext}
        disabled={isLoading}
        style={{ 
          padding: '12px 28px',
          marginLeft: isFirstStep ? 0 : 'auto',
          minWidth: '140px'
        }}
      >
        {isLoading ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .spin-animation {
                animation: spin 1s linear infinite;
              }
            `}</style>
            <Loader2 className="spin-animation" size={16} />
            <span>Saving...</span>
          </span>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>{isLastStep ? 'Complete Setup' : nextText}</span>
            {isLastStep ? <Check size={16} /> : <ArrowRight size={16} />}
          </span>
        )}
      </button>
    </div>
  );
};
