import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import {
  STEP2_EDUCATION_LEVELS,
  STEP2_ACADEMIC_FIELDS,
  STEP2_CURRENT_YEARS,
  SPECIALIZATIONS,
  INSTITUTIONS
} from '../../constants/onboarding.constants';
import { SearchableSelect } from './SearchableSelect';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';

interface AboutEducationStepProps {
  data: any;
  onChange: (section: string, fields: any) => void;
  errors: any;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export const AboutEducationStep: React.FC<AboutEducationStepProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onPrev,
  isLoading
}) => {
  const education = data.education || {};

  const handleEducationChange = (field: string, value: any) => {
    onChange('education', {
      ...education,
      [field]: value
    });
  };

  // Step 2 Validation: Highest Education (level) and Course/Degree (stream) are required
  const isStepValid =
    !!education.level &&
    !!education.stream;

  // Dynamic AI Insight Text Resolver
  const dynamicInsightText = useMemo(() => {
    const stream = education.stream || '';
    const normalized = stream.toLowerCase();

    if (
      normalized.includes('engineering') ||
      normalized.includes('mechanical') ||
      normalized.includes('civil') ||
      normalized.includes('electrical') ||
      normalized.includes('electronics') ||
      normalized.includes('aerospace') ||
      normalized.includes('robotics') ||
      normalized.includes('automobile')
    ) {
      return "Visionix will recommend engineering careers, certifications, internships, and industry skills.";
    }
    if (
      normalized.includes('computer science') ||
      normalized.includes('information technology') ||
      normalized.includes('artificial intelligence') ||
      normalized.includes('data science') ||
      normalized.includes('cyber security') ||
      normalized.includes('cloud') ||
      normalized.includes('blockchain') ||
      normalized.includes('game') ||
      normalized.includes('ui ux') ||
      normalized.includes('software')
    ) {
      return "Visionix will recommend software engineering, AI/ML research, cloud architectures, certifications, and developer portfolios.";
    }
    if (
      normalized.includes('medicine') ||
      normalized.includes('healthcare') ||
      normalized.includes('dentistry') ||
      normalized.includes('nursing') ||
      normalized.includes('pharmacy') ||
      normalized.includes('veterinary') ||
      normalized.includes('psychology') ||
      normalized.includes('biology') ||
      normalized.includes('biotechnology')
    ) {
      return "Visionix will personalize medical specializations, entrance exams, certifications, and healthcare opportunities.";
    }
    if (
      normalized.includes('commerce') ||
      normalized.includes('finance') ||
      normalized.includes('accounting') ||
      normalized.includes('economics') ||
      normalized.includes('banking')
    ) {
      return "Visionix will recommend finance, accounting, banking, investment and business career paths.";
    }
    if (
      normalized.includes('business') ||
      normalized.includes('management') ||
      normalized.includes('mba') ||
      normalized.includes('marketing') ||
      normalized.includes('human resources') ||
      normalized.includes('entrepreneur')
    ) {
      return "Visionix will personalize entrepreneurship, leadership, consulting, and management pathways.";
    }
    if (
      normalized.includes('arts') ||
      normalized.includes('humanities') ||
      normalized.includes('design') ||
      normalized.includes('fashion') ||
      normalized.includes('animation') ||
      normalized.includes('film') ||
      normalized.includes('music') ||
      normalized.includes('literature') ||
      normalized.includes('languages') ||
      normalized.includes('history') ||
      normalized.includes('political science') ||
      normalized.includes('geography')
    ) {
      return "Visionix will personalize creative careers, higher education opportunities, galleries, portfolios, and skill development.";
    }
    if (normalized.includes('law') || normalized.includes('legal')) {
      return "Visionix will recommend legal career paths, corporate law, certifications, bar prep, and higher studies.";
    }

    return "Visionix will personalize career recommendations, learning paths, scholarships, certifications, and opportunities.";
  }, [education.stream]);

  const benefits = [
    'Recommend Careers',
    'Personalize Learning Paths',
    'Find Scholarships',
    'Suggest Certifications',
    'Recommend Internships',
    'Generate AI Career Guidance'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div>
        <h2 className={styles.title}>Education & Academic Background</h2>
        <p className={styles.subtitle}>
          Tell us about your education so Visionix can personalize your learning journey.
        </p>
      </div>

      <div className={styles.formGrid}>
        {/* Highest Education Level (Required) */}
        <div className={styles.formGroup}>
          <SearchableSelect
            id="educationLevel"
            label="Highest Education Level *"
            options={STEP2_EDUCATION_LEVELS}
            value={education.level || ''}
            onChange={(val) => handleEducationChange('level', val)}
            placeholder="Select education level..."
            required={true}
            disabled={isLoading}
            error={errors.level}
            allowOther={false}
          />
        </div>

        {/* Course / Degree / Program (Required) */}
        <div className={styles.formGroup}>
          <SearchableSelect
            id="academicStream"
            label="Course / Degree / Program *"
            options={STEP2_ACADEMIC_FIELDS}
            value={education.stream || ''}
            onChange={(val) => handleEducationChange('stream', val)}
            placeholder="Select or search course/degree..."
            required={true}
            disabled={isLoading}
            error={errors.stream}
            allowOther={true}
          />
        </div>

        {/* Specialization (Optional) */}
        <div className={styles.formGroup}>
          <SearchableSelect
            id="specialization"
            label="Specialization (Optional)"
            options={SPECIALIZATIONS}
            value={education.branchSpecialization || ''}
            onChange={(val) => handleEducationChange('branchSpecialization', val)}
            placeholder="Select or type specialization..."
            required={false}
            disabled={isLoading}
            allowOther={true}
          />
        </div>

        {/* Institution Name (Optional) */}
        <div className={styles.formGroup}>
          <SearchableSelect
            id="institution"
            label="Institution Name (Optional)"
            options={INSTITUTIONS}
            value={education.institution || ''}
            onChange={(val) => handleEducationChange('institution', val)}
            placeholder="Search or type institution..."
            required={false}
            disabled={isLoading}
            allowOther={true}
          />
        </div>

        {/* Current Year / Semester (Optional) */}
        <div className={styles.formGroup}>
          <SearchableSelect
            id="currentYear"
            label="Current Year / Semester (Optional)"
            options={STEP2_CURRENT_YEARS}
            value={education.currentOccupation || ''}
            onChange={(val) => handleEducationChange('currentOccupation', val)}
            placeholder="Select year/semester..."
            required={false}
            disabled={isLoading}
            allowOther={false}
          />
        </div>

        {/* Premium AI Insight Card */}
        <div className={styles.formGroupFull} style={{ marginTop: '8px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '20px 24px',
              background: 'rgba(139, 92, 246, 0.02)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 92, 246, 0.03)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: '#c084fc',
                flexShrink: 0
              }}>
                <Sparkles size={16} />
              </div>
              <span style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                AI Insight
              </span>
            </div>

            {/* Sub-header */}
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              Based on your education, Visionix will:
            </p>

            {/* Benefits */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px 20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '16px 0'
            }}>
              {benefits.map((benefit, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  <Check size={14} style={{ color: '#a855f7', strokeWidth: 3 }} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Tailored Dynamic Insight Message */}
            <div style={{
              fontSize: '0.825rem',
              color: 'var(--text-primary)',
              background: 'rgba(255, 255, 255, 0.015)',
              padding: '12px 16px',
              borderRadius: '8px',
              borderLeft: '3px solid #a855f7',
              lineHeight: '1.6',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
              {dynamicInsightText}
            </div>
          </motion.div>
        </div>

        {/* Privacy Footer */}
        <div className={styles.formGroupFull}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '4px',
            textAlign: 'center',
            opacity: 0.8
          }}>
            <span>🔒</span>
            <span>Your information stays private and is only used to personalize your AI career guidance.</span>
          </div>
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
