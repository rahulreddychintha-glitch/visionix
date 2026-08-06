import React, { useState, useMemo, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Brain,
  Code2,
  HeartPulse,
  Scale,
  TrendingUp,
  Building,
  GraduationCap,
  Shield,
  Sparkles,
  Cpu,
  Rocket,
  Palette,
  Award,
  BookOpen,
  Briefcase,
  RefreshCw,
  Zap,
  Microscope,
  Cloud,
  Plus
} from 'lucide-react';
import {
  type TaxonomyItem,
  getTaxonomyLabel,
  getTaxonomyId,
  KEYWORD_ALIASES
} from '../../constants/onboarding.constants';
import { FloatingDropdown } from './FloatingDropdown';
import styles from '../../pages/OnboardingPage.module.css';

const renderLucideIcon = (iconName?: string, size = 14, accentColor = '#8b5cf6') => {
  const iconStyle = { color: accentColor, flexShrink: 0 };
  switch (iconName) {
    case 'Brain': return <Brain size={size} style={iconStyle} />;
    case 'Code2': return <Code2 size={size} style={iconStyle} />;
    case 'HeartPulse': return <HeartPulse size={size} style={iconStyle} />;
    case 'Scale': return <Scale size={size} style={iconStyle} />;
    case 'TrendingUp': return <TrendingUp size={size} style={iconStyle} />;
    case 'Building': return <Building size={size} style={iconStyle} />;
    case 'GraduationCap': return <GraduationCap size={size} style={iconStyle} />;
    case 'Shield': return <Shield size={size} style={iconStyle} />;
    case 'Cpu': return <Cpu size={size} style={iconStyle} />;
    case 'Rocket': return <Rocket size={size} style={iconStyle} />;
    case 'Palette': return <Palette size={size} style={iconStyle} />;
    case 'Award': return <Award size={size} style={iconStyle} />;
    case 'BookOpen': return <BookOpen size={size} style={iconStyle} />;
    case 'Briefcase': return <Briefcase size={size} style={iconStyle} />;
    case 'RefreshCw': return <RefreshCw size={size} style={iconStyle} />;
    case 'Zap': return <Zap size={size} style={iconStyle} />;
    case 'Microscope': return <Microscope size={size} style={iconStyle} />;
    case 'Cloud': return <Cloud size={size} style={iconStyle} />;
    case 'Plus': return <Plus size={size} style={iconStyle} />;
    default: return <Sparkles size={size} style={iconStyle} />;
  }
};

// Text Highlighting Helper
const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const trimmed = query.trim();
  if (!trimmed) return <span>{text}</span>;

  try {
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === trimmed.toLowerCase() ? (
            <mark
              key={i}
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.3)',
                color: '#ffffff',
                borderRadius: '3px',
                padding: '0 3px',
                fontWeight: 600
              }}
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  } catch {
    return <span>{text}</span>;
  }
};

