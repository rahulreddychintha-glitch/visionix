import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CareerService,
  type Career,
  type CareerComparisonResponse,
} from '../services/career.service';
import {
  RoadmapService,
  type RoadmapComparisonResponse,
} from '../services/roadmap.service';
import { useProfile } from '../hooks/useProfile';
import { CareerDetailsModal } from '../components/dashboard/CareerDetailsModal';
import styles from './CareerComparePage.module.css';

export const CareerComparePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, saveProfile } = useProfile();

  // Selected Career IDs (Up to 3)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const stateIds = (location.state as any)?.selectedCareerIds || [];
    const stateCareers = (location.state as any)?.selectedCareers || [];
    if (stateIds.length > 0) return stateIds.slice(0, 3);
    if (stateCareers.length > 0) return stateCareers.map((c: any) => c.id).slice(0, 3);

    const searchParams = new URLSearchParams(location.search);
    const queryIds = searchParams.get('ids') || searchParams.get('careerIds');
    if (queryIds) {
      return queryIds.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);
    }
    return [];
  });

  // Active View Tab: 'careers' | 'roadmaps'
  const [activeTab, setActiveTab] = useState<'careers' | 'roadmaps'>('careers');

  // Comparison Data States
  const [careerComparison, setCareerComparison] = useState<CareerComparisonResponse | null>(null);
  const [roadmapComparison, setRoadmapComparison] = useState<RoadmapComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);

  // Add Career Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [allCareersList, setAllCareersList] = useState<Career[]>([]);
  const [careerSearchQuery, setCareerSearchQuery] = useState<string>('');
  const [loadingCatalogue, setLoadingCatalogue] = useState<boolean>(false);

  // Detail Modal for Single Career
  const [selectedDetailCareer, setSelectedDetailCareer] = useState<Career | null>(null);

  // Fetch comparison data whenever selectedIds change
  const fetchComparisonData = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setCareerComparison(null);
      setRoadmapComparison(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [careersRes, roadmapRes] = await Promise.all([
        CareerService.compareCareers(ids),
        RoadmapService.compareRoadmaps(ids).catch((err) => {
          console.warn('Could not load roadmap comparison:', err);
          return null;
        }),
      ]);

      setCareerComparison(careersRes);
      if (roadmapRes) {
        setRoadmapComparison(roadmapRes);
      }
    } catch (err: any) {
      console.error('Failed to load career comparison:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load comparison.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparisonData(selectedIds);
  }, [selectedIds, fetchComparisonData]);

  // Load career catalogue for "Add Career" modal
  const handleOpenAddModal = async () => {
    if (selectedIds.length >= 3) {
      setToastMessage({
        type: 'warning',
        text: 'Maximum 3 careers can be compared at once. Remove one to add another.',
      });
      return;
    }

    setShowAddModal(true);
    if (allCareersList.length === 0) {
      setLoadingCatalogue(true);
      try {
        const res = await CareerService.getCareers();
        setAllCareersList(res.careers);
      } catch (err) {
        console.error('Failed to load career catalogue:', err);
      } finally {
        setLoadingCatalogue(false);
      }
    }
  };

  // Add career to comparison
  const handleAddCareer = (careerId: string) => {
    if (selectedIds.includes(careerId)) {
      setToastMessage({ type: 'warning', text: 'Career is already in comparison.' });
      return;
    }
    if (selectedIds.length >= 3) {
      setToastMessage({
        type: 'warning',
        text: 'Maximum 3 careers can be compared at once.',
      });
      setShowAddModal(false);
      return;
    }

    const updated = [...selectedIds, careerId];
    setSelectedIds(updated);
    setShowAddModal(false);
    setCareerSearchQuery('');
  };

  // Remove career from comparison
  const handleRemoveCareer = (careerId: string) => {
    const updated = selectedIds.filter((id) => id !== careerId);
    setSelectedIds(updated);
  };

  // Clear all
  const handleClearAll = () => {
    setSelectedIds([]);
  };

  // Choose This Career handler (sets target career in profile and syncs)
  const handleChooseTargetCareer = async (career: Career) => {
    try {
      if (saveProfile) {
        await saveProfile({
          ...(profile || {}),
          careerGoals: {
            ...(profile?.careerGoals || {}),
            dreamCareer: career.title,
            preferredIndustries: profile?.careerGoals?.preferredIndustries || [career.category],
          },
        });
      }

      setToastMessage({
        type: 'success',
        text: `Target career updated to ${career.title}! Your roadmap and dashboard are now aligned.`,
      });

      // Update local state to reflect target status
      if (careerComparison) {
        setCareerComparison({
          ...careerComparison,
          careers: careerComparison.careers.map((c) => ({
            ...c,
            isTargetCareer: c.id === career.id || c.title.toLowerCase() === career.title.toLowerCase(),
          })),
        });
      }
    } catch (err) {
      console.error('Failed to update target career:', err);
      setToastMessage({ type: 'error', text: 'Could not update target career. Please try again.' });
    }
  };

  // Navigate to Roadmap for selected career
  const handleNavigateToRoadmap = (career: Career) => {
    navigate('/roadmap', { state: { selectedCareer: career, careerId: career.id } });
  };

  // Toggle bookmark / saved career
  const handleToggleBookmark = async (career: Career) => {
    try {
      if (career.saved) {
        await CareerService.unsaveCareer(career.id);
        setToastMessage({ type: 'success', text: `Removed ${career.title} from bookmarks.` });
      } else {
        await CareerService.saveCareer(career.id);
        setToastMessage({ type: 'success', text: `Saved ${career.title} to bookmarks!` });
      }

      if (careerComparison) {
        setCareerComparison({
          ...careerComparison,
          careers: careerComparison.careers.map((c) =>
            c.id === career.id ? { ...c, saved: !c.saved } : c
          ),
        });
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      setToastMessage({ type: 'error', text: 'Could not update bookmark.' });
    }
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Education info summary for display
  const studentStream = profile?.education?.stream || careerComparison?.userEducation?.stream || 'General Studies';
  const studentLevel = profile?.education?.level || careerComparison?.userEducation?.level || 'Education';
  const studentClass = profile?.education?.currentClass || careerComparison?.userEducation?.currentClass;
  const educationSummary = studentClass
    ? `${studentLevel} (${studentClass}) • ${studentStream}`
    : `${studentLevel} • ${studentStream}`;

  return (
    <div className={styles.compareContainer}>
      {/* Header & Back Link */}
      <div className={styles.compareHeader}>
        <div className={styles.titleArea}>
          <button className={styles.backLink} onClick={() => navigate('/explore')}>
            ← Back to Career Explorer
          </button>
          <h1 className={styles.pageTitle}>
            Career & Roadmap Comparison
          </h1>
          <p className={styles.pageSubtitle}>
            Compare career pathways, course relevance, required skills, and roadmap structures side-by-side to make confident decisions.
          </p>
          <div className={styles.educationBadge}>
            🎓 Evaluated for: {educationSummary}
          </div>
        </div>

        {/* Action Controls */}
        <div className={styles.actionsGroup}>
          <button
            className={styles.addCareerBtn}
            onClick={handleOpenAddModal}
            disabled={selectedIds.length >= 3}
            title={selectedIds.length >= 3 ? 'Maximum 3 careers can be compared' : 'Add career'}
          >
            + Add Career to Compare ({selectedIds.length}/3)
          </button>
          {selectedIds.length > 0 && (
            <button className={styles.clearAllBtn} onClick={handleClearAll}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Toolbar / Mode Selector */}
      {selectedIds.length > 0 && (
        <div className={styles.toolbarArea}>
          <div className={styles.tabGroup}>
            <button
              className={`${styles.tabButton} ${activeTab === 'careers' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('careers')}
            >
              📊 Career Comparison
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'roadmaps' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('roadmaps')}
            >
              🗺️ Roadmap Comparison
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`${styles.toastNotice} ${styles[toastMessage.type]}`}>
          <span>{toastMessage.text}</span>
          <button className={styles.clearAllBtn} onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* Loading & Error States */}
      {loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⏳</div>
          <h2 className={styles.emptyTitle}>Loading Comparison Data...</h2>
          <p className={styles.emptyText}>Evaluating course relevance, career paths, and milestone roadmaps...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⚠️</div>
          <h2 className={styles.emptyTitle}>Could Not Load Comparison</h2>
          <p className={styles.emptyText}>{error}</p>
          <button className={styles.emptyActionBtn} onClick={() => fetchComparisonData(selectedIds)}>
            Retry
          </button>
        </div>
      )}

      {/* Empty State when no careers selected */}
      {selectedIds.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h2 className={styles.emptyTitle}>Select Careers to Compare</h2>
          <p className={styles.emptyText}>
            Choose up to 3 careers from your course recommendations or the career catalogue to compare them side-by-side.
          </p>
          <button className={styles.emptyActionBtn} onClick={handleOpenAddModal}>
            + Browse & Add Careers
          </button>
        </div>
      )}

      {/* View Mode 1: Career Comparison View */}
      {activeTab === 'careers' && careerComparison && !loading && selectedIds.length > 0 && (
        <div
          className={styles.comparisonGrid}
          style={{ '--cols': careerComparison.careers.length } as React.CSSProperties}
        >
          {careerComparison.careers.map((career) => {
            const isTarget = career.isTargetCareer || profile?.careerGoals?.dreamCareer?.toLowerCase() === career.title.toLowerCase();
            const rel = career.courseRelevance;
            const relClass = rel?.relevanceLevel === 'Strongly Relevant'
              ? styles.stronglyRelevant
              : rel?.relevanceLevel === 'Requires Additional Education / Transition'
              ? styles.transitionRequired
              : styles.relevant;

            const uniqueSkills = careerComparison.uniqueSkillsByCareer[career.id] || [];

            return (
              <div
                key={career.id}
                className={`${styles.careerColumnCard} ${isTarget ? styles.targetCareerCard : ''}`}
              >
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderTop}>
                    <span className={styles.categoryTag}>{career.category}</span>
                    <div className={styles.headerActions}>
                      <button
                        className={`${styles.iconBtn} ${career.saved ? styles.saved : ''}`}
                        onClick={() => handleToggleBookmark(career)}
                        title={career.saved ? 'Saved in Bookmarks' : 'Save to Bookmarks'}
                      >
                        {career.saved ? '★' : '☆'}
                      </button>
                      <button
                        className={`${styles.iconBtn} ${styles.removeBtn}`}
                        onClick={() => handleRemoveCareer(career.id)}
                        title="Remove from comparison"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <h2 className={styles.careerTitle}>{career.title}</h2>

                  {isTarget && (
                    <span className={styles.targetBadge}>⭐ Your Target Career</span>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className={styles.cardPrimaryActions}>
                  <button
                    className={`${styles.chooseCareerBtn} ${isTarget ? styles.alreadyChosen : ''}`}
                    onClick={() => !isTarget && handleChooseTargetCareer(career)}
                    disabled={isTarget}
                  >
                    {isTarget ? '✓ Selected Target Career' : '⭐ Choose This Career'}
                  </button>

                  <div className={styles.secondaryActionRow}>
                    <button
                      className={styles.secondaryActionBtn}
                      onClick={() => handleNavigateToRoadmap(career)}
                    >
                      🚀 View Roadmap
                    </button>
                    <button
                      className={styles.secondaryActionBtn}
                      onClick={() => setSelectedDetailCareer(career)}
                    >
                      🔍 Details
                    </button>
                  </div>
                </div>

                {/* Card Body & Comparison Attributes */}
                <div className={styles.cardBody}>
                  {/* 1. Course / Education Relevance */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabel}>🎓 Course Relevance</div>
                    <div className={`${styles.relevanceBox} ${relClass}`}>
                      <div className={styles.relevanceVerdict}>
                        {rel?.relevanceLevel === 'Strongly Relevant' ? '✓' : rel?.relevanceLevel === 'Requires Additional Education / Transition' ? '⚠' : 'ℹ'}{' '}
                        {rel?.relevanceLevel || 'Relevant'}
                      </div>
                      <p className={styles.relevanceReason}>
                        {rel?.reason || 'Aligned with your student profile and career interests.'}
                      </p>
                    </div>
                  </div>

                  {/* 2. Overview & Description */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabel}>📋 What This Career Does</div>
                    <p className={styles.sectionText}>{career.description}</p>
                  </div>

                  {/* 3. Key Responsibilities */}
                  {career.responsibilities && career.responsibilities.length > 0 && (
                    <div className={styles.sectionBlock}>
                      <div className={styles.sectionLabel}>💼 Core Responsibilities</div>
                      <ul className={styles.responsibilitiesList}>
                        {career.responsibilities.slice(0, 3).map((r, i) => (
                          <li key={i} className={styles.responsibilityItem}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 4. Education Pathway */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabel}>🏛️ Education Requirements</div>
                    <p className={styles.sectionText}>{career.education}</p>
                  </div>

                  {/* 5. Required Skills (Shared vs Unique) */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabel}>⚡ Required Skills</div>
                    <div className={styles.skillsWrap}>
                      {career.skills.map((skill) => {
                        const isShared = careerComparison.sharedSkills.includes(skill);
                        const isUnique = uniqueSkills.includes(skill);
                        const pillClass = isShared
                          ? styles.sharedSkillPill
                          : isUnique
                          ? styles.uniqueSkillPill
                          : styles.skillPill;

                        return (
                          <span
                            key={skill}
                            className={pillClass}
                            title={isShared ? 'Shared across compared careers' : isUnique ? 'Unique to this career' : ''}
                          >
                            {isShared ? '✓ ' : ''}{skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6. Relevant Subjects */}
                  {career.courseRelevance?.relevantSubjects && career.courseRelevance.relevantSubjects.length > 0 && (
                    <div className={styles.sectionBlock}>
                      <div className={styles.sectionLabel}>📚 Key Academic Subjects</div>
                      <div className={styles.skillsWrap}>
                        {career.courseRelevance.relevantSubjects.map((sub) => (
                          <span key={sub} className={styles.skillPill}>{sub}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 7. Key Entrance & Qualification Requirements */}
                  {career.courseRelevance?.entranceRequirements && career.courseRelevance.entranceRequirements.length > 0 && (
                    <div className={styles.sectionBlock}>
                      <div className={styles.sectionLabel}>📝 Key Entrance & Checkpoints</div>
                      <ul className={styles.responsibilitiesList}>
                        {career.courseRelevance.entranceRequirements.slice(0, 3).map((ent, i) => (
                          <li key={i} className={styles.responsibilityItem}>{ent}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 8. Market Demand & Salary Metrics */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabel}>📈 Market & Salary Outlook</div>
                    <div className={styles.metricsRow}>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Salary Range</span>
                        <span className={styles.metricValue}>{career.salaryRange}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Growth Rate</span>
                        <span className={styles.metricValue}>{career.growthRate}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Demand Level</span>
                        <span className={styles.metricValue}>{career.demandLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* 9. Career Match Compatibility */}
                  {career.match && (
                    <div className={styles.sectionBlock}>
                      <div className={styles.sectionLabel}>🎯 Your Profile Compatibility</div>
                      <div className={styles.matchBlock}>
                        <div>
                          <div className={styles.matchScore}>{career.match.matchScore}% Match</div>
                          <div className={styles.matchLevel}>{career.match.matchLevel} Compatibility</div>
                        </div>
                        <button
                          className={styles.secondaryActionBtn}
                          onClick={() => setSelectedDetailCareer(career)}
                        >
                          View Gap Analysis →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 2: Roadmap Comparison View */}
      {activeTab === 'roadmaps' && roadmapComparison && !loading && selectedIds.length > 0 && (
        <>
          {/* Key Differences Banner */}
          {roadmapComparison.pathDifferences && (
            <div className={styles.differencesBanner}>
              <div className={styles.differencesHeader}>
                🗺️ How The Learning Paths Differ
              </div>
              <ul className={styles.differencesList}>
                {roadmapComparison.pathDifferences.keyDifferences.map((diff, i) => (
                  <li
                    key={i}
                    className={styles.differencesItem}
                    dangerouslySetInnerHTML={{ __html: diff.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Side-by-Side Roadmap Columns */}
          <div
            className={styles.comparisonGrid}
            style={{ '--cols': roadmapComparison.roadmaps.length } as React.CSSProperties}
          >
            {roadmapComparison.roadmaps.map((rm) => {
              const matchedCareer = careerComparison?.careers.find((c) => c.id === rm.careerId);
              const isTarget = matchedCareer?.isTargetCareer || profile?.careerGoals?.dreamCareer?.toLowerCase() === rm.careerTitle.toLowerCase();

              return (
                <div
                  key={rm.careerId}
                  className={`${styles.careerColumnCard} ${isTarget ? styles.targetCareerCard : ''}`}
                >
                  {/* Roadmap Column Header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderTop}>
                      <span className={styles.categoryTag}>{rm.category}</span>
                      <button
                        className={`${styles.iconBtn} ${styles.removeBtn}`}
                        onClick={() => handleRemoveCareer(rm.careerId)}
                        title="Remove from comparison"
                      >
                        ✕
                      </button>
                    </div>

                    <h2 className={styles.careerTitle}>{rm.careerTitle} Roadmap</h2>
                    <div className={styles.metricsRow}>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Total Stages</span>
                        <span className={styles.metricValue}>{rm.totalStages} Stages</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Milestones</span>
                        <span className={styles.metricValue}>{rm.totalMilestones} Milestones</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Skills Trained</span>
                        <span className={styles.metricValue}>{rm.allSkills.length} Skills</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.cardPrimaryActions}>
                    <button
                      className={`${styles.chooseCareerBtn} ${isTarget ? styles.alreadyChosen : ''}`}
                      onClick={() => matchedCareer && !isTarget && handleChooseTargetCareer(matchedCareer)}
                      disabled={isTarget}
                    >
                      {isTarget ? '✓ Selected Target Career' : '⭐ Choose This Career'}
                    </button>
                    <button
                      className={styles.secondaryActionBtn}
                      onClick={() => matchedCareer && handleNavigateToRoadmap(matchedCareer)}
                    >
                      🚀 Continue to Full Roadmap →
                    </button>
                  </div>

                  {/* Roadmap Stages Progression */}
                  <div className={styles.cardBody}>
                    {/* Primary Learning Direction */}
                    <div className={styles.sectionBlock}>
                      <div className={styles.sectionLabel}>🎯 Core Learning Direction</div>
                      <p className={styles.sectionText}>{rm.coreLearningDirection}</p>
                    </div>

                    {/* Stage Breakdown */}
                    <div className={styles.sectionBlock}>
                      <div className={styles.sectionLabel}>📍 Stage-by-Stage Progression</div>
                      <div className={styles.stageList}>
                        {rm.stages.map((st) => (
                          <div key={st.stageIndex} className={styles.stageCard}>
                            <div className={styles.stageHeader}>
                              <span className={styles.stageTitle}>
                                {st.stageIndex}. {st.title}
                              </span>
                              <span className={styles.milestoneCountBadge}>
                                {st.milestonesCount} milestones
                              </span>
                            </div>

                            {/* Milestone Titles preview */}
                            <ul className={styles.responsibilitiesList}>
                              {st.milestoneTitles.slice(0, 3).map((mTitle, mi) => (
                                <li key={mi} className={styles.responsibilityItem}>
                                  {mTitle}
                                </li>
                              ))}
                            </ul>

                            {/* Stage Skills */}
                            {st.skills.length > 0 && (
                              <div className={styles.skillsWrap} style={{ marginTop: '0.35rem' }}>
                                {st.skills.slice(0, 4).map((sk) => (
                                  <span key={sk} className={styles.skillPill}>{sk}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Practical Projects */}
                    {rm.keyProjects && rm.keyProjects.length > 0 && (
                      <div className={styles.sectionBlock}>
                        <div className={styles.sectionLabel}>🛠️ Practical Projects Included</div>
                        <ul className={styles.responsibilitiesList}>
                          {rm.keyProjects.slice(0, 4).map((proj, pi) => (
                            <li key={pi} className={styles.responsibilityItem}>
                              {proj}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add Career Search Modal */}
      {showAddModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Select Career to Compare</h3>
              <button className={styles.iconBtn} onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <div className={styles.modalSearch}>
              <input
                type="text"
                className={styles.modalSearchInput}
                placeholder="Search careers by title or category..."
                value={careerSearchQuery}
                onChange={(e) => setCareerSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className={styles.modalList}>
              {loadingCatalogue ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Loading career catalogue...
                </div>
              ) : (
                allCareersList
                  .filter((c) =>
                    !careerSearchQuery ||
                    c.title.toLowerCase().includes(careerSearchQuery.toLowerCase()) ||
                    c.category.toLowerCase().includes(careerSearchQuery.toLowerCase())
                  )
                  .map((c) => {
                    const isAlreadySelected = selectedIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        className={`${styles.modalItem} ${isAlreadySelected ? styles.alreadySelected : ''}`}
                        onClick={() => !isAlreadySelected && handleAddCareer(c.id)}
                      >
                        <div>
                          <div className={styles.modalItemTitle}>{c.title}</div>
                          <div className={styles.modalItemCategory}>{c.category}</div>
                        </div>
                        <div>
                          {isAlreadySelected ? (
                            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Added</span>
                          ) : (
                            <span style={{ fontSize: '0.8125rem', color: '#38bdf8', fontWeight: 600 }}>+ Select</span>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for Full Single Career Exploration */}
      {selectedDetailCareer && (
        <CareerDetailsModal
          career={selectedDetailCareer}
          onClose={() => setSelectedDetailCareer(null)}
          onToggleBookmark={(c: Career) => handleToggleBookmark(c)}
          onToggleCompare={(c: Career) => handleAddCareer(c.id)}
          compareList={careerComparison?.careers || []}
          onSetTargetCareer={(c: Career) => handleChooseTargetCareer(c)}
          targetCareerTitle={profile?.careerGoals?.dreamCareer || ''}
        />
      )}
    </div>
  );
};

export default CareerComparePage;
