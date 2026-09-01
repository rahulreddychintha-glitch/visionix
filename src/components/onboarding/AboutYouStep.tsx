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
  
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Autofocus on mount
    if (firstNameInputRef.current) {
      firstNameInputRef.current.focus();
    }
  }, []);

  const handleFieldChange = (field: string, value: any) => {
    const updated = {
      ...personal,
      [field]: value
    };
    if (field === 'firstName' || field === 'lastName') {
      const first = field === 'firstName' ? value : (personal.firstName || '');
      const last = field === 'lastName' ? value : (personal.lastName || '');
      updated.fullName = `${first} ${last}`.trim();
    }
    onChange('personal', updated);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to ensure date string is YYYY-MM-DD for input
  const dobInputValue = personal.dateOfBirth
    ? typeof personal.dateOfBirth === 'string'
      ? personal.dateOfBirth.split('T')[0]
      : new Date(personal.dateOfBirth).toISOString().split('T')[0]
    : '';

  // Step validation
  const isDobValid = !!dobInputValue && dobInputValue <= todayStr;
  const isStepValid = 
    !!personal.firstName?.trim() && 
    !!personal.lastName?.trim() && 
    isDobValid;

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
        {/* First Name */}
        <div className={styles.formGroup}>
          <label htmlFor="firstName">First Name *</label>
          <input
            ref={firstNameInputRef}
            type="text"
            id="firstName"
            className={styles.input}
            placeholder="John"
            value={personal.firstName || ''}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            disabled={isLoading}
            aria-invalid={errors.firstName ? 'true' : 'false'}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            required
          />
          {errors.firstName && (
            <span id="firstName-error" role="alert" className={styles.fieldError}>
              {errors.firstName}
            </span>
          )}
        </div>

        {/* Last Name */}
        <div className={styles.formGroup}>
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            className={styles.input}
            placeholder="Doe"
            value={personal.lastName || ''}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            disabled={isLoading}
            aria-invalid={errors.lastName ? 'true' : 'false'}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            required
          />
          {errors.lastName && (
            <span id="lastName-error" role="alert" className={styles.fieldError}>
              {errors.lastName}
            </span>
          )}
        </div>

        {/* Date of Birth */}
        <div className={styles.formGroupFull}>
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input
            type="date"
            id="dateOfBirth"
            className={styles.input}
            max={todayStr}
            value={dobInputValue}
            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
            disabled={isLoading}
            aria-invalid={errors.dateOfBirth ? 'true' : 'false'}
            aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
            required
          />
          {errors.dateOfBirth && (
            <span id="dateOfBirth-error" role="alert" className={styles.fieldError}>
              {errors.dateOfBirth}
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
