import React from 'react';
import { INDUSTRIES } from '../../constants/onboarding.constants';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';

interface CareerGoalsStepProps {
  data: any;
  onChange: (section: string, fields: any) => void;
  errors: any;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const PRIMARY_GOALS = [
  'Get Internship',
  'Prepare for Placements',
  'Choose Career',
  'Learn New Skills',
  'Higher Studies',
  'Build Portfolio',
  'Start Freelancing'
];

const WORK_PREFERENCES = ['Remote', 'Hybrid', 'Office'];

const DREAM_CAREER_SUGGESTIONS = [
  'AI Engineer',
  'Software Developer',
  'Product Manager',
  'Cyber Security Analyst',
  'Data Scientist',
  'UX Designer',
  'DevOps Engineer'
];

export const CareerGoalsStep: React.FC<CareerGoalsStepProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onPrev,
  isLoading
}) => {
  const careerGoals = data.careerGoals || { dreamCareer: '', preferredIndustries: [], careerObjectives: '' };
  const workPreferences = data.workPreferences || { remoteHybridOffice: '' };

  const handleCareerChange = (field: string, value: any) => {
    onChange('careerGoals', {
      ...careerGoals,
      [field]: value,
    });
  };

  const handleWorkChange = (field: string, value: any) => {
    onChange('workPreferences', {
      ...workPreferences,
      [field]: value,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'slideUp 0.4s ease-out' }}>
      <div>
        <h2 className={styles.title}>Career Aspirations</h2>
        <p className={styles.subtitle}>Define your dream path and workplace preferences.</p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroupFull}>
          <label htmlFor="dreamCareer">Dream Career / Job Role</label>
          <input
            type="text"
            id="dreamCareer"
            className={styles.input}
            placeholder="e.g. AI Engineer, UX Designer"
            list="dream-career-suggestions"
            value={careerGoals.dreamCareer || ''}
            onChange={(e) => handleCareerChange('dreamCareer', e.target.value)}
            disabled={isLoading}
            aria-invalid={errors.dreamCareer ? 'true' : 'false'}
            aria-describedby={errors.dreamCareer ? 'dreamCareer-error' : undefined}
            required
          />
          <datalist id="dream-career-suggestions">
            {DREAM_CAREER_SUGGESTIONS.map((sug) => (
              <option key={sug} value={sug} />
            ))}
          </datalist>
          {errors.dreamCareer && (
            <span id="dreamCareer-error" role="alert" className={styles.fieldError}>
              {errors.dreamCareer}
            </span>
          )}
        </div>

        <div className={styles.formGroupFull}>
          <label htmlFor="targetIndustry">Target Industry</label>
          <select
            id="targetIndustry"
            className={styles.select}
            value={careerGoals.preferredIndustries?.[0] || ''}
            onChange={(e) => handleCareerChange('preferredIndustries', e.target.value ? [e.target.value] : [])}
            disabled={isLoading}
            aria-invalid={errors.preferredIndustries ? 'true' : 'false'}
            aria-describedby={errors.preferredIndustries ? 'targetIndustry-error' : undefined}
            required
          >
            <option value="">Select Target Industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          {errors.preferredIndustries && (
            <span id="targetIndustry-error" role="alert" className={styles.fieldError}>
              {errors.preferredIndustries}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="primaryGoal">Primary Career Goal</label>
          <select
            id="primaryGoal"
            className={styles.select}
            value={careerGoals.careerObjectives || ''} // Maps Primary Goal to careerObjectives
            onChange={(e) => handleCareerChange('careerObjectives', e.target.value)}
            disabled={isLoading}
            aria-invalid={errors.careerObjectives ? 'true' : 'false'}
            aria-describedby={errors.careerObjectives ? 'primaryGoal-error' : undefined}
            required
          >
            <option value="">Select Goal</option>
            {PRIMARY_GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
          {errors.careerObjectives && (
            <span id="primaryGoal-error" role="alert" className={styles.fieldError}>
              {errors.careerObjectives}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="workPreference">Work Preference (Optional)</label>
          <select
            id="workPreference"
            className={styles.select}
            value={workPreferences.remoteHybridOffice || ''}
            onChange={(e) => handleWorkChange('remoteHybridOffice', e.target.value)}
            disabled={isLoading}
          >
            <option value="">Select Preference</option>
            {WORK_PREFERENCES.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
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
