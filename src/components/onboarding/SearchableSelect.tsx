import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import {
  ChevronDown,
  Check,
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
  Plus,
  Globe,
  Languages,
  Search
} from 'lucide-react';
import {
  type TaxonomyItem,
  OTHER_OPTION,
  KEYWORD_ALIASES,
  getTaxonomyLabel,
  getTaxonomyId
} from '../../constants/onboarding.constants';
import { FloatingDropdown } from './FloatingDropdown';
import styles from '../../pages/OnboardingPage.module.css';

// Lucide Icon Resolver
const renderLucideIcon = (iconName?: string, size = 16, accentColor = '#8b5cf6') => {
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
    case 'Globe': return <Globe size={size} style={iconStyle} />;
    case 'Languages': return <Languages size={size} style={iconStyle} />;
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

interface SearchableSelectProps {
  id: string;
  label?: string;
  options: (TaxonomyItem | string)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  allowOther?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Search or select an option...',
  required = false,
  disabled = false,
  error,
  allowOther = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customOtherValue, setCustomOtherValue] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  // Dynamic label for the custom other option based on ID
  const otherItem = useMemo<TaxonomyItem>(() => {
    let customLabel = 'Other (Specify)';
    if (id === 'institution') {
      customLabel = 'Use Custom Institution';
    } else if (id === 'academicStream') {
      customLabel = 'Use Custom Field / Stream';
    }
    return {
      ...OTHER_OPTION,
      label: customLabel
    };
  }, [id]);

  // Uniform TaxonomyItem list
  const normalizedOptions = useMemo<TaxonomyItem[]>(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        let defaultIcon = 'Sparkles';
        let defaultAccent = '#8b5cf6';
        if (id === 'country') {
          defaultIcon = 'Globe';
          defaultAccent = '#3b82f6';
        } else if (id === 'preferredLanguage') {
          defaultIcon = 'Languages';
          defaultAccent = '#10b981';
        } else if (id === 'institution') {
          defaultIcon = 'Building';
          defaultAccent = '#8b5cf6';
        }
        return {
          id: getTaxonomyId([], opt),
          label: opt,
          category: 'General',
          icon: defaultIcon,
          description: '',
          accentColor: defaultAccent,
          keywords: [opt.toLowerCase()]
        };
      }
      return opt;
    });
  }, [options, id]);

  useEffect(() => {
    if (!value) {
      setIsOtherSelected(false);
      setCustomOtherValue('');
      setQuery('');
      return;
    }

    if (value.startsWith('Other: ') || value === 'other') {
      setIsOtherSelected(true);
      const specifyText = value.startsWith('Other: ') ? value.replace('Other: ', '') : '';
      setCustomOtherValue(specifyText);
      setQuery(otherItem.label);
    } else {
      setIsOtherSelected(false);
      const labelText = getTaxonomyLabel(normalizedOptions, value);
      setQuery(labelText || value);
    }
  }, [value, normalizedOptions, otherItem]);

  // Global single-dropdown manager event listeners
  useEffect(() => {
    const handleGlobalClose = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.id !== id) {
        setIsOpen(false);
      }
    };
    window.addEventListener('close-onboarding-dropdowns', handleGlobalClose);
    return () => window.removeEventListener('close-onboarding-dropdowns', handleGlobalClose);
  }, [id]);

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('close-onboarding-dropdowns', { detail: { id } }));
    }
  }, [isOpen, id]);

  // 4-Tier Intelligent Search Engine Ranking
  const rankedFilteredOptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || trimmed === otherItem.label.toLowerCase()) {
      const list = normalizedOptions.filter((opt) => opt.id !== otherItem.id);
      const topRecs = list.slice(0, 150); // Fast performance slice
      return allowOther ? [...topRecs, otherItem] : topRecs;
    }

    const exactMatches: TaxonomyItem[] = [];
    const startsWithMatches: TaxonomyItem[] = [];
    const containsMatches: TaxonomyItem[] = [];
    const aliasMatches: TaxonomyItem[] = [];

    const aliasTargetIds = KEYWORD_ALIASES[trimmed] || [];

    normalizedOptions.forEach((opt) => {
      if (opt.id === otherItem.id) return;
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

    const results = [...exactMatches, ...startsWithMatches, ...containsMatches, ...aliasMatches].slice(0, 150);
    if (allowOther) {
      results.push(otherItem);
    }
    return results;
  }, [query, normalizedOptions, allowOther, otherItem]);

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

  const handleSelectOption = (item: TaxonomyItem) => {
    if (item.id === otherItem.id) {
      setIsOtherSelected(true);
      setQuery(otherItem.label);
      onChange(customOtherValue ? `Other: ${customOtherValue}` : 'other');
    } else {
      setIsOtherSelected(false);
      setCustomOtherValue('');
      setQuery(item.label);
      onChange(item.id);
    }
    setIsOpen(false);
  };

  const handleCustomOtherChange = (text: string) => {
    setCustomOtherValue(text);
    onChange(text ? `Other: ${text}` : 'other');
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
        if (selectedItem) handleSelectOption(selectedItem);
      } else {
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOtherSelected(false);
    setCustomOtherValue('');
    onChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  const activeOptionId = rankedFilteredOptions[highlightedIndex]
    ? `${listboxId}-opt-${rankedFilteredOptions[highlightedIndex].id}`
    : undefined;

  return (
    <div className={styles.formGroup} ref={containerRef} style={{ position: 'relative' }}>
      {label && <label htmlFor={id}>{label}</label>}

      <div style={{ position: 'relative', width: '100%' }}>
        <div
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <Search size={15} />
        </div>

        <input
          ref={inputRef}
          type="text"
          id={id}
          className={styles.input}
          style={{ paddingLeft: '38px', paddingRight: '42px', zIndex: 20 }}
          placeholder={placeholder}
          value={
            isOpen
              ? query
              : isOtherSelected
              ? customOtherValue
                ? `Other: ${customOtherValue}`
                : OTHER_OPTION.label
              : getTaxonomyLabel(normalizedOptions, value) || query
          }
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            setIsOpen(true);
            if (value && !isOtherSelected) {
              setQuery('');
            }
          }}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required && !value}
        />

        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            zIndex: 21
          }}
        >
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              disabled={disabled}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'auto'
              }}
              aria-label="Clear selection"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.18s ease-in-out'
            }}
          />
        </div>

        {/* Shared Portal Floating Dropdown */}
        <FloatingDropdown
          anchorRef={inputRef}
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
                    const isSelected = value === item.id || (isOtherSelected && item.id === OTHER_OPTION.id);
                    const isHighlighted = idx === highlightedIndex;
                    const optionDomId = `${listboxId}-opt-${item.id}`;
                    return (
                      <div
                        key={item.id}
                        id={optionDomId}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectOption(item)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        style={{
                          padding: '10px 14px',
                          fontSize: '0.875rem',
                          color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)',
                          backgroundColor: isHighlighted ? 'rgba(139, 92, 246, 0.14)' : 'transparent',
                          borderLeft: isHighlighted ? '3px solid var(--color-primary)' : '3px solid transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* LEFT: Icon in Glass Box + CENTER: Title & Secondary Description */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              boxShadow: isHighlighted ? `0 0 12px ${item.accentColor || '#8b5cf6'}33` : 'none'
                            }}
                          >
                            {renderLucideIcon(item.icon, 16, item.accentColor || '#8b5cf6')}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                            <span style={{ fontWeight: isSelected ? 600 : 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <HighlightedText text={item.label} query={query} />
                            </span>
                            {item.description && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* RIGHT: Category Badge & Checkmark */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          {item.category && item.category !== 'General' && item.category !== category && (
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '3px 9px',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                color: 'var(--text-muted)',
                                fontWeight: 500,
                                letterSpacing: '0.02em'
                              }}
                            >
                              {item.category}
                            </span>
                          )}
                          {isSelected && <Check size={15} style={{ color: 'var(--color-primary)' }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div style={{ padding: '20px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>No matching results</div>
                <div>Try another keyword or select &quot;Other (Specify)&quot; to create a custom entry.</div>
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
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
              <span style={{ padding: '2px 4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginRight: '4px' }}>↵</span> Select
              <span style={{ padding: '2px 4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginLeft: '8px', marginRight: '4px' }}>esc</span> Close
            </div>
          </div>
        </FloatingDropdown>
      </div>

      {/* Other (Specify) Custom Entry */}
      {isOtherSelected && (
        <div style={{ marginTop: '8px' }}>
          <input
            type="text"
            className={styles.input}
            placeholder="Please specify custom entry..."
            value={customOtherValue}
            onChange={(e) => handleCustomOtherChange(e.target.value)}
            disabled={disabled}
            required={required}
            autoFocus
          />
        </div>
      )}

      {error && (
        <span id={`${id}-error`} role="alert" className={styles.fieldError}>
          {error}
        </span>
      )}
    </div>
  );
};
