import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GitBranch,
  Compass,
  ArrowRightLeft,
  Target,
  BookOpen,
  Sparkles,
  RotateCw,
  Info,
  AlertTriangle,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { CareerPathsService } from '../services/careerPaths.service';
import { CareerService, type Career } from '../services/career.service';
import { CareerDetailsModal } from '../components/dashboard/CareerDetailsModal';
import type {
  ICareerPathsData,
  ICareerPathItem,
  EducationCompatibility,
} from '../types/careerPaths.types';
import styles from './CareerPathsPage.module.css';

export const CareerPathsPage: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<ICareerPathsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Why These Paths Accordion Toggle
  const [isWhyExpanded, setIsWhyExpanded] = useState<boolean>(true);

  // Career Details Modal State
  const [modalCareer, setModalCareer] = useState<Career | null>(null);
  const [allCareers, setAllCareers] = useState<Career[]>([]);

  // Pre-fetch careers catalogue for rich modal data
  useEffect(() => {
    CareerService.getCareers()
      .then((res) => {
        if (res && Array.isArray(res.careers)) {
          setAllCareers(res.careers);
        }
      })
      .catch((err) => console.warn('[CareerPaths] Could not load careers list:', err));
  }, []);

  const fetchPaths = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        CareerPathsService.clearCache();
      } else {
        setLoading(true);
      }
      setError(null);

      const res = await CareerPathsService.getCareerPaths();
      setData(res);
    } catch (err: any) {
      console.error('[CareerPathsPage] Failed to load career paths:', err);
      setError(
        err?.response?.data?.message || err?.message || 'Failed to load alternative and backup paths.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  // Handle Opening Career Details Modal
  const handleOpenDetails = (item: ICareerPathItem) => {
    const found = allCareers.find(
      (c) => c.id.toLowerCase() === item.id.toLowerCase() || c.title.toLowerCase() === item.title.toLowerCase()
    );

    if (found) {
      setModalCareer(found);
    } else {
      // Fallback constructed Career object
      const fallbackCareer: Career = {
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description,
        overview: item.overview || item.description,
        education: item.education.requiredEducation,
        skills: [...item.sharedSkills, ...item.skillsToDevelop],
        responsibilities: [
          `Execute operational tasks and projects in ${item.category}`,
          `Collaborate with cross-functional stakeholders on professional deliverables`,
          `Continuously upskill and adhere to ${item.title} industry practices`,
        ],
        relevantDegrees: item.education.relevantDegrees,
        relevantSubjects: item.education.relevantSubjects,
        salaryRange: item.metrics.salaryRange,
        growthRate: item.metrics.growthRate,
        demandLevel: item.metrics.demandLevel,
        saved: false,
        relevanceTag: 'Relevant',
      };
      setModalCareer(fallbackCareer);
    }
  };

  const getFitBadgeClass = (fit: EducationCompatibility) => {
    switch (fit) {
      case 'Direct Fit':
        return styles.fitDirect;
      case 'Related Transition':
        return styles.fitRelated;
      case 'Requires Additional Education':
        return styles.fitAdditional;
      default:
        return styles.fitRelated;
    }
  };

  // Render Loading State
  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              Analyzing related specializations, transferable skills, and backup pathways...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render Error State
  if (error || !data) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div className={styles.emptyStateCard}>
              <AlertTriangle size={36} style={{ color: '#f59e0b' }} />
              <h2 className={styles.emptyStateTitle}>Could Not Load Career Paths</h2>
              <p className={styles.emptyStateText}>{error || 'Failed to load recommendation data.'}</p>
              <button className={styles.emptyStateBtn} onClick={() => fetchPaths(true)}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render No Target Career Clean Empty State
  if (!data.hasTargetCareer || !data.primaryCareer) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <div className={styles.emptyStateCard}>
              <Compass size={48} style={{ color: '#818cf8', marginBottom: 4 }} />
              <h2 className={styles.emptyStateTitle}>Choose a Career to Explore Related Pathways</h2>
              <p className={styles.emptyStateText}>
                You haven't selected a primary target career or created an active roadmap yet.
                Explore Visionix careers to discover tailored alternative specializations and practical backup options.
              </p>
              <Link to="/explore" className={styles.emptyStateBtn}>
                <Compass size={16} />
                <span>Explore Careers Catalogue</span>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { primaryCareer, alternatives, backupPaths, factorsExplanation, disclaimer } = data;

  // Render Career Card Helper
  const renderCareerCard = (item: ICareerPathItem, type: 'alternative' | 'backup') => {
    return (
      <div key={item.id} className={styles.pathCard}>
        <div className={styles.cardTopRow}>
          <div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <span className={styles.cardCategory}>{item.category}</span>
          </div>
          <span className={`${styles.fitBadge} ${getFitBadgeClass(item.education.compatibility)}`}>
            {item.education.compatibility === 'Direct Fit' && <CheckCircle2 size={12} />}
            {item.education.compatibility}
          </span>
        </div>

        {/* Relevance Rationale */}
        <div className={type === 'alternative' ? styles.rationaleBox : styles.backupRationaleBox}>
          {item.relevanceReason}
        </div>

        {/* Transition Requirement */}
        <div className={styles.transitionText}>
          <strong>Education: </strong>
          {item.education.transitionRequirement}
        </div>

        {/* Shared Skills */}
        {item.sharedSkills.length > 0 && (
          <div className={styles.skillBlock}>
            <span className={styles.skillBlockLabel}>
              Shared with {primaryCareer.title} ({item.sharedSkills.length})
            </span>
            <div className={styles.tagRow}>
              {item.sharedSkills.slice(0, 4).map((skill) => (
                <span key={skill} className={`${styles.skillTag} ${styles.sharedTag}`}>
                  {skill}
                </span>
              ))}
              {item.sharedSkills.length > 4 && (
                <span className={styles.skillTag}>+{item.sharedSkills.length - 4} more</span>
              )}
            </div>
          </div>
        )}

        {/* Transferable Skills */}
        {item.transferableSkills.length > 0 && (
          <div className={styles.skillBlock}>
            <span className={styles.skillBlockLabel}>
              Transferable Strengths ({item.transferableSkills.length})
            </span>
            <div className={styles.tagRow}>
              {item.transferableSkills.slice(0, 4).map((skill) => (
                <span key={skill} className={`${styles.skillTag} ${styles.transferTag}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills to Develop */}
        {item.skillsToDevelop.length > 0 && (
          <div className={styles.skillBlock}>
            <span className={styles.skillBlockLabel}>Key Skills to Develop</span>
            <div className={styles.tagRow}>
              {item.skillsToDevelop.slice(0, 3).map((skill) => (
                <span key={skill} className={`${styles.skillTag} ${styles.developTag}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons Integrated With Existing Visionix Modules */}
        <div className={styles.cardActions}>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.btnPrimary}`}
            onClick={() =>
              navigate('/compare', {
                state: { selectedCareerIds: [primaryCareer.id, item.id] },
              })
            }
            title={`Compare ${item.title} with ${primaryCareer.title}`}
          >
            <ArrowRightLeft size={13} />
            <span>Compare</span>
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.btnSecondary}`}
            onClick={() =>
              navigate('/skill-gap', {
                state: { careerId: item.id },
              })
            }
            title="Analyze skill gap for this career"
          >
            <Target size={13} />
            <span>Skill Gap</span>
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.btnSecondary}`}
            onClick={() => navigate(item.learning.hubRoute)}
            title="View learning courses for this career"
          >
            <BookOpen size={13} />
            <span>Courses</span>
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.btnSecondary}`}
            onClick={() =>
              navigate('/roadmap', {
                state: { careerId: item.id, careerTitle: item.title },
              })
            }
            title="View career roadmap"
          >
            <GitBranch size={13} />
            <span>Roadmap</span>
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.btnSecondary}`}
            onClick={() => handleOpenDetails(item)}
            title="View comprehensive career details"
          >
            <span>Details</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Top Header */}
        <header className={styles.header}>
          <div className={styles.headerTitleArea}>
            <h1>Career Paths</h1>
            <p className={styles.subtitle}>
              Explore related career options and alternative pathways based on your current direction,
              education, and skills.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              className={styles.refreshButton}
              onClick={() => fetchPaths(true)}
              disabled={refreshing}
              aria-label="Refresh career paths"
            >
              <RotateCw size={14} className={refreshing ? styles.spinning : ''} />
              <span>{refreshing ? 'Evaluating...' : 'Refresh'}</span>
            </button>
          </div>
        </header>

        {/* 1. Primary Career Hero Card */}
        <section className={styles.primaryHero} aria-labelledby="primary-career-heading">
          <div className={styles.primaryBadgeRow}>
            <span className={styles.primaryLabel}>Primary Target Career</span>
            <span className={styles.categoryBadge}>{primaryCareer.category}</span>
            <span className={styles.sourceBadge}>
              {primaryCareer.source === 'roadmap' ? 'Active Roadmap' : 'Career Goal'}
            </span>
          </div>

          <h2 id="primary-career-heading" className={styles.primaryCareerTitle}>
            {primaryCareer.title}
          </h2>

          <p className={styles.primaryCareerDescription}>{primaryCareer.description}</p>

          <div className={styles.primaryMetricsRow}>
            <div className={styles.metricItem}>
              <span>Est. Salary:</span>
              <span>{primaryCareer.salaryRange}</span>
            </div>
            <div className={styles.metricItem}>
              <span>Industry Demand:</span>
              <span>{primaryCareer.demandLevel}</span>
            </div>
            <div className={styles.metricItem}>
              <span>Growth Trend:</span>
              <span>{primaryCareer.growthRate}</span>
            </div>
          </div>
        </section>

        {/* 2. Alternative Careers Section */}
        <section aria-labelledby="alt-careers-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <h2 id="alt-careers-heading" className={styles.sectionTitle}>
                <Layers size={18} style={{ color: '#818cf8' }} />
                <span>Alternative Careers</span>
                <span className={`${styles.sectionBadge} ${styles.altBadge}`}>
                  {alternatives.length} Related Pathways
                </span>
              </h2>
              <p className={styles.sectionDesc}>
                Closely aligned specializations and adjacent fields sharing core technical competencies
                and educational prerequisites.
              </p>
            </div>
          </div>

          <div className={styles.cardGrid}>
            {alternatives.map((alt) => renderCareerCard(alt, 'alternative'))}
          </div>
        </section>

        {/* 3. Backup Career Paths Section */}
        <section aria-labelledby="backup-paths-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <h2 id="backup-paths-heading" className={styles.sectionTitle}>
                <TrendingUp size={18} style={{ color: '#f59e0b' }} />
                <span>Backup Career Paths</span>
                <span className={`${styles.sectionBadge} ${styles.backupBadge}`}>
                  {backupPaths.length} Practical Pivots
                </span>
              </h2>
              <p className={styles.sectionDesc}>
                Reasonable alternative directions you can explore if you decide to change direction,
                applying your existing transferable strengths.
              </p>
            </div>
          </div>

          <div className={styles.cardGrid}>
            {backupPaths.map((backup) => renderCareerCard(backup, 'backup'))}
          </div>
        </section>

        {/* 4. Why These Paths? Expandable Card */}
        <section className={styles.factorsBox} aria-labelledby="why-paths-heading">
          <div
            className={styles.factorsHeader}
            onClick={() => setIsWhyExpanded(!isWhyExpanded)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsWhyExpanded(!isWhyExpanded);
              }
            }}
          >
            <div className={styles.factorsHeaderLeft}>
              <Sparkles size={18} style={{ color: '#818cf8' }} />
              <h3 id="why-paths-heading">Why These Paths? Evaluation Framework</h3>
            </div>
            {isWhyExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {isWhyExpanded && (
            <div className={styles.factorGrid}>
              <div className={styles.factorItem}>
                <span className={styles.factorTitle}>Domain Proximity</span>
                <p className={styles.factorDesc}>{factorsExplanation.domain}</p>
              </div>
              <div className={styles.factorItem}>
                <span className={styles.factorTitle}>Shared Skills</span>
                <p className={styles.factorDesc}>{factorsExplanation.skills}</p>
              </div>
              <div className={styles.factorItem}>
                <span className={styles.factorTitle}>Transferable Strengths</span>
                <p className={styles.factorDesc}>{factorsExplanation.transferableSkills}</p>
              </div>
              <div className={styles.factorItem}>
                <span className={styles.factorTitle}>Academic Compatibility</span>
                <p className={styles.factorDesc}>{factorsExplanation.education}</p>
              </div>
              <div className={styles.factorItem}>
                <span className={styles.factorTitle}>Course Pathways</span>
                <p className={styles.factorDesc}>{factorsExplanation.learning}</p>
              </div>
            </div>
          )}
        </section>

        {/* 5. Safety & Product Language Disclaimer */}
        <footer className={styles.safetyCard}>
          <Info size={18} className={styles.safetyIcon} />
          <p className={styles.safetyText}>{disclaimer}</p>
        </footer>

        {/* Career Details Modal Integration */}
        {modalCareer && (
          <CareerDetailsModal
            career={modalCareer}
            onClose={() => setModalCareer(null)}
            onToggleBookmark={() => {}}
            onToggleCompare={(c) => {
              navigate('/compare', {
                state: { selectedCareerIds: [primaryCareer.id, c.id] },
              });
            }}
            compareList={[]}
            targetCareerTitle={primaryCareer.title}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CareerPathsPage;
