import React from 'react';
import { NavigationButtons } from './NavigationButtons';
import { Edit2, CheckCircle2, User, BookOpen } from 'lucide-react';
import styles from '../../pages/OnboardingPage.module.css';

interface FinishStepProps {
  data: any;
  onGoToStep: (step: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export const FinishStep: React.FC<FinishStepProps> = ({
  data,
  onGoToStep,
  onNext,
  onPrev,
  isLoading
}) => {
  const personal = data.personal || {};
  const education = data.education || {};
  const interests = data.interests || { careerInterests: [], favouriteSubjects: [] };
  const skills = data.skills || { technicalSkills: [] };
  const careerGoals = data.careerGoals || { dreamCareer: '', preferredIndustries: [], careerObjectives: '' };
  const workPreferences = data.workPreferences || { remoteHybridOffice: '' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'slideUp 0.4s ease-out' }}>
      <div>
        <h2 className={styles.title}>All Setup!</h2>
        <p className={styles.subtitle}>Review your onboarding summary before generating your personalized cockpit dashboard.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Step 1: Education Summary */}
        <div style={{
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-md)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} style={{ color: 'var(--color-primary)' }} />
              <span>Academic Profile</span>
            </h4>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              disabled={isLoading}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 500,
                padding: 0
              }}
              aria-label="Edit Academic Profile"
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div><strong>Name:</strong> {personal.fullName || 'Not Specified'}</div>
            <div><strong>Education Level:</strong> {education.level || 'Not Specified'}</div>
            <div><strong>Current Class/Year:</strong> {education.institution || 'Not Specified'}</div>
            <div><strong>Stream/Major:</strong> {education.stream || 'Not Specified'}</div>
          </div>
        </div>

        {/* Step 2: Interests Summary */}
        <div style={{
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-md)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} style={{ color: 'var(--color-secondary)' }} />
              <span>Focus & Interests</span>
            </h4>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              disabled={isLoading}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 500,
                padding: 0
              }}
              aria-label="Edit Focus & Interests"
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div>
              <strong>Career Paths:</strong>{' '}
              {interests.careerInterests?.length > 0
                ? interests.careerInterests.join(', ')
                : 'None selected'}
            </div>
            <div>
              <strong>Favorite Subjects:</strong>{' '}
              {interests.favouriteSubjects?.length > 0
                ? interests.favouriteSubjects.join(', ')
                : 'None selected'}
            </div>
            <div>
              <strong>Skills:</strong>{' '}
              {skills.technicalSkills?.length > 0
                ? skills.technicalSkills.join(', ')
                : 'None selected'}
            </div>
          </div>
        </div>

        {/* Step 3: Goals Summary */}
        <div style={{
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-md)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: '#10b981' }} />
              <span>Career Aspirations</span>
            </h4>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              disabled={isLoading}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 500,
                padding: 0
              }}
              aria-label="Edit Career Aspirations"
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div><strong>Dream Career:</strong> {careerGoals.dreamCareer || 'Not Specified'}</div>
            <div><strong>Target Industry:</strong> {careerGoals.preferredIndustries?.[0] || 'Not Specified'}</div>
            <div><strong>Primary Goal:</strong> {careerGoals.careerObjectives || 'Not Specified'}</div>
            <div><strong>Work Preference:</strong> {workPreferences.remoteHybridOffice || 'Not Specified'}</div>
          </div>
        </div>

      </div>

      <div style={{
        marginTop: '16px',
        padding: '16px',
        background: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        fontWeight: 500
      }}>
        Visionix AI now has enough information to personalize your experience.
      </div>

      <NavigationButtons
        isFirstStep={false}
        isLastStep={true} // Triggers completion
        isLoading={isLoading}
        onNext={onNext}
        onPrev={onPrev}
        nextText="Generate My Dashboard"
      />
    </div>
  );
};
