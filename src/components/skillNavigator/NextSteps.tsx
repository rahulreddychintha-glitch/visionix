import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Award,
  HelpCircle,
  GitFork,
  FileEdit,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { INextStepItem, ActionType } from '../../types/skillNavigator.types';
import styles from './SkillNavigatorComponents.module.css';

interface NextStepsProps {
  nextSteps: INextStepItem[];
  targetCareerTitle?: string;
}

export const NextSteps: React.FC<NextStepsProps> = ({ nextSteps }) => {
  const navigate = useNavigate();

  const getActionIcon = (actionType: ActionType) => {
    switch (actionType) {
      case 'learning':
        return <GraduationCap size={18} />;
      case 'assessment':
        return <Award size={18} />;
      case 'interview':
        return <HelpCircle size={18} />;
      case 'roadmap':
        return <GitFork size={18} />;
      case 'project':
      default:
        return <FileEdit size={18} />;
    }
  };

  const getCardAccentClass = (actionType: ActionType) => {
    switch (actionType) {
      case 'learning':
        return styles.accentIndigo;
      case 'assessment':
        return styles.accentEmerald;
      case 'interview':
        return styles.accentPurple;
      case 'roadmap':
        return styles.accentAmber;
      case 'project':
      default:
        return styles.accentCyan;
    }
  };

  return (
    <div className={styles.nextStepsSection}>
      <div className={styles.nextStepsHeader}>
        <div className={styles.sparkleIconBadge}>
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className={styles.sectionTitle}>Recommended Next Actions</h3>
          <p className={styles.sectionSubtitle}>
            Personalized immediate steps connected to Visionix learning, assessment, and career tools.
          </p>
        </div>
      </div>

      <div className={styles.nextStepsGrid}>
        {nextSteps.map((step, idx) => (
          <motion.div
            key={step.id || idx}
            className={`${styles.nextStepCard} ${getCardAccentClass(step.actionType)}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <div className={styles.nextStepCardHeader}>
              <div className={styles.nextStepIconBox}>{getActionIcon(step.actionType)}</div>
              <span className={styles.nextStepPriorityBadge}>{step.priority} Priority</span>
            </div>

            <h4 className={styles.nextStepTitle}>{step.title}</h4>
            <p className={styles.nextStepDescription}>{step.description}</p>

            <div className={styles.nextStepFooter}>
              <button
                type="button"
                className={styles.nextStepActionButton}
                onClick={() => navigate(step.targetRoute)}
              >
                <span>{step.actionText}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
