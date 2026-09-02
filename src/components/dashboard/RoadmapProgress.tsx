import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Compass, Lock, GitFork, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RoadmapMilestone } from '../../types/dashboard.types';
import styles from './DashboardWidgets.module.css';

interface RoadmapProgressProps {
  milestones?: RoadmapMilestone[];
  trackName?: string;
  currentPhaseName?: string;
  overallProgressPercent?: number;
  estimatedCompletion?: string;
  nextGoalName?: string;
  hoursRemaining?: number | string;
}

const DEFAULT_MILESTONES: RoadmapMilestone[] = [
  {
    title: 'Profile Calibration & Setup',
    duration: 'Week 1',
    description: 'Verify interest parameters and initialize profiling vectors.',
    skills: ['Python Foundations', 'Domain Mapping'],
    completed: true,
    status: 'completed'
  },
  {
    title: 'DSA & Core Fundamentals',
    duration: 'Month 1 - 3',
    description: 'Master core language syntax, search/sort algorithms, and data structures.',
    skills: ['Data Structures', 'OOP Concepts', 'Big O Analysis'],
    completed: false,
    status: 'active'
  },
  {
    title: 'Applied Portfolio Projects',
    duration: 'Month 4 - 6',
    description: 'Assemble full-stack client/server codebases and deploy containerized applications.',
    skills: ['REST APIs', 'Cloud Deployment', 'System Architecture'],
    completed: false,
    status: 'locked'
  }
];

export const RoadmapProgress: React.FC<RoadmapProgressProps> = ({
  milestones = DEFAULT_MILESTONES,
  trackName = 'AI & Machine Learning Engineer',
  currentPhaseName = 'Phase 1 - Basics',
  overallProgressPercent = 0,
  estimatedCompletion = 'Not Specified',
  nextGoalName = 'None',
  hoursRemaining = '0 Hours'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  // Calculate timeline height percentage dynamically
  const progressPercent = useMemo(() => {
    const completedCount = milestones.filter(m => m.status === 'completed' || m.completed).length;
    if (completedCount === milestones.length) return 100;
    return (completedCount / milestones.length) * 100;
  }, [milestones]);

  return (
    <motion.div 
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '18px 20px',
        boxSizing: 'border-box'
      }}
    >
      {/* ─── Timeline Header ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 className="text-subheading" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Roadmap Milestones</h3>
          <span className="text-caption" style={{ fontWeight: 600, color: 'var(--color-primary)', marginTop: '3px', display: 'inline-block' }}>
            {trackName}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 8px',
          borderRadius: '6px',
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.18)'
        }}>
          <GitFork size={14} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 600 }}>Active Track</span>
        </div>
      </div>

      {/* ─── Milestone Vertical Path ─────────────────────────────────────── */}
      <div 
        style={{ 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '18px',
          paddingLeft: '6px',
          margin: '4px 0 16px 0'
        }}
      >
        {/* Connecting Vertical Line */}
        <div 
          style={{
            position: 'absolute',
            left: '19px',
            top: '14px',
            bottom: '14px',
            width: '3px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '9999px',
            zIndex: 1
          }}
        >
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${progressPercent}%` }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, var(--color-primary), var(--color-secondary))',
              borderRadius: '9999px',
              filter: 'drop-shadow(0 0 6px var(--color-primary))'
            }}
          />
        </div>

        {/* Milestone Node Items */}
        {milestones.map((milestone, idx) => {
          const isCompleted = milestone.status === 'completed' || milestone.completed;
          const isActive = milestone.status === 'active';
          
          return (
            <div 
              key={milestone.title} 
              style={{ 
                display: 'flex', 
                gap: '16px', 
                alignItems: 'flex-start', 
                position: 'relative', 
                zIndex: 2 
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Popover Tooltip on Hover */}
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      left: '56px',
                      top: '0',
                      width: '240px',
                      background: 'rgba(9, 10, 16, 0.96)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
                      borderRadius: '12px',
                      padding: '12px',
                      zIndex: 100,
                      pointerEvents: 'none',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '0.725rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Key Skills for Phase:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                      {milestone.skills.map(s => (
                        <span key={s} className={styles.careerTag} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '4px' }}>
                      Duration: {milestone.duration}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Node Dot icon wrapper */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.08 + 0.2 }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCompleted 
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : '#090a10',
                  border: isCompleted
                    ? 'none'
                    : (isActive ? '2px solid var(--color-primary)' : '2px solid rgba(255,255,255,0.1)'),
                  color: isCompleted ? '#fff' : (isActive ? 'var(--color-primary)' : 'var(--text-muted)'),
                  boxShadow: isActive ? '0 0 14px rgba(88, 80, 236, 0.5)' : 'none',
                  flexShrink: 0,
                  marginTop: '1px'
                }}
              >
                {isCompleted ? (
                  <Check size={13} />
                ) : isActive ? (
                  <Compass size={14} className="spin-animation" style={{ animationDuration: '6s' }} />
                ) : (
                  <Lock size={11} />
                )}
              </motion.div>

              {/* Node description info content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span 
                    style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 650, 
                      color: isActive ? 'var(--text-primary)' : (isCompleted ? '#a7f3d0' : 'var(--text-secondary)')
                    }}
                  >
                    {milestone.title}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                    <Clock size={10} /> {milestone.duration}
                  </span>
                </div>
                <span className="text-caption" style={{ fontSize: '0.75rem', lineHeight: '1.45', color: 'var(--text-secondary)' }}>
                  {milestone.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Summary Metrics & Action Button at Bottom ─────────────────── */}
      <div 
        style={{ 
          marginTop: 'auto',
          paddingTop: '14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Current Phase</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentPhaseName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Overall Progress</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{overallProgressPercent}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Estimated Completion</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{estimatedCompletion}</span>
        </div>
        {nextGoalName && nextGoalName !== 'None' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Next Goal</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{nextGoalName}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Learning Remaining</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{hoursRemaining}</span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/roadmap')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '8px',
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.22)',
            color: '#c084fc',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.18)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.22)';
          }}
        >
          View Full Interactive Roadmap <ArrowRight size={13} />
        </button>
      </div>
    </motion.div>
  );
};
