import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Clock, Layers } from 'lucide-react';
import type { ISkillGapAnalysis } from '../../types/skillNavigator.types';
import styles from './SkillNavigatorComponents.module.css';

interface SkillOverviewProps {
  analysis: ISkillGapAnalysis;
}

export const SkillOverview: React.FC<SkillOverviewProps> = ({ analysis }) => {
  const total = analysis.requiredSkillsCount || 1;
  const verifiedAndStrong = analysis.strongSkillsCount || 0;
  const developing = analysis.developingSkillsCount || 0;
  const missing = analysis.missingSkillsCount || 0;

  const verifiedPercent = Math.round((verifiedAndStrong / total) * 100);
  const developingPercent = Math.round((developing / total) * 100);
  const missingPercent = Math.max(0, 100 - verifiedPercent - developingPercent);

  return (
    <div className={styles.overviewSection}>
      <div className={styles.overviewCardsGrid}>
        {/* Total Required */}
        <motion.div
          className={styles.overviewMetricCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.metricIconWrap} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Layers size={18} />
          </div>
          <div className={styles.metricDetails}>
            <span className={styles.metricNumber}>{total}</span>
            <span className={styles.metricLabel}>Required Skills</span>
          </div>
        </motion.div>

        {/* Strong / Verified */}
        <motion.div
          className={styles.overviewMetricCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className={styles.metricIconWrap} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={18} />
          </div>
          <div className={styles.metricDetails}>
            <span className={styles.metricNumber}>{verifiedAndStrong}</span>
            <span className={styles.metricLabel}>Strong & Verified</span>
          </div>
        </motion.div>

        {/* Developing */}
        <motion.div
          className={styles.overviewMetricCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className={styles.metricIconWrap} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Clock size={18} />
          </div>
          <div className={styles.metricDetails}>
            <span className={styles.metricNumber}>{developing}</span>
            <span className={styles.metricLabel}>In Development</span>
          </div>
        </motion.div>

        {/* Missing */}
        <motion.div
          className={styles.overviewMetricCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className={styles.metricIconWrap} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
            <ShieldAlert size={18} />
          </div>
          <div className={styles.metricDetails}>
            <span className={styles.metricNumber}>{missing}</span>
            <span className={styles.metricLabel}>Missing Gaps</span>
          </div>
        </motion.div>
      </div>

      {/* Progress Composition Bar */}
      <div className={styles.distributionBarWrapper}>
        <div className={styles.distributionLabels}>
          <span className={styles.distributionTitle}>Skill Coverage Composition</span>
          <div className={styles.legendRow}>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#10b981' }} />
              Strong ({verifiedPercent}%)
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#f59e0b' }} />
              Developing ({developingPercent}%)
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#ef4444' }} />
              Missing ({missingPercent}%)
            </span>
          </div>
        </div>

        <div className={styles.multiProgressBar}>
          <div
            className={styles.progressSegment}
            style={{ width: `${verifiedPercent}%`, background: 'linear-gradient(90deg, #059669, #10b981)' }}
            title={`Strong & Verified: ${verifiedPercent}%`}
          />
          <div
            className={styles.progressSegment}
            style={{ width: `${developingPercent}%`, background: 'linear-gradient(90deg, #d97706, #f59e0b)' }}
            title={`Developing: ${developingPercent}%`}
          />
          <div
            className={styles.progressSegment}
            style={{ width: `${missingPercent}%`, background: 'linear-gradient(90deg, #dc2626, #ef4444)' }}
            title={`Missing: ${missingPercent}%`}
          />
        </div>
      </div>
    </div>
  );
};
