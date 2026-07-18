import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { ProgressBar } from '../components/onboarding/ProgressBar';
import { WelcomeStep } from '../components/onboarding/WelcomeStep';
import { EducationStep } from '../components/onboarding/EducationStep';
import { InterestsStep } from '../components/onboarding/InterestsStep';
import { CareerGoalsStep } from '../components/onboarding/CareerGoalsStep';
import { FinishStep } from '../components/onboarding/FinishStep';
import { UserService } from '../services/user.service';
import { Check, AlertCircle } from 'lucide-react';
import styles from './OnboardingPage.module.css';

const initialState = {
  personal: {
    fullName: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    state: '',
    city: '',
  },
  education: {
    level: '',
    institution: '', // Maps to Current Class / Year
    stream: '',
    graduationYear: '',
  },
  interests: {
    careerInterests: [],
    favouriteSubjects: [],
    technologies: [],
    industries: [],
  },
  skills: {
    technicalSkills: [],
    softSkills: [],
    languages: [],
    skillLevels: {},
  },
  careerGoals: {
    dreamCareer: '',
    preferredIndustries: [], // Target Industry select
    salaryGoal: '',
    careerObjectives: '', // Primary Goal select
  },
  learningPreferences: {
    learningStyle: '',
    weeklyStudyTime: '',
    preferredResources: [],
  },
  workPreferences: {
    remoteHybridOffice: '',
    startupEnterprise: '',
    teamSize: '',
  },
  onboarding: {
    currentStep: 0,
    completed: false,
  },
};

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading: contextLoading, loadProfile, saveProfile, currentStep, setCurrentStep } = useProfile();
  
  const [formData, setFormData] = useState<any>(initialState);
  const [localErrors, setLocalErrors] = useState<any>({});
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [apiError, setApiError] = useState<string | null>(null);

  const isDirtyRef = useRef(false);
  const formDataRef = useRef(formData);
  const currentStepRef = useRef(currentStep);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  // Load initial profile data on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Sync profile values into local form state when loaded
  useEffect(() => {
    if (profile) {
      setFormData((prev: any) => ({
        ...prev,
        personal: { ...prev.personal, ...(profile.personal || {}) },
        education: { ...prev.education, ...(profile.education || {}) },
        interests: {
          careerInterests: profile.interests?.careerInterests || [],
          favouriteSubjects: profile.interests?.favouriteSubjects || [],
          technologies: profile.interests?.technologies || [],
          industries: profile.interests?.industries || [],
        },
        skills: {
          technicalSkills: profile.skills?.technicalSkills || [],
          softSkills: profile.skills?.softSkills || [],
          languages: profile.skills?.languages || [],
          skillLevels: profile.skills?.skillLevels || {},
        },
        careerGoals: { ...prev.careerGoals, ...(profile.careerGoals || {}) },
        learningPreferences: { ...prev.learningPreferences, ...(profile.learningPreferences || {}) },
        workPreferences: { ...prev.workPreferences, ...(profile.workPreferences || {}) },
        onboarding: { ...prev.onboarding, ...(profile.onboarding || {}) },
      }));
    }
  }, [profile]);

  // Handle unload changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to refresh?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // Silently pre-populate database-required fields for final submission API validators
  const prefillRequiredDatabaseFields = (data: any) => {
    const currentYear = new Date().getFullYear();
    return {
      ...data,
      personal: {
        ...data.personal,
        dateOfBirth: data.personal?.dateOfBirth || '2000-01-01T00:00:00.000Z',
        country: data.personal?.country || 'Not Specified',
        state: data.personal?.state || 'Not Specified',
        city: data.personal?.city || 'Not Specified',
      },
      education: {
        ...data.education,
        graduationYear: data.education?.graduationYear || currentYear,
      },
      learningPreferences: {
        ...data.learningPreferences,
        learningStyle: data.learningPreferences?.learningStyle || 'Practical',
        weeklyStudyTime: data.learningPreferences?.weeklyStudyTime ?? 0,
      },
      workPreferences: {
        ...data.workPreferences,
        startupEnterprise: data.workPreferences?.startupEnterprise || 'Growth-stage Scaleup',
        teamSize: data.workPreferences?.teamSize || 'Medium',
      },
      careerGoals: {
        ...data.careerGoals,
        salaryGoal: data.careerGoals?.salaryGoal || 'Not Specified',
      }
    };
  };

  // Perform a silent autosave draft
  const performAutosave = useCallback(async (data: any, stepNum: number) => {
    if (!isDirtyRef.current) return;

    setSaveStatus('saving');
    try {
      await saveProfile({
        ...data,
        onboarding: {
          ...data.onboarding,
          currentStep: stepNum,
          completed: false,
        },
      }, false);

      isDirtyRef.current = false;
      setIsDirty(false);
      setSaveStatus('saved');
      setApiError(null);

      setTimeout(() => {
        setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
      }, 2500);
    } catch (err: any) {
      setSaveStatus('error');
      setApiError(err.response?.data?.message || 'Failed to autosave changes.');
    }
  }, [saveProfile]);

  // Periodic autosave loop (every 25 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStepRef.current > 0 && isDirtyRef.current && !submitLoading) {
        performAutosave(formDataRef.current, currentStepRef.current);
      }
    }, 25000);

    return () => {
      clearInterval(interval);
    };
  }, [performAutosave, submitLoading]);

  // Save changes silently on component unmount
  useEffect(() => {
    return () => {
      if (isDirtyRef.current && currentStepRef.current > 0) {
        const payload = {
          ...formDataRef.current,
          onboarding: {
            ...formDataRef.current.onboarding,
            currentStep: currentStepRef.current,
            completed: false,
          },
        };
        UserService.saveProfile(payload).catch(() => {});
      }
    };
  }, []);

  const handleStateChange = (section: string, fields: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: fields,
    }));
    
    isDirtyRef.current = true;
    setIsDirty(true);
    
    if (localErrors && Object.keys(localErrors).length > 0) {
      setLocalErrors({});
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: any = {};
    let isValid = true;

    if (step === 1) {
      const p = formData.personal || {};
      const e = formData.education || {};
      if (!p.fullName || p.fullName.trim().length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
        isValid = false;
      }
      if (!e.level) {
        errors.level = 'Education level is required';
        isValid = false;
      }
      if (!e.institution) { // Current Class / Year
        errors.institution = 'Current Class / Year is required';
        isValid = false;
      }
      if (!e.stream) {
        errors.stream = 'Major / stream is required';
        isValid = false;
      }
    }

    if (step === 3) {
      const c = formData.careerGoals || {};
      if (!c.dreamCareer || !c.dreamCareer.trim()) {
        errors.dreamCareer = 'Dream career is required';
        isValid = false;
      }
      if (!c.preferredIndustries || c.preferredIndustries.length === 0 || !c.preferredIndustries[0]) {
        errors.preferredIndustries = 'Target industry is required';
        isValid = false;
      }
      if (!c.careerObjectives) { // Primary Goal
        errors.careerObjectives = 'Primary goal is required';
        isValid = false;
      }
    }

    setLocalErrors(errors);
    return isValid;
  };

  const validateAllSteps = (): boolean => {
    let allValid = true;
    const errors: any = {};

    const p = formData.personal || {};
    const e = formData.education || {};
    if (!p.fullName || p.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
      allValid = false;
    }
    if (!e.level) {
      errors.level = 'Education level is required';
      allValid = false;
    }
    if (!e.institution) {
      errors.institution = 'Class / Year is required';
      allValid = false;
    }
    if (!e.stream) {
      errors.stream = 'Stream is required';
      allValid = false;
    }

    const c = formData.careerGoals || {};
    if (!c.dreamCareer || !c.dreamCareer.trim()) {
      errors.dreamCareer = 'Dream career is required';
      allValid = false;
    }
    if (!c.preferredIndustries || c.preferredIndustries.length === 0 || !c.preferredIndustries[0]) {
      errors.preferredIndustries = 'Target industry is required';
      allValid = false;
    }
    if (!c.careerObjectives) {
      errors.careerObjectives = 'Primary goal is required';
      allValid = false;
    }

    setLocalErrors(errors);
    return allValid;
  };

  const handleNext = async () => {
    if (currentStep > 0 && !validateStep(currentStep)) {
      return;
    }

    if (currentStep === 4) {
      if (!validateAllSteps()) {
        setApiError('Onboarding contains incomplete fields. Please verify all sections.');
        return;
      }

      setSubmitLoading(true);
      setApiError(null);
      try {
        const finalPayload = prefillRequiredDatabaseFields(formData);
        await saveProfile(finalPayload, true);
        isDirtyRef.current = false;
        setIsDirty(false);
        setShowSuccess(true);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (err: any) {
        setApiError(err.response?.data?.message || 'Failed to submit onboarding profile.');
      } finally {
        setSubmitLoading(false);
      }
    } else {
      setSubmitLoading(true);
      setApiError(null);
      try {
        const nextStep = currentStep + 1;
        await saveProfile({
          ...formData,
          onboarding: {
            ...formData.onboarding,
            currentStep: nextStep,
            completed: false,
          },
        }, false);

        isDirtyRef.current = false;
        setIsDirty(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);

        setCurrentStep(nextStep);
      } catch (err: any) {
        setApiError(err.response?.data?.message || 'Failed to save draft progress.');
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setLocalErrors({});
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoToStep = (stepNum: number) => {
    setLocalErrors({});
    setCurrentStep(stepNum);
  };

  const renderActiveStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return (
          <EducationStep
            data={formData}
            onChange={handleStateChange}
            errors={localErrors}
            onNext={handleNext}
            onPrev={handlePrev}
            isLoading={submitLoading}
          />
        );
      case 2:
        return (
          <InterestsStep
            data={formData}
            onChange={handleStateChange}
            onNext={handleNext}
            onPrev={handlePrev}
            isLoading={submitLoading}
          />
        );
      case 3:
        return (
          <CareerGoalsStep
            data={formData}
            onChange={handleStateChange}
            errors={localErrors}
            onNext={handleNext}
            onPrev={handlePrev}
            isLoading={submitLoading}
          />
        );
      case 4:
        return (
          <FinishStep
            data={formData}
            onGoToStep={handleGoToStep}
            onNext={handleNext}
            onPrev={handlePrev}
            isLoading={submitLoading}
          />
        );
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  // Render glassmorphic pulse loaders during initial fetching
  if (contextLoading && !profile) {
    return (
      <div className={styles.container}>
        <div className={`${styles.card} glass-panel`}>
          <div className={`${styles.skeletonTitle} ${styles.pulse}`} />
          <div className={`${styles.skeletonSubtitle} ${styles.pulse}`} />
          <div className={`${styles.skeletonLine} ${styles.pulse}`} />
          <div className={`${styles.skeletonLine} ${styles.pulse}`} />
          <div className={`${styles.skeletonLine} ${styles.pulse}`} style={{ width: '80%' }} />
          <div className={styles.navigation} style={{ borderTop: 'none', paddingTop: 0 }}>
            <div className={`${styles.pulse}`} style={{ height: '40px', width: '100px', backgroundColor: 'var(--text-muted)', borderRadius: 'var(--radius-sm)' }} />
            <div className={`${styles.pulse}`} style={{ height: '40px', width: '120px', backgroundColor: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', marginLeft: 'auto' }} />
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className={styles.container}>
        <div className={`${styles.card} glass-panel`}>
          <div className={styles.successContainer}>
            <div className={styles.successIconWrapper}>
              <Check size={36} />
            </div>
            <h2 className={styles.successTitle}>Onboarding Completed!</h2>
            <p className={styles.successDesc}>
              Your preferences have been successfully calibrated. Loading your AI career cockpit...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.card} glass-panel`}>
        
        {/* Dynamic Saving/Saved status tracker */}
        {currentStep > 0 && (
          <div className={styles.statusIndicator} aria-live="polite">
            {saveStatus === 'saving' && (
              <>
                <span className={`${styles.statusIcon} ${styles.statusSaving}`} />
                <span className={styles.statusText}>Saving draft...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <span className={`${styles.statusIcon} ${styles.statusSaved}`} />
                <span className={styles.statusText}>Changes saved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <span className={`${styles.statusIcon} ${styles.statusError}`} />
                <span className={styles.statusText}>Save failed</span>
              </>
            )}
          </div>
        )}

        {/* Global API inline error banner alerts */}
        {apiError && (
          <div className={styles.errorAlert} role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{apiError}</span>
          </div>
        )}

        {currentStep > 0 && <ProgressBar currentStep={currentStep} totalSteps={4} />}
        {renderActiveStep()}
      </div>
    </div>
  );
};
