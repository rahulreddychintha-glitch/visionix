import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { EducationPathwayService } from '../services/educationPathway.service';
import type { 
  EducationTreeNode, 
  PathwayComparisonPreset,
  CurrentEducationContext 
} from '../services/educationPathway.service';
import { RoadmapService } from '../services/roadmap.service';
import { CareerService } from '../services/career.service';
import type { Career } from '../services/career.service';
import { CareerDetailsModal } from '../components/dashboard/CareerDetailsModal';
import { useProfile } from '../hooks/useProfile';
import {
  formatStream
} from '../utils/educationFormatters';
import { 
  GitBranch, 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Briefcase, 
  Clock, 
  ArrowUpRight, 
  Rocket, 
  Loader2, 
  AlertCircle, 
  ChevronDown,
  Search,
  X,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  Cpu,
  Stethoscope,
  TrendingUp,
  Scale,
  Palette,
  Plane,
  Wrench
} from 'lucide-react';
import styles from './WhatsNextPage.module.css';

const CATEGORIES = [
  'All',
  'Science & Engineering',
  'Computing & Software',
  'Medical & Life Sciences',
  'Commerce & Economics',
  'Legal Studies',
  'Design & Visual Arts',
  'Technical Education',
  'Vocational Trades'
];

const STAGE_FILTERS = [
  { id: 'all', label: 'All Progression' },
  { id: 'stage-class-10', label: 'Class 10 Foundation' },
  { id: 'stage-intermediate', label: 'Intermediate (10+2)' },
  { id: 'stage-diploma', label: 'Polytechnic Diploma' },
  { id: 'stage-iti', label: 'ITI / Vocational' },
  { id: 'degree-btech', label: 'B.Tech / B.E. Engineering' },
  { id: 'stream-bipc', label: 'Medical & Healthcare' },
  { id: 'stream-mec', label: 'Commerce & CA' }
];

interface TreeNodeViewProps {
  node: EducationTreeNode;
  depth: number;
  expandedMap: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  onSelectNode: (node: EducationTreeNode) => void;
  selectedNodeId: string | null;
  userCurrentNodeId: string | null;
  compareList: EducationTreeNode[];
  onToggleCompare: (node: EducationTreeNode) => void;
}

