import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ExternalLink, Star, Play } from 'lucide-react';
import type { LearningResourceData } from '../../types/dashboard.types';
import styles from './DashboardWidgets.module.css';

interface LearningResourcesProps {
  resources?: LearningResourceData[];
}

const DEFAULT_RESOURCES: LearningResourceData[] = [
  {
    provider: 'Coursera',
    title: 'Deep Learning Specialization',
    duration: '4 Weeks',
    difficulty: 'Intermediate',
    rating: 4.9,
    continueUrl: 'https://coursera.org',
    categoryColor: 'linear-gradient(135deg, #1e40af, #3b82f6)'
  },
  {
    provider: 'Udemy',
    title: 'Python Core & Data Structures Masterclass',
    duration: '18 Hours',
    difficulty: 'Beginner',
    rating: 4.7,
    continueUrl: 'https://udemy.com',
    categoryColor: 'linear-gradient(135deg, #a21caf, #d946ef)'
  },
  {
    provider: 'roadmap.sh',
    title: 'AI & Machine Learning Roadmap Guide',
    duration: 'Self-paced',
    difficulty: 'Beginner',
    rating: 4.8,
    continueUrl: 'https://roadmap.sh',
    categoryColor: 'linear-gradient(135deg, #ea580c, #f97316)'
  }
];

export const LearningResources: React.FC<LearningResourcesProps> = ({
  resources = DEFAULT_RESOURCES
}) => {
  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="text-subheading">Learning Resources</h3>
          <p className="text-caption" style={{ marginTop: '2px' }}>Curated learning modules & guides</p>
        </div>
        <GraduationCap size={16} style={{ color: 'var(--color-primary)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {resources.slice(0, 2).map((res) => (
          <div 
            key={res.title}
            className={styles.interactiveListItem}
            style={{
              display: 'flex',
              gap: '14px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              alignItems: 'center'
            }}
          >
            {/* Visual Category Block */}
            <div 
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: res.categoryColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                position: 'relative',
                flexShrink: 0
              }}
            >
              <Play size={14} style={{ fill: 'currentColor' }} />
            </div>

            {/* Meta & Ratings Details */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span 
                  style={{ 
                    fontSize: '0.625rem', 
                    fontWeight: 700, 
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {res.provider}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.65rem', color: '#fbbf24' }}>
                  <Star size={10} style={{ fill: 'currentColor' }} />
                  <span>{res.rating}</span>
                </div>
              </div>
              <span className="text-description" style={{ fontSize: '0.775rem', fontWeight: 650, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {res.title}
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                <span>{res.difficulty}</span>
                <span>{res.duration}</span>
              </div>
            </div>
            
            <a 
              href={res.continueUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                color: 'var(--text-muted)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginLeft: '4px'
              }}
              aria-label={`Open ${res.title} on ${res.provider}`}
            >
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
