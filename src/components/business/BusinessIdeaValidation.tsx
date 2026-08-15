import React, { useState, useEffect, useCallback } from 'react';
import type { IBusinessValidationResult } from '../../types/startupRoadmap.types';
import { StartupRoadmapApiService } from '../../services/startupRoadmap.service';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RotateCcw,
  Loader2,
  ShieldAlert,
  Compass,
} from 'lucide-react';
import styles from './BusinessIdeaValidation.module.css';

interface BusinessIdeaValidationProps {
  roadmapId?: string;
  businessIdeaId?: string;
  ventureTitle?: string;
}

export const BusinessIdeaValidation: React.FC<BusinessIdeaValidationProps> = ({
  roadmapId,
  businessIdeaId,
  ventureTitle: _ventureTitle,
}) => {
  const [validation, setValidation] = useState<IBusinessValidationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runValidation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await StartupRoadmapApiService.validateIdea({
        roadmapId,
        businessIdeaId,
      });
      setValidation(res);
    } catch (err: any) {
      console.error('Validation error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to complete validation.');
    } finally {
      setLoading(false);
    }
  }, [roadmapId, businessIdeaId]);

  useEffect(() => {
    runValidation();
  }, [runValidation]);

  const getMetricColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 55) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px', color: '#9ca3af' }}>
        <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: '#818cf8' }} />
        <span>Evaluating concept clarity, target customer segments, and execution risks...</span>
      </div>
    );
  }

  if (error || !validation) {
    return (
      <div
        style={{
          background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
          border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
          borderRadius: '14px',
          padding: '40px 24px',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '20px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <ShieldAlert size={36} style={{ color: '#f87171' }} />
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
          {error || 'Idea Validation Unavailable'}
        </h4>
        <button
          onClick={runValidation}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 18px',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
          }}
        >
          <RotateCcw size={14} /> Run Assessment
        </button>
      </div>
    );
  }

  const { validationScore, metricScores, summary, strengths, risks, missingInformation, recommendedSteps } = validation;

  return (
    <div className={styles.container}>
      {/* 1. Score & Summary Banner */}
      <div className={styles.scoreBanner}>
        <div className={styles.scoreLeft}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreNumber}>{validationScore}</span>
            <span className={styles.scoreLabel}>Score / 100</span>
          </div>

          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f3f4f6', margin: '0 0 4px 0' }}>
              Concept Validation Assessment
            </div>
            <div style={{ fontSize: '0.88rem', color: '#c7d2fe', maxWidth: '620px', lineHeight: 1.5 }}>
              {summary}
            </div>
          </div>
        </div>

        <button
          onClick={runValidation}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#d1d5db',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <RotateCcw size={13} /> Re-evaluate
        </button>
      </div>

      {/* 2. 5 Dimension Meters */}
      <div className={styles.metricsGrid}>
        {[
          { label: 'Problem Clarity', score: metricScores.problemClarity },
          { label: 'Solution Clarity', score: metricScores.solutionClarity },
          { label: 'Target Customer Segments', score: metricScores.targetCustomerClarity },
          { label: 'Technical Feasibility', score: metricScores.feasibility },
          { label: 'Market Differentiation', score: metricScores.differentiation },
        ].map((m, idx) => (
          <div key={idx} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span>{m.label}</span>
              <span style={{ color: getMetricColor(m.score) }}>{m.score}%</span>
            </div>
            <div className={styles.barBg}>
              <div
                className={styles.barFill}
                style={{
                  width: `${m.score}%`,
                  background: getMetricColor(m.score),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Strengths & Critical Risks Grid */}
      <div className={styles.sectionsGrid}>
        {/* Strengths */}
        <div className={styles.sectionCard} style={{ borderColor: 'rgba(16, 185, 129, 0.25)' }}>
          <h4 className={styles.sectionTitle} style={{ color: '#34d399' }}>
            <CheckCircle2 size={16} /> Key Concept Strengths
          </h4>
          <ul className={styles.list}>
            {strengths.map((st, idx) => (
              <li key={idx} className={styles.listItem}>
                <span style={{ color: '#34d399', fontWeight: 700 }}>✓</span>
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className={styles.sectionCard} style={{ borderColor: 'rgba(239, 68, 68, 0.25)' }}>
          <h4 className={styles.sectionTitle} style={{ color: '#f87171' }}>
            <AlertTriangle size={16} /> Critical Market & Execution Risks
          </h4>
          <ul className={styles.list}>
            {risks.map((rk, idx) => (
              <li key={idx} className={styles.listItem}>
                <span style={{ color: '#f87171', fontWeight: 700 }}>!</span>
                <span>{rk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Missing Information & Recommended Next Steps */}
      <div className={styles.sectionsGrid}>
        {/* Missing Facts */}
        <div className={styles.sectionCard} style={{ borderColor: 'rgba(245, 158, 11, 0.25)' }}>
          <h4 className={styles.sectionTitle} style={{ color: '#fbbf24' }}>
            <HelpCircle size={16} /> Information Needed to Validate
          </h4>
          <ul className={styles.list}>
            {missingInformation.map((info, idx) => (
              <li key={idx} className={styles.listItem}>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>?</span>
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Validation Experiments */}
        <div className={styles.sectionCard} style={{ borderColor: 'rgba(99, 102, 241, 0.25)' }}>
          <h4 className={styles.sectionTitle} style={{ color: '#818cf8' }}>
            <Compass size={16} /> Recommended Validation Experiments
          </h4>
          <ul className={styles.list}>
            {recommendedSteps.map((step, idx) => (
              <li key={idx} className={styles.listItem}>
                <span style={{ color: '#818cf8', fontWeight: 700 }}>→</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. Disclaimer */}
      <div className={styles.disclaimerBanner}>
        ℹ️ Note: This validation score is an AI-powered design assessment of problem-solution alignment and risk factors. True startup validation occurs through actual customer behavior, pilot tests, and verified willingness to pay.
      </div>
    </div>
  );
};
