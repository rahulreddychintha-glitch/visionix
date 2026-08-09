import { useContext } from 'react';
import { PersonalizationContext, type PersonalizationContextState } from '../contexts/PersonalizationContext';

export const usePersonalization = (): PersonalizationContextState => {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};
