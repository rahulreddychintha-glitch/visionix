import React, { useState } from 'react';
import { Brain, Sparkles, Shield, Check, Loader2, Info } from 'lucide-react';
import type { IPreferencesData } from '../../types/settings.types';
import { SettingsApiService } from '../../services/settings.service';
import styles from './SettingsComponents.module.css';

interface AiPreferencesTabProps {
  preferences: IPreferencesData;
  onRefresh: () => void;
}

export const AiPreferencesTab: React.FC<AiPreferencesTabProps> = ({
  preferences,
  onRefresh,
}) => {
  const [prefs, setPrefs] = useState<IPreferencesData>({ ...preferences });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggle = (key: keyof IPreferencesData) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      await SettingsApiService.updatePreferences(prefs);
      setSavedSuccess(true);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to save AI preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.tabContentCard}>
      <div className={styles.tabHeader}>
        <div className={styles.tabIconBox}>
          <Brain size={20} />
        </div>
        <div>
          <h3 className={styles.tabTitle}>AI Intelligence & Guidance Preferences</h3>
          <p className={styles.tabSubtitle}>
            Configure how Visionix uses Google Gemini AI models to personalize recommendations and generate insights.
          </p>
        </div>
      </div>

      <div className={styles.aiPrivacyNoticeBox}>
        <div className={styles.aiNoticeIconWrap}>
          <Shield size={18} />
        </div>
        <div className={styles.aiNoticeText}>
          <span className={styles.aiNoticeTitle}>Private & Grounded AI Architecture</span>
          <p className={styles.aiNoticeDesc}>
            All Gemini AI requests are securely processed server-side. Your profile data is used strictly to contextualize guidance and is never used to train third-party AI models. The system enforces strict anti-hallucination guardrails and treats your Phase 12 verified skills as authoritative.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className={styles.togglesList}>
        {/* AI Recommendations Enabled */}
        <div className={styles.toggleItemRow}>
          <div className={styles.toggleMeta}>
            <div className={styles.toggleIconWrap}>
              <Sparkles size={18} />
            </div>
            <div>
              <span className={styles.toggleTitle}>AI Career Matching & Recommendation Engine</span>
              <p className={styles.toggleDesc}>
                Enable AI-powered scoring and personalized rationale for the 75+ careers across Visionix.
              </p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={prefs.aiRecommendationsEnabled}
              onChange={() => handleToggle('aiRecommendationsEnabled')}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {/* Personalized AI Suggestions */}
        <div className={styles.toggleItemRow}>
          <div className={styles.toggleMeta}>
            <div className={styles.toggleIconWrap}>
              <Brain size={18} />
            </div>
            <div>
              <span className={styles.toggleTitle}>Contextual Skill Gap Insights</span>
              <p className={styles.toggleDesc}>
                Allow the AI Skill Coach to analyze your real profile, missing skills, and target role to generate custom action plans.
              </p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={prefs.aiPersonalizedSuggestions}
              onChange={() => handleToggle('aiPersonalizedSuggestions')}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {/* AI Learning Assistance */}
        <div className={styles.toggleItemRow}>
          <div className={styles.toggleMeta}>
            <div className={styles.toggleIconWrap}>
              <Info size={18} />
            </div>
            <div>
              <span className={styles.toggleTitle}>AI Interview Evaluation & Resume Optimization</span>
              <p className={styles.toggleDesc}>
                Enable AI scoring and constructive bullet-point wording suggestions for mock interviews and resumes.
              </p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={prefs.aiLearningAssistance}
              onChange={() => handleToggle('aiLearningAssistance')}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}
        {savedSuccess && (
          <div className={styles.successBanner}>
            <Check size={16} />
            <span>AI guidance preferences updated successfully!</span>
          </div>
        )}

        <div className={styles.formFooter}>
          <button type="submit" className={styles.saveButton} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 size={16} className={styles.spinIcon} />
                <span>Saving AI Preferences...</span>
              </>
            ) : (
              <span>Save AI Preferences</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
