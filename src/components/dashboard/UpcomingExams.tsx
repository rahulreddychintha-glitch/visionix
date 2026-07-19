import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

interface Exam {
  name: string;
  date: string;
  daysRemaining: number;
  status: string;
  statusColor: string;
}

interface UpcomingExamsProps {
  exams?: Exam[];
}

const DEFAULT_EXAMS: Exam[] = [
  {
    name: 'AWS Certified Machine Learning',
    date: 'Oct 12, 2026',
    daysRemaining: 3,
    status: 'Registered',
    statusColor: 'var(--color-primary)'
  },
  {
    name: 'Python Advanced Coding Challenge',
    date: 'Nov 02, 2026',
    daysRemaining: 24,
    status: 'Scheduled',
    statusColor: 'var(--color-accent)'
  }
];

export const UpcomingExams: React.FC<UpcomingExamsProps> = ({
  exams = DEFAULT_EXAMS
}) => {
  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="text-subheading">Upcoming Exams</h3>
          <p className="text-caption" style={{ marginTop: '2px' }}>Track your certification schedules</p>
        </div>
        <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {exams.map((exam) => (
          <div 
            key={exam.name}
            className={styles.interactiveListItem}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <span className="text-description" style={{ fontSize: '0.8rem', fontWeight: 650, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {exam.name}
              </span>
              <span 
                style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  background: `rgba(255, 255, 255, 0.02)`,
                  border: `1px solid ${exam.statusColor}`,
                  color: exam.statusColor,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap'
                }}
              >
                {exam.status}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                <span>{exam.date}</span>
              </div>
              <span style={{ fontWeight: 600, color: exam.daysRemaining <= 5 ? '#f43f5e' : 'var(--text-secondary)' }}>
                {exam.daysRemaining} days left
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
