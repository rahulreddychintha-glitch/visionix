import React, { useState } from 'react';
import { Moon, Sun, Monitor, Check, Loader2 } from 'lucide-react';
import type { IPreferencesData } from '../../types/settings.types';
import { useTheme, type ThemeMode } from '../../contexts/ThemeContext';
import styles from './SettingsComponents.module.css';

interface AppearanceSettingsTabProps {
  preferences: IPreferencesData;
  onRefresh: () => void;
}

export const AppearanceSettingsTab: React.FC<AppearanceSettingsTabProps> = ({
  onRefresh,
}) => {
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (selectedTheme: ThemeMode) => {
    setIsSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      await setTheme(selectedTheme, true);
      setSavedSuccess(true);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to update theme preference.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.tabContentCard}>
      <div className={styles.tabHeader}>
        <div className={styles.tabIconBox}>
          <Moon size={20} />
        </div>
        <div>
          <h3 className={styles.tabTitle}>Appearance & Theme</h3>
          <p className={styles.tabSubtitle}>
            Customize the look and visual theme of the Visionix platform.
          </p>
        </div>
      </div>

      <div className={styles.themeCardsGrid}>
        {/* Dark Theme Card */}
        <div
          className={`${styles.themeOptionCard} ${theme === 'dark' ? styles.themeOptionActive : ''}`}
          onClick={() => handleSave('dark')}
        >
          <div className={styles.themePreviewDark}>
            <div className={styles.mockSidebarDark} />
            <div className={styles.mockContentDark}>
              <div className={styles.mockLineDark} style={{ width: '60%' }} />
              <div className={styles.mockLineDark} style={{ width: '80%' }} />
            </div>
          </div>
          <div className={styles.themeOptionMeta}>
            <div className={styles.themeTitleRow}>
              <Moon size={16} className={styles.themeIconDark} />
              <span className={styles.themeTitle}>Dark Theme (Default)</span>
            </div>
            <p className={styles.themeDesc}>
              Deep space glassmorphic dark mode optimized for eye comfort and focused studying.
            </p>
            {theme === 'dark' && (
              <span className={styles.activeCheckBadge}>
                <Check size={14} /> Selected
              </span>
            )}
          </div>
        </div>

        {/* Light Theme Card */}
        <div
          className={`${styles.themeOptionCard} ${theme === 'light' ? styles.themeOptionActive : ''}`}
          onClick={() => handleSave('light')}
        >
          <div className={styles.themePreviewLight}>
            <div className={styles.mockSidebarLight} />
            <div className={styles.mockContentLight}>
              <div className={styles.mockLineLight} style={{ width: '60%' }} />
              <div className={styles.mockLineLight} style={{ width: '80%' }} />
            </div>
          </div>
          <div className={styles.themeOptionMeta}>
            <div className={styles.themeTitleRow}>
              <Sun size={16} className={styles.themeIconLight} />
              <span className={styles.themeTitle}>Light Theme</span>
            </div>
            <p className={styles.themeDesc}>
              High-contrast bright interface suitable for well-lit environments.
            </p>
            {theme === 'light' && (
              <span className={styles.activeCheckBadge}>
                <Check size={14} /> Selected
              </span>
            )}
          </div>
        </div>

        {/* System Theme Card */}
        <div
          className={`${styles.themeOptionCard} ${theme === 'system' ? styles.themeOptionActive : ''}`}
          onClick={() => handleSave('system')}
        >
          <div className={styles.themePreviewSystem}>
            <div className={styles.mockSidebarSystem} />
            <div className={styles.mockContentSystem}>
              <div className={styles.mockLineSystem} style={{ width: '70%' }} />
            </div>
          </div>
          <div className={styles.themeOptionMeta}>
            <div className={styles.themeTitleRow}>
              <Monitor size={16} className={styles.themeIconSystem} />
              <span className={styles.themeTitle}>System Preference</span>
            </div>
            <p className={styles.themeDesc}>
              Automatically syncs with your operating system dark/light configuration.
            </p>
            {theme === 'system' && (
              <span className={styles.activeCheckBadge}>
                <Check size={14} /> Selected
              </span>
            )}
          </div>
        </div>
      </div>

      {isSaving && (
        <div className={styles.savingNotice}>
          <Loader2 size={16} className={styles.spinIcon} />
          <span>Applying appearance preference...</span>
        </div>
      )}

      {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}
      {savedSuccess && (
        <div className={styles.successBanner}>
          <Check size={16} />
          <span>Theme preference updated successfully!</span>
        </div>
      )}
    </div>
  );
};