interface SearchableChipGroupProps {
  title: string;
  options: (TaxonomyItem | string)[];
  selectedValues: string[];
  onToggle: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchableChipGroup: React.FC<SearchableChipGroupProps> = ({
  title,
  options,
  selectedValues = [],
  onToggle,
  placeholder = 'Search...',
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  // Uniform TaxonomyItem list
  const normalizedOptions = useMemo<TaxonomyItem[]>(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return {
          id: getTaxonomyId([], opt),
          label: opt,
          category: 'General',
          icon: 'Sparkles',
          description: opt,
          accentColor: '#8b5cf6',
          keywords: [opt.toLowerCase()]
        };
      }
      return opt;
    });
  }, [options]);

  // Global single-dropdown manager listener
  useEffect(() => {
    const handleGlobalClose = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.id !== title) {
        setIsOpen(false);
      }
    };
    window.addEventListener('close-onboarding-dropdowns', handleGlobalClose);
    return () => window.removeEventListener('close-onboarding-dropdowns', handleGlobalClose);
  }, [title]);

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('close-onboarding-dropdowns', { detail: { id: title } }));
    }
  }, [isOpen, title]);

  // 4-Tier Search Engine Ranking
  const rankedFilteredOptions = useMemo(() => {
    const available = normalizedOptions.filter((opt) => !selectedValues.includes(opt.id));
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      return available.slice(0, 100);
    }

    const exactMatches: TaxonomyItem[] = [];
    const startsWithMatches: TaxonomyItem[] = [];
    const containsMatches: TaxonomyItem[] = [];
    const aliasMatches: TaxonomyItem[] = [];

    const aliasTargetIds = KEYWORD_ALIASES[trimmed] || [];

    available.forEach((opt) => {
      const lowerLabel = opt.label.toLowerCase();
      const lowerId = opt.id.toLowerCase();
      const keywords = opt.keywords || [];

      if (lowerLabel === trimmed || lowerId === trimmed) {
        exactMatches.push(opt);
      } else if (lowerLabel.startsWith(trimmed) || lowerId.startsWith(trimmed)) {
        startsWithMatches.push(opt);
      } else if (lowerLabel.includes(trimmed) || lowerId.includes(trimmed)) {
        containsMatches.push(opt);
      } else if (
        aliasTargetIds.includes(opt.id) ||
        keywords.some((k) => k.toLowerCase().includes(trimmed))
      ) {
        aliasMatches.push(opt);
      }
    });

    return [...exactMatches, ...startsWithMatches, ...containsMatches, ...aliasMatches].slice(0, 100);
  }, [query, normalizedOptions, selectedValues]);

  // Group ranked filtered options by category
  const groupedOptions = useMemo(() => {
    const groups: Record<string, TaxonomyItem[]> = {};
    rankedFilteredOptions.forEach((item) => {
      const cat = item.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [rankedFilteredOptions]);

  // Auto-scroll highlighted item into view
  useEffect(() => {
    if (isOpen && scrollContainerRef.current && highlightedIndex >= 0) {
      const activeItem = rankedFilteredOptions[highlightedIndex];
      if (activeItem) {
        const itemEl = scrollContainerRef.current.querySelector(`[id="${listboxId}-opt-${activeItem.id}"]`);
        if (itemEl) {
          itemEl.scrollIntoView({ block: 'nearest' });
        }
      }
    }
  }, [highlightedIndex, isOpen, rankedFilteredOptions, listboxId]);

  const handleSelectOption = (id: string) => {
    onToggle(id);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) => (prev + 1) % Math.max(1, rankedFilteredOptions.length));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex((prev) => (prev - 1 + rankedFilteredOptions.length) % Math.max(1, rankedFilteredOptions.length));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && rankedFilteredOptions.length > 0) {
        const selectedItem = rankedFilteredOptions[highlightedIndex] || rankedFilteredOptions[0];
        if (selectedItem) handleSelectOption(selectedItem.id);
      } else if (query.trim()) {
        const match = normalizedOptions.find(
          (opt) => opt.label.toLowerCase() === query.trim().toLowerCase() || opt.id === query.trim().toLowerCase()
        );
        const itemToAdd = match ? match.id : query.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
        if (!selectedValues.includes(itemToAdd)) {
          onToggle(itemToAdd);
        }
        setQuery('');
      } else {
        setIsOpen(true);
      }
    } else if (e.key === 'Backspace' && !query && selectedValues.length > 0) {
      const lastItem = selectedValues[selectedValues.length - 1];
      if (lastItem) onToggle(lastItem);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h4 className={styles.chipLabel} style={{ marginBottom: 0 }}>
        {title} ({selectedValues.length} selected)
      </h4>

      {/* Field Input Wrapper Container */}
      <div
        ref={inputWrapperRef}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            if (inputRef.current) inputRef.current.focus();
          }
        }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: isOpen ? '1px solid rgba(139, 92, 246, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-sm)',
          cursor: disabled ? 'not-allowed' : 'text',
          position: 'relative',
          minHeight: '46px',
          boxShadow: isOpen ? '0 0 20px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.02)' : 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 20
        }}
      >
        <Search
          size={16}
          style={{
            color: 'var(--text-muted)',
            flexShrink: 0,
            pointerEvents: 'none'
          }}
        />

        {/* Selected Chips Inline Inside the Input Container */}
        <AnimatePresence>
          {selectedValues.map((val) => {
            const labelText = getTaxonomyLabel(normalizedOptions, val);
            const itemObj = normalizedOptions.find((o) => o.id === val);
            const iconName = itemObj?.icon;
            const accentColor = itemObj?.accentColor || '#8b5cf6';

            return (
              <motion.span
                key={val}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(88, 80, 236, 0.1))',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  userSelect: 'none'
                }}
              >
                {renderLucideIcon(iconName, 12, accentColor)}
                <span>{labelText || val}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) onToggle(val);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: 0,
                    marginLeft: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label={`Remove ${labelText || val}`}
                >
                  <X size={12} />
                </button>
              </motion.span>
            );
          })}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={selectedValues.length === 0 ? placeholder : 'Add more...'}
          style={{
            flex: 1,
            minWidth: '120px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            padding: '2px 0',
          }}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
        />

        {query && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              flexShrink: 0
            }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Shared Portal Floating Dropdown */}
      <FloatingDropdown
        anchorRef={inputWrapperRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        listboxId={listboxId}
        maxHeight="320px"
      >
        <div ref={scrollContainerRef} style={{ flex: 1, overflowY: 'auto', maxHeight: '270px', scrollBehavior: 'smooth' }}>
          {rankedFilteredOptions.length > 0 ? (
            Object.entries(groupedOptions).map(([category, items]) => (
              <div key={category} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  padding: '6px 14px',
                  fontSize: '0.675rem',
                  fontWeight: 700,
                  color: 'rgba(139, 92, 246, 0.85)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  backgroundColor: 'rgba(139, 92, 246, 0.03)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.02)',
                  userSelect: 'none'
                }}>
                  {category}
                </div>
                {items.map((item) => {
                  const idx = rankedFilteredOptions.findIndex((o) => o.id === item.id);
                  const isHighlighted = idx === highlightedIndex;
                  const optionDomId = `${listboxId}-opt-${item.id}`;

                  return (
                    <div
                      key={item.id}
                      id={optionDomId}
                      role="option"
                      aria-selected={false}
                      onClick={() => handleSelectOption(item.id)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      style={{
                        padding: '10px 14px',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)',
                        backgroundColor: isHighlighted ? 'rgba(139, 92, 246, 0.14)' : 'transparent',
                        borderLeft: isHighlighted ? '3px solid var(--color-primary)' : '3px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: isHighlighted ? `0 0 12px ${item.accentColor || '#8b5cf6'}33` : 'none'
                          }}
                        >
                          {renderLucideIcon(item.icon, 14, item.accentColor || '#8b5cf6')}
                        </div>
                        <span>
                          <HighlightedText text={item.label} query={query} />
                        </span>
                      </div>
                      {item.category && item.category !== 'General' && item.category !== category && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: 'var(--text-muted)',
                            fontWeight: 500
                          }}
                        >
                          {item.category}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              No matching results. Press Enter to add custom entry.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.4)',
          userSelect: 'none'
        }}>
          <div>
            <span style={{ padding: '2px 4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginRight: '4px' }}>↑↓</span> Navigate
          </div>
          <div>
            <span style={{ padding: '2px 4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginRight: '4px' }}>↵</span> Select / Add
            <span style={{ padding: '2px 4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginLeft: '8px', marginRight: '4px' }}>esc</span> Close
          </div>
        </div>
      </FloatingDropdown>
    </div>
  );
};
