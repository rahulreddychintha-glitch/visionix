import React, { useEffect } from 'react';
import type { IBusinessIdea, ISkillMatchResult } from '../../types/business.types';
import {
  X,
  Heart,
  AlertTriangle,
  Lightbulb,
  Users,
  Briefcase,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import styles from './BusinessIdeaDetails.module.css';

interface BusinessIdeaDetailsProps {
  idea: IBusinessIdea;
  isSaved: boolean;
  matchResult: ISkillMatchResult;
  onClose: () => void;
  onSaveToggle: (ideaId: string) => void;
  onBuildStartup?: (idea: IBusinessIdea) => void;
}

export const BusinessIdeaDetails: React.FC<BusinessIdeaDetailsProps> = ({
  idea,
  isSaved,
  matchResult,
  onClose,
  onSaveToggle,
  onBuildStartup,
}) => {
  const {
    matchScore,
    matchingSkills,
    missingSkills,
    verifiedMatchingSkills,
    matchReasons,
  } = matchResult;

  // Close on Escape key press
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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* 1. Header & Quick Actions */}
        <div className={styles.headerRow}>
          <div>
            <div className={styles.metaRow} style={{ marginBottom: '8px' }}>
              <span className={styles.badge}>{idea.category}</span>
              <span className={styles.badge} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                {idea.industry}
              </span>
              <span className={styles.badge} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                {idea.difficulty}
              </span>
              <span style={{ fontSize: '0.76rem', color: '#9ca3af' }}>
                Model: <strong>{idea.businessModel}</strong>
              </span>
            </div>

            <h2 className={styles.title}>{idea.title}</h2>
            <p style={{ fontSize: '0.92rem', color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
              {idea.shortDescription}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onBuildStartup && (
              <button
                type="button"
                onClick={() => {
                  onBuildStartup(idea);
                  onClose();
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                }}
              >
                <span>Build This Startup</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onSaveToggle(idea._id)}
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

        {/* 2. Personalized Match Breakdown Banner */}
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
                Why this opportunity matches you:
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.82rem', color: '#c7d2fe', lineHeight: 1.45 }}>
                {matchReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
            Potential: <strong style={{ color: '#f3f4f6' }}>{idea.startupPotential}</strong> • Complexity:{' '}
            <strong style={{ color: '#f3f4f6' }}>{idea.estimatedComplexity}</strong>
          </div>
        </div>

        {/* 3. The Problem Section */}
        <div className={styles.blueprintSection}>
          <h3 className={styles.sectionTitle}>
            <AlertTriangle size={17} style={{ color: '#fbbf24' }} /> The Market Problem
          </h3>
          <p className={styles.sectionBody}>{idea.problem}</p>
        </div>

        {/* 4. The Solution Section */}
        <div className={styles.blueprintSection}>
          <h3 className={styles.sectionTitle}>
            <Lightbulb size={17} style={{ color: '#34d399' }} /> The Proposed Solution
          </h3>
          <p className={styles.sectionBody}>{idea.solution}</p>
        </div>

        {/* 5. Target Audience */}
        {idea.targetAudience && idea.targetAudience.length > 0 && (
          <div className={styles.blueprintSection}>
            <h3 className={styles.sectionTitle}>
              <Users size={17} style={{ color: '#60a5fa' }} /> Target Customers & Users
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              {idea.targetAudience.map((aud, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    color: '#93c5fd',
                    fontSize: '0.82rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {aud}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 6. Business Model & Execution Architecture */}
        <div className={styles.blueprintSection}>
          <h3 className={styles.sectionTitle}>
            <Briefcase size={17} style={{ color: '#a78bfa' }} /> Business Model & Architecture
          </h3>
          <p className={styles.sectionBody}>{idea.description}</p>
        </div>

        {/* 7. Skills You'll Need */}
        <div className={styles.blueprintSection}>
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
                  <ShieldCheck size={14} /> Verified in Phase 12
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
                  Additional Skills to Acquire
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

        {/* 8. Persisted Resources (if any) */}
        {idea.resources && idea.resources.length > 0 && (
          <div className={styles.blueprintSection}>
            <h3 className={styles.sectionTitle}>
              <BookOpen size={17} style={{ color: '#38bdf8' }} /> Recommended Resources & Frameworks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {idea.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#f3f4f6',
                    textDecoration: 'none',
                    fontSize: '0.86rem',
                  }}
                >
                  <span>{res.title}</span>
                  <ExternalLink size={14} style={{ color: '#818cf8' }} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 9. Source Link (if any) */}
        {idea.source && idea.sourceUrl && (
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
            Reference Source:{' '}
            <a
              href={idea.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#818cf8', textDecoration: 'underline' }}
            >
              {idea.source}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
