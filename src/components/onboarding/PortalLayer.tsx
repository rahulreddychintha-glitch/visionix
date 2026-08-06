import React from 'react';
import { createPortal } from 'react-dom';

interface PortalLayerProps {
  children: React.ReactNode;
}

export const PortalLayer: React.FC<PortalLayerProps> = ({ children }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};
