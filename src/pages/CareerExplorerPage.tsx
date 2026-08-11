import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { CareerService } from '../services/career.service';
import type { Career } from '../services/career.service';
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  X, 
  GitCompare, 
  Loader2, 
  ArrowUpRight,
  Sparkles,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const [careers, setCareers] = useState<Career[]>([]);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
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

  // Handle compare list modification
  const handleToggleCompare = (career: Career) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === career.id);
      if (exists) {
        return prev.filter((c) => c.id !== career.id);
      }
      if (prev.length >= 3) {
        return prev; // Max 3 items
      }
      return [...prev, career];
    });
  };

  // Filter local careers array for relevance filtering
  const displayedCareers = careers.filter((c) => {
    if (relevanceFilter === 'All') return true;
    if (relevanceFilter === 'Dream Career') return c.relevanceTag === 'Dream Career';
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
                Discover career pathways across various disciplines and match them to your goals.
              </p>
            </div>
            
            <div className={styles.headerPills}>
              <button 
                className={`${styles.headerPill} ${showRecommended ? styles.headerPillActive : ''}`}
                onClick={() => {
                  setShowRecommended(prev => !prev);
                  setShowCareerMatch(false);
                  setSelectedCategory('All');
                }}
              >
                <Sparkles size={16} />
                <div style={{ textAlign: 'left' }}>
                  <div className={styles.pillTitle}>Recommended for You</div>
                  <div className={styles.pillSubtitle}>Phase 8</div>
                </div>
              </button>
              
              <button 
                className={`${styles.headerPill} ${showCareerMatch ? styles.headerPillActive : ''}`}
                onClick={() => {
                  setShowCareerMatch(prev => !prev);
                  setShowRecommended(false);
                  setSelectedCategory('All');
                }}
                title="View your compatibility match score for all careers"
              >
                <Heart size={16} style={{ color: showCareerMatch ? '#a78bfa' : '#ec4899' }} />
                <div style={{ textAlign: 'left' }}>
                  <div className={styles.pillTitle}>Career Match</div>
                  <div className={styles.pillSubtitle}>Phase 9</div>
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

        {showCareerMatch && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.2)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
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
              <option value="Dream Career">⭐ Dream Careers</option>
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
            {displayedCareers.map((career) => (
              <div key={career.id} className={`${styles.card} premiumCard`}>
                <div className={styles.cardHeader}>
                  <div>
                    {career.relevanceTag === 'Dream Career' && (
                      <span className={`${styles.relevanceBadge} ${styles.dreamCareerBadge}`}>⭐ Dream Career</span>
                    )}
                    {career.relevanceTag === 'Interested' && (
                      <span className={`${styles.relevanceBadge} ${styles.interestedBadge}`}>💜 Interested</span>
                    )}
                    {career.relevanceTag === 'Relevant' && (
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
                            <strong>Gap:</strong> {career.match.skillGaps[0]?.replace('Missing verified skill: ', '') || 'None'}
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
                      disabled={compareList.length >= 3 && !compareList.some((c) => c.id === career.id)}
                    />
                    Compare
                  </label>

                  <button
                    className={styles.detailsBtn}
                    onClick={() => setSelectedCareer(career)}
                  >
                    <span>View Details</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
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
            
            <button
              className="premiumButtonPrimary"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              disabled={compareList.length < 2}
              onClick={() => setShowCompareModal(true)}
            >
              <GitCompare size={14} />
              <span>Compare Now</span>
            </button>
          </div>
        )}

        {/* Career Details Modal */}
        {selectedCareer && (
          <CareerDetailsModal
            career={selectedCareer}
            onClose={() => setSelectedCareer(null)}
            onToggleBookmark={handleToggleBookmark}
            onToggleCompare={handleToggleCompare}
            compareList={compareList}
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
                      {compareList.map((item) => (
                        <th key={item.id}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontWeight: 700 }}>{item.title}</span>
                            <button
                              className="premiumButtonPrimary"
                              style={{ padding: '4px 8px', fontSize: '0.74rem', minWidth: '90px' }}
                              onClick={() => {
                                setSelectedCareer(item);
                                setShowCompareModal(false);
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </th>
                      ))}
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
                      <td className={styles.compareRowHeader} style={{ color: '#f472b6', fontWeight: 700 }}>Match Level</td>
                      {compareList.map((item) => (
                        <td key={item.id} style={{ fontWeight: 700, color: item.match?.isProfileComplete && item.match.matchScore >= 75 ? '#10b981' : '#f59e0b' }}>
                          {item.match?.isProfileComplete ? `${item.match.matchLevel} Alignment` : 'Incomplete Profile'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Education Compatibility</td>
                      {compareList.map((item) => {
                        const aligned = item.match?.strengths.some(s => s.toLowerCase().includes('alignment') || s.toLowerCase().includes('relevance'));
                        return (
                          <td key={item.id} className="text-caption">
                            {aligned ? '✓ Directly Aligned' : 'General Compatibility'}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Skills Match</td>
                      {compareList.map((item) => (
                        <td key={item.id} className="text-caption">
                          {item.match?.isProfileComplete ? `${item.match.skillsYouHave.length} / ${item.skills.length} skills owned` : 'Not Specified'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Interest Fit</td>
                      {compareList.map((item) => {
                        const aligned = item.match?.strengths.some(s => s.toLowerCase().includes('interest'));
                        return (
                          <td key={item.id} className="text-caption">
                            {aligned ? '✓ Profile Interest Fit' : 'No Direct Fit'}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Dream Career Fit</td>
                      {compareList.map((item) => {
                        const aligned = item.match?.strengths.some(s => s.toLowerCase().includes('dream'));
                        return (
                          <td key={item.id} className="text-caption">
                            {aligned ? '✓ Target Dream Career' : 'Alternative Target'}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Strengths</td>
                      {compareList.map((item) => (
                        <td key={item.id}>
                          <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {item.match?.isProfileComplete && item.match.strengths.map((str, idx) => (
                              <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{str}</li>
                            ))}
                            {(!item.match?.isProfileComplete || !item.match?.strengths?.length) && (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not Specified</span>
                            )}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Skill Gaps</td>
                      {compareList.map((item) => (
                        <td key={item.id}>
                          <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {item.match?.isProfileComplete && item.match.skillGaps.map((sg, idx) => (
                              <li key={idx} style={{ fontSize: '0.8rem', color: '#ef4444' }}>{sg.replace('Missing verified skill: ', '')}</li>
                            ))}
                            {item.match?.isProfileComplete && item.match.skillGaps.length === 0 && (
                              <span style={{ fontSize: '0.8rem', color: '#10b981' }}>✓ No skill gaps!</span>
                            )}
                            {!item.match?.isProfileComplete && (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not Specified</span>
                            )}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Improvement Areas</td>
                      {compareList.map((item) => (
                        <td key={item.id}>
                          <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {item.match?.isProfileComplete && item.match.improvementSuggestions.map((sugg, idx) => (
                              <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{sugg}</li>
                            ))}
                            {(!item.match?.isProfileComplete || !item.match?.improvementSuggestions?.length) && (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not Specified</span>
                            )}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Category</td>
                      {compareList.map((item) => (
                        <td key={item.id} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{item.category}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Description</td>
                      {compareList.map((item) => (
                        <td key={item.id} className="text-caption">{item.description}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Skills Required</td>
                      {compareList.map((item) => (
                        <td key={item.id}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {item.skills.map((s) => (
                              <span key={s} className={styles.skillTag}>{s}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Education Pathway</td>
                      {compareList.map((item) => (
                        <td key={item.id} className="text-caption">{item.education}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Salary Outlook</td>
                      {compareList.map((item) => (
                        <td key={item.id} className="text-caption">{item.salaryRange}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Job Growth</td>
                      {compareList.map((item) => (
                        <td key={item.id} className="text-caption">{item.growthRate}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className={styles.compareRowHeader}>Market Demand</td>
                      {compareList.map((item) => (
                        <td key={item.id} className="text-caption">{item.demandLevel}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  className="premiumButtonSecondary"
                  onClick={() => setCompareList([])}
                >
                  Clear Selection
                </button>
                <button
                  className="premiumButtonPrimary"
                  onClick={() => setShowCompareModal(false)}
                >
                  Close Comparison
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
