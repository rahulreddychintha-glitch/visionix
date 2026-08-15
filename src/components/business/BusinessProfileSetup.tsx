import React, { useState } from 'react';
import type {
  IBusinessProfile,
  EntrepreneurshipExperience,
  AvailableTime,
  StartupStage,
} from '../../types/business.types';
import {
  ArrowLeft,
  Check,
  Rocket,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import styles from './BusinessProfileSetup.module.css';

const INDUSTRY_OPTIONS = [
  'AI & Machine Learning',
  'Software & Web Services',
  'Healthcare & Biotech',
  'Finance & Fintech',
  'E-commerce & D2C',
  'Education & EdTech',
  'Sustainability & CleanTech',
  'Media & Content',
  'Cybersecurity',
  'Gaming & Interactive',
  'Robotics & Hardware',
  'Supply Chain & Logistics',
];

const EXPERIENCE_OPTIONS: EntrepreneurshipExperience[] = [
  'Beginner',
  'Exploring',
  'Some Experience',
  'Experienced',
];

const GOAL_OPTIONS = [
  'Explore startup ideas',
  'Build a startup',
  'Learn entrepreneurship',
  'Join a startup team',
  'Find competitions & hackathons',
  'Find funding & grants',
  'Build an MVP',
];

const TIME_OPTIONS: AvailableTime[] = [
  'Less than 5 hours/week',
  '5–10 hours/week',
  '10–20 hours/week',
  '20+ hours/week',
];

const STAGE_OPTIONS: StartupStage[] = [
  'Exploring',
  'Idea',
  'Validation',
  'MVP',
  'Early Launch',
  'Growth',
];

interface BusinessProfileSetupProps {
  existingProfile: IBusinessProfile | null;
  onCancel: () => void;
  onSave: (data: Partial<IBusinessProfile>) => Promise<void>;
}

export const BusinessProfileSetup: React.FC<BusinessProfileSetupProps> = ({
  existingProfile,
  onCancel,
  onSave,
}) => {
  const [industries, setIndustries] = useState<string[]>(
    existingProfile?.interestedIndustries || ['AI & Machine Learning', 'Software & Web Services']
  );
  const [experience, setExperience] = useState<EntrepreneurshipExperience>(
    existingProfile?.entrepreneurshipExperience || 'Exploring'
  );
  const [goals, setGoals] = useState<string[]>(
    existingProfile?.goals || ['Explore startup ideas', 'Build an MVP']
  );
  const [availableTime, setAvailableTime] = useState<AvailableTime>(
    existingProfile?.availableTime || '5–10 hours/week'
  );
  const [startupStage, setStartupStage] = useState<StartupStage>(
    existingProfile?.preferredStartupStage || 'Exploring'
  );

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleIndustry = (ind: string) => {
    setIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (industries.length === 0) {
      setError('Please select at least one industry of interest.');
      return;
    }
    if (goals.length === 0) {
      setError('Please select at least one entrepreneurship goal.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSave({
        interestedIndustries: industries,
        entrepreneurshipExperience: experience,
        goals,
        availableTime,
        preferredStartupStage: startupStage,
        onboardingCompleted: true,
      });
    } catch (err: any) {
      console.error('Failed to save business profile:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to update business profile. Please try again.'
      );
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f3f4f6',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '0.84rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back to Hub
        </button>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818cf8',
            textTransform: 'uppercase',
          }}
        >
          Configuration
        </span>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>Configure Entrepreneurship Preferences</h2>
        <p className={styles.desc}>
          Set your industry interests, experience level, and venture timeline to tailor business discovery and toolkits.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* 1. Target Industries */}
        <div className={styles.section}>
          <label className={styles.label}>Target Industries & Sectors *</label>
          <div className={styles.chipGrid}>
            {INDUSTRY_OPTIONS.map((ind) => {
              const isSelected = industries.includes(ind);
              return (
                <button
                  key={ind}
                  type="button"
                  onClick={() => toggleIndustry(ind)}
                  className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                >
                  {isSelected && <Check size={13} />}
                  {ind}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Entrepreneurship Experience */}
        <div className={styles.section}>
          <label className={styles.label}>Entrepreneurship Experience Level</label>
          <div className={styles.chipGrid}>
            {EXPERIENCE_OPTIONS.map((exp) => {
              const isSelected = experience === exp;
              return (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setExperience(exp)}
                  className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                >
                  {isSelected && <Check size={13} />}
                  {exp}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Primary Goals */}
        <div className={styles.section}>
          <label className={styles.label}>Entrepreneurship Goals *</label>
          <div className={styles.chipGrid}>
            {GOAL_OPTIONS.map((goal) => {
              const isSelected = goals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                >
                  {isSelected && <Check size={13} />}
                  {goal}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Available Time Commitment & Startup Stage */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Time */}
          <div className={styles.section}>
            <label className={styles.label}>Weekly Time Commitment</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {TIME_OPTIONS.map((time) => {
                const isSelected = availableTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setAvailableTime(time)}
                    className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    {isSelected && <Check size={13} />}
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage */}
          <div className={styles.section}>
            <label className={styles.label}>Current Startup Venture Stage</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {STAGE_OPTIONS.map((st) => {
                const isSelected = startupStage === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStartupStage(st)}
                    className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    {isSelected && <Check size={13} />}
                    {st}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className={styles.buttonRow}>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f3f4f6',
              padding: '9px 18px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '9px 22px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
            }}
          >
            {saving ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Saving Profile...
              </>
            ) : (
              <>
                <Rocket size={16} />
                Save Business Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
