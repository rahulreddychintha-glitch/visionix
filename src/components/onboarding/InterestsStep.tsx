import React from 'react';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';

interface InterestsStepProps {
  data: any;
  onChange: (section: string, fields: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const CAREER_INTERESTS = [
  'Artificial Intelligence',
  'Software Development',
  'Cyber Security',
  'UI/UX',
  'Data Science',
  'Finance',
  'Marketing',
  'Design',
  'Business',
  'Healthcare'
];

const FAVOURITE_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'History',
  'Languages'
];

const TECHNICAL_SKILLS = [
  'Programming',
  'Design',
  'Video Editing',
  'Public Speaking',
  'Writing'
];

export const InterestsStep: React.FC<InterestsStepProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
  isLoading
}) => {
  const interests = data.interests || { careerInterests: [], favouriteSubjects: [], technologies: [], industries: [] };
  const skills = data.skills || { technicalSkills: [], softSkills: [], languages: [], skillLevels: {} };

  const toggleInterest = (field: string, item: string) => {
    const list = interests[field] || [];
    let updatedList;
    if (list.includes(item)) {
      updatedList = list.filter((i: string) => i !== item);
    } else {
      updatedList = [...list, item];
    }
    onChange('interests', {
      ...interests,
      [field]: updatedList
    });
  };

  const toggleTechnicalSkill = (item: string) => {
    const list = skills.technicalSkills || [];
    let updatedList;
    const levels = { ...(skills.skillLevels || {}) };

    if (list.includes(item)) {
      updatedList = list.filter((i: string) => i !== item);
      delete levels[item];
    } else {
      updatedList = [...list, item];
      levels[item] = 'Intermediate'; // Default level
    }

    onChange('skills', {
      ...skills,
      technicalSkills: updatedList,
      skillLevels: levels
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'slideUp 0.4s ease-out' }}>
      <div>
        <h2 className={styles.title}>Your Interests</h2>
        <p className={styles.subtitle}>Select the topics and areas that excite you the most.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Career Interests */}
        <div>
          <h4 className={styles.chipLabel}>Career Interests</h4>
          <div className={styles.chipGrid}>
            {CAREER_INTERESTS.map((interest) => {
              const active = (interests.careerInterests || []).includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest('careerInterests', interest)}
                  disabled={isLoading}
                  className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorite Subjects */}
        <div>
          <h4 className={styles.chipLabel}>Favorite Subjects</h4>
          <div className={styles.chipGrid}>
            {FAVOURITE_SUBJECTS.map((sub) => {
              const active = (interests.favouriteSubjects || []).includes(sub);
              return (
                <button
                  type="button"
                  key={sub}
                  onClick={() => toggleInterest('favouriteSubjects', sub)}
                  disabled={isLoading}
                  className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Skills */}
        <div>
          <h4 className={styles.chipLabel}>Technical Skills (Optional)</h4>
          <div className={styles.chipGrid}>
            {TECHNICAL_SKILLS.map((skill) => {
              const active = (skills.technicalSkills || []).includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleTechnicalSkill(skill)}
                  disabled={isLoading}
                  className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
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
