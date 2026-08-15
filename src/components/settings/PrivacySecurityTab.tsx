import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  LogOut,
  Check,
  Loader2,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { SettingsApiService } from '../../services/settings.service';
import { useAuth } from '../../hooks/useAuth';
import styles from './SettingsComponents.module.css';

export const PrivacySecurityTab: React.FC = () => {
  const { user, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form submission & feedback
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const isValidEmail = (val: string) => /^\S+@\S+\.\S+$/.test(val.trim());
  const isLengthValid = newPassword.length >= 8;
  const isMatchValid = newPassword.length > 0 && newPassword === confirmPassword;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setPassSuccess(false);

    if (!email.trim() || !isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address associated with your account.');
      return;
    }

    if (!oldPassword) {
      setErrorMsg('Please enter your current password.');
      return;
    }

    if (!isLengthValid) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match. Please verify.');
      return;
    }

    setIsChangingPass(true);

    try {
      await SettingsApiService.changePassword(
        email.trim(),
        oldPassword,
        newPassword,
        confirmPassword
      );
      setPassSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(false), 5000);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          'Failed to update password. Please verify your email and current password.'
      );
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className={styles.tabContentCard}>
      <div className={styles.tabHeader}>
        <div className={styles.tabIconBox}>
          <ShieldCheck size={20} />
        </div>
        <div>
          <h3 className={styles.tabTitle}>Privacy & Security</h3>
          <p className={styles.tabSubtitle}>
            Manage your account password, active authentication session, and security standards.
          </p>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className={styles.securityGrid}>
        <div className={styles.securityItemCard}>
          <div className={styles.securityIconBox}>
            <Lock size={18} />
          </div>
          <div>
            <span className={styles.securityTitle}>Encrypted Password Security</span>
            <p className={styles.securityDesc}>
              Passwords are cryptographically salted and hashed using bcrypt (10 rounds). Plain text passwords are never stored or returned.
            </p>
          </div>
        </div>

        <div className={styles.securityItemCard}>
          <div className={styles.securityIconBox}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className={styles.securityTitle}>JWT Stateless Authentication</span>
            <p className={styles.securityDesc}>
              Session tokens are cryptographically verified per request on the backend with user ownership validation.
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className={styles.passwordSection}>
        <div className={styles.sectionHeaderRow}>
          <KeyRound size={18} className={styles.sectionIcon} />
          <div>
            <h4 className={styles.innerSectionTitle}>CHANGE PASSWORD</h4>
            <p className={styles.innerSectionSubtitle}>
              Update your account password by verifying your email and current credentials.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
          {/* 1. Email Address */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <Mail size={14} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.textInput}
              placeholder="Enter your Visionix account email"
            />
            <span className={styles.inputHint}>
              Enter the email address associated with your Visionix account.
            </span>
          </div>

          {/* 2. Current Password */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <Lock size={14} />
              <span>Current Password</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className={styles.passwordInputWithToggle}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className={styles.passwordToggleBtn}
                onClick={() => setShowOldPassword((prev) => !prev)}
                title={showOldPassword ? 'Hide password' : 'Show password'}
                aria-label={showOldPassword ? 'Hide password' : 'Show password'}
              >
                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 3. New Password */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <KeyRound size={14} />
              <span>New Password (min 8 characters)</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className={styles.passwordInputWithToggle}
                placeholder="Enter new password (at least 8 characters)"
              />
              <button
                type="button"
                className={styles.passwordToggleBtn}
                onClick={() => setShowNewPassword((prev) => !prev)}
                title={showNewPassword ? 'Hide password' : 'Show password'}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {newPassword.length > 0 && (
              <div className={styles.validationRow}>
                {isLengthValid ? (
                  <span className={styles.validText}>
                    <Check size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Password meets minimum length requirement (8+ characters)
                  </span>
                ) : (
                  <span className={styles.invalidText}>
                    <AlertCircle size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Must be at least 8 characters ({8 - newPassword.length} more needed)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 4. Confirm New Password */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <KeyRound size={14} />
              <span>Confirm New Password</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className={styles.passwordInputWithToggle}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className={styles.passwordToggleBtn}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <div className={styles.validationRow}>
                {isMatchValid ? (
                  <span className={styles.validText}>
                    <Check size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Passwords match
                  </span>
                ) : (
                  <span className={styles.invalidText}>
                    <AlertCircle size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Passwords do not match yet
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className={styles.errorBanner}>
              <AlertCircle size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {passSuccess && (
            <div className={styles.successBanner}>
              <Check size={16} />
              <span>Your password has been changed successfully!</span>
            </div>
          )}

          {/* Action Button */}
          <div className={styles.formFooter}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isChangingPass || !newPassword || !oldPassword || !confirmPassword || !email}
            >
              {isChangingPass ? (
                <>
                  <Loader2 size={16} className={styles.spinIcon} />
                  <span>Changing Password...</span>
                </>
              ) : (
                <span>Change Password</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Session Controls */}
      <div className={styles.sessionSection}>
        <div className={styles.sessionHeaderRow}>
          <div>
            <h4 className={styles.innerSectionTitle}>Current Session</h4>
            <p className={styles.innerSectionSubtitle}>
              You are currently signed in to Visionix on this device.
            </p>
          </div>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={logout}
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
