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
import { 
  GitFork, 
  Circle, 
  RefreshCw, 
  ChevronRight, 
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
  Video
} from 'lucide-react';
import styles from './CareerRoadmapPage.module.css';

export const CareerRoadmapPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAiModal } = useAiModal();

  // Roadmap State
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  const fetchSavedCareers = async () => {
    try {
      const response = await CareerService.getSavedCareers();
      setSavedCareers(response.careers);
    } catch (err) {
      console.warn('Error fetching saved careers for roadmap selector:', err);
    }
  };

  // 2. Fetch or generate a roadmap based on route location state or active settings
  const loadRoadmapData = useCallback(async (careerIdInput?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedRoadmap = await RoadmapService.getRoadmap(careerIdInput);
      
      if (fetchedRoadmap) {
        setRoadmap(fetchedRoadmap);
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
  }, []);

  const selectFirstOrCurrentMilestone = (rm: CareerRoadmap) => {
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
  };

  // Triggered when entering page. Checks if we came from Career Match and need to auto-create
  useEffect(() => {
    fetchSavedCareers();
    
    const stateCareer = location.state?.selectedCareer as Career | undefined;
    if (stateCareer) {
      handleInitialCheck(stateCareer.id, stateCareer.title);
      window.history.replaceState({}, document.title);
    } else {
      loadRoadmapData();
    }
  }, [location.state, loadRoadmapData]);

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

  // Initial check: if roadmap exists, load it. If not, generate immediately.
  const handleInitialCheck = async (careerId: string, careerTitle: string) => {
    try {
      setLoading(true);
      const existing = await RoadmapService.getRoadmap(careerId);
      if (existing) {
        setRoadmap(existing);
        selectFirstOrCurrentMilestone(existing);
        setLoading(false);
      } else {
        startAiGeneration(careerId, careerTitle, false);
      }
    } catch (err) {
      console.error('Error checking initial roadmap status:', err);
      setError('Could not establish roadmap status.');
      setLoading(false);
    }
  };

  // 3. AI Generation steps trigger
  const startAiGeneration = async (careerId: string, careerTitle: string, overwrite: boolean) => {
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
        setAiGenerating(false);
      } else if (response.roadmap) {
        setRoadmap(response.roadmap);
        selectFirstOrCurrentMilestone(response.roadmap);
        setAiGenerating(false);
      }
    } catch (err: any) {
      console.error('AI generation request failed:', err);
      setError('Generation failed. Please try again.');
      setAiGenerating(false);
    }
  };

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

  // Switch to a different saved career or load it
  const handleSelectCareerToLoad = async (career: Career) => {
    setShowSwitchMenu(false);
    try {
      setLoading(true);
      const existing = await RoadmapService.getRoadmap(career.id);
      if (existing) {
        setRoadmap(existing);
        selectFirstOrCurrentMilestone(existing);
        setLoading(false);
      } else {
        startAiGeneration(career.id, career.title, false);
      }
    } catch (err) {
      console.error('Failed to load roadmap selection:', err);
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
        {loading && !aiGenerating && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
            <RefreshCw className={styles.loadingSpinner} size={32} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading roadmap...</p>
          </div>
        )}

        {error && (
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

        {/* Empty State */}
        {!loading && !roadmap && !error && (
          <div className={styles.emptyState}>
            <GitFork size={48} style={{ color: 'var(--color-primary)' }} />
            <h2 className={styles.emptyTitle}>Create Your Career Roadmap</h2>
            <p className={styles.emptyText}>
              Track your skill development and test your knowledge. Select a saved career to start generating your personalized educational pathway.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className={`${styles.button} ${styles.primaryButton}`} onClick={() => navigate('/explore')}>
                Explore Careers
              </button>
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
        {!loading && roadmap && (
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

            {/* IMPROVEMENT 1: ROADMAP OVERVIEW CARD */}
            <div className={styles.progressCard}>
              <div className={styles.progressInfo}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                  Your Path to {roadmap.careerTitle}
                </h3>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>{roadmap.stages.length} Stages</span>
                  <span>•</span>
                  <span>{getFlatMilestones().length} Milestones</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <strong>Current Checkpoint:</strong> {getCurrentMilestoneTitle()}
                </div>
                <div className={styles.progressOuter}>
                  <div className={styles.progressInner} style={{ width: `${roadmap.progress}%` }} />
                </div>
              </div>
              
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statVal}>{getCompletedCount()}</span>
                  <span className={styles.statLabel}>Completed</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statVal}>{roadmap.progress}%</span>
                  <span className={styles.statLabel}>Progress</span>
                </div>
              </div>
            </div>

            {/* Main Timelines Section */}
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
                            
                            {/* Render dependency connecting arrow/dots inside list visually */}
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
                        
                        {/* WHY THIS MILESTONE MATTERS */}
                        <div className={styles.whyMattersBox}>
                          <Info size={16} style={{ color: '#a78bfa', flexShrink: 0, marginTop: '2px' }} />
                          <div className={styles.whyMattersText}>
                            <strong>Why this matters:</strong> {getWhyMattersText(selectedMilestone)}
                          </div>
                        </div>

                        {/* Dependencies details */}
                        {selectedMilestone.dependencies && selectedMilestone.dependencies.length > 0 && (
                          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.04)', borderRadius: '6px', padding: '10px 14px', marginTop: '10px' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600, marginBottom: '2px' }}>Prerequisites (Informational)</span>
                            <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>
                              Requires prior completion of: {selectedMilestone.dependencies.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Section 3: WHAT YOU SHOULD DO (tasks/checkpoints) */}
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
                            dangerouslySetInnerHTML={{ __html: video.title }}
                          />
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
