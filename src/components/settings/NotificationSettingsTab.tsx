import React, { useState } from 'react';
import { Bell, Mail, Compass, GraduationCap, Award, HelpCircle, Lightbulb, Check, Loader2 } from 'lucide-react';
import type { IPreferencesData } from '../../types/settings.types';
import { SettingsApiService } from '../../services/settings.service';
import styles from './SettingsComponents.module.css';

interface NotificationSettingsTabProps {
  preferences: IPreferencesData;
  onRefresh: () => void;
}

export const NotificationSettingsTab: React.FC<NotificationSettingsTabProps> = ({
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
      setErrorMsg(err?.response?.data?.message || 'Failed to save notification preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.tabContentCard}>
      <div className={styles.tabHeader}>
        <div className={styles.tabIconBox}>
          <Bell size={20} />
        </div>
        <div>
          <h3 className={styles.tabTitle}>Notification Preferences</h3>
          <p className={styles.tabSubtitle}>
            Control the updates, learning reminders, and milestone alerts you receive.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className={styles.togglesList}>
        {/* Career Updates */}
        <div className={styles.toggleItemRow}>
          <div className={styles.toggleMeta}>
            <div className={styles.toggleIconWrap}>
              <Compass size={18} />
            </div>
            <div>
              <span className={styles.toggleTitle}>Career & Industry Insights</span>
              <p className={styles.toggleDesc}>
                Receive alerts when market trends, salary data, or skill requirements for your dream career shift.
              </p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={prefs.careerUpdates}
              onChange={() => handleToggle('careerUpdates')}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {/* Learning Reminders */}
        <div className={styles.toggleItemRow}>
          <div className={styles.toggleMeta}>
            <div className={styles.toggleIconWrap}>
              <GraduationCap size={18} />
            </div>
            <div>
              <span className={styles.toggleTitle}>Learning Hub Reminders</span>
              <p className={styles.toggleDesc}>
                Friendly periodic prompts to maintain your weekly study goals and completed resource streaks.
              </p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={prefs.learningReminders}
              onChange={() => handleToggle('learningReminders')}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {/* Assessment Reminders */}
        <div className={styles.toggleItemRow}>
          <div className={styles.toggleMeta}>
            <div className={styles.toggleIconWrap}>
              <Award size={18} />
            </div>
            <div>
              <span className={styles.toggleTitle}>Skill Verification & Assessment Alerts</span>
              <p className={styles.toggleDesc}>
                Notifications when new Phase 12 verification challenges or milestone assessments become available.
              </p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={prefs.assessmentReminders}
              onChange={() => handleToggle('assessmentReminders')}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {/* Interview Reminders */}
        <div className={styles.toggleItemRow}>
          <div className={styles.toggleMeta}>
            <div className={styles.toggleIconWrap}>
              <HelpCircle size={18} />
            </div>
            <div>
              <span className={styles.toggleTitle}>Interview Prep Practice Prompts</span>
              <p className={styles.toggleDesc}>
                Reminders to practice AI-evaluated technical and behavioral questions for your target roles.
              </p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={prefs.interviewReminders}
              onChange={() => handleToggle('interviewReminders')}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {/* Business & Startup Updates */}
        <div className={styles.toggleItemRow}>
          <div className={styles.toggleMeta}>
            <div className={styles.toggleIconWrap}>
              <Lightbulb size={18} />
            </div>
            <div>
              <span className={styles.toggleTitle}>Startup Opportunities & Grants</span>
              <p className={styles.toggleDesc}>
                Alerts on newly discovered student hackathons, venture grants, and founder resources.
              </p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={prefs.businessUpdates}
              onChange={() => handleToggle('businessUpdates')}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {/* Channels: Email & Weekly Digest */}
        <div className={styles.channelSection}>
          <h4 className={styles.channelSectionTitle}>Delivery Channels</h4>

          <div className={styles.toggleItemRow}>
            <div className={styles.toggleMeta}>
              <div className={styles.toggleIconWrap}>
                <Mail size={18} />
              </div>
              <div>
                <span className={styles.toggleTitle}>Weekly Progress Digest Email</span>
                <p className={styles.toggleDesc}>
                  A weekly consolidated email summarizing milestones achieved, verified skills earned, and next actions.
                </p>
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={prefs.weeklyReport}
                onChange={() => handleToggle('weeklyReport')}
              />
              <span className={styles.slider} />
            </label>
          </div>
        </div>

        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}
        {savedSuccess && (
          <div className={styles.successBanner}>
            <Check size={16} />
            <span>Notification preferences updated successfully!</span>
          </div>
        )}

        <div className={styles.formFooter}>
          <button type="submit" className={styles.saveButton} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 size={16} className={styles.spinIcon} />
                <span>Saving Preferences...</span>
              </>
            ) : (
              <span>Save Notification Settings</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
