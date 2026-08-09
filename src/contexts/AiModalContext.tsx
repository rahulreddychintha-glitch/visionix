import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AiModalContextType {
  isAiModalOpen: boolean;
  openAiModal: () => void;
  closeAiModal: () => void;
}

const AiModalContext = createContext<AiModalContextType | undefined>(undefined);

export const AiModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const location = useLocation();

  // Close modal when navigating to /ai-assistant since /ai-assistant renders the full page chat interface
  useEffect(() => {
    if (location.pathname === '/ai-assistant') {
      setIsAiModalOpen(false);
    }
  }, [location.pathname]);

  const openAiModal = () => setIsAiModalOpen(true);
  const closeAiModal = () => setIsAiModalOpen(false);

  return (
    <AiModalContext.Provider value={{ isAiModalOpen, openAiModal, closeAiModal }}>
      {children}
    </AiModalContext.Provider>
  );
};

export const useAiModal = (): AiModalContextType => {
  const context = useContext(AiModalContext);
  if (!context) {
    throw new Error('useAiModal must be used within an AiModalProvider');
  }
  return context;
};
