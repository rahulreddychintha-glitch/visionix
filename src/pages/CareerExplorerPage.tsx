import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { CareerService } from '../services/career.service';
import type { Career } from '../services/career.service';
import { RoadmapService } from '../services/roadmap.service';
import { useProfile } from '../hooks/useProfile';
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  X, 
  GitCompare, 
  Loader2, 
  ArrowUpRight,
  Sparkles,
  Heart,
  Compass,
  Rocket
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './CareerExplorerPage.module.css';
import { CareerDetailsModal } from '../components/dashboard/CareerDetailsModal';

const CATEGORIES = [
  "All",
  "Healthcare",
  "Technology",
  "Engineering",
  "Science",
  "Business & Finance",
  "Law",
  "Arts & Design",
  "Education",
  "Hospitality & Tourism",
  "Media & Entertainment",
  "Agriculture",
  "Government",
  "Defence",
  "Skilled Trades",
  "Other"
];

export const CareerExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, saveProfile } = useProfile();
  const [careers, setCareers] = useState<Career[]>([]);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [existingRoadmaps, setExistingRoadmaps] = useState<Record<string, boolean>>({});
  
  const [showRecommended, setShowRecommended] = useState<boolean>(false);
  const [showCareerMatch, setShowCareerMatch] = useState<boolean>(false);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(true);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [relevanceFilter, setRelevanceFilter] = useState<string>('All');

  // Drawer / Detail states
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [compareList, setCompareList] = useState<Career[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Target Career state
  const targetCareerTitle = profile?.careerGoals?.dreamCareer || '';

  const isTargetCareer = useCallback((c: Career) => {
    if (!targetCareerTitle) return false;
    return targetCareerTitle.toLowerCase() === c.title.toLowerCase() || targetCareerTitle.toLowerCase() === c.id.toLowerCase();
  }, [targetCareerTitle]);

  // Fetch user roadmaps to accurately display View Roadmap vs Create Roadmap
  const fetchUserRoadmaps = useCallback(async () => {
    try {
      const roadmaps = await RoadmapService.getUserRoadmaps();
      const map: Record<string, boolean> = {};
      roadmaps.forEach((r) => {
        map[r.careerId.toLowerCase()] = true;
        map[r.careerTitle.toLowerCase()] = true;
      });
      setExistingRoadmaps(map);
    } catch (err) {
      console.warn('Error fetching user roadmaps in explorer:', err);
    }
  }, []);

  useEffect(() => {
    fetchUserRoadmaps();
  }, [fetchUserRoadmaps]);

  // Fetch careers from API
  const fetchCareers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (showRecommended) {
        const response = await CareerService.getRecommendations(
          searchQuery ? searchQuery : undefined,
          selectedCategory !== 'All' ? selectedCategory : undefined
        );
        setCareers(response.careers);
        setIsProfileComplete(response.isProfileComplete);
        setIsMockMode(response.isMockMode);
      } else {
        const response = await CareerService.getCareers(
          searchQuery ? searchQuery : undefined,
          selectedCategory !== 'All' ? selectedCategory : undefined
        );
        let list = response.careers;
        if (showCareerMatch) {
          const firstCareer = response.careers[0];
          if (firstCareer && firstCareer.match) {
            setIsProfileComplete(firstCareer.match.isProfileComplete);
          } else {
            setIsProfileComplete(true);
          }
          list = [...response.careers].sort((a, b) => (b.match?.matchScore || 0) - (a.match?.matchScore || 0));
        } else {
          setIsProfileComplete(true);
        }
        setCareers(list);
        setIsMockMode(response.isMockMode);
      }
    } catch (err: any) {
      console.error('Error fetching careers:', err);
      setError('Failed to load careers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, showRecommended, showCareerMatch]);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  // Handle setting target career
  const handleSetTargetCareer = async (career: Career) => {
    try {
      const updatedGoals = {
        ...(profile?.careerGoals || {}),
        dreamCareer: career.title,
      };
      await saveProfile({
        ...(profile || {}),
        careerGoals: updatedGoals,
      });
      CareerService.clearCache();
    } catch (err) {
      console.error('Error setting target career:', err);
    }
  };

  // Handle bookmark toggle
  const handleToggleBookmark = async (career: Career, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    try {
      if (career.saved) {
        await CareerService.unsaveCareer(career.id);
        setCareers((prev) =>
          prev.map((c) => (c.id === career.id ? { ...c, saved: false } : c))
        );
        if (selectedCareer?.id === career.id) {
          setSelectedCareer((prev) => (prev ? { ...prev, saved: false } : null));
        }
        setCompareList((prev) =>
          prev.map((c) => (c.id === career.id ? { ...c, saved: false } : c))
        );
      } else {
        await CareerService.saveCareer(career.id);
        setCareers((prev) =>
          prev.map((c) => (c.id === career.id ? { ...c, saved: true } : c))
        );
        if (selectedCareer?.id === career.id) {
          setSelectedCareer((prev) => (prev ? { ...prev, saved: true } : null));
        }
        setCompareList((prev) =>
          prev.map((c) => (c.id === career.id ? { ...c, saved: true } : c))
        );
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const [compareLimitToast, setCompareLimitToast] = useState<string | null>(null);

  // Handle compare list modification (Strict limit: Max 3)
  const handleToggleCompare = (career: Career) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === career.id);
      if (exists) {
        return prev.filter((c) => c.id !== career.id);
      }
      if (prev.length >= 3) {
        setCompareLimitToast('Maximum 3 careers can be compared at once. Remove one to add another.');
        return prev;
      }
      return [...prev, career];
    });
  };

  useEffect(() => {
    if (compareLimitToast) {
      const t = setTimeout(() => setCompareLimitToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [compareLimitToast]);

  // Filter local careers array for relevance filtering
  const displayedCareers = careers.filter((c) => {
    if (relevanceFilter === 'All') return true;
    if (relevanceFilter === 'Dream Career') return c.relevanceTag === 'Dream Career' || isTargetCareer(c);
    if (relevanceFilter === 'Interested') return c.relevanceTag === 'Interested';
    if (relevanceFilter === 'Relevant') return c.relevanceTag === 'Relevant';
    return true;
  });

  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div className="glow-accent-primary" style={{ width: '400px', height: '400px', top: '15%', left: '20%', opacity: 0.3 }} />

      <div className={styles.container}>
        
        {/* Header Title Section */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div>
              <h1 className="text-heading" style={{ fontSize: '1.8rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Explore Careers
                {isMockMode && (
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#f59e0b',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    Demo Mode
                  </span>
                )}
              </h1>
              <p className="text-description" style={{ fontSize: '0.9rem' }}>
                Discover career pathways, evaluate profile compatibility, and build your personalized learning roadmap.
              </p>
            </div>
            
            {/* Student-Friendly Mode Switcher Tabs */}
            <div className={styles.headerPills}>
              <button 
                type="button"
                className={`${styles.headerPill} ${!showRecommended && !showCareerMatch ? styles.headerPillActive : ''}`}
                onClick={() => {
                  setShowRecommended(false);
                  setShowCareerMatch(false);
                  setSelectedCategory('All');
                }}
              >
                <Compass size={16} />
                <div style={{ textAlign: 'left' }}>
                  <div className={styles.pillTitle}>All Careers</div>
                  <div className={styles.pillSubtitle}>Browse & Search</div>
                </div>
              </button>

              <button 
                type="button"
                className={`${styles.headerPill} ${showRecommended ? styles.headerPillActive : ''}`}
                onClick={() => {
                  setShowRecommended(true);
                  setShowCareerMatch(false);
                  setSelectedCategory('All');
                }}
              >
                <Sparkles size={16} />
                <div style={{ textAlign: 'left' }}>
                  <div className={styles.pillTitle}>Recommended for You</div>
                  <div className={styles.pillSubtitle}>
                    {profile?.education?.stream ? `Relevant to ${profile.education.stream}` : 'Profile Picks'}
                  </div>
                </div>
              </button>
              
              <button 
                type="button"
                className={`${styles.headerPill} ${showCareerMatch ? styles.headerPillActive : ''}`}
                onClick={() => {
                  setShowCareerMatch(true);
                  setShowRecommended(false);
                  setSelectedCategory('All');
                }}
                title="View your compatibility match score for all careers"
              >
                <Heart size={16} style={{ color: showCareerMatch ? '#a78bfa' : '#ec4899' }} />
                <div style={{ textAlign: 'left' }}>
                  <div className={styles.pillTitle}>Career Match</div>
                  <div className={styles.pillSubtitle}>Ranked by Fit</div>
                </div>
              </button>
              
              <Link to="/saved" className={styles.headerPill} style={{ textDecoration: 'none' }}>
                <BookmarkCheck size={16} />
                <div style={{ textAlign: 'left' }}>
                  <div className={styles.pillTitle}>Saved Bookmarks</div>
                  <div className={styles.pillSubtitle}>Saved Careers</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Unified Journey Step Guide */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>1. Discover & Explore</span>
          <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>→</span>
          <span style={{ color: showCareerMatch ? 'var(--color-primary)' : 'var(--text-secondary)', fontWeight: showCareerMatch ? 700 : 500 }}>2. Match & Fit</span>
          <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>→</span>
          <span style={{ color: compareList.length > 0 ? 'var(--color-primary)' : 'var(--text-secondary)', fontWeight: compareList.length > 0 ? 700 : 500 }}>3. Compare</span>
          <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>→</span>
          <span style={{ color: targetCareerTitle ? '#fbbf24' : 'var(--text-secondary)', fontWeight: targetCareerTitle ? 700 : 500 }}>4. Choose Target Career</span>
          <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>→</span>
          <span style={{ color: 'var(--text-secondary)' }}>5. Roadmap & Skills</span>
          <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>→</span>
          <span style={{ color: 'var(--text-secondary)' }}>6. Learn & Progress</span>
        </div>

        {compareLimitToast && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '0.86rem',
            fontWeight: 500,
            animation: 'fadeIn 0.2s ease-in-out'
          }}>
            <span>⚠️ {compareLimitToast}</span>
            <button
              onClick={() => setCompareLimitToast(null)}
              style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px 6px' }}
            >
              ✕
            </button>
          </div>
        )}

        {showCareerMatch && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.2)', padding: '12px 16px', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#f472b6' }}>
              <strong>Career Match Mode Active:</strong> Showing careers ranked by compatibility score with your profile.
            </p>
            <button 
              className="premiumButtonSecondary" 
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              onClick={() => setShowCareerMatch(false)}
            >
              Back to All Careers
            </button>
          </div>
        )}

        {/* Search & Filters Section */}
        <div className={styles.controlsSection}>
          <div className={styles.searchBarRow}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search by career title, category, or required skills..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className={styles.filterSelect}
              value={relevanceFilter}
              onChange={(e) => setRelevanceFilter(e.target.value)}
              aria-label="Filter by profile relevance"
            >
              <option value="All">All Careers</option>
              <option value="Dream Career">⭐ Target Career</option>
              <option value="Interested">💜 Interested Careers</option>
              <option value="Relevant">📚 Relevant to Degree</option>
            </select>
          </div>

          {/* Categories Tab Bar */}
          <div className={styles.categoriesWrapper}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.categoryTab} ${selectedCategory === cat ? styles.categoryTabActive : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 className="spin-animation" size={36} style={{ color: 'var(--color-primary)' }} />
          </div>
        ) : error ? (
          <div className={styles.neutralState}>
            <p className={styles.neutralTitle}>Error Encountered</p>
            <p className={styles.neutralText}>{error}</p>
            <button className="premiumButtonPrimary" onClick={fetchCareers}>
              Retry Load
            </button>
          </div>
        ) : (showRecommended || showCareerMatch) && !isProfileComplete ? (
          <div className={styles.neutralState}>
            <p className={styles.neutralTitle}>Personalize Your Profile</p>
            <p className={styles.neutralText}>
              Complete more of your profile to receive personalized compatibility match scores and recommendations.
            </p>
            <Link to="/profile" className="premiumButtonPrimary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Update Profile
            </Link>
          </div>
        ) : displayedCareers.length === 0 ? (
          <div className={styles.neutralState}>
            <p className={styles.neutralTitle}>{showRecommended ? "No Recommendations Available" : "No Careers Found"}</p>
            <p className={styles.neutralText}>
              {showRecommended
                ? "Personalized career recommendations are currently unavailable."
                : (searchQuery || selectedCategory !== 'All' || relevanceFilter !== 'All'
                  ? "No careers match the selected search terms or active filters."
                  : "No career definitions currently available.")}
            </p>
            {showRecommended ? (
              <Link to="/profile" className="premiumButtonSecondary" style={{ textDecoration: 'none' }}>
                Edit Profile
              </Link>
            ) : (
              (searchQuery || selectedCategory !== 'All' || relevanceFilter !== 'All') && (
                <button
                  className="premiumButtonSecondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setRelevanceFilter('All');
                  }}
                >
                  Clear Filters
                </button>
              )
            )}
          </div>
        ) : (
          /* Grid of Careers */
          <div className={styles.grid}>
            {displayedCareers.map((career) => {
              const isTarget = isTargetCareer(career);

              return (
                <div 
                  key={career.id} 
                  className={`${styles.card} premiumCard`}
                  style={isTarget ? {
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.08)'
                  } : undefined}
                >
                  <div className={styles.cardHeader}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                      {isTarget && (
                        <span style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          ⭐ Target Career
                        </span>
                      )}
                      {!isTarget && career.relevanceTag === 'Dream Career' && (
                        <span className={`${styles.relevanceBadge} ${styles.dreamCareerBadge}`}>⭐ Dream Career</span>
                      )}
                      {career.courseRelevance?.relevanceTag && (
                        <span className={styles.relevanceBadge} style={{
                          background: career.courseRelevance.relevanceLevel === 'Strongly Relevant' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: career.courseRelevance.relevanceLevel === 'Strongly Relevant' ? '#34d399' : '#60a5fa',
                          border: career.courseRelevance.relevanceLevel === 'Strongly Relevant' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                          {career.courseRelevance.relevanceLevel === 'Strongly Relevant' ? '✓ ' : ''}{career.courseRelevance.relevanceTag}
                        </span>
                      )}
                      {!career.courseRelevance && career.relevanceTag === 'Interested' && (
                        <span className={`${styles.relevanceBadge} ${styles.interestedBadge}`}>💜 Interested</span>
                      )}
                      {!career.courseRelevance && career.relevanceTag === 'Relevant' && (
                        <span className={`${styles.relevanceBadge} ${styles.relevantBadge}`}>📚 Relevant</span>
                      )}
                    </div>
                    
                    <button
                      className={`${styles.bookmarkBtn} ${career.saved ? styles.bookmarked : ''}`}
                      onClick={(e) => handleToggleBookmark(career, e)}
                      aria-label={career.saved ? 'Unsaved bookmark' : 'Save bookmark'}
                    >
                      {career.saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  </div>

                  <div className={styles.cardBody}>
                    <p className={styles.cardCategory}>{career.category}</p>
                    <h3 className={styles.cardTitle}>{career.title}</h3>
                    <p className="text-caption" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {career.description}
                    </p>
                    
                    {career.skills.length > 0 && (
                      <div className={styles.cardSkills}>
                        {career.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                        {career.skills.length > 3 && (
                          <span className={styles.skillTag}>+{career.skills.length - 3}</span>
                        )}
                      </div>
                    )}

                    {showRecommended && career.recommendationReason && (
                      <div style={{
                        marginTop: '12px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: 'rgba(124, 58, 237, 0.05)',
                        border: '1px solid rgba(124, 58, 237, 0.15)'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#a78bfa', lineHeight: '1.4' }}>
                          <strong>Relevance:</strong> {career.recommendationReason}
                        </p>
                      </div>
                    )}

                    {showCareerMatch && career.match && (
                      <div style={{
                        marginTop: '12px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: 'rgba(236, 72, 153, 0.04)',
                        border: '1px solid rgba(236, 72, 153, 0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f472b6' }}>
                            {career.match.isProfileComplete ? `${career.match.matchScore}% Match` : 'Not Specified'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: career.match.isProfileComplete && career.match.matchScore >= 75 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                            {career.match.isProfileComplete ? `${career.match.matchLevel} Alignment` : 'Incomplete Profile'}
                          </span>
                        </div>
                        {career.match.isProfileComplete && (
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <strong>Strength:</strong> {career.match.strengths[0] || 'Domain exposure'}
                            </p>
                            <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <strong>Gap:</strong> {career.match.skillGaps[0]?.replace(/^(Missing verified skill: |Missing career skill: |Missing skill: )/, '') || 'None'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <label className={styles.compareLabel}>
                      <input
                        type="checkbox"
                        className={styles.compareCheckbox}
                        checked={compareList.some((c) => c.id === career.id)}
                        onChange={() => handleToggleCompare(career)}
                      />
                      Compare
                    </label>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        className={styles.detailsBtn}
                        onClick={() => setSelectedCareer(career)}
                      >
                        <span>View Details</span>
                        <ArrowUpRight size={14} />
                      </button>

                      {(() => {
                        const hasRoadmap = Boolean(existingRoadmaps[career.id.toLowerCase()] || existingRoadmaps[career.title.toLowerCase()]);
                        return (
                          <button
                            type="button"
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#fff',
                              background: hasRoadmap 
                                ? 'linear-gradient(135deg, #059669, #10b981)' 
                                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => navigate('/roadmap', { state: { selectedCareer: career } })}
                          >
                            <Rocket size={13} />
                            <span>{hasRoadmap ? 'View Roadmap' : 'Create Roadmap'}</span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Compare Toolbar Drawer (Only appears when items are selected) */}
        {compareList.length > 0 && (
          <div className={styles.compareDrawer}>
            <span className={styles.drawerText}>
              Comparing <strong>{compareList.length}</strong>/3 careers
            </span>
            <div className={styles.drawerItems}>
              {compareList.map((item) => (
                <div key={item.id} className={styles.drawerItemChip}>
                  <span>{item.title}</span>
                  <button onClick={() => handleToggleCompare(item)} aria-label="Remove career from compare list">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className="premiumButtonPrimary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                onClick={() => navigate('/compare', { state: { selectedCareerIds: compareList.map(c => c.id), selectedCareers: compareList } })}
              >
                <GitCompare size={14} />
                <span>Compare Careers ({compareList.length}/3)</span>
              </button>

              <button
                className="premiumButtonSecondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                onClick={() => navigate('/compare', { state: { selectedCareerIds: compareList.map(c => c.id), selectedCareers: compareList, activeTab: 'roadmaps' } })}
              >
                <span>🗺️ Compare Roadmaps</span>
              </button>
            </div>
          </div>
        )}

        {/* Career Details Modal with Unified Journey Connections */}
        {selectedCareer && (
          <CareerDetailsModal
            career={selectedCareer}
            onClose={() => setSelectedCareer(null)}
            onToggleBookmark={handleToggleBookmark}
            onToggleCompare={handleToggleCompare}
            compareList={compareList}
            onSetTargetCareer={handleSetTargetCareer}
            targetCareerTitle={targetCareerTitle}
            hasRoadmap={Boolean(existingRoadmaps[selectedCareer.id.toLowerCase()] || existingRoadmaps[selectedCareer.title.toLowerCase()])}
          />
        )}

        {/* Career Comparison Modal */}
        {showCompareModal && compareList.length > 0 && (
          <div className={styles.modalOverlay} onClick={() => setShowCompareModal(false)}>
            <div className={styles.compareModalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleWrapper}>
                  <p className={styles.cardCategory} style={{ marginBottom: '2px' }}>Feature Comparison</p>
                  <h2 className="text-heading" style={{ fontSize: '1.45rem' }}>Compare Careers</h2>
                </div>
                <button className={styles.modalCloseBtn} onClick={() => setShowCompareModal(false)} aria-label="Close modal">
                  <X size={20} />
                </button>
              </div>

              <div className={styles.compareTableWrapper}>
                <table className={styles.compareTable}>
                  <thead>
                    <tr>
                      <th className={styles.compareRowHeader}>Metrics</th>
                      {compareList.map((item) => {
                        const isTarget = isTargetCareer(item);
                        return (
                          <th key={item.id}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: 700 }}>{item.title}</span>
                                {isTarget && <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>⭐</span>}
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  className="premiumButtonPrimary"
                                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                                  onClick={() => {
                                    setSelectedCareer(item);
                                    setShowCompareModal(false);
                                  }}
                                >
                                  View Details
                                </button>
                                {!isTarget && (
                                  <button
                                    className="premiumButtonSecondary"
                                    style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                                    onClick={() => handleSetTargetCareer(item)}
                                  >
                                    Set Target
                                  </button>
                                )}
                              </div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.compareRowHeader} style={{ color: '#f472b6', fontWeight: 700 }}>Match Score</td>
                      {compareList.map((item) => (
                        <td key={item.id} style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f472b6' }}>
                          {item.match?.isProfileComplete ? `${item.match.matchScore}%` : 'Not Specified'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Category</td>
                      {compareList.map((item) => (
                        <td key={item.id}>{item.category}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Salary Range</td>
                      {compareList.map((item) => (
                        <td key={item.id}>{item.salaryRange}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Growth Outlook</td>
                      {compareList.map((item) => (
                        <td key={item.id} style={{ color: '#34d399', fontWeight: 600 }}>{item.growthRate}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Demand Level</td>
                      {compareList.map((item) => (
                        <td key={item.id}>{item.demandLevel}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Education</td>
                      {compareList.map((item) => (
                        <td key={item.id} style={{ fontSize: '0.8rem' }}>{item.education}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Skills</td>
                      {compareList.map((item) => (
                        <td key={item.id}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                            {item.skills.map((s) => (
                              <span key={s} className={styles.skillTag} style={{ fontSize: '0.7rem' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Action</td>
                      {compareList.map((item) => {
                        const hasRoadmap = Boolean(existingRoadmaps[item.id.toLowerCase()] || existingRoadmaps[item.title.toLowerCase()]);
                        return (
                          <td key={item.id}>
                            <button
                              className="premiumButtonPrimary"
                              style={{ 
                                padding: '6px 12px', 
                                fontSize: '0.76rem',
                                background: hasRoadmap ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none',
                                color: '#fff',
                                margin: '0 auto'
                              }}
                              onClick={() => {
                                navigate('/roadmap', { state: { selectedCareer: item } });
                                setShowCompareModal(false);
                              }}
                            >
                              {hasRoadmap ? 'View Roadmap →' : 'Create Roadmap →'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
