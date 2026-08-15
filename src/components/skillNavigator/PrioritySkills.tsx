import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { IPrioritySkillItem } from '../../types/skillNavigator.types';
import styles from './SkillNavigatorComponents.module.css';

interface PrioritySkillsProps {
  prioritySkills: IPrioritySkillItem[];
}

export const PrioritySkills: React.FC<PrioritySkillsProps> = ({ prioritySkills }) => {
  const navigate = useNavigate();

  if (!prioritySkills || prioritySkills.length === 0) {
    return null;
  }

  return (
    <div className={styles.prioritySection}>
      <div className={styles.priorityHeaderRow}>
        <div className={styles.priorityTitleWrap}>
          <div className={styles.flameIconWrap}>
            <Flame size={18} />
          </div>
          <div>
            <h3 className={styles.sectionTitle}>Top Skills to Work On</h3>
            <p className={styles.sectionSubtitle}>
              Ranked by role criticality, skill dependency, and immediate career impact.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.priorityList}>
        {prioritySkills.map((item, idx) => (
          <motion.div
            key={item.skillName + idx}
            className={styles.priorityItemCard}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
          >
            <div className={styles.priorityRankBadge}>
              <span>#{idx + 1}</span>
            </div>

            <div className={styles.priorityItemInfo}>
              <div className={styles.priorityTitleRow}>
                <span className={styles.prioritySkillName}>{item.skillName}</span>
                <span
                  className={`${styles.priorityLevelBadge} ${
                    item.priority === 'High'
                      ? styles.priorityHigh
                      : item.priority === 'Medium'
                      ? styles.priorityMedium
                      : styles.priorityLow
                  }`}
                >
                  {item.priority} Priority
                </span>
                <span className={styles.priorityStatusPill}>{item.status}</span>
              </div>
              <p className={styles.priorityReasonText}>{item.reason}</p>
            </div>

            <div className={styles.priorityActionCol}>
              <button
                type="button"
                className={styles.priorityQuickBtn}
                onClick={() => navigate(item.actionRoute || '/courses')}
              >
                <span>{item.quickAction || 'Take Action'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
