import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  IBusinessOpportunity,
  IBusinessProfile,
  IBusinessOpportunityFilters,
  OpportunityType,
  OpportunityDifficulty,
} from '../../types/business.types';
import { BusinessService } from '../../services/business.service';
import { calculateBusinessOpportunityMatch } from '../../utils/businessOpportunityMatching';
import { BusinessOpportunityCard } from './BusinessOpportunityCard';
import { BusinessOpportunityDetails } from './BusinessOpportunityDetails';
import { RecommendedOpportunities } from './RecommendedOpportunities';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowLeft,
  ArrowRight,
  Rocket,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import styles from './BusinessOpportunityExplorer.module.css';

const TYPE_FILTER_OPTIONS: { label: string; value: OpportunityType | 'all' }[] = [
  { label: 'All Opportunities', value: 'all' },
  { label: 'Grants & Funding', value: 'grant' },
  { label: 'Hackathons', value: 'hackathon' },
  { label: 'Incubators', value: 'incubator' },
  { label: 'Accelerators', value: 'accelerator' },
  { label: 'Competitions', value: 'competition' },
  { label: 'Fellowships', value: 'fellowship' },
  { label: 'Startup Programs', value: 'startup_program' },
  { label: 'Scholarships', value: 'scholarship' },
];

const INDUSTRY_FILTER_OPTIONS = [
  'All Industries',
  'AI & Machine Learning',
  'Software & Web Services',
  'Healthcare & Biotech',
  'Finance & Fintech',
  'E-commerce & D2C',
  'Education & EdTech',
  'Sustainability & CleanTech',
  'Media & Content',
  'Cybersecurity',
  'Gaming & Interactive',
  'Robotics & Hardware',
];

interface BusinessOpportunityExplorerProps {
  profile: IBusinessProfile | null;
  userSkills: string[];
  verifiedSkills: string[];
  userIndustries: string[];
  onSaveToggle: (id: string) => Promise<void>;
}

