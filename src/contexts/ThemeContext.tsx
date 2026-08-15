import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SettingsApiService } from '../services/settings.service';

export type ThemeMode = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode, persistToBackend?: boolean) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'visionix_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      return saved;
    }
    return 'dark';
  });

  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  };

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (theme === 'system') return getSystemTheme();
    return theme;
  });

  // Apply theme to DOM
  const applyThemeToDom = useCallback((resolved: ResolvedTheme) => {
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.classList.remove('dark-theme', 'light-theme');
    document.documentElement.classList.add(`${resolved}-theme`);
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(`${resolved}-theme`);
  }, []);

  // Update theme calculation
  useEffect(() => {
    let resolved: ResolvedTheme;
    if (theme === 'system') {
      resolved = getSystemTheme();
    } else {
      resolved = theme;
    }

    setResolvedTheme(resolved);
    applyThemeToDom(resolved);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, applyThemeToDom]);

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      if (theme === 'system') {
        const newResolved = mediaQuery.matches ? 'light' : 'dark';
        setResolvedTheme(newResolved);
        applyThemeToDom(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyThemeToDom]);

  const setTheme = async (newTheme: ThemeMode, persistToBackend = true) => {
    setThemeState(newTheme);
    let resolved: ResolvedTheme;
    if (newTheme === 'system') {
      resolved = getSystemTheme();
    } else {
      resolved = newTheme;
    }
    setResolvedTheme(resolved);
    applyThemeToDom(resolved);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    if (persistToBackend) {
      try {
        await SettingsApiService.updatePreferences({ theme: newTheme });
      } catch (err) {
        console.warn('Could not persist theme to server settings:', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
