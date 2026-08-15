import React, { useState, useEffect, useCallback } from 'react';
import type { IResume, IResumeAnalysis, IResumeSuggestedChange } from '../../types/resume.types';
import { ResumeService } from '../../services/resume.service';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Zap,
  Check,
  X,
  History,
  RotateCcw,
  Loader2,
  FileCheck,
} from 'lucide-react';
import styles from './ResumeAnalysis.module.css';

interface ResumeAnalysisProps {
  resume: IResume;
  onApplyChange: (updatedResume: IResume, message: string) => void;
}

export const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({
  resume,
  onApplyChange,
}) => {
  const [analysis, setAnalysis] = useState<IResumeAnalysis | null>(null);
  const [history, setHistory] = useState<IResumeAnalysis[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissedChangeIds, setDismissedChangeIds] = useState<string[]>([]);
  const [appliedChangeIds, setAppliedChangeIds] = useState<string[]>([]);

  // Load past analysis history
  const loadHistory = useCallback(async () => {
    if (!resume._id) return;
    try {
      setHistoryLoading(true);
      const data = await ResumeService.getAnalysisHistory(resume._id);
      setHistory(data.history || []);
      if (data.history && data.history.length > 0 && !analysis) {
        setAnalysis(data.history[0]);
      }
    } catch (err) {
      console.warn('Failed to load analysis history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [resume._id, analysis]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Run AI Resume Analysis
  const handleAnalyze = async () => {
    if (!resume._id) return;
    try {
      setLoading(true);
      setError(null);
      const result = await ResumeService.analyzeResume(resume._id);
      setAnalysis(result);
      setHistory((prev) => [result, ...prev]);
    } catch (err: any) {
      console.error('Error analyzing resume:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to complete AI resume analysis. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Switch displayed history record
  const handleSelectHistoryRecord = (analysisId: string) => {
    const found = history.find((h) => h._id === analysisId);
    if (found) {
      setAnalysis(found);
    }
  };

  // Safe Field Mutation by Path
  const handleApplyChange = (change: IResumeSuggestedChange) => {
    const cloned: IResume = JSON.parse(JSON.stringify(resume));
    const path = change.fieldPath.trim();

    try {
      if (path === 'summary') {
        cloned.summary = change.suggested;
      } else if (path === 'targetRole') {
        cloned.targetRole = change.suggested;
      } else if (path.startsWith('experience')) {
        // e.g. experience[0].description or experience[0].highlights[1]
        const expMatch = path.match(/experience\[(\d+)\](\.(description|position|company|highlights(\[(\d+)\])?))?/);
        if (expMatch) {
          const expIdx = parseInt(expMatch[1], 10);
          if (cloned.experience && cloned.experience[expIdx]) {
            if (path.includes('highlights')) {
              const hMatch = path.match(/highlights\[(\d+)\]/);
              if (hMatch && cloned.experience[expIdx].highlights) {
                const hIdx = parseInt(hMatch[1], 10);
                cloned.experience[expIdx].highlights![hIdx] = change.suggested;
              } else if (cloned.experience[expIdx].highlights) {
                cloned.experience[expIdx].highlights!.push(change.suggested);
              }
            } else {
              cloned.experience[expIdx].description = change.suggested;
            }
          }
        }
      } else if (path.startsWith('projects')) {
        // e.g. projects[0].description
        const projMatch = path.match(/projects\[(\d+)\]/);
        if (projMatch) {
          const projIdx = parseInt(projMatch[1], 10);
          if (cloned.projects && cloned.projects[projIdx]) {
            cloned.projects[projIdx].description = change.suggested;
          }
        }
      } else if (path.startsWith('skills.technical')) {
        if (change.suggested.includes(',')) {
          cloned.skills.technical = change.suggested.split(',').map((s) => s.trim()).filter(Boolean);
        } else {
          cloned.skills.technical = [...(cloned.skills.technical || []), change.suggested];
        }
      } else {
        // Fallback default to summary if matched
        if (change.section.toLowerCase().includes('summary')) {
          cloned.summary = change.suggested;
        }
      }

      setAppliedChangeIds((prev) => [...prev, change.id]);
      onApplyChange(cloned, `Applied AI suggestion to ${change.section}.`);
    } catch (applyErr) {
      console.error('Failed to apply suggested change:', applyErr);
    }
  };

  const handleDismiss = (changeId: string) => {
    setDismissedChangeIds((prev) => [...prev, changeId]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreBadgeText = (score: number) => {
    if (score >= 80) return 'Strong Profile';
    if (score >= 60) return 'Good Potential';
    return 'Needs Optimization';
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <Loader2 size={42} className={styles.spinner} />
          <h3 style={{ color: '#f3f4f6', margin: 0, fontSize: '1.2rem' }}>
            Auditing Resume with Gemini AI...
          </h3>
          <p style={{ maxWidth: '480px', margin: 0, fontSize: '0.9rem' }}>
            Evaluating content quality, ATS keyword compatibility, target role alignment, and action-oriented impact.
          </p>
        </div>
      </div>
    );
  }

  // 2. Idle State (No Analysis Yet)
  if (!analysis) {
    return (
      <div className={styles.container}>
        <div className={styles.idleCard}>
          <div className={styles.idleIconWrapper}>
            <Sparkles size={36} />
          </div>
          <h2 className={styles.idleTitle}>AI Resume Analysis & Optimization</h2>
          <p className={styles.idleText}>
            Get detailed ATS compatibility metrics, target role alignment scoring, prioritized improvements, and
            actionable phrasing recommendations computed directly from your authentic resume data.
          </p>
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '0.88rem',
              }}
            >
              {error}
            </div>
          )}
          <button
            className={styles.btnApply}
            onClick={handleAnalyze}
            style={{
              fontSize: '0.95rem',
              padding: '10px 24px',
              borderRadius: '8px',
              margin: '0 auto',
            }}
          >
            <Sparkles size={18} />
            Analyze Resume Now
          </button>
        </div>
      </div>
    );
  }

  const activeChanges = (analysis.suggestedChanges || []).filter(
    (c) => !dismissedChangeIds.includes(c.id) && !appliedChangeIds.includes(c.id)
  );

  return (
    <div className={styles.container}>
      {/* Top Action & History Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionLeft}>
          <button
            className={styles.btnApply}
            onClick={handleAnalyze}
            disabled={loading}
            title="Re-run AI analysis on the current saved resume"
          >
            <RotateCcw size={15} />
            Re-Analyze Resume
          </button>
          {history.length > 1 && (
            <div className={styles.historySelector}>
              <History size={15} />
              <span>Version:</span>
              <select
                className={styles.historySelect}
                value={analysis._id || ''}
                onChange={(e) => handleSelectHistoryRecord(e.target.value)}
                disabled={historyLoading}
              >
                {history.map((h, idx) => (
                  <option key={h._id || idx} value={h._id}>
                    {new Date(h.createdAt || Date.now()).toLocaleDateString()} — Score: {h.overallScore}/100
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          Analyzed {new Date(analysis.createdAt || Date.now()).toLocaleTimeString()}
        </div>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.88rem',
          }}
        >
          {error}
        </div>
      )}

      {/* 1. Hero Score Section */}
      <div className={styles.heroGrid}>
        <div className={styles.scoreCard}>
          <div
            className={styles.scoreCircle}
            style={{
              borderColor: getScoreColor(analysis.overallScore),
              boxShadow: `0 0 24px ${getScoreColor(analysis.overallScore)}33`,
            }}
          >
            <span className={styles.scoreNumber}>{analysis.overallScore}</span>
            <span className={styles.scoreMax}>/ 100</span>
          </div>
          <span
            className={styles.scoreLabel}
            style={{
              background: `${getScoreColor(analysis.overallScore)}22`,
              color: getScoreColor(analysis.overallScore),
              border: `1px solid ${getScoreColor(analysis.overallScore)}44`,
            }}
          >
            {getScoreBadgeText(analysis.overallScore)}
          </span>
        </div>

        <div className={styles.scoreSummaryCard}>
          <h3 className={styles.summaryTitle}>
            <FileCheck size={20} style={{ color: '#818cf8' }} /> Executive Evaluation
          </h3>
          <p className={styles.summaryText}>{analysis.summary}</p>

          {/* Target Role Alignment */}
          {analysis.targetRoleAlignment && (
            <div className={styles.alignmentBox}>
              <div className={styles.alignmentHeader}>
                <span className={styles.alignmentTitle}>
                  Target Role Alignment: <strong>{analysis.targetRoleAlignment.role}</strong>
                </span>
                <span className={styles.alignmentScore}>
                  {analysis.targetRoleAlignment.score} / 100
                </span>
              </div>
              <p className={styles.alignmentFeedback}>{analysis.targetRoleAlignment.feedback}</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Section Scores Breakdown */}
      {analysis.sectionScores && (
        <div className={styles.sectionScoresGrid}>
          {Object.entries(analysis.sectionScores).map(([sec, val]) => {
            const labelMap: Record<string, string> = {
              summary: 'Summary',
              experience: 'Experience',
              skills: 'Skills',
              projects: 'Projects',
              education: 'Education',
              overallStructure: 'Formatting & Structure',
            };
            const label = labelMap[sec] || sec;
            const scoreColor = getScoreColor(val);
            return (
              <div key={sec} className={styles.sectionScoreItem}>
                <div className={styles.sectionScoreHeader}>
                  <span>{label}</span>
                  <span style={{ color: scoreColor, fontWeight: 700 }}>{val}%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${val}%`, backgroundColor: scoreColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. ATS Compatibility Widget */}
      {analysis.ats && (
        <div className={styles.atsCard}>
          <div className={styles.atsHeader}>
            <h3 className={styles.atsTitle}>
              <ShieldCheck size={22} style={{ color: '#10b981' }} /> ATS (Applicant Tracking System) Compatibility
            </h3>
            <span
              className={styles.atsScoreBadge}
              style={{
                background: `${getScoreColor(analysis.ats.score)}22`,
                color: getScoreColor(analysis.ats.score),
                border: `1px solid ${getScoreColor(analysis.ats.score)}44`,
              }}
            >
              Likely ATS Score: {analysis.ats.score} / 100
            </span>
          </div>

          <div className={styles.atsColumns}>
            <div className={styles.atsBox}>
              <h4 className={styles.atsBoxTitle} style={{ color: '#6ee7b7' }}>
                <CheckCircle2 size={16} /> Positive Factors
              </h4>
              <ul className={styles.atsList}>
                {analysis.ats.positiveFactors?.map((pf, idx) => (
                  <li key={idx}>{pf}</li>
                ))}
              </ul>
            </div>

            <div className={styles.atsBox}>
              <h4 className={styles.atsBoxTitle} style={{ color: '#fca5a5' }}>
                <AlertTriangle size={16} /> Potential Issues / Missing Keywords
              </h4>
              <ul className={styles.atsList}>
                {analysis.ats.issues && analysis.ats.issues.length > 0 ? (
                  analysis.ats.issues.map((iss, idx) => <li key={idx}>{iss}</li>)
                ) : (
                  <li style={{ color: '#9ca3af' }}>No critical ATS parsing blockers identified.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. Strengths & Prioritized Improvements */}
      <div className={styles.twoColGrid}>
        {/* Strengths */}
        <div className={styles.contentCard}>
          <h3 className={styles.cardTitle} style={{ color: '#6ee7b7' }}>
            <Zap size={20} /> Identified Strengths ({analysis.strengths?.length || 0})
          </h3>
          <div className={styles.itemList}>
            {analysis.strengths?.map((st, idx) => (
              <div key={idx} className={styles.strengthItem}>
                <span className={styles.strengthItemTitle}>{st.title}</span>
                <p className={styles.strengthItemDesc}>{st.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prioritized Improvements */}
        <div className={styles.contentCard}>
          <h3 className={styles.cardTitle} style={{ color: '#fbbf24' }}>
            <TrendingUp size={20} /> Recommended Improvements ({analysis.improvements?.length || 0})
          </h3>
          <div className={styles.itemList}>
            {analysis.improvements?.map((imp, idx) => (
              <div key={idx} className={styles.improvementItem}>
                <div className={styles.improvementHeader}>
                  <span className={styles.improvementSection}>{imp.section}</span>
                  <span
                    className={`${styles.priorityBadge} ${
                      imp.priority === 'high'
                        ? styles.priorityHigh
                        : imp.priority === 'medium'
                        ? styles.priorityMedium
                        : styles.priorityLow
                    }`}
                  >
                    {imp.priority} priority
                  </span>
                </div>
                <p className={styles.improvementIssue}>{imp.issue}</p>
                <p className={styles.improvementRec}>
                  <strong>Action: </strong> {imp.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Interactive Suggested Changes */}
      {analysis.suggestedChanges && analysis.suggestedChanges.length > 0 && (
        <div className={styles.suggestedCard}>
          <h3 className={styles.cardTitle}>
            <Sparkles size={20} style={{ color: '#818cf8' }} />
            One-Click Suggested Phrasing ({activeChanges.length} available)
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.86rem', margin: '0 0 12px 0' }}>
            Review AI phrasing recommendations. Clicking <strong>Apply Change</strong> updates only the targeted field
            in your resume.
          </p>

          <div className={styles.itemList}>
            {analysis.suggestedChanges.map((change) => {
              const isApplied = appliedChangeIds.includes(change.id);
              const isDismissed = dismissedChangeIds.includes(change.id);

              if (isDismissed) return null;

              return (
                <div key={change.id} className={styles.suggestedItem}>
                  <div className={styles.suggestedHeader}>
                    <span className={styles.suggestedSectionName}>{change.section}</span>
                    <span className={styles.suggestedFieldPath}>{change.fieldPath}</span>
                  </div>

                  <div className={styles.diffContainer}>
                    {change.original && (
                      <div className={styles.originalBox}>
                        <span className={styles.originalLabel}>Current Text:</span>
                        <p className={styles.originalText}>{change.original}</p>
                      </div>
                    )}
                    <div className={styles.suggestedBox}>
                      <span className={styles.suggestedLabel}>Recommended Wording:</span>
                      <p className={styles.suggestedText}>{change.suggested}</p>
                    </div>
                  </div>

                  <p className={styles.reasonText}>
                    <strong>Why:</strong> {change.reason}
                  </p>

                  <div className={styles.suggestedActions}>
                    {isApplied ? (
                      <span style={{ color: '#34d399', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={16} /> Applied to Resume
                      </span>
                    ) : (
                      <>
                        <button
                          className={styles.btnDismiss}
                          onClick={() => handleDismiss(change.id)}
                          title="Hide this suggestion"
                        >
                          <X size={14} /> Dismiss
                        </button>
                        <button
                          className={styles.btnApply}
                          onClick={() => handleApplyChange(change)}
                          title="Apply this text to the target field in your resume"
                        >
                          <Check size={14} /> Apply Change
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
