import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  INDUSTRIES,
  WORK_MODES,
  PREFERRED_JOB_TYPES,
  PREFERRED_LOCATIONS,
  getContextualDreamCareers
} from '../../constants/onboarding.constants';
import { getSkillGap } from '../../utils/recommendationUtils';
import { SearchableSelect } from './SearchableSelect';
import { NavigationButtons } from './NavigationButtons';
import { ChevronDown, SlidersHorizontal, Sparkles, Target } from 'lucide-react';
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
  'Get Internship / Entry-Level Role',
  'Prepare for Campus & Off-Campus Placements',
  'Choose Right Career Path',
  'Learn New Domain Skills & Transition',
  'Prepare for Higher Studies',
  'Build Professional Portfolio & Projects',
  'Start Freelancing & Independent Practice',
  'Accelerate Career Growth'
];

export const CareerGoalsStep: React.FC<CareerGoalsStepProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onPrev,
  isLoading
}) => {
  const [showAdvancedAccordion, setShowAdvancedAccordion] = useState(false);

  const education = data.education || {};
  const careerGoals = data.careerGoals || { dreamCareer: '', preferredIndustries: [], careerObjectives: '', preferredJobType: '', preferredLocation: '', expectedSalary: '', availability: '', careerConfidence: 80 };
  const workPreferences = data.workPreferences || { remoteHybridOffice: '' };
  const skills = data.skills || { portfolioLinks: {} };
  const portfolioLinks = skills.portfolioLinks || {};

  const status = education.studentStatus || '';
  const domain = education.stream || '';

  const contextualDreamCareers = useMemo(() => {
    return getContextualDreamCareers(domain, status);
  }, [domain, status]);

  // PART 6: Skill Gap Detection derived deterministically from utility
  const skillGap = useMemo(() => {
    return getSkillGap(data);
  }, [data]);

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

  const handlePortfolioChange = (field: string, value: string) => {
    onChange('skills', {
      ...skills,
      portfolioLinks: {
        ...portfolioLinks,
        [field]: value,
      },
    });
  };

  const confidenceValue = careerGoals.careerConfidence ?? 80;

  const getConfidenceLabel = (val: number) => {
    if (val < 40) return 'Exploring & Open to AI Recommendations';
    if (val < 75) return 'Moderately Certain';
    return 'Highly Targeted & Specialized Path';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'slideUp 0.4s ease-out' }}>
      <div>
        <h2 className={styles.title}>Career Aspirations & Goals</h2>
        <p className={styles.subtitle}>Define your dream career path, target industry, and primary goals.</p>
      </div>

      <div className={styles.formGrid}>
        {/* Dream Career / Job Role (Required) */}
        <div className={styles.formGroupFull}>
          <SearchableSelect
            id="dreamCareer"
            label="Dream Career / Job Role *"
            options={contextualDreamCareers}
            value={careerGoals.dreamCareer || ''}
            onChange={(val) => handleCareerChange('dreamCareer', val)}
            placeholder="Type or search dream career (e.g. AI Engineer, Software Engineer, Doctor)..."
            required
            disabled={isLoading}
            error={errors.dreamCareer}
          />
        </div>

        {/* PART 6: Skill Gap Detection Card */}
        {careerGoals.dreamCareer && skillGap.missingSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={styles.formGroupFull}
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: 'var(--radius-md)',
              marginTop: '-4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Target size={16} style={{ color: '#a855f7' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Skill Gap Detection — Recommended Skills to Learn
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skillGap.missingSkills.map((missingSkill, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '4px 10px',
                    fontSize: '0.775rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={11} style={{ color: '#3b82f6' }} />
                  {missingSkill}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              * Informational skill gap insights derived for your chosen career.
            </div>
          </motion.div>
        )}

        {/* Target Industry (Required) */}
        <div className={styles.formGroupFull}>
          <SearchableSelect
            id="targetIndustry"
            label="Target Industry *"
            options={INDUSTRIES}
            value={careerGoals.preferredIndustries?.[0] || ''}
            onChange={(val) => handleCareerChange('preferredIndustries', val ? [val] : [])}
            placeholder="Search target industry (e.g. Technology, Healthcare, Finance)..."
            required
            disabled={isLoading}
            error={errors.preferredIndustries}
          />
        </div>

        {/* Primary Goal (Required) */}
        <div className={styles.formGroupFull}>
          <SearchableSelect
            id="primaryGoal"
            label="Primary Goal *"
            options={PRIMARY_GOALS}
            value={careerGoals.careerObjectives || ''}
            onChange={(val) => handleCareerChange('careerObjectives', val)}
            placeholder="Select primary goal..."
            required
            disabled={isLoading}
            error={errors.careerObjectives}
          />
        </div>

        {/* PART 5: Career Confidence Slider */}
        <div className={styles.formGroupFull} style={{ marginTop: '8px', padding: '16px 20px', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label htmlFor="careerConfidence" style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
              How confident are you about your career choice?
            </label>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {confidenceValue}%
            </span>
          </div>
          <input
            type="range"
            id="careerConfidence"
            min="0"
            max="100"
            step="5"
            value={confidenceValue}
            onChange={(e) => handleCareerChange('careerConfidence', Number(e.target.value))}
            disabled={isLoading}
            style={{
              width: '100%',
              accentColor: 'var(--color-primary)',
              cursor: 'pointer',
              height: '6px',
              borderRadius: '3px'
            }}
            aria-label="Career confidence percentage slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            <span>0% (Exploring)</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{getConfidenceLabel(confidenceValue)}</span>
            <span>100% (Certain)</span>
          </div>
        </div>

        {/* Collapsible Advanced Preferences Accordion with Framer Motion */}
        <div className={styles.formGroupFull} style={{ marginTop: '8px' }}>
          <button
            type="button"
            onClick={() => setShowAdvancedAccordion(!showAdvancedAccordion)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={15} style={{ color: 'var(--color-primary)' }} />
              <span>Advanced Preferences (Optional)</span>
            </span>
            <ChevronDown
              size={16}
              style={{
                transform: showAdvancedAccordion ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.18s ease-in-out'
              }}
            />
          </button>

          <AnimatePresence initial={false}>
            {showAdvancedAccordion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    marginTop: '12px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Work Mode */}
                  <div className={styles.formGroup}>
                    <label htmlFor="workPreference">Work Mode</label>
                    <select
                      id="workPreference"
                      className={styles.select}
                      value={workPreferences.remoteHybridOffice || ''}
                      onChange={(e) => handleWorkChange('remoteHybridOffice', e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="">Select Mode</option>
                      {WORK_MODES.map((pref) => (
                        <option key={pref} value={pref}>
                          {pref}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Job Type */}
                  <div className={styles.formGroup}>
                    <label htmlFor="preferredJobType">Job Type</label>
                    <select
                      id="preferredJobType"
                      className={styles.select}
                      value={careerGoals.preferredJobType || ''}
                      onChange={(e) => handleCareerChange('preferredJobType', e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="">Select Job Type</option>
                      {PREFERRED_JOB_TYPES.map((jt) => (
                        <option key={jt} value={jt}>
                          {jt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Location */}
                  <div className={styles.formGroupFull}>
                    <label htmlFor="preferredLocation">Preferred Location</label>
                    <select
                      id="preferredLocation"
                      className={styles.select}
                      value={careerGoals.preferredLocation || ''}
                      onChange={(e) => handleCareerChange('preferredLocation', e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="">Select Location Preference</option>
                      {PREFERRED_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Portfolio URL */}
                  <div className={styles.formGroup}>
                    <label htmlFor="portfolioUrl">Portfolio URL</label>
                    <input
                      type="url"
                      id="portfolioUrl"
                      className={styles.input}
                      placeholder="https://yourportfolio.com"
                      value={portfolioLinks.portfolio || ''}
                      onChange={(e) => handlePortfolioChange('portfolio', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* GitHub URL */}
                  <div className={styles.formGroup}>
                    <label htmlFor="githubUrl">GitHub Profile</label>
                    <input
                      type="url"
                      id="githubUrl"
                      className={styles.input}
                      placeholder="https://github.com/username"
                      value={portfolioLinks.github || ''}
                      onChange={(e) => handlePortfolioChange('github', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* LinkedIn URL */}
                  <div className={styles.formGroupFull}>
                    <label htmlFor="linkedinUrl">LinkedIn Profile</label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      className={styles.input}
                      placeholder="https://linkedin.com/in/username"
                      value={portfolioLinks.linkedin || ''}
                      onChange={(e) => handlePortfolioChange('linkedin', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Expected Salary */}
                  <div className={styles.formGroup}>
                    <label htmlFor="expectedSalary">Expected Salary / Pay (Optional)</label>
                    <input
                      type="text"
                      id="expectedSalary"
                      className={styles.input}
                      placeholder="e.g. $80k - $120k / year"
                      value={careerGoals.expectedSalary || ''}
                      onChange={(e) => handleCareerChange('expectedSalary', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Availability */}
                  <div className={styles.formGroup}>
                    <label htmlFor="availability">Availability (Optional)</label>
                    <input
                      type="text"
                      id="availability"
                      className={styles.input}
                      placeholder="e.g. Immediate, 2 Weeks, 1 Month"
                      value={careerGoals.availability || ''}
                      onChange={(e) => handleCareerChange('availability', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
