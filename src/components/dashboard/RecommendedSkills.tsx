import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight, Code2, Database, BrainCircuit } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

interface Skill {
  name: string;
  progress: number;
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  color: string;
}

interface RecommendedSkillsProps {
  skills?: Skill[];
}

const DEFAULT_SKILLS: Skill[] = [
  {
    name: 'Python OOP & Algorithm Design',
    progress: 85,
    icon: Code2,
    color: '#8b5cf6'
  },
  {
    name: 'Data Structures & Big-O Optimization',
    progress: 60,
    icon: Database,
    color: '#3b82f6'
  },
  {
    name: 'Neural Network Fundamentals (PyTorch)',
    progress: 40,
    icon: BrainCircuit,
    color: '#10b981'
  }
];

export const RecommendedSkills: React.FC<RecommendedSkillsProps> = ({
  skills = DEFAULT_SKILLS
}) => {
  const navigate = useNavigate();
  const activeSkills = skills.length > 0 ? skills : DEFAULT_SKILLS;

  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '18px 20px',
        boxSizing: 'border-box'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 className="text-subheading" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Target Skills</h3>
            <p className="text-caption" style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>Verify your core domain capabilities</p>
          </div>
          <Award size={16} style={{ color: 'var(--color-primary)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activeSkills.map((skill) => {
            const Icon = skill.icon || Award;
            return (
              <div 
                key={skill.name} 
                onClick={() => navigate('/skill-gap')}
                className={styles.interactiveListItem}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '4px',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Icon size={13} style={{ color: skill.color }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {skill.name}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.75rem' }}>
                    {skill.progress}%
                  </span>
                </div>
                <div className={styles.progressBarContainerRefined} style={{ height: '4px', marginTop: '2px' }}>
                  <div 
                    className={styles.progressBarActiveRefined} 
                    style={{ 
                      width: `${skill.progress}%`, 
                      background: `linear-gradient(90deg, ${skill.color}, var(--color-secondary))` 
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/skill-gap')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '14px',
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
        Skill Gap Analysis <ArrowRight size={13} />
      </button>
    </motion.div>
  );
};
