import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, ArrowRight } from 'lucide-react';
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
    title: 'Machine Learning Fundamentals & Data Prep',
    difficulty: 'Intermediate',
    progress: 65,
    provider: 'Stanford Online',
    categoryColor: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
  },
  {
    title: 'Deep Learning & Neural Network Architecture',
    difficulty: 'Advanced',
    progress: 30,
    provider: 'deeplearning.ai',
    categoryColor: 'linear-gradient(135deg, #3b82f6, #06b6d4)'
  }
];

export const ContinueLearning: React.FC<ContinueLearningProps> = ({
  courses = DEFAULT_COURSES
}) => {
  const navigate = useNavigate();
  const activeCourses = courses.length > 0 ? courses : DEFAULT_COURSES;

  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
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
            <h3 className="text-subheading" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Continue Learning</h3>
            <p className="text-caption" style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>Resume your active study tracks</p>
          </div>
          <BookOpen size={16} style={{ color: 'var(--color-primary)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeCourses.map((course) => (
            <div 
              key={course.title} 
              className={`${styles.courseItem} ${styles.interactiveListItem}`}
              onClick={() => navigate('/learning')}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.04)',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              {/* Visual Thumbnail */}
              <div 
                style={{
                  width: '40px',
                  height: '40px',
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
                <Play size={14} style={{ fill: 'currentColor' }} />
              </div>

              {/* Course Meta & Progress */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {course.title}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>{course.provider || course.difficulty}</span>
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
      </div>

      <button
        type="button"
        onClick={() => navigate('/learning')}
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
        Open Learning Hub <ArrowRight size={13} />
      </button>
    </motion.div>
  );
};