export const BusinessOpportunityExplorer: React.FC<BusinessOpportunityExplorerProps> = ({
  profile,
  userSkills,
  verifiedSkills,
  userIndustries,
  onSaveToggle,
}) => {
  // Filters & Query State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All Industries');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All Levels');
  const [sortBy, setSortBy] = useState<string>('best_match');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Data & Async States
  const [opportunities, setOpportunities] = useState<IBusinessOpportunity[]>([]);
  const [totalOpportunities, setTotalOpportunities] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected for details modal
  const [selectedOpportunity, setSelectedOpportunity] = useState<IBusinessOpportunity | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load Opportunities from API
  const loadOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: IBusinessOpportunityFilters = {
        page: currentPage,
        limit: 12,
        search: debouncedSearch.trim() || undefined,
        opportunityType: selectedType !== 'all' ? (selectedType as OpportunityType) : undefined,
        industry: selectedIndustry !== 'All Industries' ? selectedIndustry : undefined,
        isOnline: selectedFormat === 'online' ? true : selectedFormat === 'in_person' ? false : undefined,
        difficulty: selectedDifficulty !== 'All Levels' ? (selectedDifficulty as OpportunityDifficulty) : undefined,
        sortBy: sortBy as any,
      };

      const result = await BusinessService.getBusinessOpportunities(filters);
      setOpportunities(result.opportunities || []);
      setTotalOpportunities(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err: any) {
      console.error('Failed to load business opportunities:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load opportunities. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearch,
    selectedType,
    selectedIndustry,
    selectedFormat,
    selectedDifficulty,
    sortBy,
  ]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  // Compute Skill Matches & Re-sort if 'best_match' is selected
  const opportunitiesWithMatches = useMemo(() => {
    const mapped = opportunities.map((opp) => {
      const match = calculateBusinessOpportunityMatch(
        opp,
        profile,
        userSkills,
        verifiedSkills,
        userIndustries
      );
      return { opportunity: opp, match };
    });

    if (sortBy === 'best_match') {
      return mapped.sort((a, b) => b.match.matchScore - a.match.matchScore);
    }

    return mapped;
  }, [opportunities, profile, userSkills, verifiedSkills, userIndustries, sortBy]);

  const savedIdSet = useMemo(() => {
    const rawSaved = profile?.savedOpportunities || [];
    return new Set(
      rawSaved.map((item) => (typeof item === 'object' ? item._id : item.toString()))
    );
  }, [profile?.savedOpportunities]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedType('all');
    setSelectedIndustry('All Industries');
    setSelectedFormat('all');
    setSelectedDifficulty('All Levels');
    setSortBy('best_match');
    setCurrentPage(1);
  };

  const isFilterActive =
    debouncedSearch.length > 0 ||
    selectedType !== 'all' ||
    selectedIndustry !== 'All Industries' ||
    selectedFormat !== 'all' ||
    selectedDifficulty !== 'All Levels';

  return (
    <div className={styles.container}>
      {/* 1. Header Toolbar with Search & Dropdowns */}
      <div className={styles.searchToolbar}>
        <div className={styles.searchRow}>
          <div className={styles.searchInputWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search grants, hackathons, incubator deadlines, skills..."
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.selectInput}
          >
            <option value="best_match">Sort: Best Match</option>
            <option value="deadline">Sort: Closest Deadline</option>
            <option value="newest">Sort: Newest Added</option>
            <option value="featured">Sort: Featured</option>
            <option value="alphabetical">Sort: A to Z</option>
          </select>
        </div>

        {/* Filter Dropdowns */}
        <div className={styles.filtersRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontSize: '0.82rem', fontWeight: 600 }}>
            <SlidersHorizontal size={14} />
            <span>Filters:</span>
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.selectInput}
          >
            {TYPE_FILTER_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => {
              setSelectedIndustry(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.selectInput}
          >
            {INDUSTRY_FILTER_OPTIONS.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          {/* Format (Online / In-Person) */}
          <select
            value={selectedFormat}
            onChange={(e) => {
              setSelectedFormat(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.selectInput}
          >
            <option value="all">All Formats</option>
            <option value="online">Online / Remote Only</option>
            <option value="in_person">In-Person Only</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.selectInput}
          >
            <option value="All Levels">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Clear Filters */}
          {isFilterActive && (
            <button className={styles.clearBtn} onClick={handleClearFilters}>
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            padding: '14px 18px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            onClick={loadOpportunities}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      )}

      {/* 2. Top Personalized Recommendations (only shown on page 1 when no strict search query) */}
      {!isFilterActive && currentPage === 1 && (
        <RecommendedOpportunities
          profile={profile}
          userSkills={userSkills}
          verifiedSkills={verifiedSkills}
          userIndustries={userIndustries}
          onSaveToggle={onSaveToggle}
        />
      )}

      {/* 3. Opportunities Grid or Empty / Loading States */}
      {loading ? (
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : opportunitiesWithMatches.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
            borderRadius: '16px',
            padding: '54px 24px',
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
            maxWidth: '640px',
            margin: '20px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <Rocket size={40} style={{ color: '#818cf8' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
            {isFilterActive ? 'No opportunities match your search' : 'No opportunities available yet'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
            {isFilterActive
              ? 'Try broadening your search term or resetting your opportunity type and industry filters.'
              : 'New incubator deadlines, student hackathons, and founder grants will appear here as opportunities open.'}
          </p>

          {isFilterActive && (
            <button
              onClick={handleClearFilters}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                marginTop: '6px',
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {opportunitiesWithMatches.map(({ opportunity, match }) => (
            <BusinessOpportunityCard
              key={opportunity._id}
              opportunity={opportunity}
              isSaved={savedIdSet.has(opportunity._id)}
              matchResult={match}
              onSaveToggle={onSaveToggle}
              onViewDetails={(selected) => setSelectedOpportunity(selected)}
            />
          ))}
        </div>
      )}

      {/* 4. Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.paginationRow}>
          <div style={{ fontSize: '0.84rem', color: '#9ca3af' }}>
            Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalOpportunities} opportunities)
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 5. Detailed Opportunity Modal */}
      {selectedOpportunity && (
        <BusinessOpportunityDetails
          opportunity={selectedOpportunity}
          isSaved={savedIdSet.has(selectedOpportunity._id)}
          matchResult={calculateBusinessOpportunityMatch(
            selectedOpportunity,
            profile,
            userSkills,
            verifiedSkills,
            userIndustries
          )}
          onClose={() => setSelectedOpportunity(null)}
          onSaveToggle={onSaveToggle}
        />
      )}
    </div>
  );
};
