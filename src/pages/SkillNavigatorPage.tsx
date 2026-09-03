import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { SkillNavigatorService } from '../services/skillNavigator.service';
import type {
  ISkillGapAnalysis,
  ISkillGapItem,
  ICareerComparisonItem,
} from '../types/skillNavigator.types';
import { CareerService } from '../services/career.service';
import type { Career } from '../services/career.service';
import { CareerDetailsModal } from '../components/dashboard/CareerDetailsModal';
import { useProfile } from '../hooks/useProfile';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Rocket,
  Search,
  X,
  RefreshCw,
  Loader2,
  Award,
  Layers,
  BarChart2,
  Compass,
  ArrowRightLeft,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import styles from './SkillNavigatorPage.module.css';

const POPULAR_CAREER_SUGGESTIONS = [
  { id: 'software_engineer', title: 'Software Engineer', category: 'Technology & Software' },
  { id: 'data_scientist', title: 'Data Scientist', category: 'Technology & AI' },
  { id: 'ai_engineer', title: 'AI & Machine Learning Engineer', category: 'Technology & AI' },
  { id: 'doctor', title: 'Doctor / Physician (MBBS)', category: 'Medical & Healthcare' },
  { id: 'chartered_accountant', title: 'Chartered Accountant (CA)', category: 'Commerce & Finance' },
  { id: 'cybersecurity_analyst', title: 'Cybersecurity Analyst', category: 'Technology & Security' },
  { id: 'lawyer', title: 'Corporate Lawyer (Advocate)', category: 'Law & Governance' },
  { id: 'ui_designer', title: 'UI/UX Product Designer', category: 'Design & Visual Arts' },
];

