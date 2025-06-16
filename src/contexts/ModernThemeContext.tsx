import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { modernLightTheme, modernDarkTheme } from '../theme/modernTheme';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ModernThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  theme: Theme;
}

const ModernThemeContext = createContext<ModernThemeContextType | undefined>(undefined);

export const useModernTheme = () => {
  const context = useContext(ModernThemeContext);
  if (!context) {
    throw new Error('useModernTheme must be used within a ModernThemeProvider');
  }
  return context;
};

interface ModernThemeProviderProps {
  children: ReactNode;
}

export const ModernThemeProvider: React.FC<ModernThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    return savedMode || 'auto';
  });

  const [effectiveMode, setEffectiveMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setEffectiveMode(mediaQuery.matches ? 'dark' : 'light');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveMode(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setEffectiveMode(mode);
    }
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = React.useMemo(() => {
    return effectiveMode === 'dark' ? modernDarkTheme : modernLightTheme;
  }, [effectiveMode]);

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const globalStyles = {
    '*': {
      boxSizing: 'border-box',
    },
    html: {
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      scrollBehavior: 'smooth',
    },
    body: {
      margin: 0,
      padding: 0,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '#root': {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    // Scrollbar personalizada
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb': {
      background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
      '&:hover': {
        background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
      },
    },
    // Seleção de texto
    '::selection': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    // Animações globais
    '@keyframes fadeInUp': {
      from: {
        opacity: 0,
        transform: 'translateY(30px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    '@keyframes slideInRight': {
      from: {
        opacity: 0,
        transform: 'translateX(30px)',
      },
      to: {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
    '@keyframes scaleIn': {
      from: {
        opacity: 0,
        transform: 'scale(0.9)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
    '@keyframes floating': {
      '0%, 100%': {
        transform: 'translateY(0px)',
      },
      '50%': {
        transform: 'translateY(-10px)',
      },
    },
    '@keyframes pulse': {
      '0%, 100%': {
        opacity: 1,
      },
      '50%': {
        opacity: 0.5,
      },
    },
    '@keyframes shimmer': {
      '0%': {
        backgroundPosition: '-200px 0',
      },
      '100%': {
        backgroundPosition: 'calc(200px + 100%) 0',
      },
    },
    // Classes utilitárias
    '.fade-in-up': {
      animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '.slide-in-right': {
      animation: 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '.scale-in': {
      animation: 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '.floating': {
      animation: 'floating 3s ease-in-out infinite',
    },
    '.pulse': {
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    '.gradient-text': {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    '.glass-effect': {
      background: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
    },
    '.hover-lift': {
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
      },
    },
    '.shimmer': {
      background: `linear-gradient(90deg, transparent, ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}, transparent)`,
      backgroundSize: '200px 100%',
      animation: 'shimmer 1.5s infinite',
    },
  };

  return (
    <ModernThemeContext.Provider value={{ mode, toggleTheme, setThemeMode, theme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        {children}
      </ThemeProvider>
    </ModernThemeContext.Provider>
  );
}; 