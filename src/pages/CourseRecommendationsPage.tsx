import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Play,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Search,
  X,
  Clock,
  Target,
  AlertCircle,
  Loader2,
  RefreshCw,
  Flame,
  Info,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { CourseService } from '../services/course.service';
import { LearningHubApiService } from '../services/learning.service';
import type { ICourseRecommendationsResponse, IRecommendedCourseItem, ICourseFilterOptions } from '../types/course.types';
import styles from './CourseRecommendationsPage.module.css';

export const CourseRecommendationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<ICourseRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filters State
  const [searchInput, setSearchInput] = useState<string>(searchParams.get('search') || '');
  const [selectedSkill, setSelectedSkill] = useState<string>(searchParams.get('skill') || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Course Inspector Modal State
  const [inspectedCourse, setInspectedCourse] = useState<IRecommendedCourseItem | null>(null);

  // Fetch course recommendations
  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filterOptions: ICourseFilterOptions = {};
      if (searchInput.trim()) filterOptions.search = searchInput.trim();
      if (selectedSkill !== 'All') filterOptions.skill = selectedSkill;
      if (selectedDifficulty !== 'All') filterOptions.difficulty = selectedDifficulty;
      if (selectedProvider !== 'All') filterOptions.provider = selectedProvider;
      if (selectedType !== 'All') filterOptions.resourceType = selectedType;

      const res = await CourseService.getCourseRecommendations(filterOptions);
      setData(res);
    } catch (err: any) {
      console.error('[CourseRecommendationsPage] Failed to load course recommendations:', err);
      setError(err?.response?.data?.message || 'Failed to load course recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchInput, selectedSkill, selectedDifficulty, selectedProvider, selectedType]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Sync URL parameters
  useEffect(() => {
    const qSkill = searchParams.get('skill');
    const qSearch = searchParams.get('search');
    if (qSkill && qSkill !== selectedSkill) {
      setSelectedSkill(qSkill);
    }
    if (qSearch && qSearch !== searchInput) {
      setSearchInput(qSearch);
    }
  }, [searchParams, selectedSkill, searchInput]);

  const handleStartCourse = async (course: IRecommendedCourseItem) => {
    try {
      setActionLoading(course.resourceId);
      await LearningHubApiService.startResource(course.resourceId);
      if (course.url) {
        window.open(course.url, '_blank', 'noopener,noreferrer');
      }
      fetchRecommendations();
    } catch (err) {
      console.error('Error starting course:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteCourse = async (resourceId: string) => {
    try {
      setActionLoading(resourceId);
      await LearningHubApiService.updateProgress(resourceId, 'completed');
      if (inspectedCourse?.resourceId === resourceId) {
        setInspectedCourse(null);
      }
      fetchRecommendations();
    } catch (err) {
      console.error('Error completing course:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleBookmark = async (resourceId: string) => {
    try {
      setActionLoading(resourceId);
      await LearningHubApiService.toggleBookmark(resourceId);
      fetchRecommendations();
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedSkill('All');
    setSelectedDifficulty('All');
    setSelectedProvider('All');
    setSelectedType('All');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchInput ||
    selectedSkill !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedProvider !== 'All' ||
    selectedType !== 'All'
  );

  return (
    <DashboardLayout>
      <div className={styles.container}>

        {/* ════════════════════════════════════════════════════════════════════
            1. HEADER BANNER & CONTEXT METRICS
            ════════════════════════════════════════════════════════════════════ */}
        <section className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.titleArea}>
              <div className={styles.badgeRow}>
                <span className={styles.headerBadge}>
                  <GraduationCap size={13} />
                  Phase 25 Course Recommendations
                </span>

                {data?.targetCareer ? (
                  <span className={styles.targetTag}>
                    🎯 Target: {data.targetCareer.title}
                  </span>
                ) : (
                  <span className={styles.gapTag}>
                    ⚠️ No Target Career Selected
                  </span>
                )}

                {data?.summary && data.summary.totalMissingGaps > 0 && (
                  <span className={styles.gapTag}>
                    ⚡ {data.summary.totalMissingGaps} Skill Gaps to Close
                  </span>
                )}

                {data?.is100PercentCovered && (
                  <span className={styles.targetTag} style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.15)' }}>
                    ✓ 100% Skills Covered
                  </span>
                )}
              </div>

              <h1 className={styles.pageTitle}>Recommended Courses</h1>
              <p className={styles.pageSubtitle}>
                Courses selected specifically from your target career and Phase 23 skill gap analysis to help you build verified competencies.
              </p>
            </div>
          </div>

          <div className={styles.searchBarRow}>
            <div className={styles.searchBox}>
              <Search size={17} style={{ color: '#94a3b8' }} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search recommended courses by title, skill, provider, or topic..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setSearchInput('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </section>

        {loading && !data ? (
          <div className={styles.loadingContainer}>
            <Loader2 className="spin-animation" size={36} style={{ color: '#6366f1' }} />
            <p>Matching personalized courses to your skill gaps...</p>
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <AlertCircle size={36} style={{ color: '#f87171', margin: '0 auto 0.75rem' }} />
            <h3 style={{ color: '#ffffff', margin: '0 0 0.5rem' }}>Failed to Load Recommendations</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 1.25rem' }}>{error}</p>
            <button
              type="button"
              className={styles.primaryActionBtn}
              onClick={fetchRecommendations}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        ) : data && (
          <>
            {/* ════════════════════════════════════════════════════════════════
                2. "START WITH THESE" (TOP PRIORITY FOCUS SECTION)
                ════════════════════════════════════════════════════════════════ */}
            {data.topPriorityCourses && data.topPriorityCourses.length > 0 && !hasActiveFilters && (
              <section className={styles.topPrioritySection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Flame size={20} style={{ color: '#f87171' }} />
                    <span>Start With These (Highest Priority Gaps)</span>
                  </h2>

                  {data.targetCareer && (
                    <Link
                      to="/skill-gap"
                      style={{ fontSize: '0.82rem', color: '#818cf8', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      <span>View Skill Gap</span>
                      <Target size={13} />
                    </Link>
                  )}
                </div>

                <div className={styles.topPriorityGrid}>
                  {data.topPriorityCourses.map((course) => {
                    const isCritical = course.priorityLevel === 'Critical';
                    const isInProgress = course.progressStatus === 'in_progress';
                    const isCompleted = course.progressStatus === 'completed';

                    return (
                      <div key={course.resourceId} className={styles.priorityCard}>
                        <div>
                          <div className={styles.priorityTopMeta}>
                            <span className={isCritical ? styles.priorityBadgeCritical : styles.priorityBadgeHigh}>
                              {isCritical ? 'Critical Gap' : 'High Priority'}
                            </span>
                            <span className={styles.providerText}>{course.provider}</span>
                          </div>

                          <h3 className={styles.cardTitle}>{course.title}</h3>

                          <div className={styles.cardReason}>
                            <span>💡 {course.recommendationReason}</span>
                          </div>

                          <div className={styles.cardSkillsRow}>
                            {course.skills.map((sk) => (
                              <span key={sk} className={styles.skillPill}>
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={styles.cardFooter}>
                          <div className={styles.durationDifficulty}>
                            {course.duration && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Clock size={12} />
                                <span>{course.duration}</span>
                              </span>
                            )}
                            <span>•</span>
                            <span>{course.difficulty}</span>
                          </div>

                          <div className={styles.actionBtnGroup}>
                            <button
                              type="button"
                              className={styles.secondaryActionBtn}
                              onClick={() => setInspectedCourse(course)}
                              title="Inspect details"
                            >
                              <Info size={13} />
                              <span>Details</span>
                            </button>

                            <button
                              type="button"
                              className={styles.primaryActionBtn}
                              onClick={() => handleStartCourse(course)}
                              disabled={actionLoading === course.resourceId}
                            >
                              <Play size={13} />
                              <span>{isInProgress ? 'Resume' : isCompleted ? 'Review' : 'Start'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ════════════════════════════════════════════════════════════════
                3. SKILL-BASED RECOMMENDATIONS (ORGANIZED BY SKILL GAP)
                ════════════════════════════════════════════════════════════════ */}
            {data.skillBasedRecommendations && data.skillBasedRecommendations.length > 0 && !hasActiveFilters && (
              <section style={{ marginBottom: '2rem' }}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Target size={18} style={{ color: '#818cf8' }} />
                    <span>Skill-Based Recommendations</span>
                  </h2>
                </div>

                {data.skillBasedRecommendations.map((grp) => (
                  <div key={grp.skillName} className={styles.skillGroupBlock}>
                    <div className={styles.skillGroupHeader}>
                      <div className={styles.skillGroupTitleArea}>
                        <h3 className={styles.skillGroupTitle}>{grp.skillName}</h3>
                        <span className={grp.priority === 'Critical' ? styles.priorityBadgeCritical : styles.priorityBadgeHigh}>
                          {grp.priority} Skill Gap
                        </span>
                      </div>

                      <button
                        type="button"
                        style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.8rem', cursor: 'pointer' }}
                        onClick={() => setSelectedSkill(grp.skillName)}
                      >
                        View all for {grp.skillName} →
                      </button>
                    </div>

                    <div className={styles.skillCoursesGrid}>
                      {grp.courses.map((c) => (
                        <div key={c.resourceId} className={styles.courseMiniCard}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.74rem', color: '#94a3b8' }}>
                              <span>{c.provider}</span>
                              <span>{c.difficulty}</span>
                            </div>
                            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.4rem', lineHeight: 1.35 }}>
                              {c.title}
                            </h4>
                            <p style={{ fontSize: '0.76rem', color: '#cbd5e1', margin: '0 0 0.65rem', lineHeight: 1.4 }}>
                              {c.recommendationReason}
                            </p>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                              {c.duration || 'Self-paced'}
                            </span>
                            <button
                              type="button"
                              className={styles.primaryActionBtn}
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.74rem' }}
                              onClick={() => handleStartCourse(c)}
                            >
                              <Play size={11} />
                              <span>{c.progressStatus === 'in_progress' ? 'Resume' : 'Start'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* ════════════════════════════════════════════════════════════════
                4. FILTER CONTROLS BAR & COMPLETE RECOMMENDATIONS CATALOG
                ════════════════════════════════════════════════════════════════ */}
            <section style={{ marginBottom: '2rem' }}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Sparkles size={18} style={{ color: '#fbbf24' }} />
                  <span>
                    {hasActiveFilters ? 'Filtered Course Recommendations' : 'All Recommended Courses'} ({data.allRecommendedCourses.length})
                  </span>
                </h2>
              </div>

              <div className={styles.filterControlsBar}>
                {/* Skill Filter */}
                <select
                  className={styles.filterSelect}
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                >
                  <option value="All">All Skills</option>
                  {data.availableFilters.skills.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select
                  className={styles.filterSelect}
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="All">All Difficulties</option>
                  {data.availableFilters.difficulties.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                {/* Provider Filter */}
                <select
                  className={styles.filterSelect}
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                >
                  <option value="All">All Providers</option>
                  {data.availableFilters.providers.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    type="button"
                    className={styles.resetFiltersBtn}
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {data.allRecommendedCourses.length > 0 ? (
                <div className={styles.allCoursesGrid}>
                  {data.allRecommendedCourses.map((course) => {
                    const isInProgress = course.progressStatus === 'in_progress';
                    const isCompleted = course.progressStatus === 'completed';

                    return (
                      <div key={course.resourceId} className={styles.priorityCard}>
                        <div>
                          <div className={styles.priorityTopMeta}>
                            <span style={{ fontSize: '0.74rem', color: '#818cf8', fontWeight: 600 }}>
                              {course.type}
                            </span>
                            <span className={styles.providerText}>{course.provider}</span>
                          </div>

                          <h3 className={styles.cardTitle}>{course.title}</h3>

                          <div className={styles.cardReason}>
                            <span>💡 {course.recommendationReason}</span>
                          </div>

                          <div className={styles.cardSkillsRow}>
                            {course.skills.map((sk) => (
                              <span key={sk} className={styles.skillPill}>
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={styles.cardFooter}>
                          <div className={styles.durationDifficulty}>
                            {course.duration && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Clock size={12} />
                                <span>{course.duration}</span>
                              </span>
                            )}
                            <span>•</span>
                            <span>{course.difficulty}</span>
                          </div>

                          <div className={styles.actionBtnGroup}>
                            <button
                              type="button"
                              className={styles.secondaryActionBtn}
                              onClick={() => setInspectedCourse(course)}
                            >
                              <Info size={13} />
                              <span>Details</span>
                            </button>

                            <button
                              type="button"
                              className={styles.primaryActionBtn}
                              onClick={() => handleStartCourse(course)}
                              disabled={actionLoading === course.resourceId}
                            >
                              <Play size={13} />
                              <span>{isInProgress ? 'Resume' : isCompleted ? 'Review' : 'Start'}</span>
                            </button>

                            <button
                              type="button"
                              style={{
                                width: '32px',
                                height: '32px',
                                background: course.isBookmarked ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: course.isBookmarked ? '#818cf8' : '#94a3b8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleToggleBookmark(course.resourceId)}
                              title={course.isBookmarked ? 'Remove Bookmark' : 'Bookmark Course'}
                            >
                              {course.isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Search size={32} style={{ color: '#64748b', margin: '0 auto 0.75rem' }} />
                  <h3 style={{ color: '#ffffff', margin: '0 0 0.5rem' }}>No Courses Found</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 1.25rem' }}>
                    Try adjusting your search query or reset your active filters.
                  </p>
                  <button
                    type="button"
                    className={styles.primaryActionBtn}
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            5. COURSE DETAILS INSPECTOR MODAL
            ════════════════════════════════════════════════════════════════════ */}
        {inspectedCourse && (
          <div className={styles.modalOverlay} onClick={() => setInspectedCourse(null)}>
            <div className={styles.courseModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.courseModalHeader}>
                <h3 className={styles.courseModalTitle}>{inspectedCourse.title}</h3>
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setInspectedCourse(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.courseModalBody}>
                <div className={styles.modalMetaRow}>
                  <span><strong>Provider:</strong> {inspectedCourse.provider}</span>
                  <span><strong>Difficulty:</strong> {inspectedCourse.difficulty}</span>
                  {inspectedCourse.duration && <span><strong>Duration:</strong> {inspectedCourse.duration}</span>}
                </div>

                <div className={styles.modalReasonBox}>
                  <strong>Why Recommended:</strong> {inspectedCourse.recommendationReason}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.88rem', color: '#ffffff', margin: '0 0 0.35rem' }}>Description</h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>
                    {inspectedCourse.description}
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.88rem', color: '#ffffff', margin: '0 0 0.35rem' }}>Skills Covered</h4>
                  <div className={styles.cardSkillsRow}>
                    {inspectedCourse.skills.map((sk) => (
                      <span key={sk} className={styles.skillPill}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {inspectedCourse.roadmapMilestone && (
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    🚀 <strong>Connected Roadmap Milestone:</strong> Stage {inspectedCourse.roadmapMilestone.stageNumber}: {inspectedCourse.roadmapMilestone.milestoneTitle}
                  </div>
                )}
              </div>

              <div className={styles.courseModalFooter}>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    className={styles.primaryActionBtn}
                    onClick={() => handleStartCourse(inspectedCourse)}
                  >
                    <Play size={14} />
                    <span>Open & Start Learning</span>
                  </button>

                  <button
                    type="button"
                    className={styles.secondaryActionBtn}
                    style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}
                    onClick={() => handleCompleteCourse(inspectedCourse.resourceId)}
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark Complete</span>
                  </button>
                </div>

                <a
                  href={inspectedCourse.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryActionBtn}
                >
                  <span>Direct URL</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default CourseRecommendationsPage;
