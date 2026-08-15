import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Moon,
  Bell,
  Brain,
  ShieldCheck,
  FileJson,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { SettingsApiService } from '../services/settings.service';
import type { ISettingsResponse } from '../types/settings.types';
import { AccountSettingsTab } from '../components/settings/AccountSettingsTab';
import { AppearanceSettingsTab } from '../components/settings/AppearanceSettingsTab';
import { NotificationSettingsTab } from '../components/settings/NotificationSettingsTab';
import { AiPreferencesTab } from '../components/settings/AiPreferencesTab';
import { PrivacySecurityTab } from '../components/settings/PrivacySecurityTab';
import { DataManagementTab } from '../components/settings/DataManagementTab';
import styles from './SettingsPage.module.css';

type TabKey = 'account' | 'appearance' | 'notifications' | 'ai_preferences' | 'security' | 'data';

export const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'account';

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [settings, setSettings] = useState<ISettingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SettingsApiService.getSettings();
      setSettings(data);
    } catch (err: any) {
      console.error('[SettingsPage] Failed to load settings:', err);
      setError(err?.response?.data?.message || 'Failed to load user settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeaderRow}>
          <div className={styles.headerLeft}>
            <h1 className={styles.mainTitle}>Account & Platform Settings</h1>
            <p className={styles.subtitle}>
              Manage your personal preferences, notification alerts, AI controls, and account security.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className={styles.loadingContainer}>
            <Loader2 size={40} className={styles.loadingSpinner} />
            <span>Loading your settings and preferences...</span>
          </div>
        )}

        {!isLoading && error && (
          <div className={styles.errorCard}>
            <AlertCircle size={28} />
            <p>{error}</p>
            <button type="button" className={styles.retryButton} onClick={loadSettings}>
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {!isLoading && settings && (
          <div className={styles.settingsLayout}>
            {/* Sidebar Navigation */}
            <div className={styles.settingsSidebar}>
              <button
                type="button"
                className={`${styles.sidebarTabBtn} ${activeTab === 'account' ? styles.sidebarTabBtnActive : ''}`}
                onClick={() => handleTabChange('account')}
              >
                <User size={16} />
                <span>Account & Profile</span>
              </button>

              <button
                type="button"
                className={`${styles.sidebarTabBtn} ${activeTab === 'appearance' ? styles.sidebarTabBtnActive : ''}`}
                onClick={() => handleTabChange('appearance')}
              >
                <Moon size={16} />
                <span>Appearance & Theme</span>
              </button>

              <button
                type="button"
                className={`${styles.sidebarTabBtn} ${activeTab === 'notifications' ? styles.sidebarTabBtnActive : ''}`}
                onClick={() => handleTabChange('notifications')}
              >
                <Bell size={16} />
                <span>Notifications</span>
              </button>

              <button
                type="button"
                className={`${styles.sidebarTabBtn} ${activeTab === 'ai_preferences' ? styles.sidebarTabBtnActive : ''}`}
                onClick={() => handleTabChange('ai_preferences')}
              >
                <Brain size={16} />
                <span>AI Preferences</span>
              </button>

              <button
                type="button"
                className={`${styles.sidebarTabBtn} ${activeTab === 'security' ? styles.sidebarTabBtnActive : ''}`}
                onClick={() => handleTabChange('security')}
              >
                <ShieldCheck size={16} />
                <span>Privacy & Security</span>
              </button>

              <button
                type="button"
                className={`${styles.sidebarTabBtn} ${activeTab === 'data' ? styles.sidebarTabBtnActive : ''}`}
                onClick={() => handleTabChange('data')}
              >
                <FileJson size={16} />
                <span>Data Management</span>
              </button>
            </div>

            {/* Content Area */}
            <div className={styles.settingsContentArea}>
              <AnimatePresence mode="wait">
                {activeTab === 'account' && (
                  <motion.div
                    key="tab-account"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AccountSettingsTab
                      account={settings.account}
                      profile={settings.profile}
                      onRefresh={loadSettings}
                    />
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div
                    key="tab-appearance"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AppearanceSettingsTab
                      preferences={settings.preferences}
                      onRefresh={loadSettings}
                    />
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    key="tab-notifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NotificationSettingsTab
                      preferences={settings.preferences}
                      onRefresh={loadSettings}
                    />
                  </motion.div>
                )}

                {activeTab === 'ai_preferences' && (
                  <motion.div
                    key="tab-ai-preferences"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AiPreferencesTab
                      preferences={settings.preferences}
                      onRefresh={loadSettings}
                    />
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="tab-security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PrivacySecurityTab />
                  </motion.div>
                )}

                {activeTab === 'data' && (
                  <motion.div
                    key="tab-data"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DataManagementTab />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
