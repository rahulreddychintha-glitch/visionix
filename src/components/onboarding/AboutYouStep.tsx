import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { COUNTRIES, LANGUAGES, STUDENT_STATUSES } from '../../constants/onboarding.constants';
import { SearchableSelect } from './SearchableSelect';
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

const ROLE_HELPERS: Record<string, string> = {
  'school_student': "Perfect! We'll personalize recommendations for your school journey.",
  'college_student': "We'll recommend careers, skills and learning paths based on your studies.",
  'university_student': "We'll build recommendations around your university education.",
  'fresh_graduate': "We'll help you transition from education to your first career.",
  'working_professional': "We'll tailor recommendations using your experience and career goals.",
  'career_changer': "We'll help you discover a smooth transition into a new career.",
  'entrepreneur': "We'll personalize recommendations for founders and business builders.",
  'freelancer': "We'll help you grow your skills and opportunities.",
  'self_learner': "We'll recommend learning paths based on your interests."
};

export const AboutYouStep: React.FC<AboutYouStepProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onPrev,
  isLoading
}) => {
  const personal = data.personal || {};
  const education = data.education || {};
  
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

  const handleEducationChange = (field: string, value: any) => {
    onChange('education', {
      ...education,
      [field]: value
    });
  };

  // Step validation
  const isStepValid = 
    !!personal.fullName?.trim() && 
    personal.fullName.trim().length >= 2 &&
    !!personal.country && 
    !!education.studentStatus;

  const currentRole = education.studentStatus || '';
  const helperText = ROLE_HELPERS[currentRole] || '';

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

        {/* Country */}
        <div className={styles.formGroup}>
          <SearchableSelect
            id="country"
            label="Country *"
            options={COUNTRIES}
            value={personal.country || ''}
            onChange={(val) => handlePersonalChange('country', val)}
            placeholder="Select your country"
            required={true}
            disabled={isLoading}
            error={errors.country}
            allowOther={false}
          />
          {errors.country && (
            <span role="alert" className={styles.fieldError}>
              {errors.country}
            </span>
          )}
        </div>

        {/* Current Role */}
        <div className={styles.formGroup}>
          <SearchableSelect
            id="studentStatus"
            label="Current Role *"
            options={STUDENT_STATUSES}
            value={education.studentStatus || ''}
            onChange={(val) => handleEducationChange('studentStatus', val)}
            placeholder="Select your current role..."
            required={true}
            disabled={isLoading}
            error={errors.studentStatus}
            allowOther={false}
          />
          {errors.studentStatus && (
            <span role="alert" className={styles.fieldError}>
              {errors.studentStatus}
            </span>
          )}
        </div>

        {/* Dynamic Contextual Helper Message (Only displays when a role is selected) */}
        <div className={styles.formGroupFull} style={{ minHeight: helperText ? 'auto' : '0px', marginTop: '0px' }}>
          <AnimatePresence mode="wait">
            {helperText && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px 18px',
                  background: 'rgba(139, 92, 246, 0.02)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.03)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: '#c084fc',
                  flexShrink: 0
                }}>
                  <Sparkles size={14} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    AI Tip
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{helperText}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Age (Optional) */}
        <div className={styles.formGroup}>
          <label htmlFor="age" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Age</span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'var(--text-muted)'
            }}>Optional</span>
          </label>
          <input
            type="number"
            id="age"
            className={styles.input}
            placeholder="e.g. 21"
            min="1"
            max="120"
            value={personal.age || ''}
            onChange={(e) => handlePersonalChange('age', e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Preferred Language (Optional) */}
        <div className={styles.formGroup}>
          <label htmlFor="preferredLanguage" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Preferred Language</span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'var(--text-muted)'
            }}>Optional</span>
          </label>
          <SearchableSelect
            id="preferredLanguage"
            options={LANGUAGES}
            value={personal.preferredLanguage || ''}
            onChange={(val) => handlePersonalChange('preferredLanguage', val)}
            placeholder="Search language..."
            required={false}
            disabled={isLoading}
            allowOther={false}
          />
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
