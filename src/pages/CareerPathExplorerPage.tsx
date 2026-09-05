import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { EducationPathwayService } from '../services/educationPathway.service';
import type { 
  EducationTreeNode, 
  PathwayCareerRef,
  CurrentEducationContext 
} from '../services/educationPathway.service';
import { CareerService } from '../services/career.service';
import type { Career } from '../services/career.service';
import { CareerDetailsModal } from '../components/dashboard/CareerDetailsModal';
import { useProfile } from '../hooks/useProfile';
import { 
  GraduationCap, 
  Sparkles, 
  Briefcase, 
  Clock, 
  Rocket, 
  Loader2, 
  AlertCircle, 
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Target,
  ArrowRightLeft,
  CheckCircle2,
  Cpu,
  Stethoscope,
  TrendingUp,
  Scale,
  Palette,
  Plane,
  Wrench,
  Compass,
  Footprints,
  GitFork,
  Award,
  Layers,
  ExternalLink
} from 'lucide-react';
import styles from './CareerPathExplorerPage.module.css';

const STREAM_FILTERS = [
  { id: 'all', label: 'All Pathways' },
  { id: 'Science & Engineering', label: 'Engineering & Computing (MPC)' },
  { id: 'Medical & Life Sciences', label: 'Medical & Life Sciences (BiPC)' },
  { id: 'Commerce & Economics', label: 'Commerce & Finance (MEC/CEC)' },
  { id: 'Technical Education', label: 'Polytechnic Diploma' },
  { id: 'Vocational Trades', label: 'ITI Vocational' },
  { id: 'Legal Studies', label: 'Law & Governance' },
  { id: 'Design & Visual Arts', label: 'Design & Media' }
];

// Helper to determine node icon
const getNodeIcon = (node: EducationTreeNode) => {
  const text = `${node.nodeType} ${node.title} ${node.category || ''}`.toLowerCase();
  if (text.includes('tech') || text.includes('cse') || text.includes('computer') || text.includes('ai') || text.includes('software') || text.includes('cyber')) {
    return <Cpu size={16} />;
  }
  if (text.includes('mbbs') || text.includes('medical') || text.includes('doctor') || text.includes('pharm') || text.includes('nurs') || text.includes('bds') || text.includes('bipc') || text.includes('health') || text.includes('life sciences')) {
    return <Stethoscope size={16} />;
  }
  if (text.includes('commerce') || text.includes('b.com') || text.includes('finance') || text.includes('ca') || text.includes('bba') || text.includes('mec') || text.includes('economics')) {
    return <TrendingUp size={16} />;
  }
  if (text.includes('law') || text.includes('civil') || text.includes('governance') || text.includes('cec') || text.includes('hec') || text.includes('judge')) {
    return <Scale size={16} />;
  }
  if (text.includes('design') || text.includes('media') || text.includes('b.des') || text.includes('bjmc') || text.includes('art')) {
    return <Palette size={16} />;
  }
  if (text.includes('pilot') || text.includes('aviation') || text.includes('cpl') || text.includes('aerospace')) {
    return <Plane size={16} />;
  }
  if (text.includes('diploma') || text.includes('polytechnic') || text.includes('iti') || text.includes('fitter') || text.includes('electrician') || text.includes('vocational')) {
    return <Wrench size={16} />;
  }
  return <GraduationCap size={16} />;
};

