import React from 'react';
import { motion } from 'framer-motion';
import { Compass, TrendingUp } from 'lucide-react';
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
    title: 'Senior Product Designer',
    growth: '+18% Growth',
    matchScore: 92
  },
  {
    title: 'Growth Product Manager',
    growth: '+22% Growth',
    matchScore: 88
  }
];

export const TrendingCareers: React.FC<TrendingCareersProps> = ({
  careers = DEFAULT_CAREERS
}) => {
  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="text-subheading">Trending Careers</h3>
          <p className="text-caption" style={{ marginTop: '2px' }}>High-growth roles matching interests</p>
        </div>
        <Compass size={16} style={{ color: 'var(--color-primary)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {careers.map((role) => (
          <div 
            key={role.title}
            className={styles.interactiveListItem}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <span className="text-description" style={{ fontSize: '0.8rem', fontWeight: 650, color: 'var(--text-primary)' }}>
                {role.title}
              </span>
              <span 
                style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 750, 
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap'
                }}
              >
                {role.growth}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} style={{ color: 'var(--color-primary)' }} />
                <span>Market Growth Track</span>
              </span>
              <span style={{ fontWeight: 650, color: 'var(--text-secondary)' }}>
                {role.matchScore}% Match
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
