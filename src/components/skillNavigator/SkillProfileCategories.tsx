import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ICurrentSkillsBreakdown } from '../../types/skillNavigator.types';
import styles from './SkillNavigatorComponents.module.css';

interface SkillProfileCategoriesProps {
  currentSkills: ICurrentSkillsBreakdown;
}

export const SkillProfileCategories: React.FC<SkillProfileCategoriesProps> = ({ currentSkills }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'verified' | 'profile' | 'developing'>('verified');

  const verified = currentSkills?.verified || [];
  const profile = currentSkills?.profile || [];
  const developing = currentSkills?.developing || [];

  return (
    <div className={styles.categoriesCard}>
      <div className={styles.categoriesHeader}>
        <div>
          <h3 className={styles.sectionTitle}>Current Skill Profile</h3>
          <p className={styles.sectionSubtitle}>
            Breakdown of your verified credentials, self-reported skills, and active roadmap competencies.
          </p>
        </div>

        {/* Tab switcher */}
        <div className={styles.categoryTabSwitcher}>
          <button
            type="button"
            className={`${styles.categoryTabBtn} ${activeTab === 'verified' ? styles.categoryTabBtnActive : ''}`}
            onClick={() => setActiveTab('verified')}
          >
            <ShieldCheck size={14} />
            <span>Verified Skills ({verified.length})</span>
          </button>
          <button
            type="button"
            className={`${styles.categoryTabBtn} ${activeTab === 'profile' ? styles.categoryTabBtnActive : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <BookOpen size={14} />
            <span>Profile Skills ({profile.length})</span>
          </button>
          <button
            type="button"
            className={`${styles.categoryTabBtn} ${activeTab === 'developing' ? styles.categoryTabBtnActive : ''}`}
            onClick={() => setActiveTab('developing')}
          >
            <Clock size={14} />
            <span>Developing ({developing.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.categoryContentArea}>
        <AnimatePresence mode="wait">
          {activeTab === 'verified' && (
            <motion.div
              key="tab-verified"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {verified.length === 0 ? (
                <div className={styles.emptyCategoryState}>
                  <div className={styles.emptyIconCircle}>
                    <Award size={24} />
                  </div>
                  <h4 className={styles.emptyTitle}>No Phase 12 Verified Skills Yet</h4>
                  <p className={styles.emptyDesc}>
                    Take milestone or standalone skill assessments in Quizzes & Assessments to earn authoritative verified credentials on your profile.
                  </p>
                  <button
                    type="button"
                    className={styles.emptyActionBtn}
                    onClick={() => navigate('/exams')}
                  >
                    <span>Take Skill Assessment</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className={styles.skillBadgeGrid}>
                  {verified.map((v, i) => (
                    <div key={v.name + i} className={styles.verifiedSkillBadge}>
                      <div className={styles.badgeTopRow}>
                        <div className={styles.verifiedCheckBadge}>
                          <CheckCircle2 size={13} />
                          <span>Verified</span>
                        </div>
                        {v.score ? <span className={styles.scorePill}>{v.score}% Score</span> : null}
                      </div>
                      <span className={styles.badgeSkillName}>{v.name}</span>
                      <span className={styles.badgeSourceText}>
                        Source: {v.source === 'standalone_assessment' ? 'Skill Assessment' : 'Milestone Assessment'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {profile.length === 0 ? (
                <div className={styles.emptyCategoryState}>
                  <div className={styles.emptyIconCircle}>
                    <BookOpen size={24} />
                  </div>
                  <h4 className={styles.emptyTitle}>No Profile Skills Added</h4>
                  <p className={styles.emptyDesc}>
                    Update your profile skills to help Visionix calculate more accurate readiness matches.
                  </p>
                  <button
                    type="button"
                    className={styles.emptyActionBtn}
                    onClick={() => navigate('/profile')}
                  >
                    <span>Edit Profile Skills</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className={styles.skillBadgeGrid}>
                  {profile.map((sk, i) => (
                    <div key={sk + i} className={styles.profileSkillBadge}>
                      <span className={styles.badgeSkillName}>{sk}</span>
                      <div className={styles.badgeFooterRow}>
                        <span className={styles.selfReportedTag}>Self-Reported</span>
                        <button
                          type="button"
                          className={styles.miniVerifyBtn}
                          onClick={() => navigate('/exams')}
                          title="Take assessment to verify this skill"
                        >
                          <span>Verify</span>
                          <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'developing' && (
            <motion.div
              key="tab-developing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {developing.length === 0 ? (
                <div className={styles.emptyCategoryState}>
                  <div className={styles.emptyIconCircle}>
                    <Clock size={24} />
                  </div>
                  <h4 className={styles.emptyTitle}>No Active Roadmap Skills</h4>
                  <p className={styles.emptyDesc}>
                    Initialize or continue your personalized Career Roadmap to track skills in development stage by stage.
                  </p>
                  <button
                    type="button"
                    className={styles.emptyActionBtn}
                    onClick={() => navigate('/roadmap')}
                  >
                    <span>Open Career Roadmap</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className={styles.skillBadgeGrid}>
                  {developing.map((d, i) => (
                    <div key={d + i} className={styles.developingSkillBadge}>
                      <div className={styles.badgeTopRow}>
                        <span className={styles.inProgressPill}>In Progress</span>
                      </div>
                      <span className={styles.badgeSkillName}>{d}</span>
                      <button
                        type="button"
                        className={styles.continueRoadmapBtn}
                        onClick={() => navigate('/roadmap')}
                      >
                        <span>Continue Roadmap</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
