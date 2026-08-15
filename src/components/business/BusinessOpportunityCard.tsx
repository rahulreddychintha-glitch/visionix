import React from 'react';
import type {
  IBusinessOpportunity,
  IBusinessOpportunityMatch,
} from '../../types/business.types';
import {
  Heart,
  ArrowRight,
  TrendingUp,
  Clock,
  Globe,
  MapPin,
  Gift,
  ShieldCheck,
} from 'lucide-react';
import styles from './BusinessOpportunityCard.module.css';

interface BusinessOpportunityCardProps {
  opportunity: IBusinessOpportunity;
  isSaved: boolean;
  matchResult: IBusinessOpportunityMatch;
  onSaveToggle: (id: string) => void;
  onViewDetails: (opportunity: IBusinessOpportunity) => void;
}

export const BusinessOpportunityCard: React.FC<BusinessOpportunityCardProps> = ({
  opportunity,
  isSaved,
  matchResult,
  onSaveToggle,
  onViewDetails,
}) => {
  const { matchScore, deadlineStatus, daysLeft, verifiedMatchingSkills } = matchResult;

  const renderDeadline = () => {
    if (deadlineStatus === 'passed') {
      return <span className={`${styles.deadlineBadge} ${styles.deadlinePassed}`}><Clock size={11} /> Deadline Passed</span>;
    }
    if (deadlineStatus === 'closing_soon') {
      return (
        <span className={`${styles.deadlineBadge} ${styles.deadlineClosingSoon}`}>
          <Clock size={11} /> {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
        </span>
      );
    }
    if (deadlineStatus === 'open' && daysLeft !== null) {
      return (
        <span className={`${styles.deadlineBadge} ${styles.deadlineOpen}`}>
          <Clock size={11} /> {daysLeft} days left
        </span>
      );
    }
    return <span className={`${styles.deadlineBadge} ${styles.deadlineNoDate}`}><Clock size={11} /> Open / Rolling</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#818cf8';
  };

  const scoreColor = getScoreColor(matchScore);

  return (
    <div className={styles.card}>
      <div>
        {/* Top Meta Bar */}
        <div className={styles.header}>
          <div className={styles.metaRow}>
            <span className={styles.typeBadge}>
              {opportunity.opportunityType.replace('_', ' ')}
            </span>
            {renderDeadline()}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              background: `${scoreColor}18`,
              border: `1px solid ${scoreColor}44`,
              color: scoreColor,
              fontSize: '0.74rem',
              fontWeight: 800,
            }}
            title="Personalized opportunity match rating"
          >
            <TrendingUp size={11} />
            <span>{matchScore}%</span>
          </div>
        </div>

        {/* Title & Organization */}
        <h3 className={styles.title}>{opportunity.title}</h3>
        <div className={styles.orgName}>{opportunity.organization}</div>

        {/* Category & Location */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '8px' }}>
          <span>{opportunity.category}</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {opportunity.isOnline ? <Globe size={11} /> : <MapPin size={11} />}
            {opportunity.location || (opportunity.isOnline ? 'Online' : 'In-Person')}
          </span>
        </div>

        {/* Short Description */}
        <p className={styles.desc}>{opportunity.description}</p>

        {/* Benefits Preview */}
        {opportunity.benefits && opportunity.benefits.length > 0 && (
          <div className={styles.benefitsRow}>
            {opportunity.benefits.slice(0, 2).map((benefit, idx) => (
              <span key={idx} className={styles.benefitChip}>
                <Gift size={11} /> {benefit}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Verified Skills highlight & Actions */}
      <div>
        {verifiedMatchingSkills.length > 0 && (
          <div
            style={{
              fontSize: '0.74rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '10px',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={12} /> {verifiedMatchingSkills.length} Phase 12 verified skill{verifiedMatchingSkills.length > 1 ? 's' : ''} matched
          </div>
        )}

        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.saveBtn} ${isSaved ? styles.saveBtnActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle(opportunity._id);
            }}
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
          >
            <Heart size={14} fill={isSaved ? '#f87171' : 'none'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            className={styles.detailsBtn}
            onClick={() => onViewDetails(opportunity)}
          >
            <span>View Details</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
