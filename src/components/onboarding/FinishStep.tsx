import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { NavigationButtons } from './NavigationButtons';
import { Edit2, Sparkles, User, GraduationCap, Briefcase, Heart, Cpu } from 'lucide-react';
import { calculateProfileStrength } from '../../utils/profileStrength';
import { generateRecommendationPreview, generateAISummarySentences } from '../../utils/recommendationUtils';
import {
  getTaxonomyLabel,
  STUDENT_STATUSES,
  EDUCATION_LEVELS,
  EDUCATION_DOMAINS,
  STEP3_INTERESTS,
  SPECIALIZATIONS,
  DREAM_CAREERS,
  INDUSTRIES,
  TECHNICAL_SKILLS
} from '../../constants/onboarding.constants';
import styles from '../../pages/OnboardingPage.module.css';

interface FinishStepProps {
  data: any;
  onGoToStep: (step: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const isValidValue = (val?: any): boolean => {
  if (!val) return false;
  const str = String(val).trim().toLowerCase();
  return (
    str !== '' &&
    str !== 'not specified' &&
    str !== 'none' &&
    str !== 'n/a' &&
    str !== 'missing' &&
    str !== 'unknown' &&
    str !== 'no data'
  );
};

export const FinishStep: React.FC<FinishStepProps> = ({
  data,
  onGoToStep,
  onNext,
  onPrev,
  isLoading
}) => {
  const personal = data.personal || {};
  const education = data.education || {};
  const experience = data.experience || {};
  const interests = data.interests || {};
  const skills = data.skills || {};
  const careerGoals = data.careerGoals || {};

  // Pure Utility Calculations
  const strength = useMemo(() => calculateProfileStrength(data), [data]);
  const previewRecommendations = useMemo(() => generateRecommendationPreview(data), [data]);
  const summarySentences = useMemo(() => generateAISummarySentences(data), [data]);

  // Labels Resolving
  const roleLabel = isValidValue(education.studentStatus)
    ? getTaxonomyLabel(STUDENT_STATUSES, education.studentStatus)
    : '';
  const levelLabel = isValidValue(education.level)
    ? getTaxonomyLabel(EDUCATION_LEVELS, education.level)
    : '';
  const streamLabel = isValidValue(education.stream)
    ? getTaxonomyLabel(EDUCATION_DOMAINS, education.stream)
    : '';
  const specLabel = isValidValue(education.branchSpecialization)
    ? getTaxonomyLabel(SPECIALIZATIONS, education.branchSpecialization)
    : '';
  const dreamCareerLabel = isValidValue(careerGoals.dreamCareer)
    ? getTaxonomyLabel(DREAM_CAREERS, careerGoals.dreamCareer)
    : '';
  const industryLabel = isValidValue(careerGoals.preferredIndustries?.[0])
    ? getTaxonomyLabel(INDUSTRIES, careerGoals.preferredIndustries[0])
    : '';

  const skillLabels = (skills.technicalSkills || [])
    .filter(isValidValue)
    .map((s: string) => getTaxonomyLabel(TECHNICAL_SKILLS, s));

  const interestLabels = (interests.careerInterests || [])
    .filter(isValidValue)
    .map((i: string) => getTaxonomyLabel(STEP3_INTERESTS, i) || i);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'slideUp 0.4s ease-out' }}>
      
      {/* Title */}
      <div>
        <h2 className={styles.title}>Review Your Career Profile</h2>
        <p className={styles.subtitle}>Calibrated by Visionix AI. Make sure everything is correct before getting started.</p>
      </div>

