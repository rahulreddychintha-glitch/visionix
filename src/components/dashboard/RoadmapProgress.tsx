import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Compass, Lock, GitFork } from 'lucide-react';
import type { RoadmapMilestone } from '../../types/dashboard.types';
import styles from './DashboardWidgets.module.css';

interface RoadmapProgressProps {
  milestones?: RoadmapMilestone[];
  trackName?: string;
}

const DEFAULT_MILESTONES: RoadmapMilestone[] = [
  {
    title: 'Profile Calibration',
    duration: 'Week 1',
    description: 'Verify interest parameters and initialize profiling vectors.',
    skills: ['Python foundations', 'Interests mapping'],
    completed: true,
    status: 'completed'
  },
  {
    title: 'DSA & Python Core',
    duration: 'Month 1 - 3',
    description: 'Master core language syntax, search/sort algorithms, and structures.',
    skills: ['Python OOP', 'Big O Notation', 'Structures'],
    completed: false,
    status: 'active'
  },
  {
    title: 'Portfolio Projects',
    duration: 'Month 4 - 6',
    description: 'Assemble client/server codebases and deploy container apps.',
    skills: ['Docker', 'Express.js', 'React APIs'],
    completed: false,
    status: 'locked'
  }
];

export const RoadmapProgress: React.FC<RoadmapProgressProps> = ({
  milestones = DEFAULT_MILESTONES,
  trackName = 'AI & Machine Learning Engineer'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Timeline Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 className="text-subheading">Roadmap Milestones</h3>
          <span className="text-caption" style={{ fontWeight: 600, color: 'var(--color-primary)', marginTop: '2px', display: 'inline-block' }}>
            {trackName}
          </span>
        </div>
        <GitFork size={16} style={{ color: 'var(--color-primary)' }} />
      </div>

      {/* Symmetrical Spacing Wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
        {/* Timeline Path - Vertical Layout for natural stretching */}
        <div 
          style={{ 
            position: 'relative', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            flex: 1, 
            paddingLeft: '4px',
            minHeight: '240px'
          }}
        >
          {/* Connecting Vertical Line */}
          <div 
            style={{
              position: 'absolute',
              left: '15px',
              top: '12px',
              bottom: '12px',
              width: '4px',
              background: 'rgba(255, 255, 255, 0.04)',
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
                filter: 'drop-shadow(0 0 4px var(--color-primary))'
              }}
            />
          </div>

          {/* Milestone Node List */}
          {milestones.map((milestone, idx) => {
            const isCompleted = milestone.status === 'completed' || milestone.completed;
            const isActive = milestone.status === 'active';
            
            return (
              <div 
                key={milestone.title} 
                style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  alignItems: 'flex-start', 
                  position: 'relative', 
                  zIndex: 2 
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Popover Tooltip */}
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
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
                        borderRadius: '12px',
                        padding: '12px',
                        zIndex: 100,
                        pointerEvents: 'none',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Key Skills for Phase:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                        {milestone.skills.map(s => (
                          <span key={s} className={styles.careerTag} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
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
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCompleted 
                      ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
                      : '#090a10',
                    border: isCompleted
                      ? 'none'
                      : (isActive ? '2px solid var(--color-primary)' : '2px solid rgba(255,255,255,0.08)'),
                    color: isCompleted ? '#fff' : (isActive ? 'var(--color-primary)' : 'var(--text-muted)'),
                    boxShadow: isActive ? '0 0 12px rgba(88, 80, 236, 0.4)' : 'none',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {isCompleted ? (
                    <Check size={12} />
                  ) : isActive ? (
                    <Compass size={14} className="spin-animation" style={{ animationDuration: '6s' }} />
                  ) : (
                    <Lock size={10} />
                  )}
                </motion.div>

                {/* Node description info content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span 
                    className="text-description" 
                    style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' 
                    }}
                  >
                    {milestone.title}
                  </span>
                  <span className="text-caption" style={{ fontSize: '0.725rem', lineHeight: '1.4' }}>
                    {milestone.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary section at the bottom to balance height */}
        <div 
          style={{ 
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '0.725rem',
            fontFamily: 'inherit'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Current Phase</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 550 }}>Phase 2 – Deep Learning</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Overall Progress</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 550 }}>33%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Estimated Completion</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 550 }}>Nov 2026</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Next Goal</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 550 }}>Production ML</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Learning Remaining</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 550 }}>128 Hours</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
