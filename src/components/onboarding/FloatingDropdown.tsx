import React, { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortalLayer } from './PortalLayer';

interface FloatingDropdownProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
  listboxId: string;
  maxHeight?: string;
  children: React.ReactNode;
}

export const FloatingDropdown: React.FC<FloatingDropdownProps> = ({
  anchorRef,
  isOpen,
  onClose,
  listboxId,
  maxHeight = '320px',
  children
}) => {
  const [coords, setCoords] = useState<{
    top: number;
    bottom: number;
    left: number;
    width: number;
    openUpward: boolean;
  } | null>(null);

  const updateCoords = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    
    // Width constraint: match input width, cap at 600px
    const width = Math.min(rect.width, 600);
    
    // Horizontal viewport bounds clamping
    const viewportWidth = window.innerWidth;
    let left = rect.left;
    if (left + width > viewportWidth - 16) {
      left = Math.max(16, viewportWidth - width - 16);
    }
    left = Math.max(16, left);

    // Vertical placement logic
    const dropdownHeightNum = parseInt(maxHeight, 10) || 320;
    const threshold = dropdownHeightNum + 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < threshold && spaceAbove > spaceBelow;

    setCoords({
      top: rect.bottom + 8,
      bottom: window.innerHeight - rect.top + 8,
      left,
      width,
      openUpward
    });
  }, [anchorRef, maxHeight]);

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
    }
  }, [isOpen, updateCoords]);

  // Handle scroll & resize recalculations
  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords, true);
    }
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords, true);
    };
  }, [isOpen, updateCoords]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const dropdownEl = document.getElementById(listboxId);

      if (
        anchorRef.current &&
        !anchorRef.current.contains(target) &&
        dropdownEl &&
        !dropdownEl.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, anchorRef, listboxId, onClose]);

  // Keydown listener for Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <PortalLayer>
      <AnimatePresence>
        {isOpen && coords && (
          <motion.div
            id={listboxId}
            role="listbox"
            initial={{ opacity: 0, y: coords.openUpward ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: coords.openUpward ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: coords.openUpward ? 'auto' : `${coords.top}px`,
              bottom: coords.openUpward ? `${coords.bottom}px` : 'auto',
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              maxWidth: '600px',
              maxHeight,
              zIndex: 1000,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(12, 13, 20, 0.98)',
              border: '1px solid rgba(139, 92, 246, 0.45)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </PortalLayer>
  );
};
