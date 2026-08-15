import React from 'react';
import type { IBusinessProfile } from '../../types/business.types';
import {
  Lightbulb,
  Rocket,
  BookOpen,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Bookmark,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import styles from './BusinessHome.module.css';

interface BusinessHomeProps {
  profile: IBusinessProfile | null;
  userName: string;
  targetRole: string;
  discipline: string;
  verifiedSkills: string[];
  technicalSkills: string[];
  onOpenSetup: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const BusinessHome: React.FC<BusinessHomeProps> = ({
  profile,
  userName,
  targetRole,
  discipline,
  verifiedSkills,
  technicalSkills,
  onOpenSetup,
  onNavigateTab,
}) => {
  const isProfileConfigured = profile?.onboardingCompleted || (profile?.interestedIndustries && profile.interestedIndustries.length > 0);
  const savedIdeas = profile?.savedBusinessIdeas || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. Welcome & Context Banner */}
      <div className={styles.welcomeBanner}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Rocket size={18} style={{ color: '#818cf8' }} />
            <span style={{ fontSize: '0.82rem', color: '#c7d2fe', fontWeight: 600, textTransform: 'uppercase' }}>
              Visionix Entrepreneurship Hub
            </span>
          </div>
          <h2 className={styles.welcomeTitle}>
            Welcome, {userName || 'Entrepreneur'}!
          </h2>
          <p className={styles.welcomeText}>
            Explore scalable business concepts, evaluate startup opportunities, and transform your technical competencies
            in {discipline || targetRole || 'modern technologies'} into real-world ventures.
          </p>
        </div>

        <button
          onClick={onOpenSetup}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '10px 20px',
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
          {isProfileConfigured ? (
            <>
              <Edit3 size={15} /> Edit Business Profile
            </>
          ) : (
            <>
              <Rocket size={15} /> Configure Business Profile
            </>
          )}
        </button>
      </div>

      {/* 2. Business Profile Status Card */}
      <div className={styles.profileStatusCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: isProfileConfigured ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isProfileConfigured ? '#34d399' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isProfileConfigured ? <CheckCircle2 size={24} /> : <Rocket size={24} />}
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6' }}>
              {isProfileConfigured ? 'Entrepreneurship Profile Active' : 'Complete Your Entrepreneurship Profile'}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#9ca3af', marginTop: '2px' }}>
              {isProfileConfigured ? (
                <span>
                  Stage: <strong>{profile?.preferredStartupStage || 'Exploring'}</strong> • Experience:{' '}
                  <strong>{profile?.entrepreneurshipExperience || 'Exploring'}</strong> • Time:{' '}
                  <strong>{profile?.availableTime || '5-10 hrs/wk'}</strong>
                </span>
              ) : (
                'Set your target industries, stage, and available time to customize startup matches and tool recommendations.'
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSetup}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f3f4f6',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isProfileConfigured ? 'Update Settings' : 'Setup Profile'}
        </button>
      </div>

      {/* 3. Foundation Discovery Cards (4 Pillars) */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6', margin: '0 0 16px 0' }}>
          Explore Hub Pillars
        </h3>

        <div className={styles.discoveryGrid}>
          {/* Card 1: Business Ideas */}
          <div
            className={styles.discoveryCard}
            onClick={() => onNavigateTab('ideas')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                className={styles.cardIcon}
                style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
              >
                <Lightbulb size={22} />
              </div>
              <h4 className={styles.cardTitle}>Business Ideas Explorer</h4>
              <p className={styles.cardDesc}>
                Discover validated market opportunities, domain-specific startup blueprints, target audiences, and required tech stacks.
              </p>
            </div>
            <div className={styles.cardAction} style={{ color: '#818cf8' }}>
              Browse Ideas <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 2: Startup Opportunities */}
          <div
            className={styles.discoveryCard}
            onClick={() => onNavigateTab('opportunities')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                className={styles.cardIcon}
                style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}
              >
                <Rocket size={22} />
              </div>
              <h4 className={styles.cardTitle}>Startup Opportunities</h4>
              <p className={styles.cardDesc}>
                Explore grants, hackathons, incubator applications, founder competitions, and early-stage acceleration programs.
              </p>
            </div>
            <div className={styles.cardAction} style={{ color: '#60a5fa' }}>
              Explore Opportunities <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 3: Resources */}
          <div
            className={styles.discoveryCard}
            onClick={() => onNavigateTab('resources')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                className={styles.cardIcon}
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}
              >
                <BookOpen size={22} />
              </div>
              <h4 className={styles.cardTitle}>Founder Resources & Toolkits</h4>
              <p className={styles.cardDesc}>
                Access pitch deck templates, lean canvas frameworks, legal checklist guides, and validation templates.
              </p>
            </div>
            <div className={styles.cardAction} style={{ color: '#34d399' }}>
              View Toolkits <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 4: Startup Roadmap */}
          <div
            className={styles.discoveryCard}
            onClick={() => onNavigateTab('roadmap')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                className={styles.cardIcon}
                style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}
              >
                <Compass size={22} />
              </div>
              <h4 className={styles.cardTitle}>Startup Execution Roadmap</h4>
              <p className={styles.cardDesc}>
                Follow a step-by-step venture creation framework from problem discovery, MVP building, to launch and traction.
              </p>
            </div>
            <div className={styles.cardAction} style={{ color: '#fbbf24' }}>
              View Roadmap <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 5: AI Business Assistant */}
          <div
            className={styles.discoveryCard}
            onClick={() => onNavigateTab('assistant')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                className={styles.cardIcon}
                style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}
              >
                <Sparkles size={22} />
              </div>
              <h4 className={styles.cardTitle}>AI Business Assistant & Mentor</h4>
              <p className={styles.cardDesc}>
                Chat with an AI venture mentor for validation experiments, pitch deck generation, and milestone next steps.
              </p>
            </div>
            <div className={styles.cardAction} style={{ color: '#c084fc' }}>
              Open Assistant <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Skills & Verified Competencies Preview (Read-Only) */}
      <div className={styles.skillsPreviewCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: '0 0 2px 0' }}>
              Venture Skill Match Capabilities
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: 0 }}>
              Your verified competencies and technical profile background will be used to recommend relevant startup domains.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {verifiedSkills.map((vs, idx) => (
            <span key={idx} className={styles.verifiedBadge} title="Phase 12 Assessment-Verified Skill">
              <ShieldCheck size={13} /> {vs} (Verified)
            </span>
          ))}

          {technicalSkills
            .filter((ts) => !verifiedSkills.includes(ts))
            .slice(0, 8)
            .map((ts, idx) => (
              <span key={idx} className={styles.regularSkillBadge}>
                {ts}
              </span>
            ))}

          {verifiedSkills.length === 0 && technicalSkills.length === 0 && (
            <span style={{ fontSize: '0.84rem', color: '#9ca3af', fontStyle: 'italic' }}>
              No skills added to profile yet. Complete assessments in the Exams section or update your profile.
            </span>
          )}
        </div>
      </div>

      {/* 5. Saved Business Concepts Preview */}
      <div
        style={{
          background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
          border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
          borderRadius: '14px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bookmark size={18} style={{ color: '#818cf8' }} /> Saved Business Concepts ({savedIdeas.length})
          </h4>
        </div>

        {savedIdeas.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
            <p style={{ fontSize: '0.86rem', color: '#9ca3af', margin: 0 }}>
              You have not bookmarked any business ideas yet. Explore curated venture concepts in the Explorer to save them.
            </p>
            <button
              onClick={() => onNavigateTab('ideas')}
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              Explore Ideas Now <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {savedIdeas.map((idea: any, idx) => {
              const title = typeof idea === 'object' ? idea.title : `Idea #${idx + 1}`;
              const desc = typeof idea === 'object' ? idea.shortDescription : '';
              return (
                <div
                  key={idx}
                  onClick={() => onNavigateTab('ideas')}
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f3f4f6' }}>{title}</div>
                    {desc && <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{desc}</div>}
                  </div>
                  <ExternalLink size={14} style={{ color: '#818cf8' }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
