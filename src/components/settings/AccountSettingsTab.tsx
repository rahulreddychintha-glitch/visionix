import React, { useState } from 'react';
import { User, Mail, GraduationCap, Briefcase, MapPin, Check, Loader2 } from 'lucide-react';
import type { IAccountData, IProfileData } from '../../types/settings.types';
import { SettingsApiService } from '../../services/settings.service';
import styles from './SettingsComponents.module.css';

interface AccountSettingsTabProps {
  account: IAccountData;
  profile: IProfileData;
  onRefresh: () => void;
}

export const AccountSettingsTab: React.FC<AccountSettingsTabProps> = ({
  account,
  profile,
  onRefresh,
}) => {
  const [fullName, setFullName] = useState(account.fullName || '');
  const [stream, setStream] = useState(profile?.education?.stream || '');
  const [specialization, setSpecialization] = useState(profile?.education?.branchSpecialization || '');
  const [occupation, setOccupation] = useState(profile?.education?.currentOccupation || '');
  const [level, setLevel] = useState(profile?.education?.level || 'Undergraduate');
  const [institution, setInstitution] = useState(profile?.education?.institution || '');
  const [city, setCity] = useState(profile?.personal?.city || '');
  const [country, setCountry] = useState(profile?.personal?.country || '');
  const [dreamCareer, setDreamCareer] = useState(profile?.careerGoals?.dreamCareer || '');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      await SettingsApiService.updateAccountProfile({
        fullName,
        personal: {
          city,
          country,
        },
        education: {
          stream,
          branchSpecialization: specialization,
          currentOccupation: occupation,
          level,
          institution,
        },
        careerGoals: {
          dreamCareer,
        },
      });

      setSavedSuccess(true);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to update account profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.tabContentCard}>
      <div className={styles.tabHeader}>
        <div className={styles.tabIconBox}>
          <User size={20} />
        </div>
        <div>
          <h3 className={styles.tabTitle}>Account & Profile Settings</h3>
          <p className={styles.tabSubtitle}>
            Manage your personal identity, academic background, and career goals.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Email - Read-only */}
        <div className={styles.inputGroupFull}>
          <label className={styles.inputLabel}>
            <Mail size={14} />
            <span>Email Address (Verified Account)</span>
          </label>
          <input
            type="email"
            value={account.email}
            disabled
            className={`${styles.textInput} ${styles.inputDisabled}`}
          />
          <span className={styles.inputHint}>Email is linked to your authentication credentials and cannot be changed here.</span>
        </div>

        {/* Full Name */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            <User size={14} />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={styles.textInput}
            placeholder="Your full name"
          />
        </div>

        {/* Dream Career */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            <Briefcase size={14} />
            <span>Dream / Target Career</span>
          </label>
          <input
            type="text"
            value={dreamCareer}
            onChange={(e) => setDreamCareer(e.target.value)}
            className={styles.textInput}
            placeholder="e.g. Software Engineer, AI Engineer"
          />
        </div>

        {/* Field of Study / Stream */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            <GraduationCap size={14} />
            <span>Field of Study / Stream</span>
          </label>
          <input
            type="text"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            className={styles.textInput}
            placeholder="e.g. Computer Science, Engineering, Medicine"
          />
        </div>

        {/* Specialization */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            <GraduationCap size={14} />
            <span>Branch / Specialization</span>
          </label>
          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className={styles.textInput}
            placeholder="e.g. Artificial Intelligence, Mechanical"
          />
        </div>

        {/* Current Role / Occupation */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            <Briefcase size={14} />
            <span>Current Role / Occupation</span>
          </label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className={styles.textInput}
            placeholder="e.g. Student, Developer, Freelancer"
          />
        </div>

        {/* Education Level */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Education Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className={styles.selectInput}
          >
            <option value="High School">High School / Secondary</option>
            <option value="Undergraduate">Undergraduate (B.Tech / B.Sc / B.Com / etc.)</option>
            <option value="Postgraduate">Postgraduate (M.Tech / M.Sc / MBA / etc.)</option>
            <option value="Doctorate">Doctorate / Ph.D.</option>
            <option value="Working Professional">Working Professional</option>
          </select>
        </div>

        {/* Institution */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>College / Institution</label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className={styles.textInput}
            placeholder="University or College name"
          />
        </div>

        {/* Location - City & Country */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            <MapPin size={14} />
            <span>City</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={styles.textInput}
            placeholder="City"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            <MapPin size={14} />
            <span>Country</span>
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={styles.textInput}
            placeholder="Country"
          />
        </div>

        {/* Status messages */}
        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}
        {savedSuccess && (
          <div className={styles.successBanner}>
            <Check size={16} />
            <span>Account and profile details saved successfully!</span>
          </div>
        )}

        <div className={styles.formFooter}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className={styles.spinIcon} />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Account Settings</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
