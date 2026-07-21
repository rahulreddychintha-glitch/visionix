import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, DollarSign, BrainCircuit, Calendar, TrendingUp } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

interface RecommendedCareerCardProps {
  dreamCareer?: string;
  careerDescription?: string;
  interests?: string[];
  matchPercentage?: number;
  salaryRange?: string;
  difficulty?: string;
  estimatedTime?: string;
  expectedGrowth?: string;
  learningProgress?: number;
  topSkills?: string[];
}

export const RecommendedCareerCard: React.FC<RecommendedCareerCardProps> = ({ 
  dreamCareer = 'AI & Machine Learning Engineer', 
  careerDescription = 'Design and deploy deep learning models, tune LLMs, and architect neural pipelines.',
  interests = [],
  matchPercentage = 98,
  salaryRange = '$145,000/yr',
  difficulty = 'Intermediate',
  estimatedTime = '6 Months',
  expectedGrowth = '+35% Growth',
  learningProgress = 24,
  topSkills = []
}) => {
  // SVG Math for a larger progress circle (90px)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchPercentage / 100) * circumference;

  // Derive skill tags dynamically
  const skillTags = topSkills.length > 0 
    ? topSkills 
    : (interests.length > 0 ? interests.slice(0, 3) : ['Python', 'Machine Learning', 'High Demand']);

  return (
    <motion.div 
      className="premiumCard premiumCardInteractive"
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: '100%' }}
    >
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span className="text-label" style={{ fontSize: '0.675rem' }}>Recommended Career</span>
        <span className={styles.matchBadge}>Excellent Match</span>
      </div>

      {/* Symmetrical Spacing Wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
        {/* 2. Career Name & Description Group */}
        <div>
          <h3 className="text-heading" style={{ fontSize: '1.45rem', marginBottom: '2px' }}>{dreamCareer}</h3>
          <p className="text-description" style={{ fontSize: '0.85rem', marginBottom: '8px', lineHeight: '1.5' }}>
            {careerDescription}
          </p>
        </div>

        {/* 4. Match Percentage Circle (Larger) & Details Grid */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ position: 'relative', width: '76px', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="76" height="76" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth="7"
              />
              <motion.circle
                cx="45"
                cy="45"
                r={radius}
                fill="transparent"
                stroke="url(#purpleGradRefined)"
                strokeWidth="7"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeDashoffset }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 5px rgba(88, 80, 236, 0.5))' }}
              />
              <defs>
                <linearGradient id="purpleGradRefined" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-secondary)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-heading" style={{ position: 'absolute', fontSize: '1.1rem', fontWeight: 800 }}>{matchPercentage}%</span>
          </div>

          {/* Metadata grid of 4 fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 20px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.675rem' }}>
                <DollarSign size={10} style={{ color: 'var(--color-primary)' }} /> Salary
              </span>
              <span className="text-description" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{salaryRange}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.675rem' }}>
                <BrainCircuit size={10} style={{ color: 'var(--color-primary)' }} /> Difficulty
              </span>
              <span className="text-description" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{difficulty}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.675rem' }}>
                <Calendar size={10} style={{ color: 'var(--color-primary)' }} /> Time Required
              </span>
              <span className="text-description" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{estimatedTime}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.675rem' }}>
                <TrendingUp size={10} style={{ color: 'var(--color-primary)' }} /> Expected Growth
              </span>
              <span className="text-description" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-accent)', marginTop: '2px' }}>{expectedGrowth}</span>
            </div>
          </div>
        </div>

        {/* 5. Learning Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-caption" style={{ fontWeight: 600 }}>Learning Progress</span>
            <span className="text-caption" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{learningProgress}%</span>
          </div>
          <div className={styles.progressBarContainerRefined} style={{ height: '5px' }}>
            <div className={styles.progressBarActiveRefined} style={{ width: `${learningProgress}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />
          </div>
        </div>

        {/* 6. Skill Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
          <span className="text-label" style={{ fontSize: '0.675rem', color: 'var(--text-secondary)' }}>Top Skills</span>
          <div className={styles.tagsWrapper}>
            {skillTags.map((tag) => (
              <span key={tag} className={styles.careerTag} style={{ fontSize: '0.725rem', padding: '4px 10px' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 7. CTA Button */}
        <motion.button 
          className="premiumButtonSecondary" 
          aria-label="View Career Details"
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
          style={{ width: '100%' }}
        >
          <span>View Career Details</span>
          <ChevronRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

