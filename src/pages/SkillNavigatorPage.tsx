import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Zap,
  BarChart3,
  Brain,
  History,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { SkillNavigatorService } from '../services/skillNavigator.service';
import type {
  ISkillGapAnalysis,
  ICareerComparisonItem,
} from '../types/skillNavigator.types';
import { SkillNavigatorHero } from '../components/skillNavigator/SkillNavigatorHero';
import { SkillOverview } from '../components/skillNavigator/SkillOverview';
import { SkillProfileCategories } from '../components/skillNavigator/SkillProfileCategories';
import { SkillGapList } from '../components/skillNavigator/SkillGapList';
import { PrioritySkills } from '../components/skillNavigator/PrioritySkills';
import { NextSteps } from '../components/skillNavigator/NextSteps';
import { CareerComparison } from '../components/skillNavigator/CareerComparison';
import { SkillCoach } from '../components/skillNavigator/SkillCoach';
import { SkillProgressHistory } from '../components/skillNavigator/SkillProgressHistory';
import styles from './SkillNavigatorPage.module.css';

export const SkillNavigatorPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<ISkillGapAnalysis | null>(null);
  const [comparisons, setComparisons] = useState<ICareerComparisonItem[]>([]);
  const [history, setHistory] = useState<ISkillGapAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'gap_analysis' | 'priorities_next_steps' | 'career_comparison' | 'skill_coach' | 'history'
  >('gap_analysis');

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [analysisData, comparisonsData, historyData] = await Promise.all([
        SkillNavigatorService.getLatestAnalysis(),
        SkillNavigatorService.getCareerComparisons(),
        SkillNavigatorService.getAnalysisHistory(),
      ]);

      setAnalysis(analysisData);
      setComparisons(comparisonsData);
      setHistory(historyData);
    } catch (err: any) {
      console.error('[SkillNavigatorPage] Failed to load initial data:', err);
      setError(err?.response?.data?.message || 'Failed to load skill gap analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCareer = async (careerId: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const updated = await SkillNavigatorService.analyzeSkills(careerId, false);
      setAnalysis(updated);
      // Refresh history in background
      const hist = await SkillNavigatorService.getAnalysisHistory();
      setHistory(hist);
    } catch (err: any) {
      console.error('[SkillNavigatorPage] Failed to switch career analysis:', err);
      setError(err?.response?.data?.message || 'Failed to analyze selected career.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRecalculate = async (includeAi: boolean = true) => {
    if (!analysis) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const updated = await SkillNavigatorService.analyzeSkills(analysis.targetCareerId, includeAi);
      setAnalysis(updated);
      const hist = await SkillNavigatorService.getAnalysisHistory();
      setHistory(hist);
    } catch (err: any) {
      console.error('[SkillNavigatorPage] Recalculate failed:', err);
      setError(err?.response?.data?.message || 'Failed to recalculate skill analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const availableCareers = comparisons.map((c) => ({
    id: c.careerId,
    title: c.title,
    category: c.category,
  }));

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        {/* Page Title & Subtitle */}
        <div className={styles.pageHeaderRow}>
          <div className={styles.headerLeft}>
            <h1 className={styles.mainTitle}>Skill Gap & Next-Step Planner</h1>
            <p className={styles.subtitle}>
              Understand your skill gaps, discover what to learn next, and build your path toward your target career.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <Loader2 size={40} className={styles.loadingSpinner} />
            <span>Calculating your real-time skill gaps and verified credentials...</span>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className={styles.errorCard}>
            <AlertCircle size={28} />
            <p>{error}</p>
            <button type="button" className={styles.retryButton} onClick={loadInitialData}>
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Content */}
        {!isLoading && analysis && (
          <>
            {/* Hero Section */}
            <SkillNavigatorHero
              analysis={analysis}
              onSelectCareer={handleSelectCareer}
              onRecalculate={handleRecalculate}
              isAnalyzing={isAnalyzing}
              availableCareers={availableCareers}
            />

            {/* Overview Metric Cards & Breakdown Bar */}
            <SkillOverview analysis={analysis} />

            {/* Main Tabs Navigation */}
            <div className={styles.tabNavigationWrapper}>
              <button
                type="button"
                className={`${styles.navTabBtn} ${activeTab === 'gap_analysis' ? styles.navTabBtnActive : ''}`}
                onClick={() => setActiveTab('gap_analysis')}
              >
                <Layers size={16} />
                <span>Skill Gap Analysis ({analysis.skillGaps.length})</span>
              </button>

              <button
                type="button"
                className={`${styles.navTabBtn} ${activeTab === 'priorities_next_steps' ? styles.navTabBtnActive : ''}`}
                onClick={() => setActiveTab('priorities_next_steps')}
              >
                <Zap size={16} />
                <span>Top Priorities & Next Steps</span>
              </button>

              <button
                type="button"
                className={`${styles.navTabBtn} ${activeTab === 'career_comparison' ? styles.navTabBtnActive : ''}`}
                onClick={() => setActiveTab('career_comparison')}
              >
                <BarChart3 size={16} />
                <span>Career Comparison ({comparisons.length})</span>
              </button>

              <button
                type="button"
                className={`${styles.navTabBtn} ${activeTab === 'skill_coach' ? styles.navTabBtnActive : ''}`}
                onClick={() => setActiveTab('skill_coach')}
              >
                <Brain size={16} />
                <span>AI Skill Coach</span>
              </button>

              <button
                type="button"
                className={`${styles.navTabBtn} ${activeTab === 'history' ? styles.navTabBtnActive : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <History size={16} />
                <span>Progress History ({history.length})</span>
              </button>
            </div>

            {/* Tab Views */}
            <AnimatePresence mode="wait">
              {activeTab === 'gap_analysis' && (
                <motion.div
                  key="tab-gap-analysis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <SkillProfileCategories currentSkills={analysis.currentSkills} />
                  <SkillGapList skillGaps={analysis.skillGaps} />
                </motion.div>
              )}

              {activeTab === 'priorities_next_steps' && (
                <motion.div
                  key="tab-priorities"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <PrioritySkills prioritySkills={analysis.prioritySkills} />
                  <NextSteps
                    nextSteps={analysis.nextSteps}
                    targetCareerTitle={analysis.targetCareerTitle}
                  />
                </motion.div>
              )}

              {activeTab === 'career_comparison' && (
                <motion.div
                  key="tab-career-comp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <CareerComparison
                    comparisons={comparisons}
                    currentTargetCareerId={analysis.targetCareerId}
                    onSelectCareer={handleSelectCareer}
                  />
                </motion.div>
              )}

              {activeTab === 'skill_coach' && (
                <motion.div
                  key="tab-coach"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <SkillCoach
                    targetCareerTitle={analysis.targetCareerTitle}
                    targetCareerId={analysis.targetCareerId}
                    topMissingSkill={analysis.biggestSkillGap}
                    verifiedSkillsCount={analysis.currentSkills.verified.length}
                  />
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="tab-history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <SkillProgressHistory history={history} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SkillNavigatorPage;
