import React from 'react';
import type { IBusinessIdea, ISkillMatchResult } from '../../types/business.types';
import {
  Heart,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import styles from './BusinessIdeaCard.module.css';

interface BusinessIdeaCardProps {
  idea: IBusinessIdea;
  isSaved: boolean;
  matchResult: ISkillMatchResult;
  onSaveToggle: (ideaId: string) => void;
  onViewDetails: (idea: IBusinessIdea) => void;
}

export const BusinessIdeaCard: React.FC<BusinessIdeaCardProps> = ({
  idea,
  isSaved,
  matchResult,
  onSaveToggle,
  onViewDetails,
}) => {
  const { matchScore, matchingSkills, verifiedMatchingSkills } = matchResult;

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#818cf8';
  };

  const scoreColor = getScoreColor(matchScore);

  return (
    <div className={styles.card}>
      <div>
        {/* Header & Match Badge */}
        <div className={styles.header}>
          <div className={styles.metaRow}>
            <span className={styles.badge}>{idea.category}</span>
            <span className={styles.difficultyBadge}>{idea.difficulty}</span>
            <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{idea.businessModel}</span>
          </div>

          <div
            className={styles.matchScoreBadge}
            style={{
              background: `${scoreColor}18`,
              border: `1px solid ${scoreColor}44`,
              color: scoreColor,
            }}
            title="Personalized venture match based on your skills, industry, and entrepreneurship goals."
          >
            <TrendingUp size={12} />
            <span>{matchScore}% Match</span>
          </div>
        </div>

        {/* Title */}
        <h3 className={styles.title}>{idea.title}</h3>

        {/* Description */}
        <p className={styles.desc}>{idea.shortDescription}</p>

        {/* Startup Potential & Target Market */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px', fontSize: '0.78rem', color: '#9ca3af' }}>
          <span>Potential: <strong style={{ color: '#f3f4f6' }}>{idea.startupPotential}</strong></span>
          <span>•</span>
          <span>Industry: <strong style={{ color: '#f3f4f6' }}>{idea.industry}</strong></span>
        </div>
      </div>

      {/* Required Skills & Matches */}
      <div>
        <div className={styles.skillsContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.skillsLabel}>Key Tech & Domain Skills</span>
            <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
              {matchingSkills.length}/{idea.requiredSkills?.length || 0} matched
            </span>
          </div>

          <div className={styles.skillsList}>
            {(idea.requiredSkills || []).slice(0, 5).map((skill, idx) => {
              const isVerified = verifiedMatchingSkills.some((vs) => vs.toLowerCase() === skill.toLowerCase());
              const isMatched = matchingSkills.some((ms) => ms.toLowerCase() === skill.toLowerCase());

              if (isVerified) {
                return (
                  <span key={idx} className={`${styles.skillChip} ${styles.skillChipVerified}`}>
                    <ShieldCheck size={11} /> {skill}
                  </span>
                );
              }

              if (isMatched) {
                return (
                  <span key={idx} className={`${styles.skillChip} ${styles.skillChipMatched}`}>
                    ✓ {skill}
                  </span>
                );
              }

              return (
                <span key={idx} className={styles.skillChip}>
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.saveBtn} ${isSaved ? styles.saveBtnActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle(idea._id);
            }}
            title={isSaved ? 'Remove from saved ideas' : 'Save business idea for later'}
          >
            <Heart size={14} fill={isSaved ? '#f87171' : 'none'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            className={styles.detailsBtn}
            onClick={() => onViewDetails(idea)}
          >
            <span>View Blueprint</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
