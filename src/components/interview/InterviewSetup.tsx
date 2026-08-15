import React, { useState, useEffect } from 'react';
import type { InterviewType, InterviewDifficulty, IGenerateInterviewRequest } from '../../types/interview.types';
import type { IResume } from '../../types/resume.types';
import { ResumeService } from '../../services/resume.service';
import {
  Sparkles,
  ArrowLeft,
  Target,
  BookOpen,
  Users,
  FileText,
  Clock,
  Check,
  Plus,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import styles from '../../pages/InterviewPage.module.css';

interface InterviewSetupProps {
  defaultType?: InterviewType;
  defaultTargetRole?: string;
  defaultFocusAreas?: string[];
  suggestedSkills?: string[];
  onCancel: () => void;
  onGenerate: (data: IGenerateInterviewRequest) => Promise<void>;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({
  defaultType = 'mock',
  defaultTargetRole = '',
  defaultFocusAreas = [],
  suggestedSkills = [],
  onCancel,
  onGenerate,
}) => {
  const [targetRole, setTargetRole] = useState<string>(defaultTargetRole || 'Software Engineer');
  const [interviewType, setInterviewType] = useState<InterviewType>(defaultType);
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [focusAreas, setFocusAreas] = useState<string[]>(
    defaultFocusAreas.length > 0 ? defaultFocusAreas : suggestedSkills.slice(0, 4)
  );
  const [newFocusInput, setNewFocusInput] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Resume selection state for resume_based type
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [loadingResumes, setLoadingResumes] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load user resumes if resume-based is selected
  useEffect(() => {
    if (interviewType === 'resume_based') {
      const fetchResumes = async () => {
        try {
          setLoadingResumes(true);
          const list = await ResumeService.getResumes();
          setResumes(list);
          if (list.length > 0) {
            setSelectedResumeId(list[0]._id || '');
          }
        } catch (err) {
          console.warn('Failed to load resumes:', err);
        } finally {
          setLoadingResumes(false);
        }
      };
      fetchResumes();
    }
  }, [interviewType]);

  const toggleFocusArea = (skill: string) => {
    if (focusAreas.includes(skill)) {
      setFocusAreas((prev) => prev.filter((s) => s !== skill));
    } else {
      setFocusAreas((prev) => [...prev, skill]);
    }
  };

  const handleAddCustomFocus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFocusInput.trim()) return;
    const trimmed = newFocusInput.trim();
    if (!focusAreas.includes(trimmed)) {
      setFocusAreas((prev) => [...prev, trimmed]);
    }
    setNewFocusInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) {
      setError('Please provide a target role for this interview session.');
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      await onGenerate({
        targetRole: targetRole.trim(),
        interviewType,
        difficulty,
        questionCount,
        focusAreas,
        timerSeconds,
        resumeId: interviewType === 'resume_based' && selectedResumeId ? selectedResumeId : undefined,
      });
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to generate interview. Please try again.'
      );
      setGenerating(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '820px',
        margin: '0 auto',
        background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
        border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
        borderRadius: '16px',
        padding: '32px',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className={styles.btnSecondary} onClick={onCancel} disabled={generating}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <span className={styles.badge}>Configuration</span>
      </div>

      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f3f4f6', margin: '0 0 6px 0' }}>
          Configure AI Interview Practice
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#9ca3af', margin: 0 }}>
          Customize your session format, difficulty, and focus competencies before generating AI questions.
        </p>
      </div>

      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* 1. Target Role */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#d1d5db' }}>
            Target Career / Role *
          </label>
          <div style={{ position: 'relative' }}>
            <Target
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#818cf8' }}
            />
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Frontend Developer, Data Scientist, DevOps Engineer"
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '10px 14px 10px 38px',
                color: '#f3f4f6',
                fontSize: '0.9rem',
                outline: 'none',
              }}
              required
            />
          </div>
        </div>

        {/* 2. Interview Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#d1d5db' }}>
            Practice Mode
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
            }}
          >
            {[
              { id: 'mock', label: 'Full Mock', icon: Sparkles },
              { id: 'technical', label: 'Technical', icon: BookOpen },
              { id: 'behavioral', label: 'Behavioral', icon: Users },
              { id: 'resume_based', label: 'Resume-Based', icon: FileText },
              { id: 'mixed', label: 'Mixed Q&A', icon: Sparkles },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = interviewType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setInterviewType(t.id as InterviewType)}
                  style={{
                    background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.5)',
                    border: `1px solid ${isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: isSelected ? '#c7d2fe' : '#9ca3af',
                    borderRadius: '8px',
                    padding: '10px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <Icon size={18} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Resume Selection (if resume_based) */}
        {interviewType === 'resume_based' && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fbbf24' }}>
              Select Source Resume
            </label>
            {loadingResumes ? (
              <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Loading resumes...</div>
            ) : resumes.length === 0 ? (
              <div style={{ fontSize: '0.84rem', color: '#fca5a5' }}>
                No resumes found. Please create a resume in the <strong>Resume Builder</strong> first, or choose another practice mode.
              </div>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#f3f4f6',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title} ({r.targetRole || 'General'})
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* 4. Difficulty & Question Count Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Difficulty */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#d1d5db' }}>
              Difficulty Level
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['Beginner', 'Intermediate', 'Advanced'] as InterviewDifficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  style={{
                    flex: 1,
                    background: difficulty === d ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.5)',
                    border: `1px solid ${difficulty === d ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: difficulty === d ? '#c7d2fe' : '#9ca3af',
                    borderRadius: '6px',
                    padding: '8px 4px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#d1d5db' }}>
              Questions Count
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[5, 10, 15].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  style={{
                    flex: 1,
                    background: questionCount === count ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.5)',
                    border: `1px solid ${questionCount === count ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: questionCount === count ? '#c7d2fe' : '#9ca3af',
                    borderRadius: '6px',
                    padding: '8px 4px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Optional Timer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#d1d5db', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} /> Optional Question Timer
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { sec: 0, label: 'Untimed' },
              { sec: 30, label: '30s' },
              { sec: 60, label: '60s' },
              { sec: 90, label: '90s' },
              { sec: 120, label: '2 mins' },
            ].map((t) => (
              <button
                key={t.sec}
                type="button"
                onClick={() => setTimerSeconds(t.sec)}
                style={{
                  background: timerSeconds === t.sec ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.5)',
                  border: `1px solid ${timerSeconds === t.sec ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: timerSeconds === t.sec ? '#c7d2fe' : '#9ca3af',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Focus Areas Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#d1d5db' }}>
            Target Focus Competencies (Optional)
          </label>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestedSkills.map((skill) => {
              const isSelected = focusAreas.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleFocusArea(skill)}
                  style={{
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                    border: `1px solid ${isSelected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: isSelected ? '#6ee7b7' : '#9ca3af',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {isSelected && <Check size={12} />}
                  {skill}
                </button>
              );
            })}

            {focusAreas
              .filter((f) => !suggestedSkills.includes(f))
              .map((custom) => (
                <span
                  key={custom}
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    color: '#c7d2fe',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {custom}
                  <X
                    size={12}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFocusAreas((prev) => prev.filter((s) => s !== custom))}
                  />
                </span>
              ))}
          </div>

          {/* Add custom topic */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <input
              type="text"
              value={newFocusInput}
              onChange={(e) => setNewFocusInput(e.target.value)}
              placeholder="Add custom topic (e.g. Docker, Redux, System Design)..."
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                padding: '6px 12px',
                color: '#f3f4f6',
                fontSize: '0.84rem',
                outline: 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomFocus(e);
                }
              }}
            />
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleAddCustomFocus}
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <button type="button" className={styles.btnSecondary} onClick={onCancel} disabled={generating}>
            Cancel
          </button>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={generating || (interviewType === 'resume_based' && resumes.length === 0)}
            style={{ padding: '10px 24px', fontSize: '0.92rem' }}
          >
            {generating ? (
              <>
                <Loader2 size={16} className={styles.spinner} />
                Generating Questions with Gemini...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Interview Session
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
