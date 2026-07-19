import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, ArrowUpRight } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

import type { ScholarshipData } from '../../types/dashboard.types';

interface ScholarshipsProps {
  scholarships?: ScholarshipData[];
}

const DEFAULT_SCHOLARSHIPS: ScholarshipData[] = [
  {
    name: 'Google AI Research Fellowship',
    provider: 'Google Research',
    amount: '$15,000 Award',
    deadline: 'Apply by Aug 30',
    eligibility: 'Graduate Students in CS/AI',
    link: 'https://research.google/outreach/fellowship/'
  },
  {
    name: 'Figma Design Creator Grant',
    provider: 'Figma Community',
    amount: '$8,000 Award',
    deadline: 'Apply by Sep 15',
    eligibility: 'Undergraduate Design Students',
    link: 'https://www.figma.com/grants/'
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
          <a 
            key={sch.name}
            href={sch.link}
            target="_blank"
            rel="noopener noreferrer"
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
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <span className="text-description" style={{ fontSize: '0.775rem', fontWeight: 650, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {sch.name}
              </span>
              <ArrowUpRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-muted)' }}>
              <span>{sch.provider}</span>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{sch.amount}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              <span>Eligible: {sch.eligibility}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{sch.deadline}</span>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
};
