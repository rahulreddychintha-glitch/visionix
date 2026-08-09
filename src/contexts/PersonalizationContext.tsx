import React, { createContext, useState, useEffect, useCallback } from 'react';
import { PersonalizationApiService } from '../services/personalization.service';
import type { PersonalizationContextData, RecommendationInsights } from '../types/personalization.types';
import { useAuth } from '../hooks/useAuth';

export interface PersonalizationContextState {
  personalizationContext: PersonalizationContextData | null;
  recommendations: RecommendationInsights | null;
  loading: boolean;
  error: string | null;
  refreshPersonalization: () => Promise<void>;
  updatePreferences: (prefs: Partial<PersonalizationContextData['userPreferences']>) => Promise<void>;
}

export const PersonalizationContext = createContext<PersonalizationContextState | undefined>(undefined);

export const PersonalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [personalizationContext, setPersonalizationContext] = useState<PersonalizationContextData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPersonalization = useCallback(async () => {
    if (!user || !user.isOnboarded) {
      setPersonalizationContext(null);
      setRecommendations(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await PersonalizationApiService.getPersonalizationData();
      setPersonalizationContext(data.context);
      setRecommendations(data.recommendations);
    } catch (err: any) {
      console.warn('Personalization data loading notice:', err?.message || err);
      setError(err?.message || 'Failed to load personalization context');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshPersonalization();
  }, [refreshPersonalization]);

  const updatePreferences = async (prefs: Partial<PersonalizationContextData['userPreferences']>) => {
    try {
      const updated = await PersonalizationApiService.updatePreferences(prefs);
      if (personalizationContext) {
        setPersonalizationContext({
          ...personalizationContext,
          userPreferences: updated,
        });
      }
    } catch (err: any) {
      console.error('Error updating preferences:', err);
      throw err;
    }
  };

  return (
    <PersonalizationContext.Provider
      value={{
        personalizationContext,
        recommendations,
        loading,
        error,
        refreshPersonalization,
        updatePreferences,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};
