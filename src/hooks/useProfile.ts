import { useContext } from 'react';
import { ProfileContext } from '../contexts/ProfileContext';
import type { ProfileContextType } from '../contexts/ProfileContext';

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