      {/* AI Profile Strength Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08))',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles size={20} style={{ color: '#c084fc' }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              AI Profile Calibrated: {strength.score}% Accuracy
            </div>
            <div style={{ fontFamily: 'monospace', letterSpacing: '1px', color: '#c084fc', fontSize: '0.8rem', marginTop: '2px' }}>
              {strength.blocks}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          ✓ Verification checks passed
        </div>
      </motion.div>

      {/* Main Single Premium Dashboard Card */}
      <div
        style={{
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* ROW 1: Profile & Education */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Card Section: About You */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#c084fc' }}>
                <User size={16} />
                <span>Profile Details</span>
              </div>
              <button
                type="button"
                onClick={() => onGoToStep(1)}
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <Edit2 size={11} /> Edit
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isValidValue(personal.fullName) && <div><span style={{ color: 'var(--text-muted)' }}>Name:</span> {personal.fullName}</div>}
              {isValidValue(personal.country) && <div><span style={{ color: 'var(--text-muted)' }}>Country:</span> {personal.country}</div>}
              {isValidValue(roleLabel) && <div><span style={{ color: 'var(--text-muted)' }}>Current Role:</span> {roleLabel}</div>}
              {isValidValue(personal.preferredLanguage) && <div><span style={{ color: 'var(--text-muted)' }}>Language:</span> {personal.preferredLanguage}</div>}
              {isValidValue(personal.age) && <div><span style={{ color: 'var(--text-muted)' }}>Age:</span> {personal.age}</div>}
            </div>
          </div>

          {/* Card Section: Education */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#c084fc' }}>
                <GraduationCap size={16} />
                <span>Education Background</span>
              </div>
              <button
                type="button"
                onClick={() => onGoToStep(2)}
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <Edit2 size={11} /> Edit
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isValidValue(levelLabel) && <div><span style={{ color: 'var(--text-muted)' }}>Highest Level:</span> {levelLabel}</div>}
              {isValidValue(streamLabel) && <div><span style={{ color: 'var(--text-muted)' }}>Course/Degree:</span> {streamLabel}</div>}
              {isValidValue(specLabel) && <div><span style={{ color: 'var(--text-muted)' }}>Specialization:</span> {specLabel}</div>}
              {isValidValue(education.institution) && <div><span style={{ color: 'var(--text-muted)' }}>Institution:</span> {education.institution}</div>}
              {isValidValue(education.currentOccupation) && <div><span style={{ color: 'var(--text-muted)' }}>Year/Semester:</span> {education.currentOccupation}</div>}
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.05)', margin: 0 }} />

        {/* ROW 2: Career Goal & Interests/Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Card Section: Career Goal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#c084fc' }}>
                <Briefcase size={16} />
                <span>Career Aspiration</span>
              </div>
              <button
                type="button"
                onClick={() => onGoToStep(3)}
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <Edit2 size={11} /> Edit
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isValidValue(dreamCareerLabel) && <div><span style={{ color: 'var(--text-muted)' }}>Dream Career:</span> {dreamCareerLabel}</div>}
              {isValidValue(experience.yearsOfExperience) && <div><span style={{ color: 'var(--text-muted)' }}>Experience:</span> {experience.yearsOfExperience}</div>}
              {isValidValue(industryLabel) && <div><span style={{ color: 'var(--text-muted)' }}>Target Industry:</span> {industryLabel}</div>}
            </div>
          </div>

          {/* Card Section: Interests & Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#c084fc' }}>
                <Heart size={16} />
                <span>Interests & Skills</span>
              </div>
              <button
                type="button"
                onClick={() => onGoToStep(3)}
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <Edit2 size={11} /> Edit
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {interestLabels.length > 0 && (
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Areas of Interest:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {interestLabels.map((l: string) => (
                      <span key={l} style={{ fontSize: '0.725rem', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px' }}>{l}</span>
                    ))}
                  </div>
                </div>
              )}
              {skillLabels.length > 0 && (
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Current Skills:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {skillLabels.map((l: string) => (
                      <span key={l} style={{ fontSize: '0.725rem', padding: '2px 8px', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '4px', color: '#c084fc' }}>{l}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.05)', margin: 0 }} />

        {/* AI Profile Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#c084fc' }}>
            <Sparkles size={16} />
            <span>AI Career Summary</span>
          </div>
          <div style={{
            padding: '14px 18px',
            background: 'rgba(139, 92, 246, 0.02)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            {summarySentences.slice(0, 3).map((sentence, idx) => (
              <p key={idx} style={{ margin: idx === 2 ? '0' : '0 0 6px 0' }}>
                {sentence}
              </p>
            ))}
          </div>
        </div>

        {/* Career Recommendation Previews */}
        {previewRecommendations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <Cpu size={16} style={{ color: '#a855f7' }} />
              <span>Recommended Paths (Calibrating...)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {previewRecommendations.map((rec, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#10b981', fontWeight: 600 }}>
                    <span>{rec.title}</span>
                    <span>{rec.matchScore}%</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Setup Navigation Action buttons */}
      <NavigationButtons
        isFirstStep={false}
        isLastStep={true}
        isLoading={isLoading}
        onNext={onNext}
        onPrev={onPrev}
        nextText="Complete Setup"
      />
    </div>
  );
};
