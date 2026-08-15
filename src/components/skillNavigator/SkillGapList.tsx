import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ISkillGapItem, SkillStatus, SkillPriority } from '../../types/skillNavigator.types';
import styles from './SkillNavigatorComponents.module.css';

interface SkillGapListProps {
  skillGaps: ISkillGapItem[];
}

export const SkillGapList: React.FC<SkillGapListProps> = ({ skillGaps }) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredGaps = skillGaps.filter((item) => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false;
    if (searchQuery.trim() && !item.skillName.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className={`${styles.statusBadge} ${styles.statusVerified}`}>
            <CheckCircle2 size={12} />
            <span>Verified</span>
          </span>
        );
      case 'Strong':
        return (
          <span className={`${styles.statusBadge} ${styles.statusStrong}`}>
            <CheckCircle2 size={12} />
            <span>Strong</span>
          </span>
        );
      case 'Developing':
        return (
          <span className={`${styles.statusBadge} ${styles.statusDeveloping}`}>
            <Clock size={12} />
            <span>Developing</span>
          </span>
        );
      case 'Needs Improvement':
        return (
          <span className={`${styles.statusBadge} ${styles.statusNeedsImprovement}`}>
            <AlertCircle size={12} />
            <span>Needs Practice</span>
          </span>
        );
      case 'Missing':
      default:
        return (
          <span className={`${styles.statusBadge} ${styles.statusMissing}`}>
            <AlertCircle size={12} />
            <span>Missing</span>
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: SkillPriority) => {
    switch (priority) {
      case 'High':
        return <span className={`${styles.priorityBadge} ${styles.priorityHigh}`}>High Priority</span>;
      case 'Medium':
        return <span className={`${styles.priorityBadge} ${styles.priorityMedium}`}>Medium Priority</span>;
      case 'Low':
      default:
        return <span className={`${styles.priorityBadge} ${styles.priorityLow}`}>Low Priority</span>;
    }
  };

  const getActionButton = (item: ISkillGapItem) => {
    if (item.status === 'Verified') {
      return (
        <button
          type="button"
          className={`${styles.gapActionBtn} ${styles.gapActionBtnSuccess}`}
          onClick={() => navigate('/interview')}
        >
          <span>Practice in Interview</span>
          <ArrowRight size={13} />
        </button>
      );
    }

    if (item.status === 'Strong') {
      return (
        <button
          type="button"
          className={`${styles.gapActionBtn} ${styles.gapActionBtnPrimary}`}
          onClick={() => navigate('/exams')}
        >
          <span>Take Assessment</span>
          <ArrowRight size={13} />
        </button>
      );
    }

    if (item.status === 'Developing') {
      return (
        <button
          type="button"
          className={`${styles.gapActionBtn} ${styles.gapActionBtnAmber}`}
          onClick={() => navigate('/roadmap')}
        >
          <span>Continue Roadmap</span>
          <ArrowRight size={13} />
        </button>
      );
    }

    // Missing skill
    return (
      <button
        type="button"
        className={`${styles.gapActionBtn} ${styles.gapActionBtnPrimary}`}
        onClick={() => navigate('/courses')}
      >
        <span>View Learning Resource</span>
        <ArrowRight size={13} />
      </button>
    );
  };

  return (
    <div className={styles.skillGapListSection}>
      <div className={styles.listHeaderRow}>
        <div>
          <h3 className={styles.sectionTitle}>Skill Gap Analysis</h3>
          <p className={styles.sectionSubtitle}>
            Detailed evaluation of required skills, your current level, and actionable next steps.
          </p>
        </div>

        {/* Filter controls */}
        <div className={styles.filterControlsRow}>
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.skillSearchInput}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by Status"
          >
            <option value="All">All Statuses</option>
            <option value="Missing">Missing</option>
            <option value="Developing">Developing</option>
            <option value="Strong">Strong</option>
            <option value="Verified">Verified</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by Priority"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {filteredGaps.length === 0 ? (
        <div className={styles.emptyListNotice}>
          <span>No skills match the selected filter criteria.</span>
        </div>
      ) : (
        <div className={styles.gapCardsGrid}>
          {filteredGaps.map((item, idx) => (
            <motion.div
              key={item.skillName + idx}
              className={styles.gapCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
            >
              <div className={styles.gapCardHeader}>
                <div className={styles.gapCardTitleWrap}>
                  <span className={styles.gapSkillName}>{item.skillName}</span>
                  {item.isVerified && (
                    <span className={styles.miniVerifiedCheck} title="Verified in Phase 12 Assessment">
                      <ShieldCheck size={14} />
                    </span>
                  )}
                </div>
                <div className={styles.gapBadgesWrap}>
                  {getStatusBadge(item.status)}
                  {getPriorityBadge(item.priority)}
                </div>
              </div>

              {/* Levels Row */}
              <div className={styles.levelsRow}>
                <div className={styles.levelCol}>
                  <span className={styles.levelLabel}>Current Status:</span>
                  <span className={styles.levelValue}>{item.currentLevel}</span>
                </div>
                <div className={styles.levelCol}>
                  <span className={styles.levelLabel}>Target Standard:</span>
                  <span className={styles.levelValue}>{item.requiredLevel}</span>
                </div>
              </div>

              {/* Why it matters */}
              <p className={styles.whyItMattersText}>{item.whyItMatters}</p>

              {/* Action row */}
              <div className={styles.gapCardFooter}>
                <span className={styles.nextStepHint}>Next Step: {item.recommendedAction}</span>
                <div className={styles.gapActionWrapper}>{getActionButton(item)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
