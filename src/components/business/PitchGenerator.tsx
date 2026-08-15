import React, { useState, useEffect, useCallback } from 'react';
import type { IPitchGenerationResult } from '../../types/startupRoadmap.types';
import { StartupRoadmapApiService } from '../../services/startupRoadmap.service';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  Clock,
  Layers,
  Briefcase,
} from 'lucide-react';
import styles from './PitchGenerator.module.css';

interface PitchGeneratorProps {
  roadmapId?: string;
  businessIdeaId?: string;
  ventureTitle?: string;
}

type PitchTab = 'one_liner' | 'elevator' | 'pitch_deck' | 'business_plan';

export const PitchGenerator: React.FC<PitchGeneratorProps> = ({
  roadmapId,
  businessIdeaId,
  ventureTitle: _ventureTitle,
}) => {
  const [activeTab, setActiveTab] = useState<PitchTab>('one_liner');
  const [pitchData, setPitchData] = useState<Record<PitchTab, IPitchGenerationResult | null>>({
    one_liner: null,
    elevator: null,
    pitch_deck: null,
    business_plan: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = useCallback(async (type: PitchTab = activeTab) => {
    try {
      setLoading(true);
      const res = await StartupRoadmapApiService.generatePitch({
        pitchType: type,
        roadmapId,
        businessIdeaId,
      });
      setPitchData((prev) => ({ ...prev, [type]: res }));
    } catch (err) {
      console.error('Failed to generate pitch:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, roadmapId, businessIdeaId]);

  useEffect(() => {
    if (!pitchData[activeTab]) {
      handleGenerate(activeTab);
    }
  }, [activeTab, pitchData, handleGenerate]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const currentResult = pitchData[activeTab];

  const getFullCopyText = () => {
    if (!currentResult) return '';
    if (activeTab === 'one_liner') return currentResult.oneLiner || '';
    if (activeTab === 'elevator') return currentResult.elevatorPitch || '';
    return currentResult.sections
      .map((s) => `## ${s.title}\n${s.content}`)
      .join('\n\n');
  };

  return (
    <div className={styles.container}>
      {/* 1. Toolbar with Pitch Format Tabs & Generate Action */}
      <div className={styles.toolbar}>
        <div className={styles.tabsRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'one_liner' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('one_liner')}
          >
            <Sparkles size={14} /> One-Line Pitch
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'elevator' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('elevator')}
          >
            <Clock size={14} /> 60s Elevator Pitch
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'pitch_deck' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('pitch_deck')}
          >
            <Layers size={14} /> 10-Slide Pitch Deck
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'business_plan' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('business_plan')}
          >
            <Briefcase size={14} /> Business Plan Draft
          </button>
        </div>

        <button
          className={styles.generateBtn}
          onClick={() => handleGenerate(activeTab)}
          disabled={loading}
        >
          {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <RotateCcw size={15} />}
          <span>{currentResult ? 'Regenerate Draft' : 'Generate'}</span>
        </button>
      </div>

      {/* 2. Content Display or Loading State */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px', color: '#9ca3af' }}>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: '#818cf8' }} />
          <span>Structuring pitch content from verified venture details...</span>
        </div>
      ) : !currentResult ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          Click Generate to create your {activeTab.replace('_', ' ')}.
        </div>
      ) : (
        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.pitchTitle}>{currentResult.title}</h3>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
                Format: <strong style={{ color: '#818cf8', textTransform: 'capitalize' }}>{activeTab.replace('_', ' ')}</strong>
              </div>
            </div>

            <button
              className={styles.copyBtn}
              onClick={() => handleCopy(getFullCopyText(), 'all')}
            >
              {copiedSection === 'all' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedSection === 'all' ? 'Copied Full Draft' : 'Copy All'}</span>
            </button>
          </div>

          {/* Render One-Liner */}
          {activeTab === 'one_liner' && (
            <div className={styles.sectionBlock}>
              <h4 className={styles.sectionHeading}>One-Line Value Proposition</h4>
              <p className={styles.sectionContent} style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f3f4f6' }}>
                "{currentResult.oneLiner}"
              </p>
            </div>
          )}

          {/* Render Elevator Pitch */}
          {activeTab === 'elevator' && (
            <div className={styles.sectionBlock}>
              <h4 className={styles.sectionHeading}>60-Second Founder Narrative</h4>
              <p className={styles.sectionContent}>{currentResult.elevatorPitch}</p>
            </div>
          )}

          {/* Render Slide / Business Plan Sections */}
          {(activeTab === 'pitch_deck' || activeTab === 'business_plan') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {currentResult.sections.map((sec, idx) => (
                <div key={idx} className={styles.sectionBlock}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className={styles.sectionHeading}>
                      {activeTab === 'pitch_deck' ? `Slide ${idx + 1}: ` : ''}{sec.title}
                    </h4>

                    <button
                      type="button"
                      onClick={() => handleCopy(sec.content, `sec-${idx}`)}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}
                    >
                      {copiedSection === `sec-${idx}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedSection === `sec-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className={styles.sectionContent}>{sec.content}</p>

                  {sec.missingFields && sec.missingFields.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {sec.missingFields.map((field, fIdx) => (
                        <span
                          key={fIdx}
                          style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            color: '#fbbf24',
                            fontSize: '0.72rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          Need: {field}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