export const SkillNavigatorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, saveProfile } = useProfile();

  const [analysis, setAnalysis] = useState<ISkillGapAnalysis | null>(null);
  const [comparisons, setComparisons] = useState<ICareerComparisonItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Active Tab View
  const [activeTab, setActiveTab] = useState<'all' | 'existing' | 'missing' | 'priority' | 'compare'>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Modals & Drawers
  const [selectedSkill, setSelectedSkill] = useState<ISkillGapItem | null>(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState<boolean>(false);
  const [allCareers, setAllCareers] = useState<Array<{ id: string; title: string; category: string }>>([]);
  const [switcherSearch, setSwitcherSearch] = useState<string>('');

  // Career Details Modal
  const [selectedCareerModal, setSelectedCareerModal] = useState<Career | null>(null);
  const [careerCompareList, setCareerCompareList] = useState<Career[]>([]);

  const handleToggleCareerCompare = (career: Career) => {
    setCareerCompareList((prev) => {
      const exists = prev.some((c) => c.id === career.id);
      if (exists) return prev.filter((c) => c.id !== career.id);
      if (prev.length >= 3) {
        alert('You can compare up to 3 careers at once.');
        return prev;
      }
      return [...prev, career];
    });
  };

  // Fetch initial analysis
  const fetchSkillGapData = useCallback(async (careerId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const [analysisData, comparisonsData] = await Promise.all([
        SkillNavigatorService.getLatestAnalysis(careerId),
        SkillNavigatorService.getCareerComparisons().catch(() => []),
      ]);

      setAnalysis(analysisData);
      setComparisons(comparisonsData);
    } catch (err: any) {
      console.error('[SkillNavigatorPage] Failed to load skill gap data:', err);
      setError(err?.response?.data?.message || 'Could not load skill gap analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch full career list for career switcher
  useEffect(() => {
    CareerService.getCareers()
      .then((res: { careers: Career[] }) => {
        if (res && Array.isArray(res.careers)) {
          setAllCareers(res.careers.map((c: Career) => ({ id: c.id, title: c.title, category: c.category })));
        }
      })
      .catch((err: unknown) => console.warn('Could not load careers list for switcher:', err));
  }, []);

  // Check route state or query params on load
  useEffect(() => {
    const passedCareerId = location.state?.careerId;
    if (passedCareerId) {
      fetchSkillGapData(passedCareerId);
      window.history.replaceState({}, document.title);
    } else {
      fetchSkillGapData();
    }
  }, [location.state, fetchSkillGapData]);

  // Switch career target
  const handleSelectTargetCareer = async (careerId: string) => {
    setIsSwitcherOpen(false);
    setAnalyzing(true);
    setError(null);
    try {
      const updated = await SkillNavigatorService.analyzeSkills(careerId, false);
      setAnalysis(updated);
      const comps = await SkillNavigatorService.getCareerComparisons().catch(() => []);
      setComparisons(comps);
    } catch (err: any) {
      console.error('[SkillNavigatorPage] Error analyzing selected career:', err);
      setError(err?.response?.data?.message || 'Failed to switch career analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Filter skills based on search & active tab
  const displayedSkills = useMemo(() => {
    if (!analysis || !analysis.hasTargetCareer) return [];

    let pool: ISkillGapItem[] = [];
    if (activeTab === 'existing') {
      pool = analysis.existingSkills || [];
    } else if (activeTab === 'missing') {
      pool = analysis.missingSkills || [];
    } else if (activeTab === 'priority') {
      pool = (analysis.missingSkills || []).filter(
        (s) => s.priority === 'Critical' || s.priority === 'High'
      );
    } else {
      pool = analysis.requiredSkills || analysis.skillGaps || [];
    }

    if (!searchFilter.trim()) return pool;
    const q = searchFilter.toLowerCase().trim();
    return pool.filter(
      (s) =>
        s.skillName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.whyItMatters.toLowerCase().includes(q)
    );
  }, [analysis, activeTab, searchFilter]);

  const filteredSwitcherCareers = useMemo(() => {
    if (!switcherSearch.trim()) return allCareers.length > 0 ? allCareers : POPULAR_CAREER_SUGGESTIONS;
    const q = switcherSearch.toLowerCase().trim();
    return (allCareers.length > 0 ? allCareers : POPULAR_CAREER_SUGGESTIONS).filter(
      (c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [allCareers, switcherSearch]);

  const handleOpenCareerDetails = async (careerId: string) => {
    try {
      const fullCareer = await CareerService.getCareerDetails(careerId);
      setSelectedCareerModal(fullCareer);
    } catch (err) {
      console.warn('Could not fetch full career record:', err);
    }
  };

  const handleStartLearning = (skill: ISkillGapItem) => {
    if (skill.learningResource?.url && skill.learningResource.url.startsWith('http')) {
      window.open(skill.learningResource.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/learning?query=${encodeURIComponent(skill.skillName)}`);
    }
  };

  const handleViewRoadmap = () => {
    if (!analysis?.targetCareerId) {
      navigate('/roadmap');
      return;
    }
    navigate('/roadmap', {
      state: {
        selectedCareer: {
          id: analysis.targetCareerId,
          title: analysis.targetCareerTitle,
          category: analysis.targetCategory,
        },
      },
    });
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        
        {/* Loading State */}
        {loading || analyzing ? (
          <div className={styles.loadingContainer}>
            <Loader2 className="spin-animation" size={36} style={{ color: '#6366f1' }} />
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              {analyzing ? 'Recalculating deterministic skill gap...' : 'Loading your skill gap analysis...'}
            </p>
          </div>
        ) : error ? (
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyIconBox} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              <AlertCircle size={32} />
            </div>
            <h2 className={styles.emptyTitle}>Skill Gap Analysis Error</h2>
            <p className={styles.emptySubtitle}>{error}</p>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              onClick={() => fetchSkillGapData()}
            >
              <RefreshCw size={15} />
              <span>Retry</span>
            </button>
          </div>
        ) : !analysis || !analysis.hasTargetCareer ? (
          /* ─── EMPTY STATE: NO TARGET CAREER SELECTED ─────────────────── */
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyIconBox}>
              <Target size={32} />
            </div>
            <h2 className={styles.emptyTitle}>Choose a Target Career</h2>
            <p className={styles.emptySubtitle}>
              Select your goal career to evaluate existing competencies, missing requirements, deterministic priorities, and personalized roadmap connections.
            </p>

            <button
              type="button"
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}
              onClick={() => setIsSwitcherOpen(true)}
            >
              <Compass size={16} />
              <span>Select Target Career</span>
            </button>

            <div style={{ textAlign: 'left', marginTop: '1.5rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#818cf8', fontWeight: 700 }}>
                Popular Career Paths:
              </span>
              <div className={styles.careerPickGrid}>
                {POPULAR_CAREER_SUGGESTIONS.map((career) => (
                  <div
                    key={career.id}
                    className={styles.careerPickCard}
                    onClick={() => handleSelectTargetCareer(career.id)}
                  >
                    <h4 className={styles.careerPickTitle}>{career.title}</h4>
                    <p className={styles.careerPickCategory}>{career.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ─── COMPLETE SKILL GAP ANALYSIS EXPERIENCE ──────────────────── */
          <>
            {/* 1. Header Banner & Target Career */}
            <section className={styles.headerBanner}>
              <div className={styles.bannerTop}>
                <div className={styles.targetInfoArea}>
                  <div className={styles.badgeRow}>
                    <span className={styles.headerTag}>
                      <Target size={13} />
                      Target Career
                    </span>
                    <span className={styles.categoryTag}>{analysis.targetCategory}</span>
                    {analysis.demandLevel && (
                      <span className={styles.categoryTag} style={{ color: '#10b981' }}>
                        🔥 {analysis.demandLevel} Demand
                      </span>
                    )}
                  </div>

                  <div className={styles.targetTitleRow}>
                    <h1 className={styles.careerTitle}>{analysis.targetCareerTitle}</h1>
                  </div>

                  <div className={styles.targetMetaRow}>
                    {analysis.salaryRange && (
                      <span className={styles.metaItem}>
                        <TrendingUp size={13} style={{ color: '#10b981' }} />
                        <span>{analysis.salaryRange}</span>
                      </span>
                    )}
                    <span className={styles.metaItem}>
                      <Layers size={13} style={{ color: '#818cf8' }} />
                      <span>{analysis.summary?.totalRequired || analysis.requiredSkillsCount} Mapped Skills</span>
                    </span>
                  </div>
                </div>

                <div className={styles.bannerActions}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.switchBtn}`}
                    onClick={() => setIsSwitcherOpen(true)}
                  >
                    <ArrowRightLeft size={14} />
                    <span>Switch Career</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.switchBtn}`}
                    onClick={() => handleOpenCareerDetails(analysis.targetCareerId)}
                  >
                    <Briefcase size={14} />
                    <span>Career Details</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                    onClick={handleViewRoadmap}
                  >
                    <Rocket size={14} />
                    <span>View Roadmap</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. Coverage Gauge & Summary Cards */}
            <section className={styles.coverageSection}>
              {/* Coverage Progress Card */}
              <div className={styles.gaugeCard}>
                <div className={styles.gaugeHeader}>
                  <span className={styles.gaugeLabel}>Skill Coverage</span>
                  <span className={styles.gaugePercent}>
                    {analysis.summary?.coveragePercentage ?? analysis.readinessScore}%
                  </span>
                </div>
                <div className={styles.progressBarTrack}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${analysis.summary?.coveragePercentage ?? analysis.readinessScore}%` }}
                  />
                </div>
                <p className={styles.coverageDescription}>
                  {analysis.summary?.coverageText ||
                    `${analysis.summary?.existingCount || analysis.strongSkillsCount} of ${
                      analysis.summary?.totalRequired || analysis.requiredSkillsCount
                    } mapped career skills covered`}
                </p>
              </div>

              {/* 4 Summary Stats */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIconBox} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                    <Layers size={18} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>
                      {analysis.summary?.totalRequired || analysis.requiredSkillsCount}
                    </span>
                    <span className={styles.statLabel}>Mapped Skills</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconBox} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>
                      {analysis.summary?.existingCount || analysis.strongSkillsCount}
                    </span>
                    <span className={styles.statLabel}>Already Have</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconBox} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                    <AlertCircle size={18} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>
                      {analysis.summary?.missingCount || analysis.missingSkillsCount}
                    </span>
                    <span className={styles.statLabel}>Skills Missing</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconBox} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                    <Sparkles size={18} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>
                      {analysis.prioritySkills?.length || 0}
                    </span>
                    <span className={styles.statLabel}>Priority Focus</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Recommended Next Skill (What to Learn Next) */}
            {analysis.recommendedNextSkill ? (
              <section className={styles.nextSkillFocusCard}>
                <div className={styles.focusLeft}>
                  <div className={styles.focusIconBox}>
                    <Sparkles size={22} />
                  </div>
                  <div className={styles.focusContent}>
                    <span className={styles.focusTag}>
                      ★ Recommended Next Skill to Focus On
                    </span>
                    <h3 className={styles.focusSkillTitle}>
                      {analysis.recommendedNextSkill.skillName}
                    </h3>
                    <p className={styles.focusReason}>
                      {analysis.recommendedNextSkill.whyItMatters}
                    </p>
                  </div>
                </div>

                <div className={styles.focusActions}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                    onClick={() => handleStartLearning(analysis.recommendedNextSkill!)}
                  >
                    <BookOpen size={14} />
                    <span>Start Learning</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.switchBtn}`}
                    onClick={handleViewRoadmap}
                  >
                    <Rocket size={14} />
                    <span>View in Roadmap</span>
                  </button>
                </div>
              </section>
            ) : (
              /* All Skills Covered State */
              <div
                className={styles.nextSkillFocusCard}
                style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
              >
                <div className={styles.focusLeft}>
                  <div className={styles.focusIconBox} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div className={styles.focusContent}>
                    <span className={styles.focusTag} style={{ color: '#10b981' }}>
                      Milestone Accomplished
                    </span>
                    <h3 className={styles.focusSkillTitle}>All mapped career skills are currently covered!</h3>
                    <p className={styles.focusReason}>
                      You have demonstrated or recorded all primary competencies for {analysis.targetCareerTitle}. Continue practicing through mock interviews and advanced projects.
                    </p>
                  </div>
                </div>

                <div className={styles.focusActions}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                    onClick={() => navigate('/interview')}
                  >
                    <Award size={14} />
                    <span>Take Mock Interview</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. Filter Tabs & Search */}
            <div className={styles.controlsRow}>
              <div className={styles.tabNavigation}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  <Layers size={13} />
                  <span>All Required Skills</span>
                  <span className={styles.tabCount}>
                    {analysis.requiredSkills?.length || analysis.skillGaps?.length || 0}
                  </span>
                </button>

                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'existing' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('existing')}
                >
                  <CheckCircle2 size={13} />
                  <span>What You Have</span>
                  <span className={styles.tabCount}>{analysis.existingSkills?.length || 0}</span>
                </button>

                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'missing' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('missing')}
                >
                  <AlertCircle size={13} />
                  <span>Skills You Need</span>
                  <span className={styles.tabCount}>{analysis.missingSkills?.length || 0}</span>
                </button>

                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'priority' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('priority')}
                >
                  <Sparkles size={13} />
                  <span>Priority Skills</span>
                  <span className={styles.tabCount}>{analysis.prioritySkills?.length || 0}</span>
                </button>

                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'compare' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('compare')}
                >
                  <BarChart2 size={13} />
                  <span>Other Careers</span>
                  <span className={styles.tabCount}>{comparisons.length}</span>
                </button>
              </div>

              {activeTab !== 'compare' && (
                <div className={styles.searchBox}>
                  <Search size={15} style={{ color: '#94a3b8' }} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Filter skills..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  {searchFilter && (
                    <button
                      type="button"
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                      onClick={() => setSearchFilter('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 5. Main Content: Skills Grid OR Career Comparison Table */}
            {activeTab === 'compare' ? (
              /* Career Comparisons Table */
              <div className={styles.skillsGrid}>
                {comparisons.map((c) => (
                  <div
                    key={c.careerId}
                    className={styles.skillCard}
                    onClick={() => handleSelectTargetCareer(c.careerId)}
                  >
                    <div className={styles.skillCardTop}>
                      <div>
                        <h4 className={styles.skillName}>{c.title}</h4>
                        <span className={styles.skillCategoryBadge}>{c.category}</span>
                      </div>
                      <span className={styles.gaugePercent} style={{ fontSize: '1.25rem' }}>
                        {c.matchScore}%
                      </span>
                    </div>

                    <p className={styles.skillReason}>
                      Top Missing Skill: <strong style={{ color: '#f87171' }}>{c.topMissingSkill}</strong>
                    </p>

                    <div className={styles.skillMetaFooter}>
                      <span>{c.strongSkillsCount} skills matched</span>
                      <button
                        type="button"
                        className={styles.miniActionBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTargetCareer(c.careerId);
                        }}
                      >
                        <span>Analyze Gap</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Skills Grid */
              displayedSkills.length > 0 ? (
                <div className={styles.skillsGrid}>
                  {displayedSkills.map((skill) => {
                    const isExisting = skill.status === 'Verified' || skill.status === 'Strong';
                    const isDeveloping = skill.status === 'Developing';

                    const getPriorityClass = () => {
                      switch (skill.priority) {
                        case 'Critical':
                          return styles.priorityCritical;
                        case 'High':
                          return styles.priorityHigh;
                        case 'Medium':
                          return styles.priorityMedium;
                        default:
                          return styles.prioritySupporting;
                      }
                    };

                    return (
                      <div
                        key={skill.id || skill.skillName}
                        className={styles.skillCard}
                        onClick={() => setSelectedSkill(skill)}
                      >
                        <div className={styles.skillCardTop}>
                          <div className={styles.skillTitleBlock}>
                            <div
                              className={styles.statusIconBox}
                              style={{
                                background: isExisting
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : isDeveloping
                                  ? 'rgba(99, 102, 241, 0.15)'
                                  : 'rgba(239, 68, 68, 0.15)',
                                color: isExisting ? '#10b981' : isDeveloping ? '#818cf8' : '#f87171',
                              }}
                            >
                              {isExisting ? (
                                <CheckCircle2 size={16} />
                              ) : isDeveloping ? (
                                <Clock size={16} />
                              ) : (
                                <AlertCircle size={16} />
                              )}
                            </div>

                            <div>
                              <h4 className={styles.skillName}>{skill.skillName}</h4>
                              <span className={styles.skillCategoryBadge}>{skill.category}</span>
                            </div>
                          </div>

                          <div className={styles.badgeGroup}>
                            <span className={`${styles.priorityBadge} ${getPriorityClass()}`}>
                              {skill.priority}
                            </span>
                          </div>
                        </div>

                        <p className={styles.skillReason}>{skill.whyItMatters}</p>

                        <div className={styles.skillMetaFooter}>
                          {skill.roadmapMilestone ? (
                            <span className={styles.roadmapLink}>
                              <Rocket size={11} />
                              <span>Stage {skill.roadmapMilestone.stageNumber} Milestone</span>
                            </span>
                          ) : (
                            <span>{skill.currentLevel}</span>
                          )}

                          <div className={styles.cardActionBtns}>
                            {!isExisting && (
                              <button
                                type="button"
                                className={styles.miniActionBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartLearning(skill);
                                }}
                              >
                                <BookOpen size={11} />
                                <span>Learn</span>
                              </button>
                            )}
                            <button
                              type="button"
                              className={styles.miniActionBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSkill(skill);
                              }}
                            >
                              <span>Details</span>
                              <ArrowRight size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyStateContainer} style={{ padding: '2rem' }}>
                  <Search size={28} style={{ color: '#64748b', margin: '0 auto 0.75rem' }} />
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: '#ffffff' }}>
                    No matching skills found
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                    Try adjusting your filter keyword or switch to another tab.
                  </p>
                </div>
              )
            )}
          </>
        )}

        {/* ─── 6. SKILL DETAIL INSPECTOR MODAL ─────────────────────────── */}
        {selectedSkill && (
          <div className={styles.modalOverlay} onClick={() => setSelectedSkill(null)}>
            <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleArea}>
                  <div className={styles.badgeRow}>
                    <span className={styles.categoryTag}>{selectedSkill.category}</span>
                    <span
                      className={styles.categoryTag}
                      style={{
                        color:
                          selectedSkill.status === 'Verified' || selectedSkill.status === 'Strong'
                            ? '#10b981'
                            : '#f87171',
                      }}
                    >
                      {selectedSkill.status}
                    </span>
                    <span className={styles.categoryTag}>{selectedSkill.priority} Priority</span>
                  </div>
                  <h2 className={styles.modalTitle}>{selectedSkill.skillName}</h2>
                </div>

                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelectedSkill(null)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Why it matters */}
              <div className={styles.modalSection}>
                <span className={styles.sectionHeading}>
                  <Sparkles size={13} />
                  <span>Why This Skill Matters</span>
                </span>
                <p className={styles.modalText}>{selectedSkill.whyItMatters}</p>
              </div>

              {/* Recommended Action */}
              <div className={styles.modalSection}>
                <span className={styles.sectionHeading}>
                  <Compass size={13} />
                  <span>Recommended Action</span>
                </span>
                <p className={styles.modalText}>{selectedSkill.recommendedAction}</p>
              </div>

              {/* Roadmap Milestone Connection */}
              {selectedSkill.roadmapMilestone && (
                <div className={styles.modalSection}>
                  <span className={styles.sectionHeading}>
                    <Rocket size={13} />
                    <span>Roadmap Milestone Connection</span>
                  </span>
                  <div className={styles.resourceBox}>
                    <div>
                      <h4 className={styles.resourceTitle}>
                        Stage {selectedSkill.roadmapMilestone.stageNumber}: {selectedSkill.roadmapMilestone.stageTitle}
                      </h4>
                      <p className={styles.resourceProvider}>
                        Milestone: {selectedSkill.roadmapMilestone.milestoneTitle} ({selectedSkill.roadmapMilestone.status})
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.switchBtn}`}
                      onClick={() => {
                        setSelectedSkill(null);
                        handleViewRoadmap();
                      }}
                    >
                      <span>View</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Learning Resource Connection */}
              {selectedSkill.learningResource && (
                <div className={styles.modalSection}>
                  <span className={styles.sectionHeading}>
                    <BookOpen size={13} />
                    <span>Mapped Learning Resource</span>
                  </span>
                  <div className={styles.resourceBox}>
                    <div>
                      <h4 className={styles.resourceTitle}>{selectedSkill.learningResource.title}</h4>
                      <p className={styles.resourceProvider}>
                        {selectedSkill.learningResource.provider} • {selectedSkill.learningResource.type}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.primaryBtn}`}
                      onClick={() => handleStartLearning(selectedSkill)}
                    >
                      <span>Open</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className={styles.modalFooterActions}>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.primaryBtn}`}
                  onClick={() => handleStartLearning(selectedSkill)}
                >
                  <BookOpen size={14} />
                  <span>Learn This Skill</span>
                </button>

                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.switchBtn}`}
                  onClick={() => {
                    setSelectedSkill(null);
                    navigate('/interview');
                  }}
                >
                  <Award size={14} />
                  <span>Take Assessment</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── 7. CAREER SWITCHER MODAL ────────────────────────────────── */}
        {isSwitcherOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsSwitcherOpen(false)}>
            <div className={styles.switcherModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Compass size={18} style={{ color: '#818cf8' }} />
                    <span>Select Target Career</span>
                  </h2>
                  <p style={{ margin: '0.2rem 0 0', color: '#94a3b8', fontSize: '0.82rem' }}>
                    Choose any career to instantly analyze required skills, existing competencies, and missing gaps.
                  </p>
                </div>

                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setIsSwitcherOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className={styles.searchBox} style={{ width: '100%', marginBottom: '1rem' }}>
                <Search size={15} style={{ color: '#94a3b8' }} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search 30+ official careers..."
                  value={switcherSearch}
                  onChange={(e) => setSwitcherSearch(e.target.value)}
                />
              </div>

              <div className={styles.switcherGrid}>
                {filteredSwitcherCareers.map((c) => {
                  const isCurrent = analysis?.targetCareerId === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`${styles.switcherItem} ${isCurrent ? styles.switcherItemActive : ''}`}
                      onClick={() => handleSelectTargetCareer(c.id)}
                    >
                      <div>
                        <h4 className={styles.careerPickTitle}>{c.title}</h4>
                        <p className={styles.careerPickCategory}>{c.category}</p>
                      </div>

                      {isCurrent && (
                        <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, marginTop: '0.4rem' }}>
                          ★ Current Target
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── 8. CAREER DETAILS MODAL ─────────────────────────────────── */}
        {selectedCareerModal && (
          <CareerDetailsModal
            career={selectedCareerModal}
            onClose={() => setSelectedCareerModal(null)}
            onToggleBookmark={() => {}}
            onToggleCompare={handleToggleCareerCompare}
            compareList={careerCompareList}
            onSetTargetCareer={async (career) => {
              if (profile) {
                await saveProfile({
                  ...profile,
                  careerGoals: {
                    ...profile.careerGoals,
                    dreamCareer: career.title,
                  },
                });
                handleSelectTargetCareer(career.id);
              }
            }}
            targetCareerTitle={analysis?.targetCareerTitle || ''}
            hasRoadmap={true}
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default SkillNavigatorPage;
