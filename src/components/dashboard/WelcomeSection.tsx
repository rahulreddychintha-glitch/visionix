import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

interface WelcomeSectionProps {
  fullName: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ fullName }) => {
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const firstName = fullName.split(' ')[0] || 'Rahul';

  return (
    <motion.div 
      className={styles.welcomeSection}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        <div>
          <h1 className={styles.welcomeTitle} style={{ fontSize: '2.1rem' }}>
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className={styles.welcomeSubtitle} style={{ marginTop: '6px' }}>
            {formatDate()}
          </p>
        </div>

        {/* Career Assistant Active Indicator badge */}
        <motion.div 
          className={styles.assistantBadge}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span 
            className={styles.pulsingBadgeDot}
            animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <Sparkles size={13} style={{ color: '#c084fc' }} />
          <span>Career Assistant Active</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
