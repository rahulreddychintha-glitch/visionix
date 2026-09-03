import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  X,
  Play,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Sparkles,
  Rocket,
  Layers,
  RefreshCw,
  Loader2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { LearningHubApiService } from '../services/learning.service';
import type { LearningHubData, IEnrichedLearningResource, ILearningFilterParams } from '../types/learning.types';
import styles from './LearningHubPage.module.css';

export const LearningHubPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [data, setData] = useState<LearningHubData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Active Filters & Search State
  const [searchInput, setSearchInput] = useState<string>(searchParams.get('search') || searchParams.get('query') || '');
  const [selectedSkill, setSelectedSkill] = useState<string>(searchParams.get('skill') || 'All');
  const [selectedCareer, setSelectedCareer] = useState<string>(searchParams.get('career') || 'All');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');

  // Video Embed Modal
  const [activePlayerResource, setActivePlayerResource] = useState<IEnrichedLearningResource | null>(null);

  // Fetch learning data with active filters
  const fetchHubData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filterParams: ILearningFilterParams = {};
      if (searchInput.trim()) filterParams.search = searchInput.trim();
      if (selectedSkill !== 'All') filterParams.skill = selectedSkill;
      if (selectedCareer !== 'All') filterParams.career = selectedCareer;
      if (selectedCategory !== 'All') filterParams.topicCategory = selectedCategory;
      if (selectedType !== 'All') filterParams.resourceType = selectedType;
      if (selectedDifficulty !== 'All') filterParams.difficulty = selectedDifficulty;
      if (selectedProvider !== 'All') filterParams.provider = selectedProvider;

      const res = await LearningHubApiService.getLearningHubData(filterParams);
      setData(res);
    } catch (err: any) {
      console.error('[LearningHubPage] Failed to load learning hub data:', err);
      setError(err?.response?.data?.message || 'Failed to load learning resources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchInput, selectedSkill, selectedCareer, selectedCategory, selectedType, selectedDifficulty, selectedProvider]);

  useEffect(() => {
    fetchHubData();
  }, [fetchHubData]);

  // Handle URL query parameters when arriving from Phase 23 Skill Gap or Career Explorer
  useEffect(() => {
    const qSkill = searchParams.get('skill');
    const qCareer = searchParams.get('career');
    const qQuery = searchParams.get('query');

    if (qSkill && qSkill !== selectedSkill) {
      setSelectedSkill(qSkill);
    }
    if (qCareer && qCareer !== selectedCareer) {
      setSelectedCareer(qCareer);
    }
    if (qQuery && qQuery !== searchInput) {
      setSearchInput(qQuery);
    }
  }, [searchParams, selectedSkill, selectedCareer, searchInput]);

  const handleStartResource = async (resource: IEnrichedLearningResource) => {
    try {
      setActionLoading(resource.resourceId);
      await LearningHubApiService.startResource(resource.resourceId);
      if (resource.provider === 'YouTube' && resource.resourceId.length === 11) {
        setActivePlayerResource(resource);
      } else if (resource.url) {
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      }
      fetchHubData();
    } catch (err) {
      console.error('Error starting resource:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteResource = async (resourceId: string) => {
    try {
      setActionLoading(resourceId);
      await LearningHubApiService.updateProgress(resourceId, 'completed');
      if (activePlayerResource?.resourceId === resourceId) {
        setActivePlayerResource(null);
      }
      fetchHubData();
    } catch (err) {
      console.error('Error completing resource:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleBookmark = async (resourceId: string) => {
    try {
      setActionLoading(resourceId);
      await LearningHubApiService.toggleBookmark(resourceId);
      fetchHubData();
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedSkill('All');
    setSelectedCareer('All');
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedDifficulty('All');
    setSelectedProvider('All');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchInput ||
    selectedSkill !== 'All' ||
    selectedCareer !== 'All' ||
    selectedCategory !== 'All' ||
    selectedType !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedProvider !== 'All'
  );

  return (
    <DashboardLayout>
      <div className={styles.container}>

        {/* ════════════════════════════════════════════════════════════════════
            1. HEADER BANNER & SEARCH BAR
            ════════════════════════════════════════════════════════════════════ */}
        <section className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.titleArea}>
              <div className={styles.badgeRow}>
                <span className={styles.headerBadge}>
                  <BookOpen size={13} />
                  Learning Hub 2.0
                </span>

                {data?.targetCareer && (
                  <span className={styles.targetTag}>
                    🎯 Target: {data.targetCareer.title}
                  </span>
                )}

                {data?.educationContext?.level && (
                  <span className={styles.targetTag}>
                    🎓 Stage: {data.educationContext.level}
                  </span>
                )}
              </div>

              <h1 className={styles.pageTitle}>Personalized Learning Catalog</h1>
              <p className={styles.pageSubtitle}>
                Master verified skills, clear Phase 23 skill gaps, and accomplish active roadmap milestones with high-quality, curated masterclasses and tutorials.
              </p>
            </div>
          </div>

          <div className={styles.searchBarRow}>
            <div className={styles.searchBox}>
              <Search size={17} style={{ color: '#94a3b8' }} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search resources by skill (Python, DSA, React, Anatomy, Tally), career, or topic..."
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
            <p>Loading personalized learning catalog...</p>
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <AlertCircle size={36} style={{ color: '#f87171', margin: '0 auto 0.75rem' }} />
            <h3 style={{ color: '#ffffff', margin: '0 0 0.5rem' }}>Failed to Load Learning Hub</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 1.25rem' }}>{error}</p>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
              onClick={fetchHubData}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        ) : data && (
          <>
            {/* ════════════════════════════════════════════════════════════════
                2. RECOMMENDED NEXT FOCUS STEP (BANNER)
                ════════════════════════════════════════════════════════════════ */}
            {data.recommendedNextStep?.resource && !hasActiveFilters && (
              <section className={styles.nextFocusCard}>
                <div className={styles.focusLeft}>
                  <div className={styles.focusIconBox}>
                    <Sparkles size={22} />
                  </div>
                  <div className={styles.focusContent}>
                    <span className={styles.focusTag}>
                      ★ Recommended Next Step to Learn
                    </span>
                    <h3 className={styles.focusTitle}>
                      {data.recommendedNextStep.resource.title}
                    </h3>
                    <p className={styles.focusReason}>
                      {data.recommendedNextStep.reason}
                    </p>
                  </div>
                </div>

                <div className={styles.focusActions}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
                    onClick={() => handleStartResource(data.recommendedNextStep!.resource!)}
                    disabled={actionLoading === data.recommendedNextStep.resource.resourceId}
                  >
                    <Play size={14} />
                    <span>Start Learning</span>
                  </button>

                  {data.targetCareer && (
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                      onClick={() => navigate('/roadmap', { state: { selectedCareer: data.targetCareer } })}
                    >
                      <Rocket size={14} />
                      <span>View Roadmap</span>
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* ════════════════════════════════════════════════════════════════
                3. CONTINUE LEARNING (ACTIVE IN-PROGRESS RESOURCES)
                ════════════════════════════════════════════════════════════════ */}
            {data.continueLearning && data.continueLearning.length > 0 && (
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Clock size={18} style={{ color: '#818cf8' }} />
                    <span>Continue Learning ({data.continueLearning.length})</span>
                  </h2>
                </div>

                <div className={styles.resourceGrid}>
                  {data.continueLearning.map((resource) => (
                    <div key={resource.resourceId} className={styles.resourceCard}>
                      <div className={styles.thumbnailWrapper}>
                        {resource.thumbnail ? (
                          <img
                            src={resource.thumbnail}
                            alt={resource.title}
                            className={styles.thumbnailImg}
                            loading="lazy"
                          />
                        ) : (
                          <div className={styles.thumbnailPlaceholder}>
                            <BookOpen size={36} />
                          </div>
                        )}
                        <span className={styles.typeBadge}>{resource.type}</span>
                        {resource.duration && (
                          <span className={styles.durationBadge}>
                            <Clock size={11} />
                            <span>{resource.duration}</span>
                          </span>
                        )}
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.cardMetaRow}>
                          <span className={styles.channelName}>{resource.channel || resource.provider}</span>
                          <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.72rem' }}>In Progress</span>
                        </div>

                        <h3 className={styles.cardTitle}>{resource.title}</h3>
                        <p className={styles.cardDesc}>{resource.description}</p>

                        <div className={styles.skillsTagsRow}>
                          {resource.skills.slice(0, 3).map((sk) => (
                            <span key={sk} className={styles.skillTag}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.cardFooter}>
                        <div className={styles.footerActions}>
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
                            onClick={() => handleStartResource(resource)}
                          >
                            <Play size={13} />
                            <span>Resume</span>
                          </button>

                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
                            style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                            onClick={() => handleCompleteResource(resource.resourceId)}
                          >
                            <CheckCircle2 size={13} />
                            <span>Done</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          className={`${styles.iconOnlyBtn} ${resource.isBookmarked ? styles.iconOnlyBtnActive : ''}`}
                          onClick={() => handleToggleBookmark(resource.resourceId)}
                          title={resource.isBookmarked ? 'Remove Bookmark' : 'Bookmark Resource'}
                        >
                          {resource.isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ════════════════════════════════════════════════════════════════
                4. LEARN BY SKILL (PRIORITY SKILL FILTER PILLS)
                ════════════════════════════════════════════════════════════════ */}
            {data.priorityMissingSkills && data.priorityMissingSkills.length > 0 && (
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Sparkles size={18} style={{ color: '#fbbf24' }} />
                    <span>Learn by Missing Skill (Phase 23 Skill Gap)</span>
                  </h2>
                </div>

                <div className={styles.skillPillsRow}>
                  <button
                    type="button"
                    className={`${styles.skillPill} ${selectedSkill === 'All' ? styles.skillPillActive : ''}`}
                    onClick={() => setSelectedSkill('All')}
                  >
                    <span>All Skills</span>
                  </button>

                  {data.priorityMissingSkills.map((sk) => (
                    <button
                      key={sk.name}
                      type="button"
                      className={`${styles.skillPill} ${selectedSkill === sk.name ? styles.skillPillActive : ''}`}
                      onClick={() => setSelectedSkill(sk.name === selectedSkill ? 'All' : sk.name)}
                    >
                      <span>{sk.name}</span>
                      {sk.count > 0 && <span className={styles.skillPillCount}>{sk.count}</span>}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ════════════════════════════════════════════════════════════════
                5. FILTER SELECTORS BAR
                ════════════════════════════════════════════════════════════════ */}
            <div className={styles.filterControlsBar}>
              {/* Category Filter */}
              <select
                className={styles.filterSelect}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {data.availableFilters.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Career Filter */}
              <select
                className={styles.filterSelect}
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
              >
                <option value="All">All Careers</option>
                {data.availableFilters.careers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>

              {/* Resource Type Filter */}
              <select
                className={styles.filterSelect}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All Resource Types</option>
                {data.availableFilters.resourceTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
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
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
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

            {/* ════════════════════════════════════════════════════════════════
                6. BROWSE RESOURCE CATALOG
                ════════════════════════════════════════════════════════════════ */}
            <section className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Layers size={18} style={{ color: '#818cf8' }} />
                  <span>
                    {hasActiveFilters ? 'Filtered Learning Resources' : 'All Curated Resources'} ({data.catalog.length})
                  </span>
                </h2>
              </div>

              {data.catalog.length > 0 ? (
                <div className={styles.resourceGrid}>
                  {data.catalog.map((resource) => {
                    const isCompleted = resource.progressStatus === 'completed';
                    const isInProgress = resource.progressStatus === 'in_progress';

                    return (
                      <div key={resource.resourceId} className={styles.resourceCard}>
                        <div className={styles.thumbnailWrapper}>
                          {resource.thumbnail ? (
                            <img
                              src={resource.thumbnail}
                              alt={resource.title}
                              className={styles.thumbnailImg}
                              loading="lazy"
                            />
                          ) : (
                            <div className={styles.thumbnailPlaceholder}>
                              <BookOpen size={36} />
                            </div>
                          )}
                          <span className={styles.typeBadge}>{resource.type}</span>
                          {resource.duration && (
                            <span className={styles.durationBadge}>
                              <Clock size={11} />
                              <span>{resource.duration}</span>
                            </span>
                          )}
                        </div>

                        <div className={styles.cardBody}>
                          <div className={styles.cardMetaRow}>
                            <span className={styles.channelName}>{resource.channel || resource.provider}</span>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{resource.difficulty}</span>
                          </div>

                          <h3 className={styles.cardTitle}>{resource.title}</h3>
                          <p className={styles.cardDesc}>{resource.description}</p>

                          {resource.relevanceReason && (
                            <div className={styles.relevanceBadge}>
                              <Sparkles size={11} />
                              <span>{resource.relevanceReason}</span>
                            </div>
                          )}

                          <div className={styles.skillsTagsRow}>
                            {resource.skills.slice(0, 3).map((sk) => (
                              <span key={sk} className={styles.skillTag}>
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={styles.cardFooter}>
                          <div className={styles.footerActions}>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
                              onClick={() => handleStartResource(resource)}
                              disabled={actionLoading === resource.resourceId}
                            >
                              <Play size={13} />
                              <span>{isInProgress ? 'Resume' : isCompleted ? 'Review' : 'Start Learning'}</span>
                            </button>

                            {isInProgress && (
                              <button
                                type="button"
                                className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
                                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                                onClick={() => handleCompleteResource(resource.resourceId)}
                              >
                                <CheckCircle2 size={13} />
                                <span>Done</span>
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            className={`${styles.iconOnlyBtn} ${resource.isBookmarked ? styles.iconOnlyBtnActive : ''}`}
                            onClick={() => handleToggleBookmark(resource.resourceId)}
                            title={resource.isBookmarked ? 'Remove Bookmark' : 'Bookmark Resource'}
                          >
                            {resource.isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Search size={32} style={{ color: '#64748b', margin: '0 auto 0.75rem' }} />
                  <h3 style={{ color: '#ffffff', margin: '0 0 0.5rem' }}>No Resources Match Your Filter</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 1.25rem' }}>
                    Try resetting filters or searching with broader keywords like "Python", "Data", "Medicine", or "Accounting".
                  </p>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
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
            7. VIDEO EMBED / RESOURCE PLAYER MODAL
            ════════════════════════════════════════════════════════════════════ */}
        {activePlayerResource && (
          <div className={styles.modalOverlay} onClick={() => setActivePlayerResource(null)}>
            <div className={styles.playerModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.playerModalHeader}>
                <h3 className={styles.playerModalTitle}>{activePlayerResource.title}</h3>
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setActivePlayerResource(null)}
                >
                  <X size={20} />
                </button>
              </div>

              {activePlayerResource.provider === 'YouTube' ? (
                <iframe
                  className={styles.videoIframe}
                  src={`https://www.youtube-nocookie.com/embed/${activePlayerResource.resourceId}?autoplay=1&rel=0`}
                  title={activePlayerResource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>{activePlayerResource.description}</p>
                  <a
                    href={activePlayerResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
                    style={{ margin: '0 auto' }}
                  >
                    <span>Open in Official Portal</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              <div className={styles.playerModalFooter}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Provider: {activePlayerResource.provider} ({activePlayerResource.channel})
                </span>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
                    style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}
                    onClick={() => handleCompleteResource(activePlayerResource.resourceId)}
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark as Completed</span>
                  </button>

                  <a
                    href={activePlayerResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <span>Open in YouTube</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default LearningHubPage;
