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
  ArrowLeft,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { ExamsApiService } from '../services/exams.service';
import type { ExamQuestion, AssessmentHistoryItem } from '../services/exams.service';
import { RoadmapService } from '../services/roadmap.service';
import type { CareerRoadmap, Milestone } from '../services/roadmap.service';
import { LearningHubApiService } from '../services/learning.service';
import { PersonalizationApiService } from '../services/personalization.service';

type ExamMode = 'milestone' | 'skill';
type SkillDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

const DEFAULT_POPULAR_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 
  'SQL', 'Data Structures', 'Machine Learning', 'Docker', 'Git'
];

export const ExamsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route State context checks
  const stateContext = location.state as {
    selectedCareer?: { title: string; category: string };
    milestone?: { id: string; title: string; skills: string[] };
    skillName?: string;
    mode?: ExamMode;
  } | null;

  // Mode Selection: Milestone Checkpoint vs Standalone Skill Exam
  const [examMode, setExamMode] = useState<ExamMode>(
    stateContext?.mode || (stateContext?.skillName ? 'skill' : 'milestone')
  );

  // Selected Career and Milestone (for Milestone mode)
  const [targetCareer, setTargetCareer] = useState<{ title: string; category: string } | null>(
    stateContext?.selectedCareer || null
  );
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Standalone Skill states
  const [selectedSkill, setSelectedSkill] = useState<string>(
    stateContext?.skillName || 'Python'
  );
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<SkillDifficulty>('Intermediate');
  const [skillAssessmentId, setSkillAssessmentId] = useState<string | null>(null);
  const [availableSkills, setAvailableSkills] = useState<string[]>(DEFAULT_POPULAR_SKILLS);

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
    verifiedSkillName?: string;
  } | null>(null);

  // Attempts History list
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);

  // Load available skills from personalization data
  useEffect(() => {
    const loadProfileSkills = async () => {
      try {
        const pData = await PersonalizationApiService.getPersonalizationData();
        if (pData?.context?.skills) {
          const tech = pData.context.skills.technicalSkills || [];
          const soft = pData.context.skills.softSkills || [];
          const missing = pData.recommendations?.skillGap?.missingSkills || [];
          const combined = Array.from(new Set([...tech, ...missing, ...soft, ...DEFAULT_POPULAR_SKILLS])).filter(Boolean);
          if (combined.length > 0) {
            setAvailableSkills(combined);
          }
        }
      } catch (err) {
        console.warn('Could not load profile skills for exams:', err);
      }
    };
    loadProfileSkills();
  }, []);

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

  // Reset quiz states when target milestone or mode changes
  useEffect(() => {
    setQuestions([]);
    setQuizActive(false);
    setQuizResult(null);
    setCurrentQuestionIdx(0);
    setQuestionsError(null);
    setSkillAssessmentId(null);
  }, [selectedMilestone, examMode, selectedSkill, selectedDifficulty]);

  // Generate milestone assessment questions
  const handleLoadMilestoneQuestions = async () => {
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

  // Generate standalone skill assessment questions
  const handleLoadSkillQuestions = async () => {
    const skillToTest = selectedSkill.trim();
    if (!skillToTest) {
      alert('Please select or enter a skill to assess.');
      return;
    }

    try {
      setQuestionsLoading(true);
      setQuestionsError(null);
      const res = await ExamsApiService.generateSkillAssessment(
        skillToTest,
        targetCareer?.title || 'Technology',
        selectedDifficulty
      );

      setSkillAssessmentId(res.assessmentId);
      setQuestions(res.questions || []);
      setUserAnswers(new Array(res.questions.length).fill(null));

      if (!res.questions || res.questions.length === 0) {
        setQuestionsError('NO_QUESTIONS');
      }
    } catch (err: any) {
      console.error('Failed to generate skill assessment questions:', err);
      setQuestionsError(err?.response?.data?.message || 'Skill assessment generation is temporarily unavailable.');
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
    // Check for unanswered questions
    const unanswered = userAnswers.some(ans => ans === null);
    if (unanswered) {
      alert('Please answer all questions before submitting your assessment.');
      return;
    }

    try {
      setQuizSubmitting(true);
      const submitData = userAnswers.map(ans => ans ?? 0);

      if (examMode === 'milestone') {
        if (!targetCareer || !selectedMilestone) return;
        const res = await ExamsApiService.submitAssessment(
          targetCareer.category,
          selectedMilestone.id,
          submitData
        );

        if (res) {
          const total = questions.length;
          const correct = Math.round((res.score / 100) * total);
          const incorrect = total - correct;
          
          setQuizResult({
            score: res.score,
            passed: res.passed,
            correctCount: correct,
            incorrectCount: incorrect
          });
          
          await fetchActiveRoadmap();
          await fetchHistory();
          LearningHubApiService.clearCache();
        }
      } else {
        // Standalone skill assessment submission
        if (!skillAssessmentId) {
          throw new Error('Active skill assessment session missing.');
        }
        const res = await ExamsApiService.submitSkillAssessment(
          skillAssessmentId,
          submitData
        );

        if (res) {
          const total = questions.length;
          const correct = Math.round((res.score / 100) * total);
          const incorrect = total - correct;

          setQuizResult({
            score: res.score,
            passed: res.passed,
            correctCount: correct,
            incorrectCount: incorrect,
            verifiedSkillName: res.passed ? res.skillName : undefined
          });

          await fetchHistory();
          LearningHubApiService.clearCache();
        }
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

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!availableSkills.includes(trimmed)) {
      setAvailableSkills(prev => [trimmed, ...prev]);
    }
    setSelectedSkill(trimmed);
    setCustomSkillInput('');
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
                <FileText size={12} /> Skill Checkpoints & Exams
              </span>
            </div>
            <h1 className="text-heading" style={{ fontSize: '1.8rem', marginTop: '4px' }}>Quizzes & Assessments</h1>
            <p className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '600px', marginTop: '2px' }}>
              Validate your competencies through roadmap milestones or standalone skill exams to earn verified status on your profile.
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

        {/* Assessment Mode Switcher */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
          <button
            onClick={() => setExamMode('milestone')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: examMode === 'milestone' ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
              background: examMode === 'milestone' ? 'rgba(88, 80, 236, 0.12)' : 'rgba(255,255,255,0.02)',
              color: examMode === 'milestone' ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 650,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Target size={14} style={{ color: examMode === 'milestone' ? 'var(--color-primary)' : 'var(--text-muted)' }} />
            Roadmap Milestones
          </button>

          <button
            onClick={() => setExamMode('skill')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: examMode === 'skill' ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
              background: examMode === 'skill' ? 'rgba(88, 80, 236, 0.12)' : 'rgba(255,255,255,0.02)',
              color: examMode === 'skill' ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 650,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap size={14} style={{ color: examMode === 'skill' ? 'var(--color-primary)' : 'var(--text-muted)' }} />
            Skill Verification Exams
          </button>
        </div>

        {/* ─── MODE 1: MILESTONE ASSESSMENTS ────────────────────────────────────────── */}
        {examMode === 'milestone' && (
          <>
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
                    <option value="" style={{ background: '#121826', color: 'var(--text-muted)' }}>-- Choose Milestone Checkpoint --</option>
                    {getRoadmapMilestones().map(m => (
                      <option key={m.id} value={m.id} style={{ background: '#121826', color: 'var(--text-primary)' }}>
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

            {/* If no milestone is active */}
            {!roadmapLoading && activeRoadmap && !selectedMilestone && (
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
                </div>

                {/* Question Assessment Flow Engine */}
                <AssessmentEngine 
                  questions={questions}
                  questionsLoading={questionsLoading}
                  questionsError={questionsError}
                  quizActive={quizActive}
                  currentQuestionIdx={currentQuestionIdx}
                  userAnswers={userAnswers}
                  quizSubmitting={quizSubmitting}
                  quizResult={quizResult}
                  onLoadQuestions={handleLoadMilestoneQuestions}
                  onStartQuiz={handleStartQuiz}
                  onSelectOption={handleSelectOption}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onSubmitQuiz={handleSubmitQuiz}
                  onRetake={() => {
                    setQuestions([]);
                    setQuizResult(null);
                    handleLoadMilestoneQuestions();
                  }}
                  contextTitle={selectedMilestone.title}
                  passMessage="Congratulations! You have verified your proficiency in this milestone. Your progress is updated."
                />
              </div>
            )}
          </>
        )}

        {/* ─── MODE 2: STANDALONE SKILL VERIFICATION EXAMS ───────────────────────────── */}
        {examMode === 'skill' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Skill Selector Card */}
            <div className="premiumCard" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} /> Independent Skill Assessment
                </span>
                <h2 className="text-heading" style={{ fontSize: '1.3rem', marginTop: '2px' }}>
                  Verify a Technical Competency
                </h2>
                <p className="text-muted" style={{ fontSize: '0.84rem', margin: '4px 0 0 0' }}>
                  Select any technical skill to generate an AI-certified competency exam. Passing adds this skill to your verified profile credentials.
                </p>
              </div>

              {/* Skill Selection Pills */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                  Suggested Skills to Verify
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {availableSkills.slice(0, 14).map((skill) => {
                    const isSelected = selectedSkill.toLowerCase() === skill.toLowerCase();
                    return (
                      <button
                        key={skill}
                        onClick={() => setSelectedSkill(skill)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: isSelected ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
                          background: isSelected ? 'rgba(88, 80, 236, 0.15)' : 'rgba(255,255,255,0.02)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Skill Input & Difficulty Config */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                    Or Test Any Other Skill
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input 
                        type="text"
                        placeholder="e.g. Kubernetes, Rust, GraphQL..."
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSkill()}
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
                      />
                    </div>
                    <button
                      onClick={handleAddCustomSkill}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'var(--text-primary)',
                        fontSize: '0.8rem',
                        fontWeight: 650,
                        cursor: 'pointer'
                      }}
                    >
                      Select
                    </button>
                  </div>
                </div>

                {/* Difficulty Selector */}
                <div style={{ minWidth: '160px' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                    Proficiency Level
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as SkillDifficulty)}
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
                    <option value="Beginner" style={{ background: '#121826', color: 'var(--text-primary)' }}>Beginner (Foundations)</option>
                    <option value="Intermediate" style={{ background: '#121826', color: 'var(--text-primary)' }}>Intermediate (Practitioner)</option>
                    <option value="Advanced" style={{ background: '#121826', color: 'var(--text-primary)' }}>Advanced (Expert)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Standalone Skill Assessment Engine */}
            <div className="premiumCard" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Selected Skill Exam</span>
                  <h2 className="text-heading" style={{ fontSize: '1.3rem', marginTop: '2px' }}>{selectedSkill}</h2>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px' }}>
                  Level: <strong>{selectedDifficulty}</strong>
                </span>
              </div>

              <AssessmentEngine 
                questions={questions}
                questionsLoading={questionsLoading}
                questionsError={questionsError}
                quizActive={quizActive}
                currentQuestionIdx={currentQuestionIdx}
                userAnswers={userAnswers}
                quizSubmitting={quizSubmitting}
                quizResult={quizResult}
                onLoadQuestions={handleLoadSkillQuestions}
                onStartQuiz={handleStartQuiz}
                onSelectOption={handleSelectOption}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSubmitQuiz={handleSubmitQuiz}
                onRetake={() => {
                  setQuestions([]);
                  setQuizResult(null);
                  handleLoadSkillQuestions();
                }}
                contextTitle={`${selectedSkill} (${selectedDifficulty})`}
                passMessage={`Congratulations! You have verified your proficiency in ${selectedSkill}. This credential is now recorded in your verified skills.`}
              />
            </div>
          </div>
        )}

        {/* ─── ASSESSMENT HISTORY SECTION ───────────────────────────────────────────── */}
        <div className="premiumCard" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} style={{ color: 'var(--color-primary)' }} /> Assessment History
            </h3>
          </div>

          {historyLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0' }}>
              <RefreshCw size={14} className="loadingSpinner" style={{ animation: 'spin 1.5s linear infinite' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Loading historical records...</span>
            </div>
          ) : history.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              No assessment attempts yet. Complete a milestone quiz or standalone skill assessment above to record your credentials.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map((item) => {
                const isSkillAssessment = item.assessmentType === 'standalone_skill' || (!item.milestoneId && item.skillName);
                const title = isSkillAssessment 
                  ? `Skill: ${item.skillName || 'Technical Skill'} (${item.difficulty || 'Intermediate'})`
                  : `Milestone: ${(item.milestoneId || '').replace(/-/g, ' ').toUpperCase()}`;

                return (
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
                      <div style={{ fontWeight: 650, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isSkillAssessment ? (
                          <Zap size={13} style={{ color: 'var(--color-primary)' }} />
                        ) : (
                          <Target size={13} style={{ color: 'var(--color-secondary)' }} />
                        )}
                        {title}
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
                );
              })}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

// ─── REUSABLE ASSESSMENT ENGINE COMPONENT ──────────────────────────────────────────
interface AssessmentEngineProps {
  questions: ExamQuestion[];
  questionsLoading: boolean;
  questionsError: string | null;
  quizActive: boolean;
  currentQuestionIdx: number;
  userAnswers: (number | null)[];
  quizSubmitting: boolean;
  quizResult: {
    score: number;
    passed: boolean;
    correctCount: number;
    incorrectCount: number;
    verifiedSkillName?: string;
  } | null;
  onLoadQuestions: () => void;
  onStartQuiz: () => void;
  onSelectOption: (idx: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmitQuiz: () => void;
  onRetake: () => void;
  contextTitle: string;
  passMessage: string;
}

const AssessmentEngine: React.FC<AssessmentEngineProps> = ({
  questions,
  questionsLoading,
  questionsError,
  quizActive,
  currentQuestionIdx,
  userAnswers,
  quizSubmitting,
  quizResult,
  onLoadQuestions,
  onStartQuiz,
  onSelectOption,
  onNext,
  onPrevious,
  onSubmitQuiz,
  onRetake,
  contextTitle,
  passMessage
}) => {
  return (
    <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
              Start the evaluation for {contextTitle}. Questions are generated dynamically and graded on the server.
            </p>
            <button
              onClick={onLoadQuestions}
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

        {/* Questions Load Error State */}
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
                ? 'No assessment questions are currently available for this selection yet.'
                : 'The AI assessment service is currently unavailable or the request timed out. Please verify configurations and try again.'}
            </p>
            {questionsError !== 'NO_QUESTIONS' && (
              <button
                onClick={onLoadQuestions}
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
                <h3 style={{ fontSize: '0.98rem', fontWeight: 650, marginTop: '4px' }}>{contextTitle} Quiz</h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{questions.length} questions</span>
            </div>
            
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 16px 0' }}>
              This assessment evaluates your practical knowledge. You must score at least <strong>60%</strong> to pass and verify your competency. Correct answers remain secured server-side.
            </p>

            <button
              onClick={onStartQuiz}
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
                AI Assessment
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
                    onClick={() => onSelectOption(idx)}
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
                onClick={onPrevious}
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
                  onClick={onNext}
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
                  onClick={onSubmitQuiz}
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
              {quizResult.passed ? passMessage : 'Your score was below the 60% verification threshold. We recommend studying the resources and retaking the assessment.'}
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

            {/* Back / Retake Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button
                onClick={onRetake}
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
                Retake Assessment
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default ExamsPage;
