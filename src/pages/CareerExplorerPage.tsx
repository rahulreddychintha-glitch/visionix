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
  ArrowUpRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './CareerExplorerPage.module.css';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
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
      const data = await CareerService.getCareers(
        searchQuery ? searchQuery : undefined,
        selectedCategory !== 'All' ? selectedCategory : undefined
      );
      setCareers(data);
    } catch (err: any) {
      console.error('Error fetching careers:', err);
      setError('Failed to load careers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

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
              <h1 className="text-heading" style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Explore Careers</h1>
              <p className="text-description" style={{ fontSize: '0.9rem' }}>
                Discover career pathways across various disciplines and match them to your goals.
              </p>
            </div>
            <Link to="/saved" className={styles.savedLink}>
              <BookmarkCheck size={16} />
              <span>Saved Bookmarks</span>
            </Link>
          </div>
        </div>

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
        ) : displayedCareers.length === 0 ? (
          <div className={styles.neutralState}>
            <p className={styles.neutralTitle}>No Careers Found</p>
            <p className={styles.neutralText}>
              {searchQuery || selectedCategory !== 'All' || relevanceFilter !== 'All'
                ? "No careers match the selected search terms or active filters."
                : "No career definitions currently available."}
            </p>
            {(searchQuery || selectedCategory !== 'All' || relevanceFilter !== 'All') && (
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
          <div className={styles.modalOverlay} onClick={() => setSelectedCareer(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleWrapper}>
                  <p className={styles.cardCategory} style={{ marginBottom: '2px' }}>{selectedCareer.category}</p>
                  <h2 className="text-heading" style={{ fontSize: '1.45rem' }}>{selectedCareer.title}</h2>
                </div>
                <button className={styles.modalCloseBtn} onClick={() => setSelectedCareer(null)} aria-label="Close modal">
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.infoSection}>
                  <p className={styles.infoLabel}>Description</p>
                  <p className={styles.infoVal}>{selectedCareer.description}</p>
                </div>

                <div className={styles.infoSection}>
                  <p className={styles.infoLabel}>Typical Skills Required</p>
                  {selectedCareer.skills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                      {selectedCareer.skills.map((skill) => (
                        <span key={skill} className={styles.skillTag} style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.infoVal}>Not Specified</p>
                  )}
                </div>

                <div className={styles.infoSection}>
                  <p className={styles.infoLabel}>Education Pathway</p>
                  <p className={styles.infoVal}>{selectedCareer.education}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.infoSection}>
                    <p className={styles.infoLabel}>Salary Range</p>
                    <p className={styles.infoVal}>{selectedCareer.salaryRange}</p>
                  </div>
                  <div className={styles.infoSection}>
                    <p className={styles.infoLabel}>Growth Outlook</p>
                    <p className={styles.infoVal}>{selectedCareer.growthRate}</p>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <p className={styles.infoLabel}>Demand Level</p>
                  <p className={styles.infoVal}>{selectedCareer.demandLevel}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
                <button
                  className={selectedCareer.saved ? 'premiumButtonSecondary' : 'premiumButtonPrimary'}
                  style={{ flex: 1 }}
                  onClick={() => handleToggleBookmark(selectedCareer)}
                >
                  {selectedCareer.saved ? 'Remove Bookmark' : 'Save Career'}
                </button>
                <button
                  className="premiumButtonSecondary"
                  onClick={() => {
                    handleToggleCompare(selectedCareer);
                    setSelectedCareer(null);
                  }}
                >
                  <GitCompare size={14} />
                  <span>{compareList.some((c) => c.id === selectedCareer.id) ? 'Remove Compare' : 'Add to Compare'}</span>
                </button>
              </div>
            </div>
          </div>
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
                        <th key={item.id}>{item.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
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
                      <td className={styles.compareRowHeader}>Skills</td>
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
                      <td className={styles.compareRowHeader}>Education</td>
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
