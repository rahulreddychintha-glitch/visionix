import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Check } from 'lucide-react';
import {
  STEP3_INTERESTS,
  STEP3_TECHNICAL_SKILLS,
  STEP3_DREAM_CAREERS,
  getTypicalSkills
} from '../../constants/onboarding.constants';
import { SearchableChipGroup } from './SearchableChipGroup';
import { SearchableSelect } from './SearchableSelect';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';

interface AboutCareerStepProps {
  data: any;
  onChange: (section: string, fields: any) => void;
  errors: any;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export const AboutCareerStep: React.FC<AboutCareerStepProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onPrev,
  isLoading
}) => {
  const interests = data.interests || {};
  const skills = data.skills || {};
  const careerGoals = data.careerGoals || {};

  const handleStateChange = (section: string, field: string, value: any) => {
    onChange(section, {
      ...(data[section] || {}),
      [field]: value
    });
  };

  const handleToggleInterest = (item: string) => {
    const list = interests.careerInterests || [];
    const updated = list.includes(item) ? list.filter((i: string) => i !== item) : [...list, item];
    handleStateChange('interests', 'careerInterests', updated);
  };

  const handleToggleTechSkill = (item: string) => {
    const list = skills.technicalSkills || [];
    const updated = list.includes(item) ? list.filter((i: string) => i !== item) : [...list, item];
    handleStateChange('skills', 'technicalSkills', updated);
  };

  const handleToggleRecommendedSkill = (skill: string) => {
    const list = skills.technicalSkills || [];
    const updated = list.includes(skill) ? list.filter((s: string) => s !== skill) : [...list, skill];
    handleStateChange('skills', 'technicalSkills', updated);
  };

  const isSkillSelected = (skill: string) => {
    return (skills.technicalSkills || []).some((s: string) => s.toLowerCase() === skill.toLowerCase());
  };

  // Step 3 Validation: Areas of Interest and Dream Career are required
  const isStepValid =
    (interests.careerInterests || []).length > 0 &&
    !!careerGoals.dreamCareer;

  const filteredInterests = useMemo(() => {
    const stream = data.education?.stream || '';
    const normStream = stream.toLowerCase();

    // Determine matching categories/keywords
    let allowedCategories: string[] = ['General'];
    let allowedKeywords: string[] = [];

    if (normStream.includes('civil')) {
      allowedCategories = ['General', 'Construction', 'Design', 'Industrial'];
      allowedKeywords = ['civil', 'construction', 'structural', 'infrastructure', 'architect', 'interior'];
    } else if (
      normStream.includes('engineering') ||
      normStream.includes('computer') ||
      normStream.includes('software') ||
      normStream.includes('information') ||
      normStream.includes('statistics') ||
      normStream.includes('mathematics')
    ) {
      allowedCategories = ['General', 'Technology', 'Industrial', 'Tech'];
      allowedKeywords = ['software', 'ai', 'data', 'cloud', 'security', 'tech', 'coding', 'dev', 'programming'];
    } else if (
      normStream.includes('medicine') ||
      normStream.includes('health') ||
      normStream.includes('nursing') ||
      normStream.includes('pharmacy') ||
      normStream.includes('dentistry') ||
      normStream.includes('biology') ||
      normStream.includes('biotechnology') ||
      normStream.includes('psychology')
    ) {
      allowedCategories = ['General', 'Healthcare', 'Science'];
      allowedKeywords = ['medicine', 'health', 'clinical', 'nursing', 'pharmacy', 'dentist', 'doctor', 'brain', 'biology', 'biotech', 'psychology'];
    } else if (
      normStream.includes('business') ||
      normStream.includes('management') ||
      normStream.includes('commerce') ||
      normStream.includes('finance') ||
      normStream.includes('accounting') ||
      normStream.includes('economics') ||
      normStream.includes('marketing')
    ) {
      allowedCategories = ['General', 'Finance', 'Management'];
      allowedKeywords = ['finance', 'business', 'management', 'marketing', 'accounting', 'audit', 'tax', 'entrepreneur', 'consultant', 'banking'];
    } else if (
      normStream.includes('arts') ||
      normStream.includes('fine_arts') ||
      normStream.includes('design') ||
      normStream.includes('fashion') ||
      normStream.includes('architecture') ||
      normStream.includes('animation')
    ) {
      allowedCategories = ['General', 'Design', 'Media', 'Arts'];
      allowedKeywords = ['design', 'art', 'graphic', 'fashion', 'ui', 'ux', 'interior', 'animation', 'media', 'creative'];
    } else {
      return STEP3_INTERESTS;
    }

    return STEP3_INTERESTS.filter((item) => {
      if (item.id === 'other') return true;
      if (allowedCategories.includes(item.category)) return true;
      const itemKeywords = item.keywords || [];
      return itemKeywords.some((kw) => allowedKeywords.includes(kw.toLowerCase()));
    });
  }, [data.education?.stream]);

  // Filter Dream Careers based on Degree Program, Specialization, and selected Interests
  const filteredDreamCareers = useMemo(() => {
    const stream = data.education?.stream || '';
    const specialization = data.education?.branchSpecialization || '';
    const selectedInterests = interests.careerInterests || [];
    const normStream = stream.toLowerCase();
    const normSpec = specialization.toLowerCase();

    let matchedKeywords: string[] = [];

    // Match based on Degree Program / Stream
    if (normStream.includes('civil')) {
      matchedKeywords.push('civil', 'construction', 'structural', 'architect', 'interior', 'project manager');
    } else if (
      normStream.includes('engineering') ||
      normStream.includes('computer') ||
      normStream.includes('software') ||
      normStream.includes('information') ||
      normStream.includes('statistics') ||
      normStream.includes('mathematics')
    ) {
      matchedKeywords.push(
        'software', 'ai', 'ml', 'data', 'cybersecurity', 'ui', 'ux', 'product manager',
        'game developer', 'robotics', 'cloud', 'blockchain', 'scientist', 'researcher', 'engineer'
      );
    } else if (
      normStream.includes('medicine') ||
      normStream.includes('health') ||
      normStream.includes('nursing') ||
      normStream.includes('pharmacy') ||
      normStream.includes('dentistry') ||
      normStream.includes('biology') ||
      normStream.includes('biotechnology') ||
      normStream.includes('psychology')
    ) {
      matchedKeywords.push(
        'doctor', 'surgeon', 'dentist', 'nurse', 'pharmacist', 'psychologist', 'veterinarian',
        'scientist', 'researcher', 'clinical'
      );
    } else if (
      normStream.includes('business') ||
      normStream.includes('management') ||
      normStream.includes('commerce') ||
      normStream.includes('finance') ||
      normStream.includes('accounting') ||
      normStream.includes('economics') ||
      normStream.includes('marketing')
    ) {
      matchedKeywords.push(
        'chartered accountant', 'financial analyst', 'investment banker', 'product manager',
        'marketing manager', 'sales manager', 'supply chain manager', 'entrepreneur', 'business owner'
      );
    } else if (
      normStream.includes('arts') ||
      normStream.includes('fine_arts') ||
      normStream.includes('design') ||
      normStream.includes('fashion') ||
      normStream.includes('architecture') ||
      normStream.includes('animation')
    ) {
      matchedKeywords.push(
        'designer', 'ui', 'ux', 'fashion', 'interior', 'animator', 'director', 'actor',
        'musician', 'artist', 'architect'
      );
    }

    // Match based on Specialization
    if (normSpec) {
      if (normSpec.includes('ai') || normSpec.includes('machine learning')) {
        matchedKeywords.push('ai', 'ml', 'data scientist');
      } else if (normSpec.includes('data')) {
        matchedKeywords.push('data scientist', 'analyst');
      } else if (normSpec.includes('cyber') || normSpec.includes('security')) {
        matchedKeywords.push('cybersecurity');
      } else if (normSpec.includes('software') || normSpec.includes('dev')) {
        matchedKeywords.push('software engineer', 'developer', 'game developer');
      } else if (normSpec.includes('cloud') || normSpec.includes('devops')) {
        matchedKeywords.push('cloud engineer', 'software');
      } else if (normSpec.includes('structural')) {
        matchedKeywords.push('structural', 'civil engineer', 'architect');
      } else if (normSpec.includes('finance') || normSpec.includes('banking')) {
        matchedKeywords.push('financial analyst', 'investment banker');
      } else if (normSpec.includes('accounting') || normSpec.includes('audit')) {
        matchedKeywords.push('chartered accountant', 'auditor');
      } else if (normSpec.includes('design')) {
        matchedKeywords.push('designer', 'ui', 'ux');
      }
    }

    // Match based on selected Interests
    selectedInterests.forEach((interestId: string) => {
      const normInterest = interestId.toLowerCase();
      if (normInterest.includes('ai') || normInterest.includes('machine')) {
        matchedKeywords.push('ai', 'ml');
      } else if (normInterest.includes('software') || normInterest.includes('web')) {
        matchedKeywords.push('software', 'developer', 'game');
      } else if (normInterest.includes('data') || normInterest.includes('analytics')) {
        matchedKeywords.push('data', 'analyst');
      } else if (normInterest.includes('security') || normInterest.includes('cyber')) {
        matchedKeywords.push('cybersecurity');
      } else if (normInterest.includes('design') || normInterest.includes('ui')) {
        matchedKeywords.push('designer', 'ui', 'ux', 'fashion', 'interior');
      } else if (normInterest.includes('medicine') || normInterest.includes('healthcare') || normInterest.includes('clinical')) {
        matchedKeywords.push('doctor', 'surgeon', 'nurse', 'dentist', 'pharmacist');
      } else if (normInterest.includes('finance') || normInterest.includes('business')) {
        matchedKeywords.push('financial', 'banker', 'accountant', 'entrepreneur', 'manager');
      } else if (normInterest.includes('civil') || normInterest.includes('construction') || normInterest.includes('infrastructure')) {
        matchedKeywords.push('civil', 'architect', 'project manager');
      }
    });

    if (matchedKeywords.length === 0) {
      return STEP3_DREAM_CAREERS;
    }

    const filtered = STEP3_DREAM_CAREERS.filter((career) => {
      if (career === 'Other (Specify)') return true;
      const lowerCareer = career.toLowerCase();
      return matchedKeywords.some((keyword) => lowerCareer.includes(keyword));
    });

    if (filtered.length <= 1) {
      return STEP3_DREAM_CAREERS;
    }
    return filtered;
  }, [data.education?.stream, data.education?.branchSpecialization, interests.careerInterests]);

  // Custom AI Dynamic Content Generator
  const aiCareerInsightText = useMemo(() => {
    const career = careerGoals.dreamCareer || '';
    if (!career) return "Select a dream career to generate custom AI career insights.";

    // Get default skills and match exactly the examples requested
    const typical = getTypicalSkills(career).slice(0, 3);
    const skillsListStr = typical.length > 0 ? typical.join(', ') : 'core domain skills';
    
    return `Based on your interests, strengthening ${skillsListStr} will improve your ${career} profile.`;
  }, [careerGoals.dreamCareer]);

  // AI Skill Suggestions (max 8 recommendations)
  const recommendedSkills = useMemo(() => {
    if (!careerGoals.dreamCareer) return [];
    const typical = getTypicalSkills(careerGoals.dreamCareer);
    return typical.slice(0, 8);
  }, [careerGoals.dreamCareer]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px', // Breathing room gap: 28px - 36px
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <div>
        <h2 className={styles.title}>Career Discovery</h2>
        <p className={styles.subtitle}>
          Help us align your interests and goals with the ideal career path.
        </p>
      </div>

      {/* 1. Career Interests */}
      <div className={styles.formGroupFull}>
        <SearchableChipGroup
          title="Areas of Interest *"
          options={filteredInterests}
          selectedValues={interests.careerInterests || []}
          onToggle={handleToggleInterest}
          placeholder="Search interests (e.g. Technology, Medicine)..."
          disabled={isLoading}
        />
        {errors.careerInterests && (
          <span role="alert" className={styles.fieldError} style={{ marginTop: '6px', display: 'block' }}>
            {errors.careerInterests}
          </span>
        )}
      </div>

      {/* 2. Dream Career */}
      <div className={styles.formGrid}>
        <div className={styles.formGroupFull}>
          <SearchableSelect
            id="dreamCareer"
            label="Dream Career *"
            options={filteredDreamCareers}
            value={careerGoals.dreamCareer || ''}
            onChange={(val) => handleStateChange('careerGoals', 'dreamCareer', val)}
            placeholder="Search or type dream career..."
            required={true}
            disabled={isLoading}
            error={errors.dreamCareer}
            allowOther={true}
          />
        </div>
      </div>

      {/* 3. Skills Input */}
      <div className={styles.formGroupFull}>
        <SearchableChipGroup
          title="Current Skills (Optional)"
          options={STEP3_TECHNICAL_SKILLS}
          selectedValues={skills.technicalSkills || []}
          onToggle={handleToggleTechSkill}
          placeholder="Search or add current skills (e.g. Python, Excel, Design)..."
          disabled={isLoading}
        />
      </div>

      {/* 4. Recommended Skills (Dynamic Gap Recommendations) */}
      <AnimatePresence>
        {recommendedSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Sparkles size={12} />
                <span>Recommended Skills Gap</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {recommendedSkills.map((skill, idx) => {
                  const isSel = isSkillSelected(skill);
                  return (
                    <motion.button
                      key={skill}
                      type="button"
                      onClick={() => handleToggleRecommendedSkill(skill)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.15, delay: idx * 0.02 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        fontSize: '0.725rem',
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        background: isSel ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSel ? '1px solid var(--color-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isSel ? 'var(--text-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: isSel ? '0 0 12px rgba(139, 92, 246, 0.25)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSel && <Check size={12} style={{ color: 'var(--color-primary)', strokeWidth: 3 }} />}
                      <span>{skill}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Compact AI Career Insight Card */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          padding: '12px 16px',
          background: 'rgba(139, 92, 246, 0.015)',
          border: '1px solid rgba(139, 92, 246, 0.12)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.18)',
          color: '#c084fc',
          flexShrink: 0
        }}>
          <Sparkles size={14} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AI Career Insight
          </div>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {aiCareerInsightText}
          </span>
        </div>
      </div>

      {/* Privacy Note Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '0.725rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        opacity: 0.8
      }}>
        <ShieldCheck size={14} style={{ color: 'var(--text-muted)' }} />
        <span>🔒 Your information remains private and is only used to personalize your AI career guidance.</span>
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
