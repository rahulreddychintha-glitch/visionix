import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  RefreshCw,
  Zap,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  Compass,
} from 'lucide-react';
import type { ISkillGapAnalysis } from '../../types/skillNavigator.types';
import styles from './SkillNavigatorComponents.module.css';

interface SkillNavigatorHeroProps {
  analysis: ISkillGapAnalysis;
  onSelectCareer: (careerId: string) => void;
  onRecalculate: (includeAi: boolean) => void;
  isAnalyzing: boolean;
  availableCareers: Array<{ id: string; title: string; category: string }>;
}

export const SkillNavigatorHero: React.FC<SkillNavigatorHeroProps> = ({
  analysis,
  onSelectCareer,
  onRecalculate,
  isAnalyzing,
  availableCareers,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const score = analysis.readinessScore || 0;

  // Calculate circular SVG progress
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 80) return '#10b981'; // emerald
    if (val >= 60) return '#6366f1'; // indigo
    if (val >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // rose
  };

  const scoreColor = getScoreColor(score);

  return (
    <motion.div
      className={styles.heroCard}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.heroBackgroundGlow} />

      <div className={styles.heroContent}>
        {/* Left: Career Target & Description */}
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <Compass size={14} />
            <span>AI Skill Gap & Next-Step Planner</span>
          </div>

          <div className={styles.careerTitleRow}>
            <span className={styles.targetLabel}>Target Career Path:</span>
            <div className={styles.careerSelectorWrapper}>
              <button
                type="button"
                className={styles.careerSelectorButton}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isAnalyzing}
                aria-label="Select Target Career"
              >
                <Target size={18} className={styles.careerIcon} />
                <span className={styles.careerTitleText}>{analysis.targetCareerTitle}</span>
                <span className={styles.careerCategoryTag}>{analysis.targetCategory}</span>
                <ChevronDown
                  size={16}
                  className={`${styles.dropdownChevron} ${isDropdownOpen ? styles.dropdownChevronOpen : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className={styles.careerDropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <span>Choose Career to Analyze ({availableCareers.length} Careers)</span>
                  </div>
                  <div className={styles.dropdownList}>
                    {availableCareers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`${styles.dropdownItem} ${
                          c.id === analysis.targetCareerId ? styles.dropdownItemActive : ''
                        }`}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          if (c.id !== analysis.targetCareerId) {
                            onSelectCareer(c.id);
                          }
                        }}
                      >
                        <span className={styles.dropdownItemTitle}>{c.title}</span>
                        <span className={styles.dropdownItemCategory}>{c.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className={styles.heroSummary}>
            {analysis.aiAnalysis?.summary ||
              `Based on your current verified competencies and profile skills, your profile covers ${score}% of the industry requirements for ${analysis.targetCareerTitle}. Follow your personalized next steps below to bridge key gaps.`}
          </p>

          <div className={styles.heroActionRow}>
            <button
              type="button"
              className={styles.recalculateButton}
              onClick={() => onRecalculate(true)}
              disabled={isAnalyzing}
            >
              <RefreshCw size={15} className={isAnalyzing ? styles.spinIcon : ''} />
              <span>{isAnalyzing ? 'Analyzing with AI...' : 'Recalculate & AI Analyze'}</span>
            </button>

            <span className={styles.lastUpdatedText}>
              Last updated: {new Date(analysis.updatedAt || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Right: Circular Score Gauge & Key Highlights */}
        <div className={styles.heroRight}>
          <div className={styles.scoreGaugeWrapper}>
            <svg className={styles.scoreSvg} width="112" height="112" viewBox="0 0 112 112">
              <circle
                className={styles.scoreBgCircle}
                cx="56"
                cy="56"
                r={radius}
                strokeWidth="8"
              />
              <motion.circle
                className={styles.scoreProgressCircle}
                cx="56"
                cy="56"
                r={radius}
                strokeWidth="8"
                stroke={scoreColor}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className={styles.scoreInnerContent}>
              <span className={styles.scoreNumber} style={{ color: scoreColor }}>
                {score}%
              </span>
              <span className={styles.scoreLabel}>Readiness</span>
            </div>
          </div>

          {/* Micro Highlight Badges */}
          <div className={styles.heroHighlights}>
            <div className={styles.highlightPill}>
              <div className={styles.highlightIconDanger}>
                <AlertTriangle size={13} />
              </div>
              <div className={styles.highlightText}>
                <span className={styles.highlightLabel}>Biggest Gap</span>
                <span className={styles.highlightVal}>{analysis.biggestSkillGap || 'None'}</span>
              </div>
            </div>

            <div className={styles.highlightPill}>
              <div className={styles.highlightIconSuccess}>
                <Zap size={13} />
              </div>
              <div className={styles.highlightText}>
                <span className={styles.highlightLabel}>Quick Win</span>
                <span className={styles.highlightVal}>{analysis.quickWin || 'Take Assessment'}</span>
              </div>
            </div>

            <div className={styles.highlightPill}>
              <div className={styles.highlightIconPrimary}>
                <TrendingUp size={13} />
              </div>
              <div className={styles.highlightText}>
                <span className={styles.highlightLabel}>Top Opportunity</span>
                <span className={styles.highlightVal}>{analysis.biggestOpportunity || 'Specialization'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
