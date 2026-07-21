import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, GraduationCap, Award } from 'lucide-react';
import type { StatCardData } from '../../types/dashboard.types';
import styles from './DashboardWidgets.module.css';

interface StatsGridProps {
  stats?: StatCardData[];
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'AI Career Match': Target,
  'Current Progress': TrendingUp,
  'Skills Learned': GraduationCap,
  'Certificates': Award
};

// Mini Sparkline SVG Renderer for premium data visualization
const MiniSparkline: React.FC<{ points: number[]; color: string }> = ({ points, color }) => {
  const width = 64;
  const height = 24;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min === 0 ? 1 : max - min;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - 2 - ((p - min) / range) * (height - 4);
    return `${x},${y}`;
  });
  const pathData = `M ${coords.join(' L ')}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <motion.path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
      />
    </svg>
  );
};

const DEFAULT_STATS: StatCardData[] = [
  {
    title: 'AI Career Match',
    value: '98%',
    trend: '↑ 2.4%',
    trendPositive: true,
    subtext: 'High calibration matching accuracy',
    color: 'var(--color-primary)',
    sparklinePoints: [82, 85, 84, 89, 91, 90, 98],
    hasProgress: true,
    progress: 98
  },
  {
    title: 'Current Progress',
    value: '24%',
    trend: '↑ 4.8%',
    trendPositive: true,
    subtext: '2 of 5 milestones completed',
    color: 'var(--color-secondary)',
    sparklinePoints: [10, 15, 18, 20, 22, 24],
    hasProgress: true,
    progress: 24
  },
  {
    title: 'Skills Learned',
    value: '12 / 28',
    trend: '+2 new',
    trendPositive: true,
    subtext: 'Core domain skills verified',
    color: 'var(--color-accent)',
    sparklinePoints: [4, 6, 8, 9, 10, 12],
    hasProgress: true,
    progress: 42
  },
  {
    title: 'Certificates',
    value: '3',
    trend: 'Steady',
    trendPositive: undefined,
    subtext: 'Verified credentials achieved',
    color: '#10b981',
    sparklinePoints: [1, 1, 2, 2, 3, 3],
    hasProgress: false,
    progress: 0
  }
];

const QUICK_DETAILS: Record<string, { label: string; value: string }[]> = {
  'AI Career Match': [
    { label: 'Confidence', value: 'High' },
    { label: 'Based On', value: 'Skills + Assessment' },
    { label: 'Updated', value: 'Today' },
    { label: 'Rank', value: 'Top 3%' },
    { label: 'Career Path', value: 'AI Engineer' },
    { label: 'Industry', value: 'Artificial Intelligence' },
    { label: 'Recommendation', value: 'Excellent' },
    { label: 'Experience', value: 'Beginner Friendly' }
  ],
  'Current Progress': [
    { label: 'Modules', value: '6 / 24' },
    { label: 'Learning Hours', value: '42 hrs' },
    { label: 'Activity', value: 'Today' },
    { label: 'Weekly Goal', value: '4 / 5' },
    { label: 'Completed', value: '24%' },
    { label: 'Remaining', value: '76%' },
    { label: 'Next Module', value: 'Neural Networks' },
    { label: 'Daily Target', value: '2 Lessons' }
  ],
  'Skills Learned': [
    { label: 'Latest Skill', value: 'PyTorch' },
    { label: 'Level', value: 'Intermediate' },
    { label: 'Verified', value: '12 Skills' },
    { label: 'Updated', value: '2 days ago' },
    { label: 'Practice Hours', value: '48 hrs' },
    { label: 'Projects', value: '5' },
    { label: 'Next Skill', value: 'TensorFlow' },
    { label: 'Skill Score', value: '88%' }
  ],
  'Certificates': [
    { label: 'Verified', value: '3' },
    { label: 'Pending', value: '1' },
    { label: 'Latest', value: 'ML Foundations' },
    { label: 'Issued', value: 'Jul 15, 2026' },
    { label: 'Total Earned', value: '3' },
    { label: 'In Review', value: '1' },
    { label: 'Provider', value: 'Coursera' },
    { label: 'Next Goal', value: 'AWS ML' }
  ]
};

export const StatsGrid: React.FC<StatsGridProps> = ({ stats = DEFAULT_STATS }) => {
  return (
    <div className={styles.statsGridWrapper}>
      {stats.map((stat, idx) => {
        const Icon = ICON_MAP[stat.title] || Target;
        return (
          <motion.div
            key={stat.title}
            className="premiumCard premiumCardCompact premiumCardInteractive"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {/* Header: Title + Icon with soft gradient bg */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="text-label" style={{ fontSize: '0.675rem' }}>{stat.title}</span>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.03))`,
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color 
                }}
              >
                <Icon size={16} />
              </div>
            </div>

            {/* Content: Value, Trend, Sparkline (side-by-side) */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="text-value" style={{ fontSize: '2rem' }}>{stat.value}</span>
                {stat.trend && (
                  <span 
                    style={{ 
                      fontSize: '0.725rem', 
                      fontWeight: 600, 
                      color: stat.trendPositive === true 
                        ? 'var(--color-accent)' 
                        : (stat.trendPositive === false ? '#ef4444' : 'var(--text-muted)'),
                      marginTop: '2px'
                    }}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <div style={{ paddingBottom: '4px' }}>
                <MiniSparkline points={stat.sparklinePoints} color={stat.color} />
              </div>
            </div>

            {/* Bottom Divider */}
            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.04)', margin: '4px 0' }} />

            {/* Quick Details Section */}
            {QUICK_DETAILS[stat.title] && (
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px', 
                  paddingTop: '6px',
                  paddingBottom: '8px',
                  fontSize: '11px',
                  fontFamily: 'inherit'
                }}
              >
                {QUICK_DETAILS[stat.title].map((item) => (
                  <div 
                    key={item.label} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 550 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Footer: Progress Bar and Subtext */}
            <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
              {stat.hasProgress && stat.progress && (
                <div style={{ marginBottom: '4px' }}>
                  <div className={styles.progressBarContainerRefined}>
                    <motion.div 
                      className={styles.progressBarActiveRefined} 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: stat.progress / 100 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                      style={{ transformOrigin: 'left', background: `linear-gradient(90deg, ${stat.color}, var(--color-secondary))` }}
                    />
                  </div>
                </div>
              )}
              <span className="text-caption" style={{ fontSize: '0.725rem', display: 'block' }}>{stat.subtext}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
