import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { ProgressBar } from '../components/onboarding/ProgressBar';
import { WelcomeStep } from '../components/onboarding/WelcomeStep';
// import { EducationStep } from '../components/onboarding/EducationStep';
import { AboutYouStep } from '../components/onboarding/AboutYouStep';
import { AboutEducationStep } from '../components/onboarding/AboutEducationStep';
// import { InterestsStep } from '../components/onboarding/InterestsStep';
import { AboutCareerStep } from '../components/onboarding/AboutCareerStep';
// import { CareerGoalsStep } from '../components/onboarding/CareerGoalsStep';
import { FinishStep } from '../components/onboarding/FinishStep';
import { UserService } from '../services/user.service';
import { Check, AlertCircle } from 'lucide-react';
import styles from './OnboardingPage.module.css';

const initialState = {
  personal: {
    fullName: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    state: '',
    city: '',
  },
  education: {
    level: '',
    studentStatus: '',
    institution: '',
    stream: '',
    branchSpecialization: '',
    currentOccupation: '',
    graduationYear: '',
    higherEducationPlans: '',
    studyYear: '',
    currentClass: '',
    courses: [],
  },
  experience: {
    yearsOfExperience: '',
    currentRole: '',
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
    certifications: [],
    portfolioLinks: { github: '', linkedin: '', portfolio: '', other: '' },
    skillLevels: {},
  },
  careerGoals: {
    dreamCareer: '',
    preferredIndustries: [],
    salaryGoal: '',
    careerObjectives: '',
    preferredJobType: '',
    preferredLocation: '',
    longTermAspirations: '',
    careerConfidence: 80,
  },
  learningPreferences: {
    learningStyle: '',
    learningPace: '',
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
      let firstName = profile.personal?.firstName || '';
      let lastName = profile.personal?.lastName || '';
      if (!firstName && !lastName && profile.personal?.fullName) {
        const parts = profile.personal.fullName.trim().split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
      }
      const fullName = `${firstName} ${lastName}`.trim() || profile.personal?.fullName || '';

      const courses = profile.education?.courses && profile.education.courses.length > 0
        ? profile.education.courses
        : (profile.education?.stream
            ? [{ stream: profile.education.stream, branchSpecialization: profile.education.branchSpecialization || '', studyYear: profile.education.studyYear || '' }]
            : []);

      setFormData((prev: any) => ({
        ...prev,
        personal: { 
          ...prev.personal, 
          ...(profile.personal || {}),
          firstName,
          lastName,
          fullName,
          dateOfBirth: profile.personal?.dateOfBirth || '',
          country: profile.personal?.country === 'Not Specified' ? '' : (profile.personal?.country || ''),
        },
        education: { 
          ...prev.education, 
          ...(profile.education || {}),
          courses,
        },
        experience: { ...prev.experience, ...(profile.experience || {}) },
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
          certifications: profile.skills?.certifications || [],
          portfolioLinks: { ...(prev.skills?.portfolioLinks || {}), ...(profile.skills?.portfolioLinks || {}) },
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
    const parseWeeklyStudyTime = (val: any): number => {
      if (typeof val === 'number') return val;
      if (!val) return 5;
      if (String(val).includes('<5')) return 4;
      if (String(val).includes('5–10') || String(val).includes('5-10')) return 8;
      if (String(val).includes('10–20') || String(val).includes('10-20')) return 15;
      if (String(val).includes('20+')) return 25;
      const num = parseInt(val, 10);
      return isNaN(num) ? 5 : num;
    };

    const getPreferredIndustries = (): string[] => {
      const selected = data.careerGoals?.preferredIndustries || [];
      if (selected.length > 0) return selected;
      
      const ints = data.interests?.careerInterests || [];
      const mapped: string[] = [];
      ints.forEach((interestId: string) => {
        const norm = String(interestId).toLowerCase();
        if (
          norm === 'software_development' || norm === 'artificial_intelligence' || 
          norm === 'machine_learning' || norm === 'data_science' || 
          norm === 'cybersecurity' || norm === 'cloud_computing' || 
          norm === 'devops' || norm === 'blockchain' || norm === 'game_development' || 
          norm === 'robotics'
        ) {
          if (!mapped.includes('technology')) mapped.push('technology');
        } else if (
          norm === 'medicine' || norm === 'surgery' || norm === 'nursing' || 
          norm === 'pharmacy' || norm === 'dentistry' || norm === 'public_health' || 
          norm === 'psychology' || norm === 'psychiatry'
        ) {
          if (!mapped.includes('healthcare')) mapped.push('healthcare');
        } else if (
          norm === 'finance' || norm === 'accounting' || norm === 'banking' || 
          norm === 'investment' || norm === 'economics'
        ) {
          if (!mapped.includes('finance')) mapped.push('finance');
        } else if (
          norm === 'agriculture' || norm === 'horticulture' || 
          norm === 'forestry' || norm === 'fisheries'
        ) {
          if (!mapped.includes('agriculture')) mapped.push('agriculture');
        } else if (norm === 'teaching' || norm === 'education_technology') {
          if (!mapped.includes('education')) mapped.push('education');
        } else if (norm === 'law' || norm === 'judiciary') {
          if (!mapped.includes('government')) mapped.push('government');
        }
      });
      
      return mapped.length > 0 ? mapped : ['technology'];
    };

    const getCareerObjectives = (): string => {
      if (data.careerGoals?.careerObjectives && data.careerGoals.careerObjectives.trim() !== '') {
        return data.careerGoals.careerObjectives;
      }
      const dream = data.careerGoals?.dreamCareer || '';
      if (dream) {
        return `My primary career goal is to become a successful ${dream} and establish a long-term career path in my chosen field.`;
      }
      return 'Build a solid foundation and establish a successful career path in my chosen field of study.';
    };

    const fullName = [data.personal?.firstName, data.personal?.lastName].filter(Boolean).join(' ').trim() || data.personal?.fullName || '';
    const lvl = (data.education?.level || '').toLowerCase().trim();
    const isSchool = lvl === 'school' || lvl.startsWith('school');
    const isIntermediate = lvl === 'intermediate' || lvl.startsWith('intermediate');
    const isDiploma = lvl === 'diploma' || lvl.startsWith('diploma') || lvl === 'polytechnic';

    const courses = data.education?.courses && data.education.courses.length > 0
      ? data.education.courses
      : (data.education?.stream ? [{ stream: data.education.stream, branchSpecialization: data.education.branchSpecialization || '', studyYear: data.education.studyYear || '' }] : []);

    const studentStatus = data.education?.studentStatus || (
      isSchool ? 'School Student' :
      isIntermediate ? 'Junior College / Intermediate Student' :
      isDiploma ? 'Diploma / Polytechnic Student' :
      'College / University Student'
    );

    return {
      ...data,
      personal: {
        ...data.personal,
        fullName: fullName || 'Candidate',
        firstName: data.personal?.firstName || '',
        lastName: data.personal?.lastName || '',
        dateOfBirth: data.personal?.dateOfBirth,
        country: data.personal?.country || 'Not Specified',
        state: data.personal?.state || 'Not Specified',
        city: data.personal?.city || 'Not Specified',
      },
      education: {
        ...data.education,
        studentStatus,
        stream: isSchool ? (data.education?.stream || 'General Schooling') : (data.education?.stream || ''),
        graduationYear: data.education?.graduationYear || currentYear,
        courses,
      },
      learningPreferences: {
        ...data.learningPreferences,
        learningStyle: data.learningPreferences?.learningStyle || 'Practical',
        weeklyStudyTime: parseWeeklyStudyTime(data.learningPreferences?.weeklyStudyTime),
      },
      workPreferences: {
        ...data.workPreferences,
        startupEnterprise: data.workPreferences?.startupEnterprise || 'Growth-stage Scaleup',
        teamSize: data.workPreferences?.teamSize || 'Medium',
      },
      careerGoals: {
        ...data.careerGoals,
        salaryGoal: data.careerGoals?.salaryGoal || 'Not Specified',
        careerObjectives: getCareerObjectives(),
        preferredIndustries: getPreferredIndustries(),
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
    let updatedFields = { ...fields };
    if (section === 'personal') {
      if (updatedFields.firstName !== undefined || updatedFields.lastName !== undefined) {
        const first = updatedFields.firstName !== undefined ? updatedFields.firstName : (formData.personal?.firstName || '');
        const last = updatedFields.lastName !== undefined ? updatedFields.lastName : (formData.personal?.lastName || '');
        updatedFields.fullName = `${first} ${last}`.trim();
      }
    }

    setFormData((prev: any) => ({
      ...prev,
      [section]: updatedFields,
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
      if (!p.firstName || !p.firstName.trim()) {
        errors.firstName = 'First name is required';
        isValid = false;
      }
      if (!p.lastName || !p.lastName.trim()) {
        errors.lastName = 'Last name is required';
        isValid = false;
      }
      if (!p.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
        isValid = false;
      } else {
        const dobStr = typeof p.dateOfBirth === 'string' ? p.dateOfBirth.split('T')[0] : new Date(p.dateOfBirth).toISOString().split('T')[0];
        const todayStr = new Date().toISOString().split('T')[0];
        if (isNaN(new Date(p.dateOfBirth).getTime())) {
          errors.dateOfBirth = 'Please enter a valid date of birth';
          isValid = false;
        } else if (dobStr > todayStr) {
          errors.dateOfBirth = 'Date of birth cannot be in the future';
          isValid = false;
        }
      }
    }

    if (step === 2) {
      const e = formData.education || {};
      if (!e.level || !e.level.trim()) {
        errors.level = 'Highest education level is required';
        isValid = false;
      }
      const lvl = (e.level || '').toLowerCase().trim();
      const isSchool = lvl === 'school' || lvl.startsWith('school');
      const isIntermediate = lvl === 'intermediate' || lvl.startsWith('intermediate');
      if (isSchool) {
        if (!e.currentClass || !e.currentClass.trim()) {
          errors.currentClass = 'Class is required';
          isValid = false;
        }
      } else if (isIntermediate) {
        if (!e.stream || !e.stream.trim()) {
          errors.stream = 'Intermediate stream is required';
          isValid = false;
        }
        if (!e.studyYear || !e.studyYear.trim()) {
          errors.studyYear = 'Class / Year is required';
          isValid = false;
        }
      } else {
        if (!e.stream || !e.stream.trim()) {
          errors.stream = 'Course / Degree / Branch is required';
          isValid = false;
        }
        if (!e.studyYear || !e.studyYear.trim()) {
          errors.studyYear = 'Year / Study year is required';
          isValid = false;
        }
      }
    }

    if (step === 3) {
      // Dream career is optional
    }

    setLocalErrors(errors);
    return isValid;
  };

  const validateAllSteps = (): boolean => {
    let allValid = true;
    const errors: any = {};

    const p = formData.personal || {};
    const e = formData.education || {};

    // Step 1: About You
    if (!p.firstName || !p.firstName.trim()) {
      errors.firstName = 'First name is required';
      allValid = false;
    }
    if (!p.lastName || !p.lastName.trim()) {
      errors.lastName = 'Last name is required';
      allValid = false;
    }
    if (!p.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
      allValid = false;
    } else {
      const dobStr = typeof p.dateOfBirth === 'string' ? p.dateOfBirth.split('T')[0] : new Date(p.dateOfBirth).toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];
      if (isNaN(new Date(p.dateOfBirth).getTime())) {
        errors.dateOfBirth = 'Please enter a valid date of birth';
        allValid = false;
      } else if (dobStr > todayStr) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
        allValid = false;
      }
    }

    // Step 2: Education
    if (!e.level || !e.level.trim()) {
      errors.level = 'Highest education level is required';
      allValid = false;
    }
    const lvl = (e.level || '').toLowerCase().trim();
    const isSchool = lvl === 'school' || lvl.startsWith('school');
    const isIntermediate = lvl === 'intermediate' || lvl.startsWith('intermediate');
    if (isSchool) {
      if (!e.currentClass || !e.currentClass.trim()) {
        errors.currentClass = 'Class is required';
        allValid = false;
      }
    } else if (isIntermediate) {
      if (!e.stream || !e.stream.trim()) {
        errors.stream = 'Intermediate stream is required';
        allValid = false;
      }
      if (!e.studyYear || !e.studyYear.trim()) {
        errors.studyYear = 'Class / Year is required';
        allValid = false;
      }
    } else {
      if (!e.stream || !e.stream.trim()) {
        errors.stream = 'Course / Degree / Branch is required';
        allValid = false;
      }
      if (!e.studyYear || !e.studyYear.trim()) {
        errors.studyYear = 'Year / Study year is required';
        allValid = false;
      }
    }

    // Step 3: Dream career is optional

    setLocalErrors(errors);
    return allValid;
  };

  const handleNext = async () => {
    if (submitLoading) return;

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
        console.log('Final Profile Payload:', finalPayload);
        await saveProfile(finalPayload, true);
        isDirtyRef.current = false;
        setIsDirty(false);
        setShowSuccess(true);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (err: any) {
        console.error('Submission error:', err.response?.data);
        const validationErrors = err.response?.data?.errors;
        if (validationErrors && validationErrors.length > 0) {
          const detail = validationErrors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
          setApiError(`Validation failed: ${detail}`);
        } else {
          setApiError(err.response?.data?.message || 'Failed to submit onboarding profile.');
        }
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
          <AboutYouStep
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
          <AboutEducationStep
            data={formData}
            onChange={handleStateChange}
            errors={localErrors}
            onNext={handleNext}
            onPrev={handlePrev}
            isLoading={submitLoading}
          />
        );
      case 3:
        return (
          <AboutCareerStep
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

        {currentStep > 0 && <ProgressBar currentStep={currentStep} totalSteps={4} formData={formData} />}
        {renderActiveStep()}
      </div>
    </div>
  );
};
