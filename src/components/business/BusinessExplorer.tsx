import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  IBusinessIdea,
  IBusinessProfile,
  IBusinessIdeaFilters,
  BusinessDifficulty,
  StartupPotential,
  BusinessModelType,
} from '../../types/business.types';
import { BusinessService } from '../../services/business.service';
import { calculateBusinessIdeaMatch } from '../../utils/businessMatching';
import { BusinessIdeaCard } from './BusinessIdeaCard';
import { BusinessIdeaDetails } from './BusinessIdeaDetails';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import styles from './BusinessExplorer.module.css';

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

interface BusinessExplorerProps {
  profile: IBusinessProfile | null;
  userSkills: string[];
  verifiedSkills: string[];
  userIndustries: string[];
  onSaveToggle: (ideaId: string) => Promise<void>;
  onBuildStartup?: (idea: IBusinessIdea) => void;
}

export const BusinessExplorer: React.FC<BusinessExplorerProps> = ({
  profile,
  userSkills,
  verifiedSkills,
  userIndustries,
  onSaveToggle,
  onBuildStartup,
}) => {
  // Filters & Query State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All Industries');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All Difficulties');
  const [selectedPotential, setSelectedPotential] = useState<string>('All Potentials');
  const [selectedModel, setSelectedModel] = useState<string>('All Models');
  const [sortBy, setSortBy] = useState<string>('best_match');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Data & Async States
  const [ideas, setIdeas] = useState<IBusinessIdea[]>([]);
  const [totalIdeas, setTotalIdeas] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected idea for modal
  const [selectedIdea, setSelectedIdea] = useState<IBusinessIdea | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load Ideas from Backend API
  const loadIdeas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: IBusinessIdeaFilters = {
        page: currentPage,
        limit: 12,
        search: debouncedSearch.trim() || undefined,
        industry: selectedIndustry !== 'All Industries' ? selectedIndustry : undefined,
        difficulty: selectedDifficulty !== 'All Difficulties' ? (selectedDifficulty as BusinessDifficulty) : undefined,
        startupPotential: selectedPotential !== 'All Potentials' ? (selectedPotential as StartupPotential) : undefined,
        businessModel: selectedModel !== 'All Models' ? (selectedModel as BusinessModelType) : undefined,
        sortBy: sortBy as any,
      };

      const result = await BusinessService.getBusinessIdeas(filters);
      setIdeas(result.ideas || []);
      setTotalIdeas(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err: any) {
      console.error('Failed to load business ideas:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load business ideas. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearch,
    selectedIndustry,
    selectedDifficulty,
    selectedPotential,
    selectedModel,
    sortBy,
  ]);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  // Compute Skill Matches & Re-sort if 'best_match' is selected
  const ideasWithMatches = useMemo(() => {
    const mapped = ideas.map((idea) => {
      const match = calculateBusinessIdeaMatch(
        idea,
        profile,
        userSkills,
        verifiedSkills,
        userIndustries
      );
      return { idea, match };
    });

    if (sortBy === 'best_match') {
      return mapped.sort((a, b) => b.match.matchScore - a.match.matchScore);
    }

    return mapped;
  }, [ideas, profile, userSkills, verifiedSkills, userIndustries, sortBy]);

  const savedIdSet = useMemo(() => {
    const rawSaved = profile?.savedBusinessIdeas || [];
    return new Set(
      rawSaved.map((item) => (typeof item === 'object' ? item._id : item.toString()))
    );
  }, [profile?.savedBusinessIdeas]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedIndustry('All Industries');
    setSelectedDifficulty('All Difficulties');
    setSelectedPotential('All Potentials');
    setSelectedModel('All Models');
    setSortBy('best_match');
    setCurrentPage(1);
  };

  const isFilterActive =
    debouncedSearch.length > 0 ||
    selectedIndustry !== 'All Industries' ||
    selectedDifficulty !== 'All Difficulties' ||
    selectedPotential !== 'All Potentials' ||
    selectedModel !== 'All Models';

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
              placeholder="Search business ideas, required tech stacks, problems..."
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
            <option value="newest">Sort: Newest</option>
            <option value="potential">Sort: Startup Potential</option>
            <option value="difficulty">Sort: Difficulty</option>
            <option value="alphabetical">Sort: A to Z</option>
          </select>
        </div>

        {/* Filter Dropdowns */}
        <div className={styles.filtersRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontSize: '0.82rem', fontWeight: 600 }}>
            <SlidersHorizontal size={14} />
            <span>Filters:</span>
          </div>

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

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.selectInput}
          >
            <option value="All Difficulties">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Potential Filter */}
          <select
            value={selectedPotential}
            onChange={(e) => {
              setSelectedPotential(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.selectInput}
          >
            <option value="All Potentials">All Potentials</option>
            <option value="High">High Potential</option>
            <option value="Medium">Medium Potential</option>
            <option value="Niche">Niche Market</option>
          </select>

          {/* Business Model Filter */}
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.selectInput}
          >
            <option value="All Models">All Models</option>
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
            <option value="B2B2C">B2B2C</option>
            <option value="SaaS">SaaS</option>
            <option value="Marketplace">Marketplace</option>
            <option value="Subscription">Subscription</option>
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
            onClick={loadIdeas}
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

      {/* 2. Ideas Grid or Empty / Loading States */}
      {loading ? (
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : ideasWithMatches.length === 0 ? (
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
          <Lightbulb size={40} style={{ color: '#818cf8' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
            {isFilterActive ? 'No business ideas match your search' : 'No business ideas available yet'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
            {isFilterActive
              ? 'Try broadening your search query or resetting industry and difficulty filters.'
              : 'New market concepts and venture blueprints will appear here as the collection expands.'}
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
          {ideasWithMatches.map(({ idea, match }) => (
            <BusinessIdeaCard
              key={idea._id}
              idea={idea}
              isSaved={savedIdSet.has(idea._id)}
              matchResult={match}
              onSaveToggle={onSaveToggle}
              onViewDetails={(selected) => setSelectedIdea(selected)}
            />
          ))}
        </div>
      )}

      {/* 3. Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.paginationRow}>
          <div style={{ fontSize: '0.84rem', color: '#9ca3af' }}>
            Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalIdeas} ideas)
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

      {/* 4. Detailed Blueprint Modal */}
      {selectedIdea && (
        <BusinessIdeaDetails
          idea={selectedIdea}
          isSaved={savedIdSet.has(selectedIdea._id)}
          matchResult={calculateBusinessIdeaMatch(
            selectedIdea,
            profile,
            userSkills,
            verifiedSkills,
            userIndustries
          )}
          onClose={() => setSelectedIdea(null)}
          onSaveToggle={onSaveToggle}
          onBuildStartup={onBuildStartup}
        />
      )}
    </div>
  );
};
