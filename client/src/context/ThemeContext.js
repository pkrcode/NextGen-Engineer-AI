import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  // Get system preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Apply theme to document
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement;
    const actualTheme = newTheme === 'system' ? getSystemTheme() : newTheme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
    
    // Set CSS custom properties for toast notifications
    if (actualTheme === 'dark') {
      root.style.setProperty('--toast-bg', '#1f2937');
      root.style.setProperty('--toast-color', '#f9fafb');
      root.style.setProperty('--toast-border', '#374151');
    } else {
      root.style.setProperty('--toast-bg', '#ffffff');
      root.style.setProperty('--toast-color', '#111827');
      root.style.setProperty('--toast-border', '#e5e7eb');
    }
    
    setResolvedTheme(actualTheme);
  }, []);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme('system');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, applyTheme]);

  // Update theme when theme state changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const value = {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
