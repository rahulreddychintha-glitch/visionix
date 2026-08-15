import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Target,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { ICareerComparisonItem } from '../../types/skillNavigator.types';
import styles from './SkillNavigatorComponents.module.css';

interface CareerComparisonProps {
  comparisons: ICareerComparisonItem[];
  currentTargetCareerId: string;
  onSelectCareer: (careerId: string) => void;
}

export const CareerComparison: React.FC<CareerComparisonProps> = ({
  comparisons,
  currentTargetCareerId,
  onSelectCareer,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = Array.from(new Set(comparisons.map((c) => c.category))).filter(Boolean);

  const filtered = comparisons.filter((c) => {
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    if (search.trim() && !c.title.toLowerCase().includes(search.toLowerCase().trim())) {
      return false;
    }
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#6366f1';
    if (score >= 35) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.comparisonSection}>
      <div className={styles.comparisonHeaderRow}>
        <div>
          <h3 className={styles.sectionTitle}>Cross-Career Readiness Comparison</h3>
          <p className={styles.sectionSubtitle}>
            Evaluate how your current skill profile matches against different career paths in Visionix.
          </p>
        </div>

        {/* Filter controls */}
        <div className={styles.filterControlsRow}>
          <div className={styles.searchBoxWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search careers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.skillSearchInput}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by Career Category"
          >
            <option value="All">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyListNotice}>
          <span>No career matches found for &quot;{search}&quot;.</span>
        </div>
      ) : (
        <div className={styles.comparisonGrid}>
          {filtered.map((item, idx) => {
            const isCurrent = item.careerId === currentTargetCareerId;
            const scoreColor = getScoreColor(item.matchScore);

            return (
              <motion.div
                key={item.careerId + idx}
                className={`${styles.comparisonCard} ${isCurrent ? styles.comparisonCardActive : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.02 }}
              >
                <div className={styles.comparisonCardTop}>
                  <div>
                    <span className={styles.comparisonCategoryTag}>{item.category}</span>
                    <h4 className={styles.comparisonCareerTitle}>{item.title}</h4>
                  </div>
                  <div className={styles.comparisonScoreBadge} style={{ borderColor: scoreColor }}>
                    <span className={styles.comparisonScoreVal} style={{ color: scoreColor }}>
                      {item.matchScore}%
                    </span>
                    <span className={styles.comparisonScoreSub}>Match</span>
                  </div>
                </div>

                {/* Match Progress Bar */}
                <div className={styles.comparisonProgressBarBg}>
                  <div
                    className={styles.comparisonProgressBarFill}
                    style={{ width: `${item.matchScore}%`, background: scoreColor }}
                  />
                </div>

                {/* Metrics */}
                <div className={styles.comparisonStatsRow}>
                  <div className={styles.comparisonStatItem}>
                    <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                    <span>{item.strongSkillsCount} Matching Skills</span>
                  </div>
                  <div className={styles.comparisonStatItem}>
                    <AlertCircle size={13} style={{ color: '#f59e0b' }} />
                    <span>{item.missingSkillsCount} Gaps</span>
                  </div>
                </div>

                {item.topMissingSkill && (
                  <div className={styles.topGapRow}>
                    <span className={styles.topGapLabel}>Top Missing:</span>
                    <span className={styles.topGapValue}>{item.topMissingSkill}</span>
                  </div>
                )}

                <div className={styles.comparisonCardFooter}>
                  {isCurrent ? (
                    <span className={styles.currentActiveBadge}>
                      <Target size={13} />
                      <span>Current Target</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className={styles.switchCareerBtn}
                      onClick={() => onSelectCareer(item.careerId)}
                    >
                      <span>Analyze This Career</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
