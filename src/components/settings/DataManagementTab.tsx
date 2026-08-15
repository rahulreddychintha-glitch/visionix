import React, { useState } from 'react';
import { Download, Trash2, AlertTriangle, Check, Loader2, FileJson, X } from 'lucide-react';
import { SettingsApiService } from '../../services/settings.service';
import { useAuth } from '../../hooks/useAuth';
import styles from './SettingsComponents.module.css';

export const DataManagementTab: React.FC = () => {
  const { logout } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Delete account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await SettingsApiService.exportUserData();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err: any) {
      alert('Failed to export user data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword.trim()) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await SettingsApiService.deleteAccount(deletePassword);
      logout();
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message || 'Incorrect password. Account deletion aborted.');
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.tabContentCard}>
      <div className={styles.tabHeader}>
        <div className={styles.tabIconBox}>
          <FileJson size={20} />
        </div>
        <div>
          <h3 className={styles.tabTitle}>Data Management & Account Control</h3>
          <p className={styles.tabSubtitle}>
            Download a portable copy of your Visionix data or permanently delete your account.
          </p>
        </div>
      </div>

      {/* Export Section */}
      <div className={styles.dataManagementBox}>
        <div className={styles.dataBoxHeader}>
          <div className={styles.dataBoxIcon}>
            <Download size={20} />
          </div>
          <div>
            <h4 className={styles.dataBoxTitle}>Export Visionix Data Archive</h4>
            <p className={styles.dataBoxDesc}>
              Download a complete JSON export of your profile details, created resumes, AI resume audits, interview performance history, roadmap stages, and verified skills.
            </p>
          </div>
        </div>

        <div className={styles.dataBoxAction}>
          <button
            type="button"
            className={styles.exportButton}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className={styles.spinIcon} />
                <span>Generating Export Archive...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download JSON Archive</span>
              </>
            )}
          </button>
        </div>

        {exportSuccess && (
          <div className={styles.successBanner} style={{ marginTop: '12px' }}>
            <Check size={16} />
            <span>Your complete data export has been downloaded successfully!</span>
          </div>
        )}
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className={`${styles.dataManagementBox} ${styles.dangerZoneBox}`}>
        <div className={styles.dataBoxHeader}>
          <div className={styles.dangerIcon}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className={styles.dangerTitle}>Danger Zone: Delete Account</h4>
            <p className={styles.dangerDesc}>
              Permanently delete your user profile, saved careers, active roadmaps, verified skill credentials, interview records, and resumes. This action is immediate and cannot be undone.
            </p>
          </div>
        </div>

        <div className={styles.dataBoxAction}>
          <button
            type="button"
            className={styles.deleteAccountButton}
            onClick={() => {
              setIsDeleteModalOpen(true);
              setDeletePassword('');
              setDeleteError(null);
            }}
          >
            <Trash2 size={16} />
            <span>Delete My Account</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.deleteModalCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalDangerIcon}>
                <AlertTriangle size={24} />
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <h3 className={styles.modalTitle}>Confirm Permanent Account Deletion</h3>
            <p className={styles.modalWarningText}>
              Are you absolutely sure you want to delete your Visionix account? All your verified skills, resumes, interview practice sessions, and startup roadmap data will be permanently erased.
            </p>

            <form onSubmit={handleDeleteAccount}>
              <div className={styles.modalInputGroup}>
                <label className={styles.modalLabel}>Enter your password to confirm:</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  placeholder="Your account password"
                  className={styles.modalTextInput}
                />
              </div>

              {deleteError && <div className={styles.modalErrorBanner}>{deleteError}</div>}

              <div className={styles.modalButtonsRow}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalConfirmDeleteBtn}
                  disabled={!deletePassword.trim() || isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className={styles.spinIcon} />
                      <span>Deleting Account...</span>
                    </>
                  ) : (
                    <span>Permanently Delete</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
