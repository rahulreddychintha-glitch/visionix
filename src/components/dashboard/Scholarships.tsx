import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, ArrowUpRight } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

interface Scholarship {
  name: string;
  organization: string;
  amount: string;
  deadline: string;
}

interface ScholarshipsProps {
  scholarships?: Scholarship[];
}

const DEFAULT_SCHOLARSHIPS: Scholarship[] = [
  {
    name: 'Google AI Research Fellowship',
    organization: 'Google Research',
    amount: '$15,000 Award',
    deadline: 'Apply by Aug 30'
  },
  {
    name: 'Figma Design Creator Grant',
    organization: 'Figma Community',
    amount: '$8,000 Award',
    deadline: 'Apply by Sep 15'
  }
];

export const Scholarships: React.FC<ScholarshipsProps> = ({
  scholarships = DEFAULT_SCHOLARSHIPS
}) => {
  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="text-subheading">Scholarships</h3>
          <p className="text-caption" style={{ marginTop: '2px' }}>Funding & financial rewards</p>
        </div>
        <Landmark size={16} style={{ color: 'var(--color-primary)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {scholarships.map((sch) => (
          <div 
            key={sch.name}
            className={styles.interactiveListItem}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <span className="text-description" style={{ fontSize: '0.775rem', fontWeight: 650, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {sch.name}
              </span>
              <ArrowUpRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-muted)' }}>
              <span>{sch.organization}</span>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{sch.amount}</span>
            </div>

            <span className="text-caption" style={{ fontSize: '0.65rem', marginTop: '2px' }}>
              {sch.deadline}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
