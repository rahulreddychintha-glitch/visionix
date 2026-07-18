import React from 'react';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';

interface EducationStepProps {
  data: any;
  onChange: (section: string, fields: any) => void;
  errors: any;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const EDUCATION_LEVELS = [
  'High School',
  'Intermediate',
  'Diploma',
  'Undergraduate',
  'Postgraduate',
  'Working Professional'
];

const CLASS_YEARS = [
  '10th',
  '12th',
  '1st Year',
  '2nd Year',
  '3rd Year',
  'Final Year',
  'N/A (Working)'
];

const MAJOR_STREAMS = [
  'Science',
  'Commerce',
  'Arts',
  'Computer Science',
  'Mechanical',
  'ECE',
  'Electrical',
  'Civil',
  'Others'
];

export const EducationStep: React.FC<EducationStepProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onPrev,
  isLoading
}) => {
  const personal = data.personal || {};
  const education = data.education || {};

  const handlePersonalChange = (field: string, value: string) => {
    onChange('personal', {
      ...personal,
      [field]: value,
    });
  };

  const handleEducationChange = (field: string, value: string) => {
    onChange('education', {
      ...education,
      [field]: value,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'slideUp 0.4s ease-out' }}>
      <div>
        <h2 className={styles.title}>Academic Profile</h2>
        <p className={styles.subtitle}>Tell us about your educational background.</p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroupFull}>
          <label htmlFor="fullName">Full Name</label>
          <input
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

        <div className={styles.formGroupFull}>
          <label htmlFor="level">Highest Education Level</label>
          <select
            id="level"
            className={styles.select}
            value={education.level || ''}
            onChange={(e) => handleEducationChange('level', e.target.value)}
            disabled={isLoading}
            aria-invalid={errors.level ? 'true' : 'false'}
            aria-describedby={errors.level ? 'level-error' : undefined}
            required
          >
            <option value="">Select Level</option>
            {EDUCATION_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
          {errors.level && (
            <span id="level-error" role="alert" className={styles.fieldError}>
              {errors.level}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="classYear">Current Class / Year</label>
          <select
            id="classYear"
            className={styles.select}
            value={education.institution || ''} // Maps classYear to education.institution
            onChange={(e) => handleEducationChange('institution', e.target.value)}
            disabled={isLoading}
            aria-invalid={errors.institution ? 'true' : 'false'}
            aria-describedby={errors.institution ? 'classYear-error' : undefined}
            required
          >
            <option value="">Select Class / Year</option>
            {CLASS_YEARS.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
          {errors.institution && (
            <span id="classYear-error" role="alert" className={styles.fieldError}>
              {errors.institution}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stream">Major / Stream of Study</label>
          <select
            id="stream"
            className={styles.select}
            value={education.stream || ''}
            onChange={(e) => handleEducationChange('stream', e.target.value)}
            disabled={isLoading}
            aria-invalid={errors.stream ? 'true' : 'false'}
            aria-describedby={errors.stream ? 'stream-error' : undefined}
            required
          >
            <option value="">Select Major / Stream</option>
            {MAJOR_STREAMS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {errors.stream && (
            <span id="stream-error" role="alert" className={styles.fieldError}>
              {errors.stream}
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
      />
    </div>
  );
};
