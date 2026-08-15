import React, { useEffect } from 'react';
import type {
  IBusinessOpportunity,
  IBusinessOpportunityMatch,
} from '../../types/business.types';
import {
  X,
  Heart,
  Calendar,
  Globe,
  MapPin,
  Gift,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Wrench,
  Sparkles,
} from 'lucide-react';
import styles from './BusinessOpportunityDetails.module.css';

interface BusinessOpportunityDetailsProps {
  opportunity: IBusinessOpportunity;
  isSaved: boolean;
  matchResult: IBusinessOpportunityMatch;
  onClose: () => void;
  onSaveToggle: (id: string) => void;
}

export const BusinessOpportunityDetails: React.FC<BusinessOpportunityDetailsProps> = ({
  opportunity,
  isSaved,
  matchResult,
  onClose,
  onSaveToggle,
}) => {
  const {
    matchScore,
    matchingSkills,
    missingSkills,
    verifiedMatchingSkills,
    matchReasons,
    deadlineStatus,
    daysLeft,
  } = matchResult;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const regularMatchingSkills = matchingSkills.filter(
    (ms) => !verifiedMatchingSkills.some((vs) => vs.toLowerCase() === ms.toLowerCase())
  );

  const formattedDeadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'No fixed deadline';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* 1. Header Row */}
        <div className={styles.headerRow}>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.badge}>{opportunity.opportunityType.replace('_', ' ')}</span>
              <span className={styles.badge} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                {opportunity.category}
              </span>
              <span className={styles.badge} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                {opportunity.difficulty}
              </span>
              {opportunity.verifiedAt && (
                <span className={styles.badge} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  ✓ Verified Source
                </span>
              )}
            </div>

            <h2 className={styles.title}>{opportunity.title}</h2>
            <div className={styles.orgName}>Presented by {opportunity.organization}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => onSaveToggle(opportunity._id)}
              style={{
                background: isSaved ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isSaved ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.1)'}`,
                color: isSaved ? '#f87171' : '#d1d5db',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Heart size={15} fill={isSaved ? '#f87171' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close details">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 2. Personalized Match Overview */}
        <div className={styles.matchBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: matchScore >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                border: `1px solid ${matchScore >= 70 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: matchScore >= 70 ? '#34d399' : '#818cf8', lineHeight: 1 }}>
                {matchScore}%
              </span>
              <span style={{ fontSize: '0.62rem', color: '#9ca3af', textTransform: 'uppercase' }}>Match</span>
            </div>

            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '2px' }}>
                Why this opportunity aligns with your profile:
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.82rem', color: '#c7d2fe', lineHeight: 1.45 }}>
                {matchReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
            Status:{' '}
            <strong
              style={{
                color:
                  deadlineStatus === 'passed'
                    ? '#ef4444'
                    : deadlineStatus === 'closing_soon'
                    ? '#fbbf24'
                    : '#34d399',
              }}
            >
              {deadlineStatus === 'passed'
                ? 'Closed / Passed'
                : deadlineStatus === 'closing_soon'
                ? `Closes in ${daysLeft} days`
                : deadlineStatus === 'open'
                ? `Open (${daysLeft} days left)`
                : 'Open / Rolling'}
            </strong>
          </div>
        </div>

        {/* 3. Description */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Sparkles size={17} style={{ color: '#818cf8' }} /> Program Overview
          </h3>
          <p className={styles.sectionBody}>{opportunity.description}</p>
        </div>

        {/* 4. Key Parameters Grid */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <span style={{ fontSize: '0.74rem', color: '#9ca3af', textTransform: 'uppercase' }}>Application Deadline</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} style={{ color: '#818cf8' }} /> {formattedDeadline}
            </div>
          </div>

          <div className={styles.infoCard}>
            <span style={{ fontSize: '0.74rem', color: '#9ca3af', textTransform: 'uppercase' }}>Format & Location</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {opportunity.isOnline ? <Globe size={14} style={{ color: '#34d399' }} /> : <MapPin size={14} style={{ color: '#60a5fa' }} />}
              {opportunity.isOnline ? 'Online / Remote' : opportunity.location}
            </div>
          </div>

          <div className={styles.infoCard}>
            <span style={{ fontSize: '0.74rem', color: '#9ca3af', textTransform: 'uppercase' }}>Eligibility Level</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f3f4f6' }}>
              {opportunity.difficulty} Level
            </div>
          </div>

          {opportunity.officialWebsite && (
            <div className={styles.infoCard}>
              <span style={{ fontSize: '0.74rem', color: '#9ca3af', textTransform: 'uppercase' }}>Official Website</span>
              <a
                href={opportunity.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.84rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
              >
                <span>Visit Homepage</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* 5. Benefits & Grants */}
        {opportunity.benefits && opportunity.benefits.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Gift size={17} style={{ color: '#60a5fa' }} /> Benefits, Grants & Awards
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {opportunity.benefits.map((benefit, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    color: '#93c5fd',
                    fontSize: '0.82rem',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                >
                  ✓ {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 6. Eligibility Criteria */}
        {opportunity.eligibility && opportunity.eligibility.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <CheckCircle2 size={17} style={{ color: '#34d399' }} /> Eligibility Criteria
            </h3>
            <ul style={{ margin: 0, paddingLeft: '18px', color: '#d1d5db', fontSize: '0.88rem', lineHeight: 1.55 }}>
              {opportunity.eligibility.map((crit, idx) => (
                <li key={idx}>{crit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 7. Skills Breakdown */}
        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Wrench size={17} style={{ color: '#818cf8' }} /> Skills Breakdown
            </h3>

            <div className={styles.skillsCategorizedGrid}>
              {/* Verified Skills */}
              {verifiedMatchingSkills.length > 0 && (
                <div
                  className={styles.skillSubcard}
                  style={{ border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.06)' }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> Phase 12 Verified Skills
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {verifiedMatchingSkills.map((vs, idx) => (
                      <span key={idx} className={styles.skillTag} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                        ✓ {vs}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Matched Skills */}
              {regularMatchingSkills.length > 0 && (
                <div
                  className={styles.skillSubcard}
                  style={{ border: '1px solid rgba(99, 102, 241, 0.3)', background: 'rgba(99, 102, 241, 0.06)' }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Matched from Profile
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {regularMatchingSkills.map((ms, idx) => (
                      <span key={idx} className={styles.skillTag} style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#c7d2fe' }}>
                        {ms}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {missingSkills.length > 0 && (
                <div
                  className={styles.skillSubcard}
                  style={{ border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(15, 23, 42, 0.4)' }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
                    Target Skills to Build
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {missingSkills.map((mis, idx) => (
                      <span key={idx} className={styles.skillTag} style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#9ca3af' }}>
                        {mis}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. Bottom Action Row with Official Application Button */}
        <div className={styles.actionsFooter}>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            {opportunity.sourceName && (
              <span>
                Source: <strong>{opportunity.sourceName}</strong>
              </span>
            )}
          </div>

          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.applyBtn}
          >
            <span>Apply on Official Portal</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
