import { createTheme, ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// 🎨 Paleta de cores moderna inspirada em eventos e socialização
const colors = {
  // Cores primárias - Gradiente vibrante
  primary: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Cor principal - Índigo vibrante
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  
  // Cores secundárias - Rosa/Magenta para energia
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899', // Rosa vibrante
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  
  // Cores de sucesso - Verde moderno
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Cores de aviso - Laranja energético
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Cores de erro - Vermelho moderno
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Cores neutras - Cinzas modernos
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Gradientes especiais
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
    secondary: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    sunset: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #6366f1 100%)',
    ocean: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    forest: 'linear-gradient(135deg, #22c55e 0%, #059669 100%)',
  }
};

// 🎭 Tema claro moderno
const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: '#ffffff',
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
    },
    background: {
      default: '#fafbfc',
      paper: '#ffffff',
    },
    text: {
      primary: colors.neutral[800],
      secondary: colors.neutral[600],
    },
    divider: alpha(colors.neutral[300], 0.12),
  },
  
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      background: colors.gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  
  shape: {
    borderRadius: 16,
  },
  
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.05)',
    '0px 10px 15px rgba(0, 0, 0, 0.1)',
    '0px 20px 25px rgba(0, 0, 0, 0.1)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    // ... mais sombras
  ] as any,
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 25px rgba(99, 102, 241, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        contained: {
          background: colors.gradients.primary,
          color: 'white',
          '&:hover': {
            background: colors.gradients.primary,
            filter: 'brightness(1.1)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: colors.primary[200],
          color: colors.primary[600],
          '&:hover': {
            borderColor: colors.primary[400],
            backgroundColor: alpha(colors.primary[50], 0.5),
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${alpha(colors.neutral[200], 0.5)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: alpha(colors.neutral[50], 0.5),
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(colors.neutral[50], 0.8),
            },
            '&.Mui-focused': {
              backgroundColor: 'white',
              boxShadow: `0 0 0 3px ${alpha(colors.primary[500], 0.1)}`,
            },
          },
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        filled: {
          background: colors.gradients.secondary,
          color: 'white',
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(colors.neutral[200], 0.5)}`,
          boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    
    MuiFab: {
      styleOverrides: {
        root: {
          background: colors.gradients.primary,
          boxShadow: '0px 8px 25px rgba(99, 102, 241, 0.4)',
          '&:hover': {
            background: colors.gradients.primary,
            filter: 'brightness(1.1)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: colors.gradients.sunset,
          fontWeight: 600,
        },
      },
    },
    
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: alpha(colors.primary[100], 0.3),
        },
        bar: {
          borderRadius: 8,
          background: colors.gradients.primary,
        },
      },
    },
  },
};

// 🌙 Tema escuro moderno
const darkTheme: ThemeOptions = {
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[400],
      light: colors.secondary[300],
      dark: colors.secondary[600],
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: colors.neutral[100],
      secondary: colors.neutral[400],
    },
    divider: alpha(colors.neutral[700], 0.12),
  },
  components: {
    ...lightTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: alpha(colors.neutral[900], 0.8),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(colors.neutral[700], 0.3)}`,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.5)',
            border: `1px solid ${alpha(colors.primary[500], 0.3)}`,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(colors.neutral[700], 0.3)}`,
        },
      },
    },
  },
};

// 🎨 Criação dos temas
export const modernLightTheme = createTheme(lightTheme);
export const modernDarkTheme = createTheme(darkTheme);

// 🌈 Exportar cores para uso direto
export { colors };

// 🎭 Utilitários de tema
export const getGradientBackground = (gradient: keyof typeof colors.gradients) => ({
  background: colors.gradients[gradient],
});

export const getGlassEffect = (opacity = 0.1) => ({
  backgroundColor: alpha('#ffffff', opacity),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha('#ffffff', 0.2)}`,
});

export const getHoverEffect = () => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
  },
});

export const getPulseAnimation = () => ({
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.05)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  animation: 'pulse 2s infinite',
});

export const getFloatingAnimation = () => ({
  '@keyframes floating': {
    '0%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
    '100%': {
      transform: 'translateY(0px)',
    },
  },
  animation: 'floating 3s ease-in-out infinite',
});

export default modernLightTheme; 