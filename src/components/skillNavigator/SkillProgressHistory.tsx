import React from 'react';
import { motion } from 'framer-motion';
import { History, Calendar } from 'lucide-react';
import type { ISkillGapAnalysis } from '../../types/skillNavigator.types';
import styles from './SkillNavigatorComponents.module.css';

interface SkillProgressHistoryProps {
  history: ISkillGapAnalysis[];
  onSelectHistoricalAnalysis?: (analysis: ISkillGapAnalysis) => void;
}

export const SkillProgressHistory: React.FC<SkillProgressHistoryProps> = ({
  history,
}) => {
  if (!history || history.length === 0) {
    return (
      <div className={styles.emptyHistoryCard}>
        <History size={24} className={styles.emptyIcon} />
        <h4 className={styles.emptyTitle}>No Analysis History Yet</h4>
        <p className={styles.emptyDesc}>
          Every time you analyze a career or recalculate your readiness, a historical record is saved so you can track your growth.
        </p>
      </div>
    );
  }

  const getScoreColor = (val: number) => {
    if (val >= 80) return '#10b981';
    if (val >= 60) return '#6366f1';
    if (val >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.historySection}>
      <div className={styles.historyHeaderRow}>
        <div className={styles.historyTitleWrap}>
          <History size={18} />
          <div>
            <h3 className={styles.sectionTitle}>Skill Readiness History</h3>
            <p className={styles.sectionSubtitle}>
              Track how your skills, readiness score, and career alignment evolve over time.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.historyTimeline}>
        {history.map((record, idx) => {
          const scoreColor = getScoreColor(record.readinessScore);
          const dateStr = new Date(record.createdAt || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <motion.div
              key={record._id || idx}
              className={styles.historyTimelineItem}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
            >
              <div className={styles.timelineNode} style={{ borderColor: scoreColor }} />

              <div className={styles.historyCard}>
                <div className={styles.historyCardTop}>
                  <div className={styles.historyCareerCol}>
                    <div className={styles.historyDateRow}>
                      <Calendar size={13} />
                      <span>{dateStr}</span>
                    </div>
                    <h4 className={styles.historyCareerTitle}>{record.targetCareerTitle}</h4>
                    <span className={styles.historyCategoryBadge}>{record.targetCategory}</span>
                  </div>

                  <div className={styles.historyScoreBox} style={{ borderColor: scoreColor }}>
                    <span className={styles.historyScoreVal} style={{ color: scoreColor }}>
                      {record.readinessScore}%
                    </span>
                    <span className={styles.historyScoreLabel}>Readiness</span>
                  </div>
                </div>

                <div className={styles.historyStatsSummary}>
                  <span>
                    <strong>{record.strongSkillsCount}</strong> Strong / Verified
                  </span>
                  <span>•</span>
                  <span>
                    <strong>{record.developingSkillsCount}</strong> Developing
                  </span>
                  <span>•</span>
                  <span>
                    <strong>{record.missingSkillsCount}</strong> Missing Gaps
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