interface TreeNodeItemProps {
  node: EducationTreeNode;
  depth: number;
  expandedMap: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  onSelectNode: (node: EducationTreeNode) => void;
  selectedNodeId: string | null;
  userCurrentNodeId: string | null;
  searchFilter: string;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  depth,
  expandedMap,
  onToggleExpand,
  onSelectNode,
  selectedNodeId,
  userCurrentNodeId,
  searchFilter
}) => {
  const isExpanded = Boolean(expandedMap[node.id]);
  const isSelected = selectedNodeId === node.id;
  const isYouAreHere = userCurrentNodeId === node.id;
  const hasChildren = Boolean(node.children && node.children.length > 0);

  // Check if node or its descendants match active search
  const isSearchActive = Boolean(searchFilter.trim());
  const matchesSearch = useMemo(() => {
    if (!isSearchActive) return true;
    const q = searchFilter.toLowerCase();
    const selfMatch = (
      node.title.toLowerCase().includes(q) ||
      (node.subtitle && node.subtitle.toLowerCase().includes(q)) ||
      (node.category && node.category.toLowerCase().includes(q)) ||
      (node.skills && node.skills.some(s => s.toLowerCase().includes(q))) ||
      (node.entranceExams && node.entranceExams.some(e => e.toLowerCase().includes(q))) ||
      (node.resolvedCareers && node.resolvedCareers.some(c => c.title.toLowerCase().includes(q)))
    );
    return selfMatch;
  }, [node, searchFilter, isSearchActive]);

  // Is this a polytechnic branch with lateral entry to B.Tech?
  const isLateralEntryBranch = node.id.startsWith('branch-polytechnic');

  return (
    <div className={styles.nodeItem}>
      <div className={styles.nodeRow}>
        {depth > 0 && <div className={styles.branchArm} />}

        <div
          className={`${styles.nodeCard} ${isSelected ? styles.nodeCardSelected : ''} ${isYouAreHere ? styles.nodeCardYouAreHere : ''} ${isSearchActive && !matchesSearch ? styles.nodeCardDimmed : ''}`}
          onClick={() => onSelectNode(node)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectNode(node);
            }
          }}
          title={node.description}
        >
          <div className={styles.nodeLeft}>
            <div className={`${styles.nodeIconWrapper} ${isYouAreHere ? styles.nodeIconCurrent : ''}`}>
              {getNodeIcon(node)}
            </div>

            <div className={styles.nodeTextGroup}>
              <h3 className={styles.nodeTitle}>
                <span>{node.shortCode || node.title}</span>
                <span className={styles.nodeTypeTag}>{node.nodeType.replace('_', ' ')}</span>
              </h3>
              <div className={styles.nodeSub}>
                {node.subtitle || node.title}
              </div>
            </div>
          </div>

          <div className={styles.nodeRight}>
            {isYouAreHere && (
              <span className={styles.hereIndicator}>YOU ARE HERE</span>
            )}

            {isLateralEntryBranch && (
              <span style={{ fontSize: '0.66rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 700 }}>
                Lateral B.Tech
              </span>
            )}

            {hasChildren && (
              <button
                type="button"
                className={styles.expandToggleBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(node.id);
                }}
                aria-label={isExpanded ? `Collapse ${node.title}` : `Expand ${node.title}`}
                title={isExpanded ? 'Collapse branch' : `Expand (${node.children?.length} branches)`}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Render child branches recursively if expanded */}
      {hasChildren && isExpanded && (
        <div className={`${styles.treeBranch} ${isLateralEntryBranch ? styles.lateralBranchHighlight : ''}`}>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedMap={expandedMap}
              onToggleExpand={onToggleExpand}
              onSelectNode={onSelectNode}
              selectedNodeId={selectedNodeId}
              userCurrentNodeId={userCurrentNodeId}
              searchFilter={searchFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CareerPathExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  // Data states
  const [treeRoot, setTreeRoot] = useState<EducationTreeNode | null>(null);
  const [allNodes, setAllNodes] = useState<EducationTreeNode[]>([]);
  const [userCurrentNodeId, setUserCurrentNodeId] = useState<string | null>(null);
  const [currentEducation, setCurrentEducation] = useState<CurrentEducationContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction states
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode] = useState<EducationTreeNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStreamFilter, setActiveStreamFilter] = useState<string>('all');

  // Career Modal detail state
  const [modalCareer, setModalCareer] = useState<Career | null>(null);
  const [allCareersCatalogue, setAllCareersCatalogue] = useState<Career[]>([]);

  // 1. Fetch Indian Education Tree and User Position
  const loadTreeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await EducationPathwayService.getPathways();
      
      setTreeRoot(res.treeRoot);
      setAllNodes(res.allNodes);
      setUserCurrentNodeId(res.userCurrentNodeId);
      setCurrentEducation(res.currentEducation);

      // Build initial expansion: root + user's "YOU ARE HERE" path
      const initialExpanded: Record<string, boolean> = {
        'stage-class-10': true
      };

      // If user has a current node, trace ancestry and expand
      if (res.userCurrentNodeId && res.allNodes) {
        const findAncestors = (targetId: string, current: EducationTreeNode, path: string[]): string[] | null => {
          if (current.id === targetId) return [...path, current.id];
          if (current.children) {
            for (const child of current.children) {
              const found = findAncestors(targetId, child, [...path, current.id]);
              if (found) return found;
            }
          }
          return null;
        };

        const ancestry = findAncestors(res.userCurrentNodeId, res.treeRoot, []);
        if (ancestry) {
          ancestry.forEach(id => {
            initialExpanded[id] = true;
          });
        }

        // Set selected node to user's current node or root
        const matched = res.allNodes.find(n => n.id === res.userCurrentNodeId);
        if (matched) {
          setSelectedNode(matched);
        } else {
          setSelectedNode(res.treeRoot);
        }
      } else {
        // Expand Intermediate by default so user sees main streams
        initialExpanded['stage-intermediate'] = true;
        setSelectedNode(res.treeRoot);
      }

      setExpandedMap(initialExpanded);
    } catch (err: any) {
      console.error('Failed to load education pathways tree:', err);
      setError('Failed to load Career Path Explorer data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch careers catalogue for modal viewing
  useEffect(() => {
    CareerService.getCareers().then(res => {
      setAllCareersCatalogue(res.careers);
    }).catch(err => {
      console.warn('Could not preload career catalogue:', err);
    });
  }, []);

  useEffect(() => {
    loadTreeData();
  }, [loadTreeData]);

  // Expand / Collapse toggler
  const handleToggleExpand = (id: string) => {
    setExpandedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Expand All
  const handleExpandAll = () => {
    const fullExpanded: Record<string, boolean> = {};
    allNodes.forEach(n => {
      if (n.children && n.children.length > 0) {
        fullExpanded[n.id] = true;
      }
    });
    setExpandedMap(fullExpanded);
  };

  // Collapse All
  const handleCollapseAll = () => {
    setExpandedMap({
      'stage-class-10': true
    });
  };

  // Focus User Position
  const handleFocusMyPosition = () => {
    if (!userCurrentNodeId || !treeRoot) return;

    // Trace path from root to userCurrentNodeId
    const findAncestors = (targetId: string, current: EducationTreeNode, path: string[]): string[] | null => {
      if (current.id === targetId) return [...path, current.id];
      if (current.children) {
        for (const child of current.children) {
          const found = findAncestors(targetId, child, [...path, current.id]);
          if (found) return found;
        }
      }
      return null;
    };

    const ancestry = findAncestors(userCurrentNodeId, treeRoot, []);
    if (ancestry) {
      setExpandedMap(prev => {
        const next = { ...prev };
        ancestry.forEach(id => { next[id] = true; });
        return next;
      });
    }

    const matched = allNodes.find(n => n.id === userCurrentNodeId);
    if (matched) {
      setSelectedNode(matched);
    }
  };

  // Compute breadcrumb ancestry path for the currently selected node
  const selectedBreadcrumbs = useMemo(() => {
    if (!selectedNode || !treeRoot) return [];
    
    const findAncestors = (targetId: string, current: EducationTreeNode, trail: EducationTreeNode[]): EducationTreeNode[] | null => {
      const nextTrail = [...trail, current];
      if (current.id === targetId) return nextTrail;
      if (current.children) {
        for (const child of current.children) {
          const found = findAncestors(targetId, child, nextTrail);
          if (found) return found;
        }
      }
      return null;
    };

    return findAncestors(selectedNode.id, treeRoot, []) || [selectedNode];
  }, [selectedNode, treeRoot]);

  // Filtered Tree Root based on category filter
  const displayedTreeRoot = useMemo(() => {
    if (!treeRoot) return null;
    if (activeStreamFilter === 'all') return treeRoot;

    // Deep filter matching category
    const filterSubtree = (node: EducationTreeNode): EducationTreeNode | null => {
      const matchesCategory = node.category === activeStreamFilter;
      const filteredChildren = (node.children || [])
        .map(c => filterSubtree(c))
        .filter((c): c is EducationTreeNode => c !== null);

      if (matchesCategory || filteredChildren.length > 0 || node.id === 'stage-class-10' || node.id === 'stage-intermediate') {
        return {
          ...node,
          children: filteredChildren
        };
      }
      return null;
    };

    return filterSubtree(treeRoot) || treeRoot;
  }, [treeRoot, activeStreamFilter]);

  // Open rich career details modal
  const handleOpenCareerModal = (careerRef: PathwayCareerRef) => {
    const full = allCareersCatalogue.find(c => c.id === careerRef.id || c.title.toLowerCase() === careerRef.title.toLowerCase());
    if (full) {
      setModalCareer(full);
    } else {
      // Fallback synthetic Career item conforming to Career interface
      const fallbackCareer: Career = {
        id: careerRef.id,
        title: careerRef.title,
        category: careerRef.category || 'General',
        description: `Professional career pathway in ${careerRef.title}.`,
        education: selectedNode?.title || 'Relevant degree / qualification',
        skills: selectedNode?.skills || [],
        responsibilities: ['Domain analysis', 'Applied problem solving', 'Continuous advancement'],
        salaryRange: careerRef.salaryRange || 'Competitive Industry Standard',
        growthRate: careerRef.growthRate || '+15% High Demand',
        demandLevel: careerRef.demandLevel || 'High',
        saved: false,
        relevanceTag: null
      };
      setModalCareer(fallbackCareer);
    }
  };

  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div className="glow-accent" style={{ top: '12%', left: '15%', opacity: 0.15 }} />
      <div className="glow-accent-secondary" style={{ bottom: '15%', right: '12%', opacity: 0.15 }} />

      <div className={styles.container}>
        {/* Loading State */}
        {loading && (
          <div className={styles.loadingSpinner}>
            <Loader2 className={styles.spinAnimation} size={36} />
            <p>Loading Visionix Career Path Explorer...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className={styles.heroSection} style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', marginBottom: '8px' }}>
              <AlertCircle size={24} />
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Explorer Error</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>{error}</p>
            <button className={styles.focusPositionBtn} onClick={loadTreeData}>
              Try Again
            </button>
          </div>
        )}

        {/* Loaded Explorer UI */}
        {!loading && !error && displayedTreeRoot && (
          <>
            {/* Top Hero & Orientation Header */}
            <div className={styles.heroSection}>
              <div className={styles.heroHeader}>
                <div className={styles.heroTitleGroup}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary, #6366f1)', marginBottom: '4px' }}>
                    <Compass size={14} />
                    <span>Visionix Career Path Explorer</span>
                  </div>
                  <h1>Interactive Education-to-Career Tree</h1>
                  <p className={styles.heroSubtitle}>
                    Follow how every educational decision branches into degrees, specializations, practical competencies, and high-impact career destinations.
                  </p>
                </div>

                <div className={styles.treeActionBtns}>
                  <button 
                    type="button"
                    className={styles.actionBtn}
                    onClick={handleExpandAll}
                    title="Expand all branches in the path"
                  >
                    <Layers size={13} />
                    <span>Expand All</span>
                  </button>
                  <button 
                    type="button"
                    className={styles.actionBtn}
                    onClick={handleCollapseAll}
                    title="Collapse to top-level stages"
                  >
                    <X size={13} />
                    <span>Collapse All</span>
                  </button>
                </div>
              </div>

              {/* "YOU ARE HERE" Banner (Non-restrictive) */}
              {userCurrentNodeId && (
                <div className={styles.youAreHereBanner}>
                  <div className={styles.youAreHereLeft}>
                    <span className={styles.youAreHereBadge}>
                      <Target size={11} />
                      <span>YOU ARE HERE</span>
                    </span>
                    <span className={styles.youAreHereTrail}>
                      {currentEducation?.stream 
                        ? `${currentEducation.level || 'Academic'} • ${currentEducation.stream} ${currentEducation.branchSpecialization ? `(${currentEducation.branchSpecialization})` : ''}`
                        : 'Your Current Academic Profile'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={styles.focusPositionBtn}
                    onClick={handleFocusMyPosition}
                    title="Jump and focus to your position in the tree"
                  >
                    <Target size={13} />
                    <span>Focus My Position</span>
                  </button>
                </div>
              )}
            </div>

            {/* Controls & Filter Toolbar */}
            <div className={styles.controlsToolbar}>
              {/* Search Bar */}
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={15} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search streams, degrees, skills, careers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className={styles.clearSearchBtn}
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Stream / Category Filter Pills */}
              <div className={styles.filterScrollRow}>
                {STREAM_FILTERS.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    className={`${styles.filterPill} ${activeStreamFilter === f.id ? styles.filterPillActive : ''}`}
                    onClick={() => setActiveStreamFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Explorer Workspace Grid */}
            <div className={styles.explorerGrid}>
              {/* Left Column: Connected Visual Tree Canvas */}
              <div className={styles.treeCanvasCard}>
                <div className={styles.treeCanvasHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GitFork size={16} style={{ color: 'var(--color-primary, #6366f1)' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
                      Connected Education Branches
                    </span>
                  </div>

                  <div className={styles.treeLegend}>
                    <span><span className={styles.legendDotCurrent} /> You Are Here</span>
                    <span><span className={styles.legendDotSelected} /> Selected</span>
                  </div>
                </div>

                {/* The Connected Tree */}
                <div className={styles.treeContainer}>
                  <TreeNodeItem
                    node={displayedTreeRoot}
                    depth={0}
                    expandedMap={expandedMap}
                    onToggleExpand={handleToggleExpand}
                    onSelectNode={setSelectedNode}
                    selectedNodeId={selectedNode?.id || null}
                    userCurrentNodeId={userCurrentNodeId}
                    searchFilter={searchQuery}
                  />
                </div>
              </div>

              {/* Right Column: Node Details Inspector Panel */}
              <div className={styles.inspectorPanel}>
                {selectedNode ? (
                  <>
                    {/* Inspector Header & Breadcrumbs */}
                    <div className={styles.inspectorHeader}>
                      <div>
                        <div className={styles.inspectorBreadcrumbs}>
                          {selectedBreadcrumbs.map((b, idx) => (
                            <React.Fragment key={b.id}>
                              <span 
                                className={`${styles.breadcrumbSegment} ${idx === selectedBreadcrumbs.length - 1 ? styles.breadcrumbActive : ''}`}
                                onClick={() => setSelectedNode(b)}
                                style={{ cursor: 'pointer' }}
                              >
                                {b.shortCode || b.title}
                              </span>
                              {idx < selectedBreadcrumbs.length - 1 && <span>→</span>}
                            </React.Fragment>
                          ))}
                        </div>

                        <h2 className={styles.inspectorTitle}>{selectedNode.title}</h2>
                        {selectedNode.subtitle && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #94a3b8)', marginBottom: '6px' }}>
                            {selectedNode.subtitle}
                          </div>
                        )}
                        <span className={styles.inspectorCategoryBadge}>
                          {getNodeIcon(selectedNode)}
                          <span>{selectedNode.category || 'Academic Pathway'}</span>
                        </span>
                      </div>

                      {userCurrentNodeId === selectedNode.id && (
                        <span className={styles.hereIndicator} style={{ alignSelf: 'flex-start' }}>
                          YOUR CURRENT STAGE
                        </span>
                      )}
                    </div>

                    {/* Overview narrative */}
                    <p className={styles.inspectorDesc}>{selectedNode.description}</p>

                    {/* Key Attributes (Duration, Eligibility) */}
                    {(selectedNode.duration || selectedNode.eligibility) && (
                      <div className={styles.metricsGrid}>
                        {selectedNode.duration && (
                          <div className={styles.metricBox}>
                            <div className={styles.metricLabel}>Typical Duration</div>
                            <div className={styles.metricValue}>
                              <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: '#a78bfa' }} />
                              <span>{selectedNode.duration}</span>
                            </div>
                          </div>
                        )}
                        {selectedNode.eligibility && (
                          <div className={styles.metricBox}>
                            <div className={styles.metricLabel}>Entry Eligibility</div>
                            <div className={styles.metricValue}>{selectedNode.eligibility}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Entrance Examinations */}
                    {selectedNode.entranceExams && selectedNode.entranceExams.length > 0 && (
                      <div className={styles.inspectorSection}>
                        <div className={styles.sectionTitle}>
                          <Award size={13} style={{ color: '#f59e0b' }} />
                          <span>Competitive Entrance Exams</span>
                        </div>
                        <div className={styles.tagCloud}>
                          {selectedNode.entranceExams.map((exam, idx) => (
                            <span key={idx} className={styles.examTag}>{exam}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Outcomes */}
                    {selectedNode.outcomes && selectedNode.outcomes.length > 0 && (
                      <div className={styles.inspectorSection}>
                        <div className={styles.sectionTitle}>
                          <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                          <span>Key Progression Outcomes</span>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.5 }}>
                          {selectedNode.outcomes.map((out, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{out}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Available Next Choices / Branches */}
                    {selectedNode.children && selectedNode.children.length > 0 && (
                      <div className={styles.inspectorSection}>
                        <div className={styles.sectionTitle}>
                          <GitFork size={13} style={{ color: 'var(--color-primary, #6366f1)' }} />
                          <span>Available Next Branches ({selectedNode.children.length})</span>
                        </div>
                        <div className={styles.branchOptionsList}>
                          {selectedNode.children.map(child => (
                            <div
                              key={child.id}
                              className={styles.branchOptionCard}
                              onClick={() => {
                                setSelectedNode(child);
                                setExpandedMap(prev => ({ ...prev, [selectedNode.id]: true, [child.id]: true }));
                              }}
                            >
                              <div>
                                <div className={styles.branchOptionTitle}>{child.shortCode || child.title}</div>
                                <div className={styles.branchOptionCategory}>{child.category}</div>
                              </div>
                              <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Connected Skills */}
                    {selectedNode.skills && selectedNode.skills.length > 0 && (
                      <div className={styles.inspectorSection}>
                        <div className={styles.sectionTitle}>
                          <Sparkles size={13} style={{ color: '#34d399' }} />
                          <span>Target Competencies & Skills</span>
                        </div>
                        <div className={styles.tagCloud} style={{ marginBottom: '10px' }}>
                          {selectedNode.skills.map((skill, idx) => (
                            <span key={idx} className={styles.skillTag}>
                              <CheckCircle2 size={11} />
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          className={styles.careerActionBtn}
                          onClick={() => navigate('/skill-gap', { state: { careerId: selectedNode.careerIds?.[0] } })}
                          style={{ width: '100%', justifyContent: 'center', padding: '6px' }}
                        >
                          <Target size={13} />
                          <span>Analyze Skill Gap in Skill Navigator</span>
                        </button>
                      </div>
                    )}

                    {/* Connected Career Destinations */}
                    {selectedNode.resolvedCareers && selectedNode.resolvedCareers.length > 0 && (
                      <div className={styles.inspectorSection}>
                        <div className={styles.sectionTitle}>
                          <Briefcase size={13} style={{ color: '#818cf8' }} />
                          <span>Associated Career Opportunities ({selectedNode.resolvedCareers.length})</span>
                        </div>
                        <div className={styles.careersList}>
                          {selectedNode.resolvedCareers.map(career => (
                            <div key={career.id} className={styles.careerCard}>
                              <div className={styles.careerHeader}>
                                <div>
                                  <h4 className={styles.careerTitle}>{career.title}</h4>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{career.category}</span>
                                </div>
                                {career.demandLevel && (
                                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}>
                                    {career.demandLevel} Demand
                                  </span>
                                )}
                              </div>

                              {(career.salaryRange || career.growthRate) && (
                                <div className={styles.careerMetaRow}>
                                  {career.salaryRange && <span className={styles.careerMetaTag}>{career.salaryRange}</span>}
                                  {career.growthRate && <span className={styles.careerMetaTag}>{career.growthRate}</span>}
                                </div>
                              )}

                              <div className={styles.careerActionsRow}>
                                <button
                                  type="button"
                                  className={`${styles.careerActionBtn} ${styles.careerActionBtnPrimary}`}
                                  onClick={() => handleOpenCareerModal(career)}
                                >
                                  <span>View Details</span>
                                </button>
                                <button
                                  type="button"
                                  className={styles.careerActionBtn}
                                  onClick={() => navigate('/compare', { state: { selectedCareerIds: [career.id] } })}
                                  title="Compare this career with others"
                                >
                                  <ArrowRightLeft size={11} />
                                  <span>Compare</span>
                                </button>
                                <button
                                  type="button"
                                  className={styles.careerActionBtn}
                                  onClick={() => navigate('/career-paths', { state: { careerId: career.id } })}
                                  title="Explore alternative & backup paths"
                                >
                                  <TrendingUp size={11} />
                                  <span>Paths</span>
                                </button>
                                <button
                                  type="button"
                                  className={styles.careerActionBtn}
                                  onClick={() => navigate('/roadmap', { state: { careerId: career.id } })}
                                  title="View developmental roadmap"
                                >
                                  <Rocket size={11} />
                                  <span>Roadmap</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Integrated System Quick Links */}
                    <div className={styles.inspectorSection} style={{ marginBottom: 0 }}>
                      <div className={styles.sectionTitle}>
                        <ExternalLink size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>Connected Visionix Ecosystem</span>
                      </div>
                      <div className={styles.systemLinksGrid}>
                        <button
                          type="button"
                          className={styles.systemLinkBtn}
                          onClick={() => navigate('/courses')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <GraduationCap size={15} style={{ color: '#818cf8' }} />
                            <span>Recommended Courses & Learning Modules</span>
                          </div>
                          <ChevronRight size={14} />
                        </button>

                        <button
                          type="button"
                          className={styles.systemLinkBtn}
                          onClick={() => navigate('/roadmap')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Rocket size={15} style={{ color: '#a78bfa' }} />
                            <span>Full Career Roadmap Journey</span>
                          </div>
                          <ChevronRight size={14} />
                        </button>

                        <button
                          type="button"
                          className={styles.systemLinkBtn}
                          onClick={() => navigate('/next-step')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Footprints size={15} style={{ color: '#10b981' }} />
                            <span>Your Next Step & Progress Source</span>
                          </div>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.emptyInspector}>
                    <Compass size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <p>Select any branch or node to inspect its complete developmental profile and connected career routes.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reusable Career Details Modal */}
      {modalCareer && (
        <CareerDetailsModal
          career={modalCareer}
          onClose={() => setModalCareer(null)}
          onToggleBookmark={() => {}}
          onToggleCompare={(c) => {
            navigate('/compare', { state: { selectedCareerIds: [c.id] } });
          }}
          compareList={[]}
          targetCareerTitle={profile?.career?.dreamCareer || ''}
        />
      )}
    </DashboardLayout>
  );
};

export default CareerPathExplorerPage;
