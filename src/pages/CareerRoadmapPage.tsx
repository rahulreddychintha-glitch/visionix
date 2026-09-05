import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DashboardLayout 
} from '../components/DashboardLayout';
import { RoadmapService } from '../services/roadmap.service';
import { ExamsApiService } from '../services/exams.service';
import { YoutubeApiService } from '../services/youtube.service';
import type { 
  CareerRoadmap, 
  Milestone
} from '../services/roadmap.service';
import { CareerService } from '../services/career.service';
import type { Career } from '../services/career.service';
import { useAiModal } from '../contexts/AiModalContext';
import { useAuth } from '../hooks/useAuth';
import { decodeHtmlEntities } from '../utils/textUtils';

import { 
  GitFork, 
  Circle, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  AlertCircle, 
  Check, 
  ListTodo,
  Play,
  CheckCircle,
  BookOpen,
  Sparkles,
  Info,
  X,
  ExternalLink,
  Video,
  Rocket,
  Calendar,
  Award,
  GraduationCap,
  FolderGit2,
  FileCheck,
  TrendingUp,
  Target,
  ArrowRight,
  Layers,
  Clock,
  Compass
} from 'lucide-react';
import styles from './CareerRoadmapPage.module.css';

export const CareerRoadmapPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAiModal } = useAiModal();
  const { isLoading: authLoading } = useAuth();

  // Roadmap State
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [pendingCareer, setPendingCareer] = useState<{ id: string; title: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Phase 31: Visualization Modes, Stage Filter & Expanded Journey Nodes
  const [viewMode, setViewMode] = useState<'progression' | 'milestones'>('progression');
  const [activeFilterStage, setActiveFilterStage] = useState<number | 'all'>('all');
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set([1]));

  const toggleStageExpansion = (stageId: number) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedStages(new Set([1, 2, 3, 4, 5, 6, 7]));
  };

  const handleCollapseAll = () => {
    setExpandedStages(new Set());
  };

  const handleFocusCurrent = () => {
    setActiveFilterStage('all');
    setExpandedStages(new Set([1]));
    const el = document.getElementById('stage-1');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Active Milestone Details Selection
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Saved Careers for switching
  const [savedCareers, setSavedCareers] = useState<Career[]>([]);
  const [showSwitchMenu, setShowSwitchMenu] = useState<boolean>(false);

  // AI Generating overlay states
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiGenStep, setAiGenStep] = useState<number>(0);

  // Assessment Wizard state
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<Array<{ question: string; options: string[] }>>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizSubmitting, setQuizSubmitting] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Learning Resources Modal
  const [showResourcesModal, setShowResourcesModal] = useState<boolean>(false);
  const [resourcesLoading, setResourcesLoading] = useState<boolean>(false);
  const [resourcesVideos, setResourcesVideos] = useState<any[]>([]);

  // Confirmation Overwrite Modals
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    careerId: string;
    careerTitle: string;
    isRegen: boolean;
  }>({ show: false, careerId: '', careerTitle: '', isRegen: false });

  // 1. Fetch user's saved careers for the "Switch Career" selector
  const fetchSavedCareers = useCallback(async () => {
    try {
      const response = await CareerService.getSavedCareers();
      setSavedCareers(response.careers);
    } catch (err) {
      console.warn('Error fetching saved careers for roadmap selector:', err);
    }
  }, []);

  const selectFirstOrCurrentMilestone = useCallback((rm: CareerRoadmap) => {
    // Find the first uncompleted milestone as "current"
    let foundCurrent: Milestone | null = null;
    for (const stage of rm.stages) {
      const uncompleted = stage.milestones.find(m => m.status === 'Upcoming' || m.status === 'In Progress');
      if (uncompleted) {
        foundCurrent = uncompleted;
        break;
      }
    }
    
    // Fallback to the first milestone if all are completed
    if (!foundCurrent && rm.stages.length > 0 && rm.stages[0].milestones.length > 0) {
      foundCurrent = rm.stages[0].milestones[0];
    }
    
    setSelectedMilestone(foundCurrent);
    // Reset quiz state
    setQuizActive(false);
    setQuizResult(null);
  }, []);

  // 2. Fetch or load a roadmap based on route location state or active settings
  const loadRoadmapData = useCallback(async (careerIdInput?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedRoadmap = await RoadmapService.getRoadmap(careerIdInput);
      
      if (fetchedRoadmap) {
        setRoadmap(fetchedRoadmap);
        setPendingCareer(null);
        selectFirstOrCurrentMilestone(fetchedRoadmap);
      } else {
        setRoadmap(null);
        setSelectedMilestone(null);
      }
    } catch (err: any) {
      console.error('Error loading career roadmap:', err);
      setError('Failed to retrieve your career roadmap.');
    } finally {
      setLoading(false);
    }
  }, [selectFirstOrCurrentMilestone]);

  // 3. AI Generation steps trigger (ONLY called on explicit user action)
  const startAiGeneration = useCallback(async (careerId: string, careerTitle: string, overwrite: boolean) => {
    setAiGenerating(true);
    setAiGenStep(1); // Reading profile
    
    const stepTimer = (step: number, ms: number) => 
      new Promise<void>((resolve) => setTimeout(() => { setAiGenStep(step); resolve(); }, ms));

    try {
      await stepTimer(2, 800); // Mapping skills
      await stepTimer(3, 1000); // Aligning stream
      
      const response = await RoadmapService.generateRoadmap(careerId, overwrite);
      
      await stepTimer(4, 800); // Finalizing checkpoints
      
      if (response.exists) {
        setConfirmModal({
          show: true,
          careerId,
          careerTitle: response.careerTitle || careerTitle,
          isRegen: false
        });
      } else if (response.roadmap) {
        setRoadmap(response.roadmap);
        setPendingCareer(null);
        selectFirstOrCurrentMilestone(response.roadmap);
      }
    } catch (err: any) {
      console.error('AI generation request failed:', err);
      setError('Generation failed. Please try again.');
    } finally {
      setAiGenerating(false);
      setLoading(false);
    }
  }, [selectFirstOrCurrentMilestone]);

  // Initial check: if roadmap exists, load it. If not, prompt to create without auto-generating.
  const handleInitialCheck = useCallback(async (careerId: string, careerTitle: string) => {
    try {
      setLoading(true);
      setError(null);
      const existing = await RoadmapService.getRoadmap(careerId);
      if (existing) {
        setRoadmap(existing);
        setPendingCareer(null);
        selectFirstOrCurrentMilestone(existing);
      } else {
        setRoadmap(null);
        setSelectedMilestone(null);
        setPendingCareer({ id: careerId, title: careerTitle });
      }
    } catch (err) {
      console.error('Error checking initial roadmap status:', err);
      setError('Could not establish roadmap status.');
    } finally {
      setLoading(false);
    }
  }, [selectFirstOrCurrentMilestone]);

  // Triggered when entering page. Checks if we came from Career Match and need to load
  useEffect(() => {
    if (authLoading) return;

    fetchSavedCareers();
    
    const stateCareer = location.state?.selectedCareer as Career | undefined;
    if (stateCareer) {
      handleInitialCheck(stateCareer.id, stateCareer.title);
      window.history.replaceState({}, document.title);
    } else {
      loadRoadmapData();
    }
  }, [authLoading, location.state, loadRoadmapData, handleInitialCheck, fetchSavedCareers]);

  // Fetch learning resources videos when modal opens
  useEffect(() => {
    let active = true;
    if (showResourcesModal && selectedMilestone) {
      const fetchResources = async () => {
        try {
          setResourcesLoading(true);
          const response = await YoutubeApiService.searchVideos({
            skill: selectedMilestone.skills[0] || selectedMilestone.title,
            maxResults: 3
          });
          if (active) {
            setResourcesVideos(response.videos || []);
          }
        } catch (err) {
          console.error('Failed to load milestone YouTube resources:', err);
          if (active) {
            setResourcesVideos([]);
          }
        } finally {
          if (active) {
            setResourcesLoading(false);
          }
        }
      };
      fetchResources();
    }
    return () => {
      active = false;
    };
  }, [showResourcesModal, selectedMilestone]);

  // 4. Milestone status actions

  // Start milestone: transition to 'In Progress'
  const handleStartMilestone = async (milestone: Milestone) => {
    if (!roadmap) return;
    try {
      const updated = await RoadmapService.startMilestone(roadmap.careerId, milestone.id);
      setRoadmap(updated);
      const updatedMilestone = updated.stages
        .flatMap(s => s.milestones)
        .find(m => m.id === milestone.id);
      if (updatedMilestone) {
        setSelectedMilestone(updatedMilestone);
      }
    } catch (err) {
      console.error('Error starting milestone:', err);
    }
  };

  // Mark Completed action: fetches and starts the assessment wizard
  // Mark Completed action: navigates to the Quizzes & Assessments page
  const handleMarkCompleted = async (milestone: Milestone) => {
    if (!roadmap) return;

    if (milestone.status === 'Upcoming') {
      try {
        const updated = await RoadmapService.startMilestone(roadmap.careerId, milestone.id);
        setRoadmap(updated);
      } catch (err) {
        console.warn('Could not auto-start milestone:', err);
      }
    }

    navigate('/exams', { 
      state: { 
        mode: 'milestone',
        selectedCareer: { 
          title: roadmap.careerTitle, 
          category: roadmap.careerId 
        },
        milestone: {
          id: milestone.id,
          title: milestone.title,
          skills: milestone.skills
        },
        autoStart: true
      } 
    });
  };

  // Select an option during the quiz
  const handleSelectQuizOption = (optionIdx: number) => {
    setUserAnswers(prev => {
      const copy = [...prev];
      copy[currentQuestionIdx] = optionIdx;
      return copy;
    });
  };

  // Submit the answers to the server for evaluation
  const handleSubmitAssessment = async () => {
    if (!roadmap || !selectedMilestone) return;
    try {
      setQuizSubmitting(true);
      const result = await ExamsApiService.submitAssessment(
        roadmap.careerId,
        selectedMilestone.id,
        userAnswers
      );

      setQuizResult({
        score: result.score,
        passed: result.passed
      });
      setRoadmap(result.roadmap);

      // Keep active milestone details updated in details card
      const updatedMilestone = result.roadmap.stages
        .flatMap(s => s.milestones)
        .find(m => m.id === selectedMilestone.id);
      if (updatedMilestone) {
        setSelectedMilestone(updatedMilestone);
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setQuizSubmitting(false);
    }
  };

  // Switch to a different saved career or load it (checks existence without auto-generation)
  const handleSelectCareerToLoad = async (career: Career) => {
    setShowSwitchMenu(false);
    try {
      setLoading(true);
      setError(null);
      const existing = await RoadmapService.getRoadmap(career.id);
      if (existing) {
        setRoadmap(existing);
        setPendingCareer(null);
        selectFirstOrCurrentMilestone(existing);
      } else {
        setRoadmap(null);
        setSelectedMilestone(null);
        setPendingCareer({ id: career.id, title: career.title });
      }
    } catch (err) {
      console.error('Failed to load roadmap selection:', err);
      setError('Failed to load selected career roadmap.');
    } finally {
      setLoading(false);
    }
  };

  // UI state-helper to get style rules
  const getMilestoneCardClass = (milestone: Milestone) => {
    const isActive = selectedMilestone?.id === milestone.id;
    let cls = styles.milestoneCard;
    if (isActive) cls += ` ${styles.milestoneCardActive}`;

    if (milestone.status === 'Completed & Verified') {
      cls += ` ${styles.milestoneCardVerified}`;
    } else if (milestone.status === 'Completed — Review Recommended') {
      cls += ` ${styles.milestoneCardReview}`;
    } else if (milestone.status === 'In Progress') {
      cls += ` ${styles.milestoneCardInProgress}`;
    } else {
      cls += ` ${styles.milestoneCardUpcoming}`;
    }
    return cls;
  };

  // Get human readable status tags
  const getMilestoneStatusBadge = (status: Milestone['status']) => {
    if (status === 'Completed & Verified') {
      return <span style={{ color: '#10b981', fontWeight: 700 }}><CheckCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />Verified</span>;
    }
    if (status === 'Completed — Review Recommended') {
      return <span style={{ color: '#f59e0b', fontWeight: 700 }}><AlertCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />Needs Review</span>;
    }
    if (status === 'In Progress') {
      return <span style={{ color: '#a78bfa', fontWeight: 700 }}><Play size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', fill: 'currentColor' }} />In Progress</span>;
    }
    return <span style={{ color: 'var(--text-muted)' }}>Upcoming</span>;
  };

  // Generate dynamic "Why this matters" section based on profile & milestone details
  const getWhyMattersText = (milestone: Milestone) => {
    const hasGap = milestone.tasks.some(t => t.includes('[Bridge Gap]'));
    const hasStrength = milestone.tasks.some(t => t.includes('[Existing Strength]'));
    
    if (hasGap) {
      return `This milestone is high-priority for you because it targets skills identified as gaps in your Career Match. Bridging these specific gaps is crucial to achieving your dream role.`;
    }
    if (hasStrength) {
      return `This milestone directly utilizes your existing verified strengths. Applying your pre-existing skills here will help you complete these practical checkpoints and tasks much faster.`;
    }
    return `This checkpoint builds core foundational knowledge in ${milestone.skills[0] || 'your chosen sector'} required to ensure placement readiness.`;
  };

  // Counts flat milestones and uncompleted stage names
  const getFlatMilestones = () => roadmap ? roadmap.stages.flatMap(s => s.milestones) : [];
  const getCompletedCount = () => getFlatMilestones().filter(m => m.status.startsWith('Completed')).length;
  
  // Find current milestone title
  const getCurrentMilestoneTitle = () => {
    const current = getFlatMilestones().find(m => m.status === 'In Progress' || m.status === 'Upcoming');
    return current ? current.title : 'All completed!';
  };

  // Phase 31: 7 Conceptual Stages Structure
  const CONCEPTUAL_STAGES = [
    { id: 1, title: 'Current Stage', short: '1. Current Stage', icon: Target },
    { id: 2, title: 'Next 6–12 Months', short: '2. Next 6–12 Mo', icon: Calendar },
    { id: 3, title: 'Skills', short: '3. Skills', icon: Sparkles },
    { id: 4, title: 'Courses', short: '4. Courses', icon: GraduationCap },
    { id: 5, title: 'Projects', short: '5. Projects', icon: FolderGit2 },
    { id: 6, title: 'Assessments', short: '6. Assessments', icon: FileCheck },
    { id: 7, title: 'Next Career Stage', short: '7. Next Stage', icon: Rocket }
  ];

  const getActiveMilestone = (): Milestone | null => {
    if (selectedMilestone) return selectedMilestone;
    const flat = getFlatMilestones();
    return flat.find(m => m.status === 'In Progress') || 
           flat.find(m => m.status === 'Upcoming') || 
           flat[0] || null;
  };

  const getActiveStage = () => {
    const activeM = getActiveMilestone();
    if (!activeM || !roadmap) return null;
    return roadmap.stages.find(s => s.milestones.some(m => m.id === activeM.id)) || roadmap.stages[0] || null;
  };

  const getUpcomingMilestones = () => {
    const flat = getFlatMilestones();
    const activeM = getActiveMilestone();
    const activeIdx = flat.findIndex(m => m.id === activeM?.id);
    return flat.filter((m, idx) => idx > activeIdx && (m.status === 'Upcoming' || m.status === 'In Progress'));
  };

  const getSkillsOverview = () => {
    if (!roadmap) return { verified: [] as string[], inProgress: [] as string[], upcoming: [] as string[], all: [] as string[] };
    const verifiedSet = new Set<string>();
    const inProgressSet = new Set<string>();
    const upcomingSet = new Set<string>();

    roadmap.stages.forEach(stage => {
      stage.milestones.forEach(m => {
        if (m.status.startsWith('Completed')) {
          m.skills.forEach(s => verifiedSet.add(s));
        } else if (m.status === 'In Progress') {
          m.skills.forEach(s => inProgressSet.add(s));
        } else {
          m.skills.forEach(s => upcomingSet.add(s));
        }
      });
    });

    inProgressSet.forEach(s => {
      if (verifiedSet.has(s)) inProgressSet.delete(s);
    });
    upcomingSet.forEach(s => {
      if (verifiedSet.has(s) || inProgressSet.has(s)) upcomingSet.delete(s);
    });

    return {
      verified: Array.from(verifiedSet),
      inProgress: Array.from(inProgressSet),
      upcoming: Array.from(upcomingSet),
      all: Array.from(new Set([...verifiedSet, ...inProgressSet, ...upcomingSet]))
    };
  };

  const getProjectsOverview = () => {
    if (!roadmap) return [];
    const projects: Array<{
      id: string;
      title: string;
      milestoneTitle: string;
      milestoneId: string;
      status: Milestone['status'];
      skills: string[];
      isActivity: boolean;
    }> = [];

    roadmap.stages.forEach(stage => {
      stage.milestones.forEach((m, mIdx) => {
        if (m.activities && m.activities.length > 0) {
          m.activities.forEach((act, aIdx) => {
            projects.push({
              id: `act-${m.id}-${aIdx}`,
              title: act,
              milestoneTitle: m.title,
              milestoneId: m.id,
              status: m.status,
              skills: m.skills,
              isActivity: true
            });
          });
        } else if (m.tasks && m.tasks.length > 0) {
          const practicalTask = m.tasks.find(t => 
            t.toLowerCase().includes('build') || 
            t.toLowerCase().includes('create') || 
            t.toLowerCase().includes('implement') || 
            t.toLowerCase().includes('develop') || 
            t.toLowerCase().includes('project')
          );
          if (practicalTask) {
            projects.push({
              id: `task-${m.id}-${mIdx}`,
              title: practicalTask.replace('[Bridge Gap]', '').replace('[Existing Strength]', '').trim(),
              milestoneTitle: m.title,
              milestoneId: m.id,
              status: m.status,
              skills: m.skills,
              isActivity: false
            });
          }
        }
      });
    });
    return projects;
  };

  const getAssessmentsOverview = () => {
    if (!roadmap) return { passed: [] as Milestone[], needsReview: [] as Milestone[], ready: [] as Milestone[], upcoming: [] as Milestone[], total: 0 };
    const flat = getFlatMilestones();
    return {
      passed: flat.filter(m => m.status === 'Completed & Verified'),
      needsReview: flat.filter(m => m.status === 'Completed — Review Recommended'),
      ready: flat.filter(m => m.status === 'In Progress'),
      upcoming: flat.filter(m => m.status === 'Upcoming'),
      total: flat.length
    };
  };

  const getConceptualStageStatus = (stageNum: number): 'completed' | 'current' | 'upcoming' => {
    const flat = getFlatMilestones();
    const allDone = flat.length > 0 && flat.every(m => m.status.startsWith('Completed'));
    
    switch (stageNum) {
      case 1:
        return allDone ? 'completed' : 'current';
      case 2:
        return allDone ? 'completed' : 'upcoming';
      case 3:
        return allDone ? 'completed' : 'current';
      case 4:
        return 'current';
      case 5:
        return allDone ? 'completed' : 'current';
      case 6:
        return allDone ? 'completed' : 'current';
      case 7:
        return 'upcoming';
      default:
        return 'upcoming';
    }
  };

  // Prevent TS6133 unused compiler warnings for navigation refactoring
  useEffect(() => {
    const dummyRef = () => {
      console.log(
        quizActive, quizQuestions, currentQuestionIdx, userAnswers, quizSubmitting, quizResult, quizLoading, quizError,
        setQuizActive, setQuizQuestions, setCurrentQuestionIdx, setUserAnswers, setQuizSubmitting, setQuizResult, setQuizLoading, setQuizError,
        handleSelectQuizOption, handleSubmitAssessment
      );
    };
    if (window.location.hash === '#dummy') dummyRef();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    quizActive, quizQuestions, currentQuestionIdx, userAnswers, quizSubmitting, quizResult, quizLoading, quizError,
    setQuizActive, setQuizQuestions, setCurrentQuestionIdx, setUserAnswers, setQuizSubmitting, setQuizResult, setQuizLoading, setQuizError
  ]);

  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div className="glow-accent" style={{ top: '10%', left: '10%', opacity: 0.15 }} />
      <div className="glow-accent-secondary" style={{ bottom: '15%', right: '10%', opacity: 0.15 }} />

      <div className={styles.container}>
        
        {/* Loading and Error States */}
        {(authLoading || (loading && !aiGenerating)) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
            <RefreshCw className={styles.loadingSpinner} size={32} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading roadmap...</p>
          </div>
        )}

        {!authLoading && error && (
          <div className={styles.emptyState}>
            <AlertCircle size={48} style={{ color: '#ef4444' }} />
            <h2 className={styles.emptyTitle}>Error</h2>
            <p className={styles.emptyText}>{error}</p>
            <button className={`${styles.button} ${styles.primaryButton}`} onClick={() => loadRoadmapData()}>
              Try Again
            </button>
          </div>
        )}

        {/* AI Generating Loader Screen */}
        <AnimatePresence>
          {aiGenerating && (
            <motion.div 
              className={styles.loadingOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <RefreshCw className={styles.loadingSpinner} size={48} />
              </div>
              <h2 className={styles.loadingHeading}>Visionix AI Workspace</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Generating your custom, non-linear career developmental pathway...</p>
              
              <div className={styles.loadingSteps}>
                <div className={`${styles.stepRow} ${aiGenStep >= 1 ? styles.stepActive : ''} ${aiGenStep > 1 ? styles.stepCompleted : ''}`}>
                  {aiGenStep > 1 ? <Check size={16} /> : <Circle size={8} fill={aiGenStep === 1 ? 'currentColor' : 'none'} />}
                  <span>Analyzing education stream...</span>
                </div>
                <div className={`${styles.stepRow} ${aiGenStep >= 2 ? styles.stepActive : ''} ${aiGenStep > 2 ? styles.stepCompleted : ''}`}>
                  {aiGenStep > 2 ? <Check size={16} /> : <Circle size={8} fill={aiGenStep === 2 ? 'currentColor' : 'none'} />}
                  <span>Aligning interests & specialized fields...</span>
                </div>
                <div className={`${styles.stepRow} ${aiGenStep >= 3 ? styles.stepActive : ''} ${aiGenStep > 3 ? styles.stepCompleted : ''}`}>
                  {aiGenStep > 3 ? <Check size={16} /> : <Circle size={8} fill={aiGenStep === 3 ? 'currentColor' : 'none'} />}
                  <span>Incorporating Phase 9 match gaps...</span>
                </div>
                <div className={`${styles.stepRow} ${aiGenStep >= 4 ? styles.stepActive : ''}`}>
                  <Circle size={8} fill={aiGenStep === 4 ? 'currentColor' : 'none'} />
                  <span>Structuring milestone checklists...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty / Create State */}
        {!authLoading && !loading && !roadmap && !error && (
          <div className={styles.emptyState}>
            <GitFork size={48} style={{ color: 'var(--color-primary)' }} />
            <h2 className={styles.emptyTitle}>
              {pendingCareer ? `Create Roadmap for ${pendingCareer.title}` : 'Create Your Career Roadmap'}
            </h2>
            <p className={styles.emptyText}>
              {pendingCareer 
                ? `No roadmap exists for "${pendingCareer.title}" yet. Click below to generate your personalized, stage-by-stage learning pathway and milestone quizzes.`
                : 'Track your skill development and test your knowledge. Select a saved career to start generating your personalized educational pathway.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {pendingCareer ? (
                <button
                  className={`${styles.button} ${styles.primaryButton}`}
                  style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', border: 'none' }}
                  onClick={() => startAiGeneration(pendingCareer.id, pendingCareer.title, false)}
                >
                  <Rocket size={16} style={{ marginRight: '6px' }} />
                  <span>Create Roadmap</span>
                </button>
              ) : (
                <button className={`${styles.button} ${styles.primaryButton}`} onClick={() => navigate('/explore')}>
                  Explore Careers
                </button>
              )}
              {savedCareers.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <button className={`${styles.button} ${styles.secondaryButton}`} onClick={() => setShowSwitchMenu(!showSwitchMenu)}>
                    Select Saved Career
                  </button>
                  {showSwitchMenu && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '8px',
                      background: '#0f111a',
                      border: '1px solid var(--border-card)',
                      borderRadius: '8px',
                      width: '240px',
                      zIndex: 10,
                      boxShadow: 'var(--shadow-lg)'
                    }}>
                      {savedCareers.map(c => (
                        <div 
                          key={c.id} 
                          style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.88rem', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)' }}
                          onClick={() => handleSelectCareerToLoad(c)}
                        >
                          {c.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Roadmap UI */}
        {!authLoading && !loading && roadmap && (
          <>
            {/* Top Header Row */}
            <div className={styles.header}>
              <div className={styles.titleSection}>
                <h1 className="text-heading">Career Roadmap</h1>
                <span className={styles.subtitle}>Your personalized path to becoming a {roadmap.careerTitle}</span>
              </div>
              
              <div className={styles.actions}>
                {/* Switch Career dropdown */}
                <div style={{ position: 'relative' }}>
                  <button className={`${styles.button} ${styles.secondaryButton}`} onClick={() => setShowSwitchMenu(!showSwitchMenu)}>
                    <span>Switch Path</span>
                    <ChevronRight size={16} style={{ transform: showSwitchMenu ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', marginLeft: '4px' }} />
                  </button>
                  
                  {showSwitchMenu && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      background: '#0f111a',
                      border: '1px solid var(--border-card)',
                      borderRadius: '8px',
                      width: '220px',
                      zIndex: 50,
                      boxShadow: 'var(--shadow-lg)'
                    }}>
                      <div style={{ padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Saved Careers</div>
                      {savedCareers.map(c => (
                        <div 
                          key={c.id} 
                          style={{
                            padding: '10px 12px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                            background: c.title === roadmap.careerTitle ? 'rgba(88, 80, 236, 0.1)' : 'transparent',
                            color: c.title === roadmap.careerTitle ? 'var(--color-primary)' : 'var(--text-primary)'
                          }}
                          onClick={() => handleSelectCareerToLoad(c)}
                        >
                          {c.title}
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', padding: '6px' }}>
                        <button 
                          style={{ width: '100%', padding: '6px', fontSize: '0.75rem', border: 'none', background: 'none', color: '#a78bfa', cursor: 'pointer', textAlign: 'left' }}
                          onClick={() => { setShowSwitchMenu(false); navigate('/explore'); }}
                        >
                          Explore All Careers
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  className={`${styles.button} ${styles.secondaryButton}`}
                  onClick={() => setConfirmModal({ show: true, careerId: roadmap.careerId, careerTitle: roadmap.careerTitle, isRegen: true })}
                >
                  <RefreshCw size={14} />
                  <span>Regenerate Path</span>
                </button>
              </div>
            </div>

            {/* Phase 31: Career Journey Orientation Hero */}
            {(() => {
              const activeM = getActiveMilestone();
              const activeS = getActiveStage();
              const upcomingM = getUpcomingMilestones();

              return (
                <div className={styles.journeyHero}>
                  <div className={styles.journeyHeroHeader}>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', marginBottom: '4px' }}>
                        <Compass size={14} />
                        <span>Your Career Journey</span>
                      </div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)' }}>
                        Path to {roadmap.careerTitle}
                      </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Overall Progress</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-display)' }}>
                          {roadmap.progress}%
                        </div>
                      </div>
                      <div style={{ width: '130px' }}>
                        <div className={styles.progressOuter} style={{ margin: 0, height: '8px' }}>
                          <div className={styles.progressInner} style={{ width: `${roadmap.progress}%` }} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '4px' }}>
                          {getCompletedCount()}/{getFlatMilestones().length} Verified
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Core Orientation Questions: Where Am I? What Comes Next? Where Am I Going? */}
                  <div className={styles.journeyOrientationGrid}>
                    <div className={`${styles.orientationCard} ${styles.orientationCardCurrent}`}>
                      <div className={styles.orientationLabel}>
                        <Target size={14} style={{ color: '#6366f1' }} />
                        <span>Where Am I?</span>
                      </div>
                      <div className={styles.orientationVal}>
                        {activeS?.title || 'Core Foundation'}
                      </div>
                      <div className={styles.orientationSub}>
                        Active: {activeM ? activeM.title : getCurrentMilestoneTitle()}
                      </div>
                    </div>

                    <div className={styles.orientationCard}>
                      <div className={styles.orientationLabel}>
                        <Calendar size={14} style={{ color: '#a78bfa' }} />
                        <span>What Comes Next?</span>
                      </div>
                      <div className={styles.orientationVal}>
                        {upcomingM[0]?.title || (roadmap.stages[1]?.title || 'Next Checkpoint')}
                      </div>
                      <div className={styles.orientationSub}>
                        {upcomingM.length > 1 ? `Plus ${upcomingM.length - 1} more upcoming checkpoint${upcomingM.length - 1 > 1 ? 's' : ''}` : 'Next 6–12 months horizon'}
                      </div>
                    </div>

                    <div className={styles.orientationCard}>
                      <div className={styles.orientationLabel}>
                        <Rocket size={14} style={{ color: '#10b981' }} />
                        <span>Where Am I Going?</span>
                      </div>
                      <div className={styles.orientationVal}>
                        {roadmap.careerTitle}
                      </div>
                      <div className={styles.orientationSub}>
                        Target Career Destination & Placement Readiness
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Phase 31: 7-Stage Progression Ribbon & View Mode Toolbar */}
            <div className={styles.progressionNav}>
              <div className={styles.progressionToolbar}>
                <div className={styles.progressionLabel}>
                  <TrendingUp size={16} style={{ color: 'var(--color-primary)' }} />
                  <span>Visual Career Progression Track</span>
                </div>

                <div className={styles.viewModeToggle}>
                  <button 
                    className={`${styles.viewModeBtn} ${viewMode === 'progression' ? styles.viewModeBtnActive : ''}`}
                    onClick={() => setViewMode('progression')}
                  >
                    <Layers size={14} />
                    <span>Visual Progression</span>
                  </button>
                  <button 
                    className={`${styles.viewModeBtn} ${viewMode === 'milestones' ? styles.viewModeBtnActive : ''}`}
                    onClick={() => setViewMode('milestones')}
                  >
                    <ListTodo size={14} />
                    <span>Milestones Explorer</span>
                  </button>
                </div>
              </div>

              {/* Responsive 7-Stage Ribbon Stepper */}
              <div className={styles.progressionStepper}>
                <button 
                  className={`${styles.stagePill} ${activeFilterStage === 'all' ? styles.stagePillSelected : ''}`}
                  onClick={() => {
                    setViewMode('progression');
                    setActiveFilterStage('all');
                  }}
                >
                  <Layers size={13} />
                  <span>All 7 Stages</span>
                </button>

                {CONCEPTUAL_STAGES.map((stage, idx) => {
                  const IconComp = stage.icon;
                  const status = getConceptualStageStatus(stage.id);
                  const isSelected = activeFilterStage === stage.id;
                  
                  let pillClass = styles.stagePill;
                  if (isSelected) pillClass += ` ${styles.stagePillSelected}`;
                  if (status === 'completed') pillClass += ` ${styles.stagePillCompleted}`;
                  else if (status === 'current') pillClass += ` ${styles.stagePillCurrent}`;
                  else pillClass += ` ${styles.stagePillUpcoming}`;

                  return (
                    <React.Fragment key={stage.id}>
                      <button 
                        className={pillClass}
                        onClick={() => {
                          setViewMode('progression');
                          setActiveFilterStage(stage.id);
                        }}
                      >
                        <span className={styles.stagePillNum}>{stage.id}</span>
                        <IconComp size={13} />
                        <span>{stage.title}</span>
                      </button>
                      {idx < CONCEPTUAL_STAGES.length - 1 && (
                        <ChevronRight size={13} className={styles.progressionArrow} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* VIEW MODE A: VISUAL PROGRESSION (7 STAGES) */}
            {viewMode === 'progression' && (
              <div className={styles.progressionFlowContainer}>
                {(() => {
                  const activeMilestone = getActiveMilestone();
                  const activeStage = getActiveStage();
                  const upcomingMilestones = getUpcomingMilestones();
                  const skillsOverview = getSkillsOverview();
                  const projects = getProjectsOverview();
                  const assessments = getAssessmentsOverview();

                  const renderStage1 = () => (
                    <div className={`${styles.stageSectionCard} ${styles.stageSectionCardCurrent}`} id="stage-1">
                      <div className={styles.stageSectionHeader}>
                        <div className={styles.stageHeaderLeft}>
                          <span className={`${styles.stageStepBadge} ${styles.stageStepBadgeCurrent}`}>
                            Stage 1 of 7
                          </span>
                          <h2 className={styles.stageSectionTitle}>
                            <Target size={20} style={{ color: 'var(--color-primary)' }} />
                            <span>Current Stage: {activeStage?.title || 'Core Foundation'}</span>
                          </h2>
                        </div>
                        <span className={`${styles.stageStatusBadge} ${styles.statusCurrent}`}>
                          <Play size={10} fill="currentColor" />
                          <span>CURRENT / IN PROGRESS</span>
                        </span>
                      </div>

                      <p className={styles.stageNarrative}>
                        Where you are right now. Focus on mastering this active checkpoint to build foundational competency.
                      </p>

                      {activeMilestone ? (
                        <div className={styles.currentCheckpointBox}>
                          <div className={styles.currentCheckpointHeader}>
                            <div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '2px' }}>
                                Active Checkpoint
                              </div>
                              <h3 className={styles.currentCheckpointTitle}>{activeMilestone.title}</h3>
                            </div>
                            {getMilestoneStatusBadge(activeMilestone.status)}
                          </div>

                          <p className={styles.currentCheckpointDesc}>{activeMilestone.description}</p>

                          <div className={styles.whyMattersBox} style={{ marginBottom: '14px' }}>
                            <Info size={16} style={{ color: '#a78bfa', flexShrink: 0, marginTop: '2px' }} />
                            <div className={styles.whyMattersText}>
                              <strong>Why this matters:</strong> {getWhyMattersText(activeMilestone)}
                            </div>
                          </div>

                          {activeMilestone.tasks && activeMilestone.tasks.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                                Practical Tasks & Focus Areas
                              </span>
                              <div className={styles.tasksList}>
                                {activeMilestone.tasks.map((t, idx) => {
                                  const isStrength = t.startsWith('[Existing Strength]');
                                  const isGap = t.startsWith('[Bridge Gap]');
                                  const cleanText = t.replace('[Existing Strength]', '').replace('[Bridge Gap]', '').trim();

                                  return (
                                    <div key={idx} className={styles.taskItem}>
                                      <div 
                                        className={styles.taskDot} 
                                        style={{ background: isStrength ? '#10b981' : isGap ? '#ef4444' : 'var(--color-primary)' }} 
                                      />
                                      <div>
                                        <span>{cleanText}</span>
                                        {isStrength && (
                                          <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 600, marginLeft: '6px' }}>
                                            Existing Strength
                                          </span>
                                        )}
                                        {isGap && (
                                          <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)', fontWeight: 600, marginLeft: '6px' }}>
                                            Prioritized Gap
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons for active milestone */}
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            {activeMilestone.status === 'Upcoming' && (
                              <button 
                                className={`${styles.button} ${styles.primaryButton}`}
                                onClick={() => handleStartMilestone(activeMilestone)}
                                style={{ padding: '7px 16px', fontSize: '0.82rem' }}
                              >
                                <Play size={12} fill="currentColor" style={{ marginRight: '4px' }} />
                                Start Milestone
                              </button>
                            )}

                            {activeMilestone.status === 'In Progress' && (
                              <button 
                                className={`${styles.button} ${styles.primaryButton}`}
                                onClick={() => handleMarkCompleted(activeMilestone)}
                                style={{ padding: '7px 16px', fontSize: '0.82rem', background: '#10b981', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
                              >
                                <Check size={13} strokeWidth={3} style={{ marginRight: '4px' }} />
                                Complete Milestone → Take Assessment
                              </button>
                            )}

                            {activeMilestone.status === 'Completed — Review Recommended' && (
                              <button 
                                className={`${styles.button} ${styles.primaryButton}`}
                                onClick={() => handleMarkCompleted(activeMilestone)}
                                style={{ padding: '7px 16px', fontSize: '0.82rem', background: '#f59e0b', color: '#000', border: 'none' }}
                              >
                                <RefreshCw size={12} style={{ marginRight: '4px' }} />
                                Retake Assessment
                              </button>
                            )}

                            <button 
                              className={`${styles.button} ${styles.secondaryButton}`}
                              onClick={() => {
                                navigate('/youtube', {
                                  state: {
                                    selectedCareer: { 
                                      title: roadmap.careerTitle, 
                                      category: roadmap.careerId 
                                    },
                                    milestone: {
                                      id: activeMilestone.id,
                                      title: activeMilestone.title,
                                      skills: activeMilestone.skills
                                    }
                                  }
                                });
                              }}
                              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                            >
                              <Video size={13} style={{ marginRight: '4px' }} />
                              Learn from YouTube
                            </button>

                            <button 
                              className={`${styles.button} ${styles.secondaryButton}`}
                              onClick={() => {
                                setSelectedMilestone(activeMilestone);
                                setShowResourcesModal(true);
                              }}
                              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                            >
                              <BookOpen size={13} style={{ marginRight: '4px' }} />
                              View Resources
                            </button>

                            <button 
                              className={`${styles.button} ${styles.secondaryButton}`}
                              onClick={() => openAiModal()}
                              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                            >
                              <Sparkles size={13} style={{ marginRight: '4px' }} />
                              Ask AI
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.compactEmptyState}>
                          <p className={styles.compactEmptyText}>All milestone checkpoints in this roadmap are completed.</p>
                        </div>
                      )}
                    </div>
                  );

                  const renderStage2 = () => (
                    <div className={styles.stageSectionCard} id="stage-2">
                      <div className={styles.stageSectionHeader}>
                        <div className={styles.stageHeaderLeft}>
                          <span className={`${styles.stageStepBadge} ${styles.stageStepBadgeUpcoming}`}>
                            Stage 2 of 7
                          </span>
                          <h2 className={styles.stageSectionTitle}>
                            <Calendar size={20} style={{ color: '#818cf8' }} />
                            <span>Next 6–12 Months: Forward Milestone Horizon</span>
                          </h2>
                        </div>
                        <span className={`${styles.stageStatusBadge} ${styles.statusUpcoming}`}>
                          <Clock size={10} />
                          <span>UPCOMING</span>
                        </span>
                      </div>

                      <p className={styles.stageNarrative}>
                        What comes next. Sequenced trajectory of subsequent checkpoints to guide your developmental growth over the coming year.
                      </p>

                      {upcomingMilestones.length > 0 ? (
                        <div className={styles.upcomingTimelineGrid}>
                          {upcomingMilestones.slice(0, 4).map((m, idx) => {
                            const horizonLabel = idx === 0 
                              ? 'Next Checkpoint (Months 1–3)' 
                              : idx === 1 
                              ? 'Mid-Term Horizon (Months 3–6)' 
                              : idx === 2 
                              ? 'Advanced Horizon (Months 6–12)' 
                              : 'Extended Horizon';

                            return (
                              <div key={m.id} className={styles.upcomingCard}>
                                <div>
                                  <div className={styles.upcomingCardHeader}>
                                    <span className={styles.horizonBadge}>{horizonLabel}</span>
                                    {getMilestoneStatusBadge(m.status)}
                                  </div>
                                  <h4 className={styles.upcomingMilestoneTitle}>{m.title}</h4>
                                  <p className={styles.upcomingMilestoneDesc}>{m.description}</p>
                                </div>

                                <div>
                                  {m.skills && m.skills.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                                      {m.skills.slice(0, 3).map(s => (
                                        <span key={s} style={{ fontSize: '0.72rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-secondary)' }}>
                                          {s}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {m.dependencies && m.dependencies.length > 0 && (
                                    <div style={{ fontSize: '0.74rem', color: '#a5b4fc', marginBottom: '8px' }}>
                                      Prerequisites: {m.dependencies.join(', ')}
                                    </div>
                                  )}

                                  <button
                                    className={`${styles.button} ${styles.secondaryButton}`}
                                    onClick={() => {
                                      setSelectedMilestone(m);
                                      setViewMode('milestones');
                                    }}
                                    style={{ width: '100%', justifyContent: 'center', padding: '6px 10px', fontSize: '0.76rem' }}
                                  >
                                    <span>Inspect Details</span>
                                    <ArrowRight size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={styles.compactEmptyState}>
                          <CheckCircle size={24} style={{ color: '#10b981' }} />
                          <p className={styles.compactEmptyText}>
                            All planned checkpoints in this roadmap are completed! Proceed to Career Readiness or explore Next Career Stage.
                          </p>
                        </div>
                      )}
                    </div>
                  );

                  const renderStage3 = () => (
                    <div className={styles.stageSectionCard} id="stage-3">
                      <div className={styles.stageSectionHeader}>
                        <div className={styles.stageHeaderLeft}>
                          <span className={`${styles.stageStepBadge} ${styles.stageStepBadgeCurrent}`}>
                            Stage 3 of 7
                          </span>
                          <h2 className={styles.stageSectionTitle}>
                            <Sparkles size={20} style={{ color: '#f59e0b' }} />
                            <span>Skills: Target Competencies & Mastery</span>
                          </h2>
                        </div>
                        <span className={`${styles.stageStatusBadge} ${skillsOverview.verified.length === skillsOverview.all.length && skillsOverview.all.length > 0 ? styles.statusCompleted : styles.statusCurrent}`}>
                          <span>{skillsOverview.verified.length} of {skillsOverview.all.length} VERIFIED</span>
                        </span>
                      </div>

                      <p className={styles.stageNarrative}>
                        Every skill connected to your roadmap milestones, categorized by verification status.
                      </p>

                      <div className={styles.skillsClustersGrid}>
                        {/* 1. Verified Skills */}
                        <div className={styles.skillBucketCard}>
                          <div className={styles.skillBucketHeader}>
                            <span className={styles.skillBucketTitle}>
                              <CheckCircle size={15} style={{ color: '#10b981' }} />
                              <span>Verified & Mastered ({skillsOverview.verified.length})</span>
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>COMPLETED</span>
                          </div>
                          {skillsOverview.verified.length > 0 ? (
                            <div className={styles.skillPillGroup}>
                              {skillsOverview.verified.map(s => (
                                <span key={s} className={`${styles.skillItemPill} ${styles.skillItemVerified}`}>
                                  <Check size={11} strokeWidth={3} />
                                  <span>{s}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className={styles.compactEmptyState}>
                              <p className={styles.compactEmptyText}>No verified skills yet. Pass milestone assessments to verify skills.</p>
                            </div>
                          )}
                        </div>

                        {/* 2. In-Progress Skills */}
                        <div className={styles.skillBucketCard}>
                          <div className={styles.skillBucketHeader}>
                            <span className={styles.skillBucketTitle}>
                              <Play size={14} style={{ color: '#a78bfa' }} />
                              <span>In Progress ({skillsOverview.inProgress.length})</span>
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#a78bfa', fontWeight: 700 }}>ACTIVE</span>
                          </div>
                          {skillsOverview.inProgress.length > 0 ? (
                            <div className={styles.skillPillGroup}>
                              {skillsOverview.inProgress.map(s => (
                                <span key={s} className={`${styles.skillItemPill} ${styles.skillItemCurrent}`}>
                                  <Circle size={6} fill="currentColor" />
                                  <span>{s}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className={styles.compactEmptyState}>
                              <p className={styles.compactEmptyText}>Start an active milestone to begin working on in-progress skills.</p>
                            </div>
                          )}
                        </div>

                        {/* 3. Upcoming Skills */}
                        <div className={styles.skillBucketCard}>
                          <div className={styles.skillBucketHeader}>
                            <span className={styles.skillBucketTitle}>
                              <Target size={14} style={{ color: 'var(--text-muted)' }} />
                              <span>Upcoming Targets ({skillsOverview.upcoming.length})</span>
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>UPCOMING</span>
                          </div>
                          {skillsOverview.upcoming.length > 0 ? (
                            <div className={styles.skillPillGroup}>
                              {skillsOverview.upcoming.map(s => (
                                <span key={s} className={`${styles.skillItemPill} ${styles.skillItemUpcoming}`}>
                                  <span>{s}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className={styles.compactEmptyState}>
                              <p className={styles.compactEmptyText}>All target skills in this roadmap have already been initiated.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                        <button
                          className={`${styles.button} ${styles.secondaryButton}`}
                          onClick={() => navigate('/skill-gap')}
                          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                        >
                          <span>Compare in Skill Gap Analysis</span>
                          <ArrowRight size={13} />
                        </button>
                        <button
                          className={`${styles.button} ${styles.secondaryButton}`}
                          onClick={() => navigate('/exams')}
                          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                        >
                          <span>Validate Skills with Quizzes</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  );

                  const renderStage4 = () => (
                    <div className={styles.stageSectionCard} id="stage-4">
                      <div className={styles.stageSectionHeader}>
                        <div className={styles.stageHeaderLeft}>
                          <span className={`${styles.stageStepBadge} ${styles.stageStepBadgeCurrent}`}>
                            Stage 4 of 7
                          </span>
                          <h2 className={styles.stageSectionTitle}>
                            <GraduationCap size={20} style={{ color: '#06b6d4' }} />
                            <span>Courses: Connected Learning & Tutorials</span>
                          </h2>
                        </div>
                        <span className={`${styles.stageStatusBadge} ${styles.statusCurrent}`}>
                          <span>ACTIVE LEARNING</span>
                        </span>
                      </div>

                      <p className={styles.stageNarrative}>
                        Curated coursework, structured learning paths, and video tutorials connected directly to your active roadmap checkpoints.
                      </p>

                      <div className={styles.coursesGrid}>
                        <div className={styles.courseCard}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <Video size={18} style={{ color: '#ef4444' }} />
                              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                                Video Tutorials for Active Checkpoint
                              </h4>
                            </div>
                            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '10px' }}>
                              {activeMilestone 
                                ? `Personalized YouTube video lessons aligned to "${activeMilestone.title}" and skills: ${activeMilestone.skills.slice(0, 3).join(', ')}.`
                                : `Targeted video lessons for ${roadmap.careerTitle}.`
                              }
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              className={`${styles.button} ${styles.primaryButton}`}
                              onClick={() => {
                                if (activeMilestone) {
                                  setSelectedMilestone(activeMilestone);
                                  setShowResourcesModal(true);
                                }
                              }}
                              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            >
                              <BookOpen size={13} />
                              <span>View Video Tutorials</span>
                            </button>
                            <button
                              className={`${styles.button} ${styles.secondaryButton}`}
                              onClick={() => {
                                if (activeMilestone) {
                                  navigate('/youtube', {
                                    state: {
                                      selectedCareer: { 
                                        title: roadmap.careerTitle, 
                                        category: roadmap.careerId 
                                      },
                                      milestone: {
                                        id: activeMilestone.id,
                                        title: activeMilestone.title,
                                        skills: activeMilestone.skills
                                      }
                                    }
                                  });
                                }
                              }}
                              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            >
                              <Video size={13} />
                              <span>Interactive Video Hub</span>
                            </button>
                          </div>
                        </div>

                        <div className={styles.courseCard}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <GraduationCap size={18} style={{ color: 'var(--color-primary)' }} />
                              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                                Structured Courses in Learning Hub
                              </h4>
                            </div>
                            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '10px' }}>
                              Explore full courses and verified certifications curated for {roadmap.careerTitle}. Track lessons, progress, and certificates.
                            </p>
                          </div>

                          <div>
                            <button
                              className={`${styles.button} ${styles.secondaryButton}`}
                              onClick={() => navigate('/courses')}
                              style={{ width: '100%', justifyContent: 'center', padding: '6px 14px', fontSize: '0.8rem' }}
                            >
                              <span>Explore Course Recommendations</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                  const renderStage5 = () => (
                    <div className={styles.stageSectionCard} id="stage-5">
                      <div className={styles.stageSectionHeader}>
                        <div className={styles.stageHeaderLeft}>
                          <span className={`${styles.stageStepBadge} ${projects.some(p => p.status.startsWith('Completed')) ? styles.stageStepBadgeCompleted : styles.stageStepBadgeCurrent}`}>
                            Stage 5 of 7
                          </span>
                          <h2 className={styles.stageSectionTitle}>
                            <FolderGit2 size={20} style={{ color: '#10b981' }} />
                            <span>Projects: Applied Scenarios & Hands-On Activities</span>
                          </h2>
                        </div>
                        <span className={`${styles.stageStatusBadge} ${projects.length > 0 ? styles.statusCurrent : styles.statusUpcoming}`}>
                          <span>{projects.length} PRACTICAL ACTIVITIES</span>
                        </span>
                      </div>

                      <p className={styles.stageNarrative}>
                        Hands-on projects and implementation activities embedded within your checkpoints to validate practical expertise.
                      </p>

                      {projects.length > 0 ? (
                        <div className={styles.projectsGrid}>
                          {projects.map((p) => {
                            const isDone = p.status.startsWith('Completed');
                            const isCurrent = p.status === 'In Progress';

                            return (
                              <div key={p.id} className={styles.projectCard}>
                                <div>
                                  <div className={styles.projectCardHeader}>
                                    <span className={styles.projectMilestoneTag}>{p.milestoneTitle}</span>
                                    {isDone ? (
                                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontWeight: 700 }}>
                                        COMPLETED
                                      </span>
                                    ) : isCurrent ? (
                                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', fontWeight: 700 }}>
                                        IN PROGRESS
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', fontWeight: 600 }}>
                                        UPCOMING
                                      </span>
                                    )}
                                  </div>
                                  <h4 className={styles.projectTitle}>{p.title}</h4>
                                </div>

                                <div>
                                  {p.skills && p.skills.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                                      {p.skills.slice(0, 3).map(s => (
                                        <span key={s} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-secondary)' }}>
                                          {s}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={styles.compactEmptyState}>
                          <FolderGit2 size={24} style={{ color: 'var(--text-muted)' }} />
                          <p className={styles.compactEmptyText}>
                            Hands-on exercises and practical application activities are embedded directly within the milestone checkpoint tasks above.
                          </p>
                        </div>
                      )}
                    </div>
                  );

                  const renderStage6 = () => (
                    <div className={styles.stageSectionCard} id="stage-6">
                      <div className={styles.stageSectionHeader}>
                        <div className={styles.stageHeaderLeft}>
                          <span className={`${styles.stageStepBadge} ${assessments.passed.length > 0 ? styles.stageStepBadgeCompleted : styles.stageStepBadgeCurrent}`}>
                            Stage 6 of 7
                          </span>
                          <h2 className={styles.stageSectionTitle}>
                            <FileCheck size={20} style={{ color: '#8b5cf6' }} />
                            <span>Assessments: Checkpoint Validation & Quizzes</span>
                          </h2>
                        </div>
                        <span className={`${styles.stageStatusBadge} ${assessments.passed.length === assessments.total && assessments.total > 0 ? styles.statusCompleted : styles.statusCurrent}`}>
                          <span>{assessments.passed.length} of {assessments.total} VERIFIED</span>
                        </span>
                      </div>

                      <p className={styles.stageNarrative}>
                        Validate real competency. Score 60% or higher to verify milestones and earn verifiable progress credentials.
                      </p>

                      <div className={styles.assessmentsOverviewGrid}>
                        <div className={styles.assessmentStatCard}>
                          <CheckCircle size={22} style={{ color: '#10b981' }} />
                          <div>
                            <div className={styles.assessmentStatVal} style={{ color: '#10b981' }}>{assessments.passed.length}</div>
                            <div className={styles.assessmentStatLabel}>Passed & Verified</div>
                          </div>
                        </div>

                        <div className={styles.assessmentStatCard}>
                          <AlertCircle size={22} style={{ color: '#f59e0b' }} />
                          <div>
                            <div className={styles.assessmentStatVal} style={{ color: '#f59e0b' }}>{assessments.needsReview.length}</div>
                            <div className={styles.assessmentStatLabel}>Review Recommended</div>
                          </div>
                        </div>

                        <div className={styles.assessmentStatCard}>
                          <Play size={20} style={{ color: '#a78bfa' }} />
                          <div>
                            <div className={styles.assessmentStatVal} style={{ color: '#a78bfa' }}>{assessments.ready.length}</div>
                            <div className={styles.assessmentStatLabel}>In Progress / Ready</div>
                          </div>
                        </div>

                        <div className={styles.assessmentStatCard}>
                          <Clock size={20} style={{ color: 'var(--text-muted)' }} />
                          <div>
                            <div className={styles.assessmentStatVal} style={{ color: 'var(--text-secondary)' }}>{assessments.upcoming.length}</div>
                            <div className={styles.assessmentStatLabel}>Upcoming Locked</div>
                          </div>
                        </div>
                      </div>

                      <div className={styles.assessmentsListGrid}>
                        {activeMilestone && (
                          <div className={styles.assessmentItemCard} style={{ borderColor: 'rgba(99, 102, 241, 0.4)' }}>
                            <div>
                              <div style={{ fontSize: '0.72rem', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                                Active Assessment
                              </div>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                                {activeMilestone.title}
                              </h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                                {activeMilestone.status === 'Completed & Verified'
                                  ? `Assessment passed with score ${activeMilestone.assessmentScore}%. Competency verified.`
                                  : activeMilestone.status === 'Completed — Review Recommended'
                                  ? `Score ${activeMilestone.assessmentScore}% requires review. Retake available.`
                                  : 'Study milestone materials and take the assessment to complete this checkpoint.'
                                }
                              </p>
                            </div>

                            <div>
                              {activeMilestone.status === 'In Progress' && (
                                <button
                                  className={`${styles.button} ${styles.primaryButton}`}
                                  onClick={() => handleMarkCompleted(activeMilestone)}
                                  style={{ width: '100%', justifyContent: 'center', padding: '6px 12px', fontSize: '0.8rem' }}
                                >
                                  <span>Take Assessment Now</span>
                                  <ArrowRight size={13} />
                                </button>
                              )}

                              {activeMilestone.status === 'Completed — Review Recommended' && (
                                <button
                                  className={`${styles.button} ${styles.primaryButton}`}
                                  onClick={() => handleMarkCompleted(activeMilestone)}
                                  style={{ width: '100%', justifyContent: 'center', padding: '6px 12px', fontSize: '0.8rem', background: '#f59e0b', color: '#000', border: 'none' }}
                                >
                                  <RefreshCw size={12} />
                                  <span>Retake Assessment</span>
                                </button>
                              )}

                              {activeMilestone.status === 'Completed & Verified' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.82rem', fontWeight: 700 }}>
                                  <CheckCircle size={15} />
                                  <span>Verified Checkpoint</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className={styles.assessmentItemCard}>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                              All Assessments
                            </div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                              Quizzes & Evaluations Hub
                            </h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                              Take full-length milestone quizzes, review past evaluations, and track question breakdowns.
                            </p>
                          </div>

                          <div>
                            <button
                              className={`${styles.button} ${styles.secondaryButton}`}
                              onClick={() => navigate('/exams')}
                              style={{ width: '100%', justifyContent: 'center', padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              <span>Open Assessments Hub</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                  const renderStage7 = () => (
                    <div className={styles.nextCareerCard} id="stage-7">
                      <div className={styles.nextCareerHeader}>
                        <div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
                            <Award size={13} />
                            <span>Stage 7 of 7: Destination</span>
                          </div>
                          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                            Next Career Stage: {roadmap.careerTitle}
                          </h2>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                            How completing this roadmap bridges you into placement readiness and continuous career advancement.
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            className={`${styles.button} ${styles.primaryButton}`}
                            onClick={() => navigate('/career-readiness')}
                            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                          >
                            <span>Check Career Readiness</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>

                      <div className={styles.nextCareerPathRow}>
                        <div className={styles.nextCareerStepPill} style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                          <span>1. Current Foundation</span>
                        </div>
                        <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                        <div className={styles.nextCareerStepPill} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe' }}>
                          <span>2. Checkpoints & Quizzes</span>
                        </div>
                        <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                        <div className={styles.nextCareerStepPill} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>
                          <span>3. Placement Ready</span>
                        </div>
                        <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                        <div className={styles.nextCareerStepPill} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fef3c7' }}>
                          <span>4. Senior {roadmap.careerTitle}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
                        <button
                          className={`${styles.button} ${styles.secondaryButton}`}
                          onClick={() => navigate('/career-paths')}
                          style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                        >
                          <TrendingUp size={13} />
                          <span>Explore Alternative & Backup Paths</span>
                        </button>
                        <button
                          className={`${styles.button} ${styles.secondaryButton}`}
                          onClick={() => navigate('/explore')}
                          style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                        >
                          <Compass size={13} />
                          <span>Browse Career Directory</span>
                        </button>
                      </div>
                    </div>
                  );

                  const getNodeSubtitle = (stageId: number) => {
                    switch (stageId) {
                      case 1:
                        return activeMilestone ? `Active Checkpoint: ${activeMilestone.title}` : 'Core Foundational Checkpoints';
                      case 2:
                        return upcomingMilestones.length > 0 
                          ? `${upcomingMilestones.length} upcoming milestone${upcomingMilestones.length > 1 ? 's' : ''} on the horizon` 
                          : 'Strategic milestones for the next 6–12 months';
                      case 3:
                        return `${skillsOverview.verified.length} verified skills • ${skillsOverview.inProgress.length + skillsOverview.upcoming.length} targeted competencies`;
                      case 4:
                        return 'Curated video tutorials and structured learning modules';
                      case 5:
                        return `${projects.length} practical portfolio projects and hands-on activities`;
                      case 6:
                        return `${assessments.total} total checkpoints • ${assessments.passed.length} verified assessments`;
                      case 7:
                        return `Target Career: ${roadmap.careerTitle} • Placement readiness & advancement`;
                      default:
                        return '';
                    }
                  };

                  const renderStageContent = (stageId: number) => {
                    switch (stageId) {
                      case 1: return renderStage1();
                      case 2: return renderStage2();
                      case 3: return renderStage3();
                      case 4: return renderStage4();
                      case 5: return renderStage5();
                      case 6: return renderStage6();
                      case 7: return renderStage7();
                      default: return null;
                    }
                  };

                  const stagesToRender = activeFilterStage === 'all'
                    ? CONCEPTUAL_STAGES
                    : CONCEPTUAL_STAGES.filter(s => s.id === activeFilterStage);

                  return (
                    <div className={styles.roadmapJourneyTrack}>
                      {/* Continuous glowing path / spine line */}
                      <div className={styles.journeySpineLine} />

                      {/* Quick Journey Controls */}
                      <div className={styles.journeyControls}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Compass size={15} style={{ color: 'var(--color-primary)' }} />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Continuous Roadmap Progression
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            ({activeFilterStage === 'all' ? `${expandedStages.size} of 7 expanded` : `Filtering Stage ${activeFilterStage}`})
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                            type="button" 
                            className={styles.journeyControlsBtn}
                            onClick={handleFocusCurrent}
                            title="Focus on your current position (You Are Here)"
                          >
                            <Target size={13} style={{ color: '#6366f1' }} />
                            <span>Focus Current</span>
                          </button>
                          <button 
                            type="button" 
                            className={styles.journeyControlsBtn}
                            onClick={handleExpandAll}
                          >
                            <ChevronDown size={13} />
                            <span>Expand All</span>
                          </button>
                          <button 
                            type="button" 
                            className={styles.journeyControlsBtn}
                            onClick={handleCollapseAll}
                          >
                            <ChevronUp size={13} />
                            <span>Collapse All</span>
                          </button>
                        </div>
                      </div>

                      {/* Connected Stage Nodes */}
                      {stagesToRender.map((stage) => {
                        const isExpanded = expandedStages.has(stage.id) || activeFilterStage === stage.id;
                        const status = getConceptualStageStatus(stage.id);
                        const isCurrent = status === 'current';
                        const isCompleted = status === 'completed';
                        const isDestination = stage.id === 7;
                        const StageIcon = stage.icon;

                        let markerClass = styles.nodeMarker;
                        if (isDestination) markerClass += ` ${styles.markerDestination}`;
                        else if (isCompleted) markerClass += ` ${styles.markerCompleted}`;
                        else if (isCurrent) markerClass += ` ${styles.markerCurrent}`;
                        else markerClass += ` ${styles.markerUpcoming}`;

                        let cardClass = styles.nodeCard;
                        if (isCurrent) cardClass += ` ${styles.nodeCardCurrent}`;

                        return (
                          <div key={stage.id} className={styles.journeyNodeItem}>
                            {/* Marker dot on the spine track */}
                            <div 
                              className={markerClass}
                              onClick={() => toggleStageExpansion(stage.id)}
                              style={{ cursor: 'pointer' }}
                              title={`${stage.title} (${isCompleted ? 'Completed' : isCurrent ? 'You Are Here' : isDestination ? 'Destination' : 'Upcoming'})`}
                            >
                              {isCompleted ? (
                                <Check size={14} strokeWidth={3} />
                              ) : isDestination ? (
                                <Rocket size={13} />
                              ) : isCurrent ? (
                                <Target size={13} />
                              ) : (
                                <span>{stage.id}</span>
                              )}
                            </div>

                            {/* Compact Stage Node Card */}
                            <div className={cardClass}>
                              <div 
                                className={styles.nodeCardHeader}
                                onClick={() => toggleStageExpansion(stage.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleStageExpansion(stage.id);
                                  }
                                }}
                              >
                                <div className={styles.nodeHeaderLeft}>
                                  <span className={styles.nodeStageNum}>Stage {stage.id}</span>
                                  <StageIcon 
                                    size={18} 
                                    style={{ 
                                      color: isCurrent ? 'var(--color-primary)' : isCompleted ? '#10b981' : isDestination ? '#c4b5fd' : 'var(--text-muted)',
                                      flexShrink: 0 
                                    }} 
                                  />
                                  <div className={styles.nodeTitleBox}>
                                    <h3 className={styles.nodeTitleText}>
                                      <span>{stage.title}</span>
                                      {isCurrent && (
                                        <span style={{ 
                                          fontSize: '0.68rem', 
                                          padding: '2px 7px', 
                                          borderRadius: '4px', 
                                          background: 'rgba(99, 102, 241, 0.2)', 
                                          color: '#a5b4fc', 
                                          border: '1px solid rgba(99, 102, 241, 0.4)', 
                                          fontWeight: 700 
                                        }}>
                                          YOU ARE HERE
                                        </span>
                                      )}
                                      {isDestination && (
                                        <span style={{ 
                                          fontSize: '0.68rem', 
                                          padding: '2px 7px', 
                                          borderRadius: '4px', 
                                          background: 'rgba(16, 185, 129, 0.15)', 
                                          color: '#34d399', 
                                          border: '1px solid rgba(16, 185, 129, 0.3)', 
                                          fontWeight: 700 
                                        }}>
                                          CAREER DESTINATION
                                        </span>
                                      )}
                                    </h3>
                                    <div className={styles.nodeSubtitleText}>
                                      {getNodeSubtitle(stage.id)}
                                    </div>
                                  </div>
                                </div>

                                <div className={styles.nodeHeaderRight}>
                                  <span className={`${styles.stageStatusBadge} ${isCompleted ? styles.statusCompleted : isCurrent ? styles.statusCurrent : styles.statusUpcoming}`}>
                                    {isCompleted ? 'COMPLETED' : isCurrent ? 'CURRENT / IN PROGRESS' : isDestination ? 'DESTINATION' : 'UPCOMING'}
                                  </span>
                                  <button
                                    type="button"
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                                    aria-label={isExpanded ? `Collapse ${stage.title}` : `Expand ${stage.title}`}
                                  >
                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                  </button>
                                </div>
                              </div>

                              {/* Expanded Detailed Content */}
                              {isExpanded && (
                                <div className={styles.nodeExpandedBody}>
                                  {renderStageContent(stage.id)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* VIEW MODE B: MILESTONES EXPLORER (CLASSIC 2-COLUMN TIMELINE) */}
            {viewMode === 'milestones' && (
              <div className={styles.roadmapGrid}>
                {/* Vertical timeline stages (Left) */}
                <div className={styles.timeline}>
                  {roadmap.stages.map((stage) => (
                    <div key={stage.title} className={styles.stageGroup}>
                      <div className={styles.stageHeader}>
                        <div className={styles.stageIconWrapper}>
                          <GitFork size={12} />
                        </div>
                        <span className={styles.stageTitle}>{stage.title}</span>
                      </div>

                      <div className={styles.milestonesList}>
                        {stage.milestones.map((milestone) => {
                          const cardClass = getMilestoneCardClass(milestone);
                          const isSelected = selectedMilestone?.id === milestone.id;
                          
                          return (
                            <div 
                              key={milestone.id}
                              className={cardClass}
                              onClick={() => {
                                setSelectedMilestone(milestone);
                                setQuizActive(false);
                                setQuizResult(null);
                                setQuizLoading(false);
                                setQuizError(null);
                              }}
                            >
                              <div className={styles.cardBody}>
                                <h4 className={styles.cardTitle}>
                                  {milestone.title}
                                </h4>
                                <p className={styles.cardDesc}>{milestone.description}</p>
                                
                                <div className={styles.tagRow}>
                                  <span className={styles.tag}>{milestone.skills.length} skills</span>
                                  {getMilestoneStatusBadge(milestone.status)}
                                </div>
                              </div>
                              
                              <ChevronRight size={16} style={{ opacity: isSelected ? 1 : 0.3, transform: isSelected ? 'translateX(2px)' : 'none', transition: 'all 0.2s' }} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Details card sidebar (Right) */}
                <div>
                  <AnimatePresence mode="wait">
                    {selectedMilestone ? (
                      <motion.div 
                        key={selectedMilestone.id}
                        className={styles.detailsCard}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={styles.detailsHeader}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                            <h2 style={{ fontSize: '1.3rem' }}>{selectedMilestone.title}</h2>
                            {getMilestoneStatusBadge(selectedMilestone.status)}
                          </div>
                          
                          {/* Action buttons panel */}
                          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                            {selectedMilestone.status === 'Upcoming' && (
                              <button 
                                className={`${styles.button} ${styles.primaryButton}`}
                                onClick={() => handleStartMilestone(selectedMilestone)}
                                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                              >
                                <Play size={12} fill="currentColor" style={{ marginRight: '4px' }} />
                                Start Milestone
                              </button>
                            )}
                            
                            {selectedMilestone.status === 'In Progress' && !quizActive && (
                              <button 
                                className={`${styles.button} ${styles.primaryButton}`}
                                onClick={() => handleMarkCompleted(selectedMilestone)}
                                style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#10b981', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                              >
                                <Check size={12} strokeWidth={3} style={{ marginRight: '4px' }} />
                                Complete Milestone → Take Assessment
                              </button>
                            )}

                            {selectedMilestone.status === 'Completed — Review Recommended' && !quizActive && (
                              <button 
                                className={`${styles.button} ${styles.primaryButton}`}
                                onClick={() => handleMarkCompleted(selectedMilestone)}
                                style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#f59e0b', boxShadow: 'none' }}
                              >
                                <RefreshCw size={12} style={{ marginRight: '4px' }} />
                                Retake Assessment
                              </button>
                            )}

                            <button 
                              className={`${styles.button} ${styles.secondaryButton}`}
                              onClick={() => openAiModal()}
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              <Sparkles size={12} style={{ marginRight: '4px' }} />
                              Ask AI
                            </button>

                            <button 
                              className={`${styles.button} ${styles.secondaryButton}`}
                              onClick={() => {
                                navigate('/youtube', {
                                  state: {
                                    selectedCareer: { 
                                      title: roadmap.careerTitle, 
                                      category: roadmap.careerId 
                                    },
                                    milestone: {
                                      id: selectedMilestone.id,
                                      title: selectedMilestone.title,
                                      skills: selectedMilestone.skills
                                    }
                                  }
                                });
                              }}
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              <Video size={12} style={{ marginRight: '4px' }} />
                              Learn from YouTube
                            </button>

                            <button 
                              className={`${styles.button} ${styles.secondaryButton}`}
                              onClick={() => setShowResourcesModal(true)}
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              <BookOpen size={12} style={{ marginRight: '4px' }} />
                              View Resources
                            </button>
                          </div>
                        </div>

                        {/* Section 2: WHAT YOU WILL LEARN */}
                        <div>
                          <span className={styles.sectionTitle}>What You Will Learn</span>
                          <p className={styles.detailsDesc}>{selectedMilestone.description}</p>
                          
                          <div className={styles.whyMattersBox}>
                            <Info size={16} style={{ color: '#a78bfa', flexShrink: 0, marginTop: '2px' }} />
                            <div className={styles.whyMattersText}>
                              <strong>Why this matters:</strong> {getWhyMattersText(selectedMilestone)}
                            </div>
                          </div>

                          {selectedMilestone.dependencies && selectedMilestone.dependencies.length > 0 && (
                            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.04)', borderRadius: '6px', padding: '10px 14px', marginTop: '10px' }}>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600, marginBottom: '2px' }}>Prerequisites (Informational)</span>
                              <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>
                                Requires prior completion of: {selectedMilestone.dependencies.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Section 3: WHAT YOU SHOULD DO */}
                        {selectedMilestone.tasks && selectedMilestone.tasks.length > 0 && (
                          <div>
                            <span className={styles.sectionTitle}>What You Should Do</span>
                            <div className={styles.tasksList}>
                              {selectedMilestone.tasks.map((t, idx) => {
                                const isStrength = t.startsWith('[Existing Strength]');
                                const isGap = t.startsWith('[Bridge Gap]');
                                
                                let cleanText = t;
                                let statusBadge = null;

                                if (isStrength) {
                                  cleanText = t.replace('[Existing Strength]', '').trim();
                                  statusBadge = <span style={{ fontSize: '0.7rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 600, marginLeft: '6px' }}>Strength</span>;
                                } else if (isGap) {
                                  cleanText = t.replace('[Bridge Gap]', '').trim();
                                  statusBadge = <span style={{ fontSize: '0.7rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)', fontWeight: 600, marginLeft: '6px' }}>Prioritized Gap</span>;
                                }

                                return (
                                  <div key={idx} className={styles.taskItem}>
                                    <div className={styles.taskDot} style={{ background: isStrength ? '#10b981' : isGap ? '#ef4444' : 'var(--color-primary)' }} />
                                    <div>
                                      <span>{cleanText}</span>
                                      {statusBadge}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Section 4: PRACTICAL ACTIVITIES */}
                        {selectedMilestone.activities && selectedMilestone.activities.length > 0 && (
                          <div>
                            <span className={styles.sectionTitle}>Practical Activities</span>
                            <div className={styles.activitiesList}>
                              {selectedMilestone.activities.map((a, idx) => (
                                <div key={idx} className={styles.activityItem}>
                                  <div className={styles.activityTitle}>{a}</div>
                                  <div className={styles.activityDesc}>Implement this scenario to validate practical expertise.</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Section 5: REQUIRED SKILLS */}
                        {selectedMilestone.skills && selectedMilestone.skills.length > 0 && (
                          <div>
                            <span className={styles.sectionTitle}>Required Skills</span>
                            <div className={styles.skillsList}>
                              {selectedMilestone.skills.map(s => {
                                const isExisting = selectedMilestone.tasks.some(t => t.includes('[Existing Strength]') && t.includes(s));
                                return (
                                  <span 
                                    key={s} 
                                    className={`${styles.skillBadge} ${isExisting ? styles.skillBadgeStrength : ''}`}
                                  >
                                    {s} {isExisting ? '✓' : ''}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Section 6: LEARNING OBJECTIVES */}
                        {selectedMilestone.learningObjectives && selectedMilestone.learningObjectives.length > 0 && (
                          <div>
                            <span className={styles.sectionTitle}>Learning Objectives</span>
                            <div className={styles.objectivesList}>
                              {selectedMilestone.learningObjectives.map((o, idx) => (
                                <div key={idx} className={styles.objectiveItem}>{o}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Section 7 & 8: ASSESSMENT & RESULT */}
                        <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                          <span className={styles.sectionTitle}>Milestone Assessment</span>
                          
                          {quizActive && (
                            <div className={styles.assessmentBox} style={{ marginTop: '10px' }}>
                              {quizLoading ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                  <RefreshCw className={styles.loadingSpinner} size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px auto' }} />
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Generating assessment...</p>
                                </div>
                              ) : quizError ? (
                                <div style={{ textAlign: 'center', padding: '16px' }}>
                                  <AlertCircle size={24} style={{ color: '#f59e0b', margin: '0 auto 8px auto' }} />
                                  <p style={{ fontSize: '0.85rem', color: '#fef3c7', margin: '0 0 12px 0' }}>{quizError}</p>
                                  <button
                                    className={`${styles.button} ${styles.primaryButton}`}
                                    onClick={() => handleMarkCompleted(selectedMilestone)}
                                    style={{ padding: '4px 12px', fontSize: '0.75rem', margin: '0 auto' }}
                                  >
                                    Try Again
                                  </button>
                                </div>
                              ) : !quizResult ? (
                                <>
                                  <div style={{ marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Milestone Assessment</h3>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Question {currentQuestionIdx + 1} of {quizQuestions.length}</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selectedMilestone.title}</div>
                                  </div>
                                  {quizQuestions.length > 0 && quizQuestions[currentQuestionIdx] ? (
                                    <>
                                      <div className={styles.quizQuestion} style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.4 }}>
                                        {quizQuestions[currentQuestionIdx].question}
                                      </div>
                                      <div className={styles.quizOptions} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {quizQuestions[currentQuestionIdx].options.map((opt, oIdx) => {
                                          const isSelected = userAnswers[currentQuestionIdx] === oIdx;
                                          return (
                                            <div 
                                              key={oIdx}
                                              className={`${styles.quizOption} ${isSelected ? styles.quizOptionSelected : ''}`}
                                              onClick={() => handleSelectQuizOption(oIdx)}
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                border: isSelected ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
                                                background: isSelected ? 'rgba(88, 80, 236, 0.08)' : 'rgba(255,255,255,0.01)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                fontSize: '0.8rem'
                                              }}
                                            >
                                              <div style={{
                                                width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)',
                                                background: isSelected ? 'var(--color-primary)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                              }}>
                                                {isSelected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />}
                                              </div>
                                              <span>{opt}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                                        <button 
                                          className={`${styles.button} ${styles.secondaryButton}`}
                                          disabled={currentQuestionIdx === 0}
                                          onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                        >
                                          Previous
                                        </button>
                                        {currentQuestionIdx < quizQuestions.length - 1 ? (
                                          <button 
                                            className={`${styles.button} ${styles.primaryButton}`}
                                            disabled={userAnswers[currentQuestionIdx] === undefined}
                                            onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                                            style={{ padding: '4px 12px', fontSize: '0.75rem', boxShadow: 'none' }}
                                          >
                                            Next
                                          </button>
                                        ) : (
                                          <button 
                                            className={`${styles.button} ${styles.primaryButton}`}
                                            disabled={userAnswers[currentQuestionIdx] === undefined || quizSubmitting}
                                            onClick={handleSubmitAssessment}
                                            style={{ padding: '4px 16px', fontSize: '0.75rem', background: '#10b981', boxShadow: 'none' }}
                                          >
                                            {quizSubmitting ? 'Grading...' : 'Submit Assessment'}
                                          </button>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <div style={{ textAlign: 'center', padding: '12px' }}>
                                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Failed to load questions.</p>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    Assessment Complete
                                  </div>
                                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                                    Score: {quizResult.score}%
                                  </div>

                                  <div className={styles.resultHeader} style={{ color: quizResult.passed ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '8px' }}>
                                    {quizResult.passed ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    <span>{quizResult.passed ? 'Completed & Verified' : '⚠ Review Recommended'}</span>
                                  </div>
                                  <p className={styles.resultText} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
                                    {quizResult.passed 
                                      ? `Congratulations! You successfully verified your understanding of this milestone.` 
                                      : `We recommend reviewing these areas before retaking the assessment.`
                                    }
                                  </p>

                                  {!quizResult.passed && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '8px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                      <strong style={{ fontSize: '0.78rem', color: '#f59e0b', display: 'block', marginBottom: '4px' }}>Recommended Areas to Review:</strong>
                                      {selectedMilestone.tasks.slice(0, 3).map((task, index) => (
                                        <div key={index} style={{ fontSize: '0.78rem', color: '#fef3c7', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b' }} />
                                          <span>Review "{task.replace('[Bridge Gap]', '').replace('[Existing Strength]', '').trim()}"</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div style={{ display: 'flex', gap: '10px' }}>
                                    {!quizResult.passed && (
                                      <button 
                                        className={`${styles.button} ${styles.primaryButton}`}
                                        onClick={() => handleMarkCompleted(selectedMilestone)}
                                        style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#f59e0b', color: '#000', border: 'none' }}
                                      >
                                        <RefreshCw size={12} style={{ marginRight: '4px' }} />
                                        Retake Assessment
                                      </button>
                                    )}
                                    <button 
                                      className={`${styles.button} ${styles.secondaryButton}`}
                                      onClick={() => setQuizActive(false)}
                                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                    >
                                      Continue Roadmap
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {!quizActive && (
                            <div style={{ marginTop: '10px' }}>
                              {selectedMilestone.status === 'Completed & Verified' && (
                                <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                  <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                                  <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>Assessment Verified (Score: {selectedMilestone.assessmentScore}%)</div>
                                    <div style={{ fontSize: '0.75rem', color: '#a7f3d0', marginTop: '2px' }}>Your knowledge of this milestone has been fully validated.</div>
                                  </div>
                                </div>
                              )}
                              
                              {selectedMilestone.status === 'Completed — Review Recommended' && (
                                <div style={{
                                  background: 'rgba(245, 158, 11, 0.06)',
                                  border: '1px solid rgba(245, 158, 11, 0.25)',
                                  borderRadius: '8px',
                                  padding: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '10px'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                                    <AlertCircle size={18} />
                                    <span>Review Recommended (Score: {selectedMilestone.assessmentScore}%)</span>
                                  </div>
                                  <p style={{ fontSize: '0.8rem', color: '#fef3c7', lineHeight: 1.4, margin: 0 }}>
                                    Your quiz score of {selectedMilestone.assessmentScore}% was below the 60% verification threshold.
                                  </p>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '8px' }}>
                                    <strong style={{ fontSize: '0.78rem', color: '#f59e0b', display: 'block', marginBottom: '4px' }}>Recommended Areas to Review:</strong>
                                    {selectedMilestone.tasks.slice(0, 3).map((task, index) => (
                                      <div key={index} style={{ fontSize: '0.78rem', color: '#fef3c7', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b' }} />
                                        <span>Review "{task.replace('[Bridge Gap]', '').replace('[Existing Strength]', '').trim()}"</span>
                                      </div>
                                    ))}
                                  </div>
                                  <button 
                                    className={`${styles.button} ${styles.primaryButton}`}
                                    onClick={() => handleMarkCompleted(selectedMilestone)}
                                    style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#f59e0b', color: '#000', border: 'none', width: 'fit-content', marginTop: '4px' }}
                                  >
                                    <RefreshCw size={12} style={{ marginRight: '4px' }} />
                                    Retake Assessment
                                  </button>
                                </div>
                              )}

                              {(selectedMilestone.status === 'Upcoming' || selectedMilestone.status === 'In Progress') && (
                                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                                    Study the milestone resources first. Once prepared, take the assessment to verify your skills.
                                  </p>
                                  <button 
                                    className={`${styles.button} ${styles.primaryButton}`}
                                    onClick={() => handleMarkCompleted(selectedMilestone)}
                                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                                  >
                                    Take Assessment
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>


                      </motion.div>
                    ) : (
                      <div className={styles.detailsCard} style={{ justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <ListTodo size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Select a milestone checkpoint to begin studying</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}
          </>
        )}

        {/* Confirmation Overwrite Dialog */}
        <AnimatePresence>
          {confirmModal.show && (
            <motion.div 
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className={styles.modalContent}
                initial={{ y: 20, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.95 }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <AlertCircle size={28} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 className={styles.modalTitle}>
                      {confirmModal.isRegen ? 'Regenerate Career Path?' : 'Path Already Exists'}
                    </h3>
                    <p className={styles.modalBody} style={{ marginTop: '10px' }}>
                      {confirmModal.isRegen 
                        ? `Are you sure you want to regenerate the roadmap for "${confirmModal.careerTitle}"? This will reset all milestone checklists and quiz score records. This cannot be undone.`
                        : `A career roadmap already exists for "${confirmModal.careerTitle}" with ${roadmap?.progress || 0}% progress. Do you want to load the existing records, or overwrite and generate a new path?`
                      }
                    </p>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button 
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={() => {
                      setConfirmModal({ show: false, careerId: '', careerTitle: '', isRegen: false });
                      if (!confirmModal.isRegen) {
                        loadRoadmapData(confirmModal.careerId);
                      }
                    }}
                  >
                    {confirmModal.isRegen ? 'Cancel' : 'Load Existing'}
                  </button>
                  <button 
                    className={`${styles.button} ${styles.primaryButton}`}
                    style={{ background: confirmModal.isRegen ? '#dc2626' : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', boxShadow: 'none' }}
                    onClick={() => {
                      const cid = confirmModal.careerId;
                      const ctitle = confirmModal.careerTitle;
                      setConfirmModal({ show: false, careerId: '', careerTitle: '', isRegen: false });
                      startAiGeneration(cid, ctitle, true);
                    }}
                  >
                    {confirmModal.isRegen ? 'Regenerate' : 'Overwrite & Generate'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resources Modal Popup */}
        <AnimatePresence>
          {showResourcesModal && selectedMilestone && (
            <motion.div 
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResourcesModal(false)}
            >
              <motion.div 
                className={styles.modalContent}
                initial={{ y: 20, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '440px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                  <h3 className={styles.modalTitle} style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
                    <span>Learning Resources</span>
                  </h3>
                  <button 
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onClick={() => setShowResourcesModal(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Personalized YouTube tutorials and study guides recommended for this milestone:
                </p>
                
                <div className={styles.resourcesModalList}>
                  {resourcesLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <RefreshCw className={styles.loadingSpinner} size={20} />
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Searching YouTube tutorials...</p>
                    </div>
                  ) : resourcesVideos.length > 0 ? (
                    resourcesVideos.map((video) => (
                      <a 
                        key={video.videoId}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resourceLinkItem}
                        style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px' }}
                      >
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          style={{ width: '64px', height: '40px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} 
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span 
                            style={{ fontSize: '0.78rem', fontWeight: 650, color: 'var(--text-primary)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {decodeHtmlEntities(video.title)}
                          </span>

                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>{video.channelTitle}</span>
                        </div>
                        <ExternalLink size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      </a>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                      <AlertCircle size={20} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '6px' }} />
                      <p style={{ fontSize: '0.8rem' }}>No recommended tutorials found.</p>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button 
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={() => setShowResourcesModal(false)}
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
};
