import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { CareerService } from '../services/career.service';
import type { Career } from '../services/career.service';
import { useProfile } from '../hooks/useProfile';
import { 
  BookmarkCheck, 
  X, 
  GitCompare, 
  Loader2, 
  ArrowUpRight,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './CareerExplorerPage.module.css';
import { CareerDetailsModal } from '../components/dashboard/CareerDetailsModal';

export const SavedCareersPage: React.FC = () => {
  const { profile, saveProfile } = useProfile();
  const [savedCareers, setSavedCareers] = useState<Career[]>([]);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Comparison states
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [compareList, setCompareList] = useState<Career[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const targetCareerTitle = profile?.careerGoals?.dreamCareer || '';

  const isTargetCareer = useCallback((c: Career) => {
    if (!targetCareerTitle) return false;
    return targetCareerTitle.toLowerCase() === c.title.toLowerCase() || targetCareerTitle.toLowerCase() === c.id.toLowerCase();
  }, [targetCareerTitle]);

  const fetchSavedCareers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await CareerService.getSavedCareers();
      setSavedCareers(response.careers);
      setIsMockMode(response.isMockMode);
    } catch (err: any) {
      console.error('Error fetching saved careers:', err);
      setError('Failed to load saved bookmarks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedCareers();
  }, [fetchSavedCareers]);

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

  // Remove saved bookmark
  const handleRemoveBookmark = async (career: Career, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    try {
      await CareerService.unsaveCareer(career.id);
      setSavedCareers((prev) => prev.filter((c) => c.id !== career.id));
      if (selectedCareer?.id === career.id) {
        setSelectedCareer(null);
      }
      setCompareList((prev) => prev.filter((c) => c.id !== career.id));
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };

  // Compare list actions
  const handleToggleCompare = (career: Career) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === career.id);
      if (exists) {
        return prev.filter((c) => c.id !== career.id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, career];
    });
  };

  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div className="glow-accent-secondary" style={{ width: '400px', height: '400px', top: '15%', right: '15%', opacity: 0.3 }} />

      <div className={styles.container}>
        
        {/* Title and navigation back */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div>
              <h1 className="text-heading" style={{ fontSize: '1.8rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Saved & Bookmarks
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
                Your saved career opportunities and bookmarks for quick reference.
              </p>
            </div>

            <Link to="/explore" className="premiumButtonSecondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} />
              <span>Back to Explorer</span>
            </Link>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 className="spin-animation" size={36} style={{ color: 'var(--color-primary)' }} />
          </div>
        ) : error ? (
          <div className={styles.neutralState}>
            <p className={styles.neutralTitle}>Error Loading Bookmarks</p>
            <p className={styles.neutralText}>{error}</p>
            <button className="premiumButtonPrimary" onClick={fetchSavedCareers}>
              Retry Load
            </button>
          </div>
        ) : savedCareers.length === 0 ? (
          <div className={styles.neutralState}>
            <p className={styles.neutralTitle}>No Saved Careers Yet</p>
            <p className={styles.neutralText}>
              You haven't bookmarked any careers yet. Browse the Career Explorer and click the bookmark icon on any career to save it for later.
            </p>
            <Link to="/explore" className="premiumButtonPrimary" style={{ textDecoration: 'none' }}>
              Explore Careers
            </Link>
          </div>
        ) : (
          /* Grid of Saved Careers */
          <div className={styles.grid}>
            {savedCareers.map((career) => {
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
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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
                      <span className={styles.relevanceBadge} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                        Saved
                      </span>
                    </div>

                    <button
                      className={`${styles.bookmarkBtn} ${styles.bookmarked}`}
                      onClick={(e) => handleRemoveBookmark(career, e)}
                      aria-label="Remove bookmark"
                    >
                      <BookmarkCheck size={18} />
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
              );
            })}
          </div>
        )}

        {/* Compare Drawer */}
        {compareList.length > 0 && (
          <div className={styles.compareDrawer}>
            <span className={styles.drawerText}>
              Comparing <strong>{compareList.length}</strong>/3 careers
            </span>
            <div className={styles.drawerItems}>
              {compareList.map((item) => (
                <div key={item.id} className={styles.drawerItemChip}>
                  <span>{item.title}</span>
                  <button onClick={() => handleToggleCompare(item)} aria-label="Remove from compare">
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

        {/* Detail Modal */}
        {selectedCareer && (
          <CareerDetailsModal
            career={selectedCareer}
            onClose={() => setSelectedCareer(null)}
            onToggleBookmark={handleRemoveBookmark}
            onToggleCompare={handleToggleCompare}
            compareList={compareList}
            onSetTargetCareer={handleSetTargetCareer}
            targetCareerTitle={targetCareerTitle}
          />
        )}

        {/* Comparison Modal */}
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
                              style={{ padding: '4px 8px', fontSize: '0.74rem' }}
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
                      <td className={styles.compareRowHeader}>Category</td>
                      {compareList.map((item) => (
                        <td key={item.id}>{item.category}</td>
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
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
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
                        <td key={item.id} className="text-caption" style={{ color: '#34d399', fontWeight: 600 }}>{item.growthRate}</td>
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
