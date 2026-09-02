import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, TrendingUp, ArrowRight } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

interface Career {
  title: string;
  growth: string;
  matchScore: number;
}

interface TrendingCareersProps {
  careers?: Career[];
}

const DEFAULT_CAREERS: Career[] = [
  {
    title: 'AI Solutions Architect & ML Lead',
    growth: '+38% Growth',
    matchScore: 94
  },
  {
    title: 'Full-Stack Distributed Systems Engineer',
    growth: '+28% Growth',
    matchScore: 89
  }
];

export const TrendingCareers: React.FC<TrendingCareersProps> = ({
  careers = DEFAULT_CAREERS
}) => {
  const navigate = useNavigate();
  const activeCareers = careers.length > 0 ? careers : DEFAULT_CAREERS;

  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '18px 20px',
        boxSizing: 'border-box'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 className="text-subheading" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Trending Careers</h3>
            <p className="text-caption" style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>High-growth roles matching interests</p>
          </div>
          <Compass size={16} style={{ color: 'var(--color-primary)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activeCareers.map((role) => (
            <div 
              key={role.title}
              onClick={() => navigate('/explore')}
              className={styles.interactiveListItem}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '8px 10px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.035)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {role.title}
                </span>
                <span 
                  style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {role.growth}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={11} style={{ color: '#60a5fa' }} />
                  <span>High Market Demand</span>
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {role.matchScore}% Match
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/explore')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '14px',
          padding: '8px 14px',
          borderRadius: '8px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.22)',
          color: '#c084fc',
          fontSize: '0.78rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.18)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.22)';
        }}
      >
        Explore Career Catalog <ArrowRight size={13} />
      </button>
    </motion.div>
  );
};
