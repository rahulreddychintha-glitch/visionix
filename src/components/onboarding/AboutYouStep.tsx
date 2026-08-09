import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';

interface AboutYouStepProps {
  data: any;
  onChange: (section: string, fields: any) => void;
  errors: any;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export const AboutYouStep: React.FC<AboutYouStepProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onPrev,
  isLoading
}) => {
  const personal = data.personal || {};
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Autofocus on mount
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handlePersonalChange = (field: string, value: any) => {
    onChange('personal', {
      ...personal,
      [field]: value
    });
  };

  // Step validation - only Full Name is required
  const isStepValid = 
    !!personal.fullName?.trim() && 
    personal.fullName.trim().length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div>
        <h2 className={styles.title}>Welcome to Visionix</h2>
        <p className={styles.subtitle}>
          Let's personalize your AI career journey in just a few quick steps.
        </p>
      </div>

      <div className={styles.formGrid}>
        {/* Full Name */}
        <div className={styles.formGroupFull}>
          <label htmlFor="fullName">Full Name *</label>
          <input
            ref={nameInputRef}
            type="text"
            id="fullName"
            className={styles.input}
            placeholder="John Doe"
            value={personal.fullName || ''}
            onChange={(e) => handlePersonalChange('fullName', e.target.value)}
            disabled={isLoading}
            aria-invalid={errors.fullName ? 'true' : 'false'}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            required
          />
          {errors.fullName && (
            <span id="fullName-error" role="alert" className={styles.fieldError}>
              {errors.fullName}
            </span>
          )}
        </div>
      </div>

      <NavigationButtons
        isFirstStep={false}
        isLastStep={false}
        isLoading={isLoading}
        onNext={onNext}
        onPrev={onPrev}
        nextDisabled={!isStepValid}
      />
    </motion.div>
  );
};
