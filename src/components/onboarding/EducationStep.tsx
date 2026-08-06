import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import {
  EDUCATION_LEVELS,
  STUDENT_STATUSES,
  EDUCATION_DOMAINS,
  DOMAIN_BRANCH_MAP,
  BRANCH_SPECIALIZATION_MAP,
  HIGHER_ED_PLANS,
  YEARS_OF_EXPERIENCE,
  LEARNING_STYLES,
  LEARNING_PACES,
  WEEKLY_STUDY_TIMES,
  type TaxonomyItem
} from '../../constants/onboarding.constants';
import { getSmartSuggestions } from '../../utils/recommendationUtils';
import { SearchableSelect } from './SearchableSelect';
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

const CLASS_YEARS = [
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  '1st Year College',
  '2nd Year College',
  '3rd Year College',
  'Final Year College',
  'Graduated / Alumni'
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
  const experience = data.experience || {};
  const learningPreferences = data.learningPreferences || {};

  const status = education.studentStatus || '';
  const isSchoolStudent = status === 'school_student' || status === 'School Student';
  const isWorking = status === 'working_professional' || status === 'career_changer' || status === 'Working Professional' || status === 'Career Changer';
  const isSelfLearner = status === 'self_learner' || status === 'Self Learner';

  // PART 5: Smart Suggestions derived from profile via pure utility
  const smartSuggestions = useMemo(() => {
    return getSmartSuggestions(data);
  }, [data]);

  // Branch & Specialization Hierarchy
  const availableBranches = useMemo<TaxonomyItem[]>(() => {
    const domainId = education.stream || '';
    if (!domainId || !DOMAIN_BRANCH_MAP[domainId]) {
      return Object.values(DOMAIN_BRANCH_MAP).flat();
    }
    return DOMAIN_BRANCH_MAP[domainId];
  }, [education.stream]);

  const availableSpecializations = useMemo<TaxonomyItem[]>(() => {
    const branchId = education.branchSpecialization || '';
    if (!branchId || !BRANCH_SPECIALIZATION_MAP[branchId]) {
      return Object.values(BRANCH_SPECIALIZATION_MAP).flat();
    }
    return BRANCH_SPECIALIZATION_MAP[branchId];
  }, [education.branchSpecialization]);

  const handlePersonalChange = (field: string, value: string) => {
    onChange('personal', {
      ...personal,
      [field]: value,
    });
  };

  const handleEducationChange = (field: string, value: string) => {
    const updated = { ...education, [field]: value };

    // Reset Branch and Specialization when Domain changes
    if (field === 'stream') {
      updated.branchSpecialization = '';
      updated.specialization = '';
    }

    // Reset Specialization when Branch changes
    if (field === 'branchSpecialization') {
      updated.specialization = '';
    }

    onChange('education', updated);
  };

  const handleExperienceChange = (field: string, value: string) => {
    onChange('experience', {
      ...experience,
      [field]: value,
    });
  };

  const handleLearningPrefChange = (field: string, value: string) => {
    onChange('learningPreferences', {
      ...learningPreferences,
      [field]: value,
    });
  };

  const handleSelectSmartSuggestion = (item: { id: string; label: string }) => {
    // If suggestion matches a known branch, set branchSpecialization
    const matchingBranch = availableBranches.find(
      (b) => b.id === item.id || b.label.toLowerCase() === item.label.toLowerCase()
    );
    if (matchingBranch) {
      handleEducationChange('branchSpecialization', matchingBranch.id);
      return;
    }

    // Otherwise set specialization
    handleEducationChange('branchSpecialization', item.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'slideUp 0.4s ease-out' }}>
      <div>
        <h2 className={styles.title}>Academic & Professional Profile</h2>
        <p className={styles.subtitle}>Select your education domain, branch, and learning preferences.</p>
      </div>

      <div className={styles.formGrid}>
        {/* Full Name (Required) */}
        <div className={styles.formGroupFull}>
          <label htmlFor="fullName">Full Name *</label>
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

        {/* Status / Role (Required) */}
        <SearchableSelect
          id="studentStatus"
          label="Status / Current Role *"
          options={STUDENT_STATUSES}
          value={education.studentStatus || ''}
          onChange={(val) => handleEducationChange('studentStatus', val)}
          placeholder="Select status (School, College, Professional...)"
          required
          disabled={isLoading}
          error={errors.studentStatus}
        />

        {/* Highest Education Level (Required) */}
        <SearchableSelect
          id="level"
          label="Highest Education Level *"
          options={EDUCATION_LEVELS}
          value={education.level || ''}
          onChange={(val) => handleEducationChange('level', val)}
          placeholder="Search education level..."
          required
          disabled={isLoading}
          error={errors.level}
        />

        {/* Education Domain (Required) */}
        <SearchableSelect
          id="stream"
          label="Education Domain *"
          options={EDUCATION_DOMAINS}
          value={education.stream || ''}
          onChange={(val) => handleEducationChange('stream', val)}
          placeholder="Search domain (Engineering, Medicine, Commerce, Law)..."
          required
          disabled={isLoading}
          error={errors.stream}
        />

        {/* PART 5: Smart Suggestions ("Recommended for You") */}
        {education.stream && smartSuggestions.length > 0 && (
          <div className={styles.formGroupFull} style={{ marginTop: '-4px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Sparkles size={14} style={{ color: '#a855f7' }} />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Recommended for You</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {smartSuggestions.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleSelectSmartSuggestion(item)}
                  style={{
                    background: 'rgba(139, 92, 246, 0.12)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '5px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  aria-label={`Select recommended domain suggestion ${item.label}`}
                >
                  <span>+ {item.label}</span>
                  <span style={{ fontSize: '0.7rem', color: '#a855f7', opacity: 0.8 }}>({item.category})</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Branch / Discipline (Filtered dynamically by Domain) */}
        {!isSchoolStudent && (
          <SearchableSelect
            id="branchSpecialization"
            label="Branch / Discipline (Optional)"
            options={availableBranches}
            value={education.branchSpecialization || ''}
            onChange={(val) => handleEducationChange('branchSpecialization', val)}
            placeholder="Search branch (Computer Science, Mechanical, CA...)..."
            disabled={isLoading || !education.stream}
          />
        )}

        {/* Specialization (Filtered dynamically by Branch) */}
        {!isSchoolStudent && education.branchSpecialization && availableSpecializations.length > 0 && (
          <SearchableSelect
            id="specialization"
            label="Specialization (Optional)"
            options={availableSpecializations}
            value={education.specialization || ''}
            onChange={(val) => handleEducationChange('specialization', val)}
            placeholder="Search specialization (AI/ML, Data Science, Cardiology...)..."
            disabled={isLoading}
          />
        )}

        {/* Class / Grade (Shown for School & College Students) */}
        {(!isWorking && !isSelfLearner) && (
          <SearchableSelect
            id="classYear"
            label="Current Class / Year (Optional)"
            options={CLASS_YEARS}
            value={education.institution || ''}
            onChange={(val) => handleEducationChange('institution', val)}
            placeholder="Search class or grade..."
            disabled={isLoading}
          />
        )}

        {/* Current Role / Occupation (Shown for Working Professionals & Career Changers) */}
        {isWorking && (
          <div className={styles.formGroup}>
            <label htmlFor="currentOccupation">Current Role / Title (Optional)</label>
            <input
              type="text"
              id="currentOccupation"
              className={styles.input}
              placeholder="e.g. Software Engineer, Registered Nurse"
              value={education.currentOccupation || experience.currentRole || ''}
              onChange={(e) => {
                handleEducationChange('currentOccupation', e.target.value);
                handleExperienceChange('currentRole', e.target.value);
              }}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Years of Experience (Shown for Working Professionals & Career Changers) */}
        {isWorking && (
          <SearchableSelect
            id="yearsOfExperience"
            label="Years of Experience (Optional)"
            options={YEARS_OF_EXPERIENCE}
            value={experience.yearsOfExperience || ''}
            onChange={(val) => handleExperienceChange('yearsOfExperience', val)}
            placeholder="Select experience level..."
            disabled={isLoading}
          />
        )}

        {/* PART 7: Learning Preferences Fields */}
        <div className={styles.formGroupFull} style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            Learning Preferences (Optional)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            
            {/* Preferred Learning Style */}
            <div className={styles.formGroup}>
              <label htmlFor="learningStyle" style={{ fontSize: '0.8rem' }}>Learning Style</label>
              <select
                id="learningStyle"
                className={styles.select}
                value={learningPreferences.learningStyle || ''}
                onChange={(e) => handleLearningPrefChange('learningStyle', e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select Style</option>
                {LEARNING_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            {/* Learning Pace */}
            <div className={styles.formGroup}>
              <label htmlFor="learningPace" style={{ fontSize: '0.8rem' }}>Learning Pace</label>
              <select
                id="learningPace"
                className={styles.select}
                value={learningPreferences.learningPace || ''}
                onChange={(e) => handleLearningPrefChange('learningPace', e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select Pace</option>
                {LEARNING_PACES.map((pace) => (
                  <option key={pace} value={pace}>
                    {pace}
                  </option>
                ))}
              </select>
            </div>

            {/* Weekly Study Time */}
            <div className={styles.formGroup}>
              <label htmlFor="weeklyStudyTime" style={{ fontSize: '0.8rem' }}>Weekly Study Time</label>
              <select
                id="weeklyStudyTime"
                className={styles.select}
                value={learningPreferences.weeklyStudyTime || ''}
                onChange={(e) => handleLearningPrefChange('weeklyStudyTime', e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select Hours</option>
                {WEEKLY_STUDY_TIMES.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Higher Education Plans (Optional) */}
        {!isSchoolStudent && (
          <div className={styles.formGroupFull}>
            <SearchableSelect
              id="higherEducationPlans"
              label="Higher Education Plans (Optional)"
              options={HIGHER_ED_PLANS}
              value={education.higherEducationPlans || ''}
              onChange={(val) => handleEducationChange('higherEducationPlans', val)}
              placeholder="Select higher education plan..."
              disabled={isLoading}
            />
          </div>
        )}
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
