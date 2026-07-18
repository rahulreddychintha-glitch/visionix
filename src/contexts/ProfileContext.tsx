import React, { createContext, useState, useCallback } from 'react';
import { UserService } from '../services/user.service';
import { useAuth } from '../hooks/useAuth';

export interface ProfileContextType {
  profile: any;
  loading: boolean;
  error: string | null;
  currentStep: number;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  setCurrentStep: (step: number) => void;
  loadProfile: () => Promise<void>;
  saveProfile: (data: any, isFinal?: boolean) => Promise<any>;
  resetProfile: () => void;
}

// eslint-disable-next-line react/only-export-components
export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStepState] = useState<number>(0);

  const setCurrentStep = useCallback((step: number) => {
    setCurrentStepState(step);
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await UserService.getProfile();
      setProfile(response.data);
      if (response.data?.onboarding) {
        setCurrentStepState(response.data.onboarding.currentStep || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (data: any, isFinal = false) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure the step metadata is attached correctly
      const payload = {
        ...data,
        onboarding: {
          ...data.onboarding,
          currentStep,
          completed: isFinal,
        },
      };

      const response = await UserService.saveProfile(payload);
      setProfile(response.data);
      
      if (isFinal) {
        // Sync the onboarding state back to AuthContext immediately
        await refreshUser();
      }
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save profile details.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentStep, refreshUser]);

  const resetProfile = useCallback(() => {
    setProfile(null);
    setError(null);
    setCurrentStepState(0);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        currentStep,
        setProfile,
        setCurrentStep,
        loadProfile,
        saveProfile,
        resetProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
