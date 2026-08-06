import React from 'react';
import {
  CAREER_INTERESTS,
  TECHNICAL_SKILLS,
  SOFT_SKILLS,
  LANGUAGES,
  EDUCATION_DOMAINS
} from '../../constants/onboarding.constants';
import { SearchableChipGroup } from './SearchableChipGroup';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';

interface InterestsStepProps {
  data: any;
  onChange: (section: string, fields: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export const InterestsStep: React.FC<InterestsStepProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
  isLoading
}) => {
  const interests = data.interests || { careerInterests: [], favouriteSubjects: [], technologies: [], industries: [] };
  const skills = data.skills || { technicalSkills: [], softSkills: [], languages: [], skillLevels: {} };

  const toggleInterestList = (field: 'careerInterests' | 'favouriteSubjects', item: string) => {
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

  const toggleSkillList = (field: 'technicalSkills' | 'softSkills' | 'languages', item: string) => {
    const list = skills[field] || [];
    let updatedList;
    const levels = { ...(skills.skillLevels || {}) };

    if (list.includes(item)) {
      updatedList = list.filter((i: string) => i !== item);
      if (field === 'technicalSkills') delete levels[item];
    } else {
      updatedList = [...list, item];
      if (field === 'technicalSkills') levels[item] = 'Intermediate';
    }

    onChange('skills', {
      ...skills,
      [field]: updatedList,
      skillLevels: levels
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'slideUp 0.4s ease-out' }}>
      <div>
        <h2 className={styles.title}>Interests & Core Skills</h2>
        <p className={styles.subtitle}>Select your career focus areas, favorite subjects, technical skills, and languages.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Career Focus */}
        <SearchableChipGroup
          title="Career Focus"
          options={CAREER_INTERESTS}
          selectedValues={interests.careerInterests || []}
          onToggle={(item) => toggleInterestList('careerInterests', item)}
          placeholder="Search career interests..."
          disabled={isLoading}
        />

        {/* Favorite Subjects */}
        <SearchableChipGroup
          title="Favorite Subjects"
          options={EDUCATION_DOMAINS}
          selectedValues={interests.favouriteSubjects || []}
          onToggle={(item) => toggleInterestList('favouriteSubjects', item)}
          placeholder="Search subjects..."
          disabled={isLoading}
        />

        {/* Technical Skills */}
        <SearchableChipGroup
          title="Technical Skills"
          options={TECHNICAL_SKILLS}
          selectedValues={skills.technicalSkills || []}
          onToggle={(item) => toggleSkillList('technicalSkills', item)}
          placeholder="Search technical skills..."
          disabled={isLoading}
        />

        {/* Soft Skills */}
        <SearchableChipGroup
          title="Soft Skills"
          options={SOFT_SKILLS}
          selectedValues={skills.softSkills || []}
          onToggle={(item) => toggleSkillList('softSkills', item)}
          placeholder="Search soft skills..."
          disabled={isLoading}
        />

        {/* Languages */}
        <SearchableChipGroup
          title="Languages"
          options={LANGUAGES}
          selectedValues={skills.languages || []}
          onToggle={(item) => toggleSkillList('languages', item)}
          placeholder="Search languages..."
          disabled={isLoading}
        />
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