const TreeNodeView: React.FC<TreeNodeViewProps> = ({
  node,
  depth,
  expandedMap,
  onToggleExpand,
  onSelectNode,
  selectedNodeId,
  userCurrentNodeId,
  compareList,
  onToggleCompare
}) => {
  const isExpanded = Boolean(expandedMap[node.id]);
  const isSelected = selectedNodeId === node.id;
  const isYouAreHere = userCurrentNodeId === node.id;
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isInCompare = compareList.some(c => c.id === node.id);

  const getNodeIcon = () => {
    const text = `${node.nodeType} ${node.title} ${node.category || ''}`.toLowerCase();
    if (text.includes('tech') || text.includes('cse') || text.includes('computer') || text.includes('ai') || text.includes('software') || text.includes('cyber')) {
      return <Cpu size={18} />;
    }
    if (text.includes('mbbs') || text.includes('medical') || text.includes('doctor') || text.includes('pharm') || text.includes('nurs') || text.includes('bds') || text.includes('bipc') || text.includes('health')) {
      return <Stethoscope size={18} />;
    }
    if (text.includes('commerce') || text.includes('b.com') || text.includes('finance') || text.includes('ca') || text.includes('bba') || text.includes('mec') || text.includes('economics')) {
      return <TrendingUp size={18} />;
    }
    if (text.includes('law') || text.includes('civil') || text.includes('governance') || text.includes('cec') || text.includes('hec') || text.includes('judge')) {
      return <Scale size={18} />;
    }
    if (text.includes('design') || text.includes('media') || text.includes('b.des') || text.includes('bjmc') || text.includes('art')) {
      return <Palette size={18} />;
    }
    if (text.includes('pilot') || text.includes('aviation') || text.includes('cpl') || text.includes('aerospace')) {
      return <Plane size={18} />;
    }
    if (text.includes('diploma') || text.includes('polytechnic') || text.includes('iti') || text.includes('fitter') || text.includes('electrician')) {
      return <Wrench size={18} />;
    }
    return <GraduationCap size={18} />;
  };

  const getNodeTypeBadgeClass = () => {
    switch (node.nodeType) {
      case 'education_stage': return styles.stageBadge;
      case 'stream': return styles.streamBadge;
      case 'degree_family': return styles.degreeBadge;
      case 'branch': return styles.branchBadge;
      case 'qualification': return styles.qualBadge;
      default: return '';
    }
  };

  const formatNodeTypeLabel = () => {
    switch (node.nodeType) {
      case 'education_stage': return 'Stage';
      case 'stream': return 'Stream';
      case 'degree_family': return 'Degree Family';
      case 'branch': return 'Branch / Course';
      case 'specialization': return 'Specialization';
      case 'qualification': return 'Qualification';
      default: return node.nodeType;
    }
  };

  return (
    <div className={`${styles.treeNodeCard} ${isExpanded || isSelected ? styles.treeNodeCardActive : ''} ${isYouAreHere ? styles.treeNodeCardYouAreHere : ''}`}>
      <div 
        className={styles.nodeHeader}
        onClick={() => {
          onSelectNode(node);
          if (hasChildren) {
            onToggleExpand(node.id);
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelectNode(node);
            if (hasChildren) onToggleExpand(node.id);
          }
        }}
      >
        <div className={styles.nodeLeft}>
          <div className={styles.nodeIconBox}>
            {getNodeIcon()}
          </div>

          <div className={styles.nodeTitleBlock}>
            <div className={styles.nodeTitleRow}>
              <h3 className={styles.nodeTitle}>{node.title}</h3>
              {isYouAreHere && (
                <span className={styles.youAreHerePin}>
                  ★ You Are Here
                </span>
              )}
            </div>
            {node.subtitle && (
              <p className={styles.nodeSubtitle}>{node.subtitle}</p>
            )}
          </div>
        </div>

        <div className={styles.nodeRight}>
          <span className={`${styles.nodeTypeBadge} ${getNodeTypeBadgeClass()}`}>
            {formatNodeTypeLabel()}
          </span>

          {node.duration && (
            <span className={styles.durationBadge}>
              <Clock size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px' }} />
              {node.duration}
            </span>
          )}

          {/* Quick Add To Compare */}
          <button
            type="button"
            className={`${styles.iconBtn} ${isInCompare ? styles.iconBtnActive : ''}`}
            title={isInCompare ? 'Remove from Comparison' : 'Add to Compare'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(node);
            }}
          >
            <ArrowRightLeft size={14} />
          </button>

          {hasChildren && (
            <ChevronDown size={17} className={styles.chevron} />
          )}
        </div>
      </div>

      {/* Downstream Child Nodes */}
      {isExpanded && hasChildren && (
        <div className={styles.nestedContainer}>
          <div className={styles.subBranchList}>
            {node.children!.map((child) => (
              <TreeNodeView
                key={child.id}
                node={child}
                depth={depth + 1}
                expandedMap={expandedMap}
                onToggleExpand={onToggleExpand}
                onSelectNode={onSelectNode}
                selectedNodeId={selectedNodeId}
                userCurrentNodeId={userCurrentNodeId}
                compareList={compareList}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const WhatsNextPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, saveProfile } = useProfile();

  const [currentEducation, setCurrentEducation] = useState<CurrentEducationContext | null>(null);
  const [userCurrentNodeId, setUserCurrentNodeId] = useState<string | null>(null);
  const [treeRoot, setTreeRoot] = useState<EducationTreeNode | null>(null);
  const [allNodes, setAllNodes] = useState<EducationTreeNode[]>([]);
  const [comparisonPresets, setComparisonPresets] = useState<PathwayComparisonPreset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [existingRoadmaps, setExistingRoadmaps] = useState<Record<string, boolean>>({});

  // Navigation & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStageTab, setSelectedStageTab] = useState<string>('all');
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode] = useState<EducationTreeNode | null>(null);

  // Comparison Tool States
  const [compareList, setCompareList] = useState<EducationTreeNode[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Career Details Modal State
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [loadingCareerDetails, setLoadingCareerDetails] = useState<boolean>(false);
  const [careerCompareList, setCareerCompareList] = useState<Career[]>([]);

  const targetCareerTitle = profile?.careerGoals?.dreamCareer || '';

  // Load complete independent tree and user roadmap map
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [pathwayData, userRoadmaps] = await Promise.all([
        EducationPathwayService.getPathways(),
        RoadmapService.getUserRoadmaps().catch(() => [])
      ]);

      setTreeRoot(pathwayData.treeRoot);
      setAllNodes(pathwayData.allNodes || []);
      setComparisonPresets(pathwayData.comparisonPresets || []);
      setCurrentEducation(pathwayData.currentEducation);
      setUserCurrentNodeId(pathwayData.userCurrentNodeId);

      // Auto-select and auto-expand relevant branch
      if (pathwayData.treeRoot) {
        const root = pathwayData.treeRoot;
        setSelectedNode(root);
        
        const initExpanded: Record<string, boolean> = { [root.id]: true };
        if (root.children && root.children.length > 0) {
          root.children.forEach(c => { initExpanded[c.id] = true; });
        }
        setExpandedMap(initExpanded);
      }

      const roadmapMap: Record<string, boolean> = {};
      userRoadmaps.forEach((r) => {
        roadmapMap[r.careerId.toLowerCase()] = true;
        roadmapMap[r.careerTitle.toLowerCase()] = true;
      });
      setExistingRoadmaps(roadmapMap);
    } catch (err: any) {
      console.error('Error loading independent education pathway tree:', err);
      setError(err?.response?.data?.message || 'Could not load the education tree. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleExpand = (id: string) => {
    setExpandedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectNode = (node: EducationTreeNode) => {
    setSelectedNode(node);
  };

  const handleToggleCompare = (node: EducationTreeNode) => {
    setCompareList(prev => {
      const exists = prev.some(n => n.id === node.id);
      if (exists) {
        return prev.filter(n => n.id !== node.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 pathways simultaneously.');
        return prev;
      }
      return [...prev, node];
    });
  };

  const handleApplyPreset = (preset: PathwayComparisonPreset) => {
    const matched = preset.nodeIds
      .map(id => allNodes.find(n => n.id === id))
      .filter((n): n is EducationTreeNode => Boolean(n));
    setCompareList(matched);
    setIsCompareModalOpen(true);
  };

  // Filtered view based on Stage Tabs and Category
  const activeTreeRoot = useMemo(() => {
    if (!treeRoot) return null;
    if (selectedStageTab === 'all') return treeRoot;

    // Find node matching selectedStageTab in flat catalog
    const targetNode = allNodes.find(n => n.id === selectedStageTab);
    return targetNode || treeRoot;
  }, [treeRoot, selectedStageTab, allNodes]);

  // Search results across entire flat catalog
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    return allNodes.filter(n => {
      const titleMatch = n.title.toLowerCase().includes(q);
      const subMatch = (n.subtitle || '').toLowerCase().includes(q);
      const catMatch = (n.category || '').toLowerCase().includes(q);
      const examMatch = (n.entranceExams || []).some(e => e.toLowerCase().includes(q));
      const skillMatch = (n.skills || []).some(s => s.toLowerCase().includes(q));
      const branchMatch = (n.majorBranches || []).some(b => b.toLowerCase().includes(q));

      const categoryFilter = selectedCategory === 'All' || n.category === selectedCategory;

      return (titleMatch || subMatch || catMatch || examMatch || skillMatch || branchMatch) && categoryFilter;
    });
  }, [searchQuery, allNodes, selectedCategory]);

  const handleOpenCareerDetails = async (careerRef: { id: string; title: string; category?: string }) => {
    try {
      setLoadingCareerDetails(true);
      const fullCareer = await CareerService.getCareerDetails(careerRef.id);
      setSelectedCareer(fullCareer);
    } catch (err) {
      console.warn('Could not fetch full career record, using fallback:', err);
      setSelectedCareer({
        id: careerRef.id,
        title: careerRef.title,
        category: careerRef.category || 'General',
        description: `Career opportunity for ${careerRef.title}.`,
        education: 'Bachelor degree or professional qualification',
        skills: ['Problem Solving', 'Communication', 'Technical Proficiency'],
        responsibilities: [
          `Execute core industry workflows as a ${careerRef.title}`,
          `Collaborate with multidisciplinary engineering or management teams`,
          `Continuous professional development and domain excellence`
        ],
        salaryRange: 'Competitive Industry Standards',
        growthRate: 'High Growth',
        demandLevel: 'High Demand',
        saved: false,
        relevanceTag: 'Relevant'
      });
    } finally {
      setLoadingCareerDetails(false);
    }
  };

  const handleToggleCareerBookmark = async (career: Career) => {
    try {
      if (career.saved) {
        await CareerService.unsaveCareer(career.id);
        career.saved = false;
      } else {
        await CareerService.saveCareer(career.id);
        career.saved = true;
      }
      setSelectedCareer({ ...career });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleToggleCareerCompare = (career: Career) => {
    setCareerCompareList(prev => {
      const exists = prev.some(c => c.id === career.id);
      if (exists) return prev.filter(c => c.id !== career.id);
      if (prev.length >= 3) {
        alert('You can compare up to 3 careers at once.');
        return prev;
      }
      return [...prev, career];
    });
  };

  const handleSetTargetCareer = async (career: Career) => {
    if (!profile) return;
    try {
      await saveProfile({
        ...profile,
        careerGoals: {
          ...profile.careerGoals,
          dreamCareer: career.title
        }
      });
    } catch (err) {
      console.error('Error setting target career:', err);
    }
  };

  const handleNavigateRoadmap = (career: any) => {
    navigate('/roadmap', { state: { selectedCareer: career } });
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        
        {/* ══════════════════════════════════════════════════════════════════════
            1. PAGE HEADER & COMPARE LAUNCHER
            ══════════════════════════════════════════════════════════════════════ */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.titleArea}>
              <div className={styles.badgeRow}>
                <div className={styles.headerBadge}>
                  <GitBranch size={13} />
                  <span>Indian Education → Career Path Explorer</span>
                </div>

                {currentEducation && userCurrentNodeId && (
                  <div className={styles.youAreHereIndicator}>
                    <span className={styles.radarBeacon} />
                    <span>Your Stage: {formatStream(currentEducation.stream, currentEducation.branchSpecialization)}</span>
                  </div>
                )}
              </div>

              <h1 className={styles.pageTitle}>What's Next?</h1>
              <p className={styles.pageSubtitle}>
                Complete standalone explorer for the Indian education system. Map your journey from Class 10 to Intermediate Streams, Polytechnic Diplomas, Undergraduate Engineering Branches, Degrees, Skills, and Destination Careers.
              </p>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.compareToggleBtn}
                onClick={() => setIsCompareModalOpen(true)}
              >
                <ArrowRightLeft size={15} />
                <span>Compare Pathways</span>
                {compareList.length > 0 && (
                  <span className={styles.compareBadge}>{compareList.length}</span>
                )}
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════
              2. SEARCH & CATEGORY FILTER BAR
              ════════════════════════════════════════════════════════════════════ */}
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <Search size={17} style={{ color: '#94a3b8' }} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search any course, branch, entrance exam (JEE, NEET, CLAT, IPMAT), skill, or degree..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setSearchQuery('')}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className={styles.categoryPills}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.categoryPill} ${selectedCategory === cat ? styles.categoryPillActive : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════
              3. STAGE QUICK-JUMP TABS
              ════════════════════════════════════════════════════════════════════ */}
          {!searchQuery && (
            <div className={styles.stageTabsBar}>
              {STAGE_FILTERS.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  className={`${styles.stageTab} ${selectedStageTab === stage.id ? styles.stageTabActive : ''}`}
                  onClick={() => {
                    setSelectedStageTab(stage.id);
                    if (stage.id !== 'all') {
                      const match = allNodes.find(n => n.id === stage.id);
                      if (match) setSelectedNode(match);
                    }
                  }}
                >
                  <Layers size={13} />
                  <span>{stage.label}</span>
                </button>
              ))}
            </div>
          )}
        </header>

        {/* ══════════════════════════════════════════════════════════════════════
            4. MAIN EXPLORER LAYOUT (TREE + DETAIL INSPECTOR DRAWER)
            ══════════════════════════════════════════════════════════════════════ */}
        {loading ? (
          <div className={styles.loadingBox}>
            <Loader2 className="spin-animation" size={34} style={{ color: '#6366f1' }} />
            <p>Loading authoritative Indian education pathways and progression tree...</p>
          </div>
        ) : error ? (
          <div className={styles.loadingBox}>
            <AlertCircle size={34} style={{ color: '#ef4444' }} />
            <p>{error}</p>
            <button type="button" className={styles.compareToggleBtn} onClick={fetchData}>
              Retry
            </button>
          </div>
        ) : (
          <div className={`${styles.explorerLayout} ${selectedNode ? styles.explorerLayoutWithDrawer : ''}`}>
            
            {/* Left Column: Interactive Tree or Search Results */}
            <div className={styles.treeCanvas}>
              
              {/* Search Results Mode */}
              {searchResults ? (
                searchResults.length > 0 ? (
                  searchResults.map((node) => (
                    <TreeNodeView
                      key={node.id}
                      node={node}
                      depth={1}
                      expandedMap={expandedMap}
                      onToggleExpand={handleToggleExpand}
                      onSelectNode={handleSelectNode}
                      selectedNodeId={selectedNode?.id || null}
                      userCurrentNodeId={userCurrentNodeId}
                      compareList={compareList}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))
                ) : (
                  <div className={styles.emptySearch}>
                    <Search size={32} style={{ color: '#64748b' }} />
                    <h3>No matching education nodes found</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
                      Try searching by generic degree name (e.g. B.Tech, MBBS, B.Com, Law), entrance exams (JEE, NEET, CLAT), or core skills.
                    </p>
                  </div>
                )
              ) : (
                /* Standard Interactive Tree Progression */
                activeTreeRoot && (
                  <TreeNodeView
                    node={activeTreeRoot}
                    depth={1}
                    expandedMap={expandedMap}
                    onToggleExpand={handleToggleExpand}
                    onSelectNode={handleSelectNode}
                    selectedNodeId={selectedNode?.id || null}
                    userCurrentNodeId={userCurrentNodeId}
                    compareList={compareList}
                    onToggleCompare={handleToggleCompare}
                  />
                )
              )}

            </div>

            {/* Right Column: Node Detail Inspector Drawer */}
            {selectedNode && (
              <aside className={styles.detailDrawer}>
                <div className={styles.drawerHeader}>
                  <div className={styles.drawerTitleArea}>
                    <span className={`${styles.nodeTypeBadge} ${styles.stageBadge}`}>
                      {selectedNode.category}
                    </span>
                    <h2 className={styles.drawerTitle}>{selectedNode.title}</h2>
                    {selectedNode.subtitle && (
                      <p className={styles.drawerSubtitle}>{selectedNode.subtitle}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.drawerCloseBtn}
                    onClick={() => setSelectedNode(null)}
                    title="Close Inspector"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Overview */}
                <div className={styles.drawerSection}>
                  <span className={styles.drawerSectionHeading}>
                    <BookOpen size={13} />
                    <span>Overview & Curriculum</span>
                  </span>
                  <p className={styles.drawerText}>{selectedNode.description}</p>
                </div>

                {/* Duration & Eligibility Meta Grid */}
                <div className={styles.metaGrid}>
                  {selectedNode.duration && (
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Duration</span>
                      <span className={styles.metaValue}>{selectedNode.duration}</span>
                    </div>
                  )}

                  {selectedNode.eligibility && (
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Eligibility</span>
                      <span className={styles.metaValue}>{selectedNode.eligibility}</span>
                    </div>
                  )}
                </div>

                {/* Qualifying Entrance Exams */}
                {selectedNode.entranceExams && selectedNode.entranceExams.length > 0 && (
                  <div className={styles.drawerSection}>
                    <span className={styles.drawerSectionHeading}>
                      <Sparkles size={13} />
                      <span>Qualifying Entrance Exams</span>
                    </span>
                    <div className={styles.pillWrap}>
                      {selectedNode.entranceExams.map((exam, idx) => (
                        <span key={idx} className={styles.examPill}>
                          🎯 {exam}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Major Branches / Specializations */}
                {selectedNode.majorBranches && selectedNode.majorBranches.length > 0 && (
                  <div className={styles.drawerSection}>
                    <span className={styles.drawerSectionHeading}>
                      <GitBranch size={13} />
                      <span>Major Branches & Tracks</span>
                    </span>
                    <ul className={styles.outcomeList}>
                      {selectedNode.majorBranches.map((branch, idx) => (
                        <li key={idx} className={styles.outcomeItem}>
                          {branch}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Postgraduate & Higher Studies */}
                {selectedNode.higherStudyOptions && selectedNode.higherStudyOptions.length > 0 && (
                  <div className={styles.drawerSection}>
                    <span className={styles.drawerSectionHeading}>
                      <GraduationCap size={13} />
                      <span>Postgraduate & Higher Studies</span>
                    </span>
                    <ul className={styles.outcomeList}>
                      {selectedNode.higherStudyOptions.map((opt, idx) => (
                        <li key={idx} className={styles.outcomeItem}>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Core Skills to Build */}
                {selectedNode.skills && selectedNode.skills.length > 0 && (
                  <div className={styles.drawerSection}>
                    <span className={styles.drawerSectionHeading}>
                      <Sparkles size={13} />
                      <span>Core Skills to Build</span>
                    </span>
                    <div className={styles.pillWrap}>
                      {selectedNode.skills.map((skill, idx) => (
                        <span key={idx} className={styles.skillPill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning & Career Outcomes */}
                {selectedNode.outcomes && selectedNode.outcomes.length > 0 && (
                  <div className={styles.drawerSection}>
                    <span className={styles.drawerSectionHeading}>
                      <CheckCircle2 size={13} />
                      <span>Key Outcomes</span>
                    </span>
                    <ul className={styles.outcomeList}>
                      {selectedNode.outcomes.map((out, idx) => (
                        <li key={idx} className={styles.outcomeItem}>
                          {out}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Destination Careers Connected to Existing Careers Database */}
                {selectedNode.resolvedCareers && selectedNode.resolvedCareers.length > 0 && (
                  <div className={styles.drawerSection}>
                    <span className={styles.drawerSectionHeading}>
                      <Briefcase size={13} />
                      <span>Destination Careers ({selectedNode.resolvedCareers.length})</span>
                    </span>

                    <div className={styles.careerMiniList}>
                      {selectedNode.resolvedCareers.map((career) => {
                        const hasRoadmap = Boolean(
                          existingRoadmaps[career.id.toLowerCase()] || 
                          existingRoadmaps[career.title.toLowerCase()]
                        );

                        return (
                          <div key={career.id} className={styles.careerMiniCard}>
                            <div>
                              <h4 className={styles.careerMiniTitle}>{career.title}</h4>
                              <p className={styles.careerMiniCategory}>{career.category}</p>
                            </div>

                            <div className={styles.careerMiniActions}>
                              <button
                                type="button"
                                className={`${styles.miniBtn} ${styles.miniDetailsBtn}`}
                                onClick={() => handleOpenCareerDetails(career)}
                                disabled={loadingCareerDetails}
                              >
                                <span>Details</span>
                                <ArrowUpRight size={11} />
                              </button>

                              <button
                                type="button"
                                className={`${styles.miniBtn} ${hasRoadmap ? styles.miniRoadmapBtnExisting : styles.miniRoadmapBtn}`}
                                onClick={() => handleNavigateRoadmap(career)}
                              >
                                <Rocket size={11} />
                                <span>{hasRoadmap ? 'View Roadmap' : 'Roadmap'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Compare Button */}
                <button
                  type="button"
                  className={styles.compareToggleBtn}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  onClick={() => handleToggleCompare(selectedNode)}
                >
                  <ArrowRightLeft size={14} />
                  <span>
                    {compareList.some(c => c.id === selectedNode.id)
                      ? 'Remove from Compare'
                      : 'Add to Pathway Compare'}
                  </span>
                </button>

              </aside>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            5. PATHWAY COMPARISON MODAL (SIDE-BY-SIDE)
            ══════════════════════════════════════════════════════════════════════ */}
        {isCompareModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsCompareModalOpen(false)}>
            <div className={styles.compareModal} onClick={(e) => e.stopPropagation()}>
              
              <div className={styles.compareModalHeader}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowRightLeft size={20} style={{ color: '#818cf8' }} />
                    <span>Side-by-Side Pathway Comparison</span>
                  </h2>
                  <p style={{ margin: '0.2rem 0 0', color: '#94a3b8', fontSize: '0.84rem' }}>
                    Compare educational foundation, qualifying entrance exams, duration, skills, and career destinations.
                  </p>
                </div>

                <button
                  type="button"
                  className={styles.drawerCloseBtn}
                  onClick={() => setIsCompareModalOpen(false)}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Quick Presets */}
              <div className={styles.comparePresetsRow}>
                <span className={styles.presetLabel}>Quick Presets:</span>
                {comparisonPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.presetBtn}
                    onClick={() => handleApplyPreset(preset)}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>

              {/* Comparison Grid */}
              {compareList.length > 0 ? (
                <div className={styles.compareGrid}>
                  {compareList.map((node) => (
                    <div key={node.id} className={styles.compareColumn}>
                      <div className={styles.colHeader}>
                        <span className={`${styles.nodeTypeBadge} ${styles.stageBadge}`}>
                          {node.category}
                        </span>
                        <h3 className={styles.colTitle}>{node.title}</h3>
                        {node.subtitle && (
                          <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>{node.subtitle}</p>
                        )}
                        <button
                          type="button"
                          className={styles.presetBtn}
                          style={{ marginTop: '0.4rem', width: 'fit-content' }}
                          onClick={() => handleToggleCompare(node)}
                        >
                          Remove
                        </button>
                      </div>

                      {/* Overview */}
                      <div className={styles.colField}>
                        <span className={styles.colFieldLabel}>Overview</span>
                        <p className={styles.colFieldValue}>{node.description}</p>
                      </div>

                      {/* Duration */}
                      {node.duration && (
                        <div className={styles.colField}>
                          <span className={styles.colFieldLabel}>Duration</span>
                          <p className={styles.colFieldValue}>{node.duration}</p>
                        </div>
                      )}

                      {/* Eligibility */}
                      {node.eligibility && (
                        <div className={styles.colField}>
                          <span className={styles.colFieldLabel}>Eligibility</span>
                          <p className={styles.colFieldValue}>{node.eligibility}</p>
                        </div>
                      )}

                      {/* Entrance Exams */}
                      {node.entranceExams && node.entranceExams.length > 0 && (
                        <div className={styles.colField}>
                          <span className={styles.colFieldLabel}>Entrance Exams</span>
                          <div className={styles.pillWrap}>
                            {node.entranceExams.map((e, idx) => (
                              <span key={idx} className={styles.examPill}>🎯 {e}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Branches */}
                      {node.majorBranches && node.majorBranches.length > 0 && (
                        <div className={styles.colField}>
                          <span className={styles.colFieldLabel}>Key Branches / Tracks</span>
                          <ul className={styles.outcomeList}>
                            {node.majorBranches.slice(0, 5).map((b, idx) => (
                              <li key={idx} className={styles.outcomeItem}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Postgraduate Progression */}
                      {node.higherStudyOptions && node.higherStudyOptions.length > 0 && (
                        <div className={styles.colField}>
                          <span className={styles.colFieldLabel}>Postgraduate Progression</span>
                          <ul className={styles.outcomeList}>
                            {node.higherStudyOptions.slice(0, 4).map((h, idx) => (
                              <li key={idx} className={styles.outcomeItem}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skills */}
                      {node.skills && node.skills.length > 0 && (
                        <div className={styles.colField}>
                          <span className={styles.colFieldLabel}>Core Skills</span>
                          <div className={styles.pillWrap}>
                            {node.skills.slice(0, 6).map((s, idx) => (
                              <span key={idx} className={styles.skillPill}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Destination Careers */}
                      {node.resolvedCareers && node.resolvedCareers.length > 0 && (
                        <div className={styles.colField}>
                          <span className={styles.colFieldLabel}>Destination Careers</span>
                          <div className={styles.careerMiniList}>
                            {node.resolvedCareers.slice(0, 3).map((c) => (
                              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.25)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>{c.title}</span>
                                <button
                                  type="button"
                                  className={`${styles.miniBtn} ${styles.miniDetailsBtn}`}
                                  style={{ flex: 'none', padding: '0.2rem 0.45rem' }}
                                  onClick={() => {
                                    setIsCompareModalOpen(false);
                                    handleOpenCareerDetails(c);
                                  }}
                                >
                                  Details
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptySearch}>
                  <ArrowRightLeft size={32} style={{ color: '#64748b' }} />
                  <h3>No pathways selected for comparison</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
                    Click "Quick Presets" above or select any node in the explorer and click "Add to Pathway Compare".
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            6. CAREER DETAILS MODAL
            ══════════════════════════════════════════════════════════════════════ */}
        {selectedCareer && (
          <CareerDetailsModal
            career={selectedCareer}
            onClose={() => setSelectedCareer(null)}
            onToggleBookmark={handleToggleCareerBookmark}
            onToggleCompare={handleToggleCareerCompare}
            compareList={careerCompareList}
            onSetTargetCareer={handleSetTargetCareer}
            targetCareerTitle={targetCareerTitle}
            hasRoadmap={Boolean(
              existingRoadmaps[selectedCareer.id.toLowerCase()] || 
              existingRoadmaps[selectedCareer.title.toLowerCase()]
            )}
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default WhatsNextPage;
