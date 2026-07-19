import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

interface Course {
  title: string;
  difficulty: string;
  progress: number;
  provider: string;
  categoryColor: string;
}

interface ContinueLearningProps {
  courses?: Course[];
}

const DEFAULT_COURSES: Course[] = [
  {
    title: 'Deep Learning Specialization',
    difficulty: 'Intermediate',
    progress: 75,
    provider: 'Coursera (DeepLearning.AI)',
    categoryColor: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
  },
  {
    title: 'Python Core & Data Structures',
    difficulty: 'Beginner',
    progress: 45,
    provider: 'Visionix Academy',
    categoryColor: 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
  }
];

export const ContinueLearning: React.FC<ContinueLearningProps> = ({
  courses = DEFAULT_COURSES
}) => {
  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="text-subheading">Continue Learning</h3>
          <p className="text-caption" style={{ marginTop: '2px' }}>Resume your active study tracks</p>
        </div>
        <BookOpen size={16} style={{ color: 'var(--color-primary)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {courses.map((course) => (
          <div 
            key={course.title} 
            className={`${styles.courseItem} ${styles.interactiveListItem}`}
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
            {/* Visual Thumbnail */}
            <div 
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: course.categoryColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                position: 'relative',
                flexShrink: 0
              }}
            >
              <Play size={16} style={{ fill: 'currentColor' }} />
            </div>

            {/* Course Meta & Progress */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <span className="text-description" style={{ fontSize: '0.8rem', fontWeight: 650, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {course.title}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                <span>{course.difficulty}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{course.progress}%</span>
              </div>
              <div className={styles.progressBarContainerRefined} style={{ height: '4px', marginTop: '2px' }}>
                <div 
                  className={styles.progressBarActiveRefined} 
                  style={{ 
                    width: `${course.progress}%`, 
                    background: course.categoryColor 
                  }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
