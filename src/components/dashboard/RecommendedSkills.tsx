import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
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



export const RecommendedSkills: React.FC<RecommendedSkillsProps> = ({
  skills = []
}) => {
  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="text-subheading">Target Skills</h3>
          <p className="text-caption" style={{ marginTop: '2px' }}>Verify your core domain capabilities</p>
        </div>
        <Award size={16} style={{ color: 'var(--color-primary)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
        {skills.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
            No target skills configured.
          </div>
        ) : (
          skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={14} style={{ color: skill.color }} />
                    <span className="text-description" style={{ fontSize: '0.775rem', fontWeight: 650, color: 'var(--text-primary)' }}>
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-caption" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {skill.progress}%
                  </span>
                </div>
                <div className={styles.progressBarContainerRefined} style={{ height: '5px' }}>
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
          })
        )}
      </div>
    </motion.div>
  );
};
