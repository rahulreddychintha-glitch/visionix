import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  AlertCircle, 
  RefreshCw, 
  Award,
  BookOpen,
  Calendar,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { ExamsApiService } from '../services/exams.service';
import type { ExamQuestion, AssessmentHistoryItem } from '../services/exams.service';
import { RoadmapService } from '../services/roadmap.service';
import type { CareerRoadmap, Milestone } from '../services/roadmap.service';
import { LearningHubApiService } from '../services/learning.service';

export const ExamsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route State context checks
  const stateContext = location.state as {
    selectedCareer?: { title: string; category: string };
    milestone?: { id: string; title: string; skills: string[] };
  } | null;

  // Selected Career and Milestone
  const [targetCareer, setTargetCareer] = useState<{ title: string; category: string } | null>(
    stateContext?.selectedCareer || null
  );
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Active Roadmap & dropdown milestone selection lists
  const [activeRoadmap, setActiveRoadmap] = useState<CareerRoadmap | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState<boolean>(false);

  // Active quiz states
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState<boolean>(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitting, setQuizSubmitting] = useState<boolean>(false);
  
  // Results panel
  const [quizResult, setQuizResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    incorrectCount: number;
  } | null>(null);

  // Attempts History list
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);

  // Sync active roadmap if accessed directly
  const fetchActiveRoadmap = useCallback(async () => {
    try {
      setRoadmapLoading(true);
      const res = await RoadmapService.getRoadmap();
      if (res) {
        setActiveRoadmap(res);
        if (!targetCareer) {
          setTargetCareer({ title: res.careerTitle, category: res.careerId });
        }
        
        // Match specific milestone state if passed via navigation
        if (stateContext?.milestone) {
          const matched = res.stages
            .flatMap(s => s.milestones)
            .find(m => m.id === stateContext.milestone?.id);
          if (matched) {
            setSelectedMilestone(matched);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching roadmap context:', err);
    } finally {
      setRoadmapLoading(false);
    }
  }, [targetCareer, stateContext]);

  // Load history records
  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await ExamsApiService.getAssessmentHistory();
      setHistory(res || []);
    } catch (err) {
      console.warn('Failed to load assessment history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveRoadmap();
    fetchHistory();
  }, [fetchActiveRoadmap, fetchHistory]);

  // Reset quiz states when target milestone changes
  useEffect(() => {
    setQuestions([]);
    setQuizActive(false);
    setQuizResult(null);
    setCurrentQuestionIdx(0);
    setQuestionsError(null);
  }, [selectedMilestone]);

  // Generate assessment questions (P2 API load / fallback handler)
  const handleLoadQuestions = async () => {
    if (!targetCareer || !selectedMilestone) return;

    try {
      setQuestionsLoading(true);
      setQuestionsError(null);
      const res = await ExamsApiService.generateAssessment(targetCareer.category, selectedMilestone.id);
      setQuestions(res || []);
      setUserAnswers(new Array(res.length).fill(null));
      
      if (!res || res.length === 0) {
        setQuestionsError('NO_QUESTIONS');
      }
    } catch (err: any) {
      console.error('Failed to generate assessment questions:', err);
      setQuestionsError(err?.response?.data?.message || 'Assessment generation is temporarily unavailable.');
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (questions.length === 0) return;
    setQuizActive(true);
    setCurrentQuestionIdx(0);
    setQuizResult(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => {
      const updated = [...prev];
      updated[currentQuestionIdx] = optionIndex;
      return updated;
    });
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!targetCareer || !selectedMilestone) return;

    // Check for unanswered questions
    const unanswered = userAnswers.some(ans => ans === null);
    if (unanswered) {
      alert('Please answer all questions before submitting your assessment.');
      return;
    }

    try {
      setQuizSubmitting(true);
      const submitData = userAnswers.map(ans => ans ?? 0);
      const res = await ExamsApiService.submitAssessment(
        targetCareer.category,
        selectedMilestone.id,
        submitData
      );

      // Score assessment correctly
      let correct = 0;
      let incorrect = 0;
      if (res) {
        // Calculate correct/incorrect counts based on score
        const total = questions.length;
        correct = Math.round((res.score / 100) * total);
        incorrect = total - correct;
        
        setQuizResult({
          score: res.score,
          passed: res.passed,
          correctCount: correct,
          incorrectCount: incorrect
        });
        
        // Force refresh roadmap context and cache
        await fetchActiveRoadmap();
        await fetchHistory();
        LearningHubApiService.clearCache(); 
      }
    } catch (err) {
      console.error('Error submitting quiz answers:', err);
      alert('Failed to submit quiz answers. Please verify your connection.');
    } finally {
      setQuizSubmitting(false);
    }
  };

  // Find all milestones in staging structure
  const getRoadmapMilestones = () => {
    if (!activeRoadmap) return [];
    return activeRoadmap.stages.flatMap(stage => stage.milestones);
  };

  const handleMilestoneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const milestoneId = e.target.value;
    const matched = getRoadmapMilestones().find(m => m.id === milestoneId);
    if (matched) {
      setSelectedMilestone(matched);
    } else {
      setSelectedMilestone(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div className="glow-accent-primary" style={{ width: '400px', height: '400px', top: '10%', right: '15%', opacity: 0.2 }} />
      <div className="glow-accent-secondary" style={{ width: '400px', height: '400px', bottom: '15%', left: '10%', opacity: 0.15 }} />

      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        zIndex: 1,
        padding: '24px'
      }}>
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'rgba(88, 80, 236, 0.1)',
                padding: '3px 8px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <FileText size={12} /> Skill Checkpoints
              </span>
            </div>
            <h1 className="text-heading" style={{ fontSize: '1.8rem', marginTop: '4px' }}>Quizzes & Assessments</h1>
            <p className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '600px', marginTop: '2px' }}>
              Validate your skill set and complete milestone certifications to update your personalized career path progress.
            </p>
          </div>

          {stateContext && (
            <button 
              onClick={() => navigate('/roadmap')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '6px 14px',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 650,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} /> Back to Roadmap
            </button>
          )}
        </div>

        {/* Milestone Selector Menu (Case 2: Direct Access) */}
        {!stateContext && !roadmapLoading && activeRoadmap && (
          <div className="premiumCard" style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Select Milestone Assessment
              </label>
              <select 
                onChange={handleMilestoneSelect}
                value={selectedMilestone?.id || ''}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              >
                <option value="">-- Choose Milestone Checkpoint --</option>
                {getRoadmapMilestones().map(m => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.status})
                  </option>
                ))}
              </select>
            </div>
            {targetCareer && (
              <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Career</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 650, color: 'var(--text-primary)' }}>{targetCareer.title}</span>
              </div>
            )}
          </div>
        )}

        {/* Loading Active Roadmap */}
        {roadmapLoading && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <RefreshCw size={28} className="loadingSpinner" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 8px auto', color: 'var(--color-primary)' }} />
            <p className="text-muted" style={{ fontSize: '0.82rem' }}>Resolving roadmap milestones...</p>
          </div>
        )}

        {/* Roadmap Not Found Empty state */}
        {!roadmapLoading && !activeRoadmap && (
          <div className="premiumCard" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={36} style={{ color: '#f59e0b', opacity: 0.8 }} />
            <h2 className="text-heading" style={{ fontSize: '1.2rem' }}>Create a career roadmap to access milestone assessments</h2>
            <p className="text-description" style={{ maxWidth: '400px', fontSize: '0.82rem', margin: 0 }}>
              Milestone checkpoints and review quizzes are generated as part of your personalized AI career roadmap. Build your roadmap to start.
            </p>
            <button 
              onClick={() => navigate('/roadmap')}
              className="premiumButton"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 650, cursor: 'pointer', marginTop: '8px' }}
            >
              Generate Roadmap
            </button>
          </div>
        )}

        {/* Assessment Card Details */}
        {!roadmapLoading && activeRoadmap && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            
            {/* If no milestone is active */}
            {!selectedMilestone && (
              <div className="premiumCard" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Layers size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 650, color: 'var(--text-primary)' }}>Select a roadmap milestone to begin an assessment</h3>
                <p style={{ fontSize: '0.8rem', maxWidth: '320px', margin: '6px auto 0 auto', lineHeight: 1.4 }}>
                  Choose any available checkpoint from your career roadmap options list above to evaluate skills.
                </p>
              </div>
            )}

            {/* Selected Milestone Active Panel */}
            {selectedMilestone && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Milestone Metadata Context Header */}
                <div className="premiumCard" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Active Milestone</span>
                      <h2 className="text-heading" style={{ fontSize: '1.4rem', marginTop: '2px' }}>{selectedMilestone.title}</h2>
                    </div>
                    {targetCareer && (
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Roadmap Career</span>
                        <div style={{ fontSize: '0.88rem', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>{targetCareer.title}</div>
                      </div>
                    )}
                  </div>
                  
                  {selectedMilestone.description && (
                    <p className="text-muted" style={{ fontSize: '0.84rem', margin: 0, lineHeight: 1.4 }}>
                      {selectedMilestone.description}
                    </p>
                  )}

                  {/* Skills Grid */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>Skills Evaluated</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedMilestone.skills.map((skill, idx) => (
                        <span key={idx} style={{ fontSize: '0.72rem', color: 'var(--text-primary)', background: 'rgba(88, 80, 236, 0.06)', border: '1px solid rgba(88, 80, 236, 0.15)', padding: '3px 10px', borderRadius: '4px' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Learning Objectives */}
                  {selectedMilestone.learningObjectives && selectedMilestone.learningObjectives.length > 0 && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>Learning Objectives</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {selectedMilestone.learningObjectives.map((obj, idx) => (
                          <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-primary)' }}>•</span>
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Assessment Panel */}
                <div className="premiumCard" style={{ padding: '24px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <AnimatePresence mode="wait">
                    
                    {/* State 1: Overview and Load Questions */}
                    {questions.length === 0 && !questionsLoading && !questionsError && (
                      <motion.div 
                        key="overview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '20px' }}
                      >
                        <BookOpen size={36} style={{ color: 'var(--color-primary)', opacity: 0.8, margin: '0 auto 12px auto' }} />
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--text-primary)' }}>Ready to test your skills?</h3>
                        <p className="text-muted" style={{ fontSize: '0.8rem', maxWidth: '380px', margin: '6px auto 16px auto', lineHeight: 1.4 }}>
                          Start the checkpoint assessment. The quiz evaluates your proficiency in {selectedMilestone.skills.slice(0, 3).join(', ')} skills.
                        </p>
                        <button
                          onClick={handleLoadQuestions}
                          className="premiumButton"
                          style={{
                            background: 'var(--color-primary)',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 24px',
                            borderRadius: '8px',
                            fontWeight: 650,
                            cursor: 'pointer'
                          }}
                        >
                          Prepare Assessment Questions
                        </button>
                      </motion.div>
                    )}

                    {/* Loading Questions State */}
                    {questionsLoading && (
                      <motion.div 
                        key="loading-questions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '36px 0' }}
                      >
                        <RefreshCw size={24} className="loadingSpinner" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 10px auto', color: 'var(--color-primary)' }} />
                        <p className="text-muted" style={{ fontSize: '0.82rem' }}>Constructing assessment questionnaire...</p>
                      </motion.div>
                    )}

                    {/* Questions Load Error State (Handling Quota/Key Failures Truthfully) */}
                    {questionsError && (
                      <motion.div 
                        key="error-questions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
                      >
                        <AlertCircle size={32} style={{ color: '#ef4444' }} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 650, color: 'var(--text-primary)' }}>
                          {questionsError === 'NO_QUESTIONS' ? 'No assessment questions available' : 'Assessment generation is temporarily unavailable'}
                        </h3>
                        <p className="text-muted" style={{ fontSize: '0.82rem', maxWidth: '360px', lineHeight: 1.4, margin: 0 }}>
                          {questionsError === 'NO_QUESTIONS' 
                            ? 'No assessment questions are currently available for this milestone yet. Assessment content will become available when verified questions or AI-generated assessment content is available.'
                            : 'The AI assessment service is currently offline or the request failed. Please verify configurations and try again.'}
                        </p>
                        {questionsError !== 'NO_QUESTIONS' && (
                          <button
                            onClick={handleLoadQuestions}
                            style={{
                              padding: '8px 18px',
                              borderRadius: '8px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: 'var(--text-primary)',
                              fontSize: '0.8rem',
                              fontWeight: 650,
                              cursor: 'pointer',
                              marginTop: '8px'
                            }}
                          >
                            Try Again
                          </button>
                        )}
                      </motion.div>
                    )}

                    {/* State 2: Ready to Start Quiz */}
                    {questions.length > 0 && !quizActive && !quizResult && (
                      <motion.div 
                        key="ready-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ padding: '16px' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', marginBottom: '14px' }}>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: 'var(--color-secondary)', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(126, 58, 242, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                              AI-generated Assessment
                            </span>
                            <h3 style={{ fontSize: '0.98rem', fontWeight: 650, marginTop: '4px' }}>Milestone Verification Quiz</h3>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{questions.length} questions</span>
                        </div>
                        
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                          This assessment will evaluate your core understanding of the skills required for this milestone. You must score at least <strong>60%</strong> to verify completion status. Correct index validations are executed on the server.
                        </p>

                        <button
                          onClick={handleStartQuiz}
                          className="premiumButton"
                          style={{
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 24px',
                            borderRadius: '8px',
                            fontWeight: 650,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Play size={12} fill="currentColor" /> Start Assessment
                        </button>
                      </motion.div>
                    )}

                    {/* State 3: Interactive Quiz Player */}
                    {quizActive && questions.length > 0 && !quizResult && (
                      <motion.div 
                        key="player"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                      >
                        {/* Progress Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Question {currentQuestionIdx + 1} of {questions.length}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
                            AI-generated Assessment
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.2s ease' }} />
                        </div>

                        {/* Question Text */}
                        <h3 style={{ fontSize: '0.98rem', fontWeight: 650, color: 'var(--text-primary)', lineHeight: 1.4, margin: '8px 0 4px 0' }}>
                          {questions[currentQuestionIdx]?.question}
                        </h3>

                        {/* Options List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {questions[currentQuestionIdx]?.options.map((option, idx) => {
                            const isSelected = userAnswers[currentQuestionIdx] === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleSelectOption(idx)}
                                style={{
                                  width: '100%',
                                  textAlign: 'left',
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  background: isSelected ? 'rgba(88, 80, 236, 0.05)' : 'rgba(255,255,255,0.01)',
                                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.05)',
                                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                                  fontSize: '0.82rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <span style={{ marginRight: '8px', fontWeight: 700, color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                                  {String.fromCharCode(65 + idx)}.
                                </span>
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {/* Question Navigation */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px', marginTop: '8px' }}>
                          <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIdx === 0}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'none',
                              border: 'none',
                              color: currentQuestionIdx === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
                              fontSize: '0.8rem',
                              cursor: currentQuestionIdx === 0 ? 'default' : 'pointer'
                            }}
                          >
                            <ChevronLeft size={16} /> Back
                          </button>

                          {currentQuestionIdx < questions.length - 1 ? (
                            <button
                              onClick={handleNext}
                              disabled={userAnswers[currentQuestionIdx] === null}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'none',
                                border: 'none',
                                color: userAnswers[currentQuestionIdx] === null ? 'var(--text-muted)' : 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                cursor: userAnswers[currentQuestionIdx] === null ? 'default' : 'pointer'
                              }}
                            >
                              Next <ChevronRight size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={handleSubmitQuiz}
                              disabled={quizSubmitting || userAnswers[currentQuestionIdx] === null}
                              style={{
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 16px',
                                color: '#fff',
                                fontSize: '0.8rem',
                                fontWeight: 650,
                                cursor: 'pointer',
                                opacity: quizSubmitting ? 0.6 : 1
                              }}
                            >
                              {quizSubmitting ? 'Evaluating...' : 'Submit Assessment'}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* State 4: Quiz Scored Result Display */}
                    {quizResult && (
                      <motion.div 
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center', padding: '12px' }}
                      >
                        {quizResult.passed ? (
                          <Award size={48} style={{ color: '#10b981' }} />
                        ) : (
                          <AlertCircle size={48} style={{ color: '#f59e0b' }} />
                        )}

                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {quizResult.passed ? 'Assessment Verified!' : 'Review Recommended'}
                          </h3>
                          <span style={{
                            display: 'inline-block',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: quizResult.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: quizResult.passed ? '#10b981' : '#f59e0b',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            marginTop: '4px'
                          }}>
                            Score: {quizResult.score}%
                          </span>
                        </div>

                        <p className="text-muted" style={{ fontSize: '0.82rem', maxWidth: '380px', lineHeight: 1.4, margin: 0 }}>
                          {quizResult.passed 
                            ? 'Congratulations! You have verified your proficiency in the skills of this milestone. The milestone status is updated.'
                            : 'Your score was below the 60% verification threshold. We recommend studying the resources and retaking the assessment.'}
                        </p>

                        {/* Breakdown Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '100%', maxWidth: '360px', marginTop: '8px' }}>
                          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px 4px' }}>
                            <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Correct</span>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>{quizResult.correctCount}</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px 4px' }}>
                            <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Incorrect</span>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444' }}>{quizResult.incorrectCount}</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px 4px' }}>
                            <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Questions</span>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{questions.length}</span>
                          </div>
                        </div>

                        {/* Back Buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                          <button
                            onClick={() => {
                              setQuestions([]);
                              setQuizResult(null);
                              handleLoadQuestions();
                            }}
                            style={{
                              padding: '8px 18px',
                              borderRadius: '8px',
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.8rem',
                              fontWeight: 650,
                              cursor: 'pointer'
                            }}
                          >
                            Retake Quiz
                          </button>
                          <button
                            onClick={() => navigate('/roadmap')}
                            className="premiumButton"
                            style={{
                              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                              color: '#fff',
                              border: 'none',
                              padding: '8px 20px',
                              borderRadius: '8px',
                              fontWeight: 650,
                              cursor: 'pointer'
                            }}
                          >
                            Back to Roadmap
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Assessment History Attempts list */}
            <div className="premiumCard" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} style={{ color: 'var(--color-primary)' }} /> Assessment History
                </h3>
              </div>

              {historyLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0' }}>
                  <RefreshCw size={14} className="loadingSpinner" />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Loading historical records...</span>
                </div>
              ) : history.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  No assessment attempts yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {history.map((item) => (
                    <div 
                      key={item._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 650, color: 'var(--text-primary)' }}>
                          {item.milestoneId.replace(/-/g, ' ').toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Completed on {new Date(item.updatedAt).toLocaleDateString()} • {item.questions.length} questions
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: item.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: item.passed ? '#10b981' : '#ef4444',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {item.score}% {item.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
export default ExamsPage;
