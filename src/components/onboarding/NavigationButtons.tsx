import React from 'react';
import { motion } from 'framer-motion';
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
  nextDisabled?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrev,
  onNext,
  isFirstStep,
  isLastStep,
  isLoading,
  nextText = 'Continue',
  prevText = 'Back',
  nextDisabled = false
}) => {
  const isButtonDisabled = isLoading || nextDisabled;

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

      <motion.button
        type="button"
        className={`btn btn-primary ${isFirstStep ? 'w-full' : ''}`}
        onClick={onNext}
        disabled={isButtonDisabled}
        whileHover={isButtonDisabled ? {} : { scale: 1.02, translateY: -1 }}
        whileTap={isButtonDisabled ? {} : { scale: 0.98 }}
        style={{ 
          padding: '14px 36px',
          marginLeft: isFirstStep ? 0 : 'auto',
          minWidth: '160px',
          opacity: isButtonDisabled ? 0.4 : 1,
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          pointerEvents: isButtonDisabled ? 'none' : 'auto',
          transition: 'background 0.2s, box-shadow 0.2s, opacity 0.2s'
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
      </motion.button>
    </div>
  );
};
