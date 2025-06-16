import { createTheme } from '@mui/material/styles';

// Paleta de cores moderna do LETZ baseada nas tendências 2025
const theme = createTheme({
  palette: {
    primary: {
      main: '#6A0DAD', // Roxo vibrante
      light: '#8A2BE2',
      dark: '#4B0082',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#007BFF', // Azul elétrico
      light: '#40A9FF',
      dark: '#0056B3',
      contrastText: '#ffffff',
    },
    success: {
      main: '#7FFF00', // Verde limão
      light: '#9AFF33',
      dark: '#66CC00',
      contrastText: '#000000',
    },
    error: {
      main: '#FF1744', // Vermelho vibrante
      light: '#FF5983',
      dark: '#D50000',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFD700', // Amarelo elétrico
      light: '#FFEB3B',
      dark: '#FFC107',
      contrastText: '#000000',
    },
    info: {
      main: '#00C4B4', // Verde água
      light: '#4DD0E1',
      dark: '#00838F',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F5F5', // Cinza claro
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333', // Cinza escuro
      secondary: '#666666',
    },
    // Cores customizadas para o LETZ
    tertiary: {
      main: '#FF69B4', // Rosa vibrante
      light: '#FFB6C1',
      dark: '#C71585',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
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
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.95rem',
    },
  },
  shape: {
    borderRadius: 16, // Cantos mais arredondados
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '12px 28px',
          fontSize: '0.95rem',
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(106, 13, 173, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(106, 13, 173, 0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8A2BE2 0%, #40A9FF 100%)',
            boxShadow: '0 6px 20px rgba(106, 13, 173, 0.35)',
          },
        },
        outlined: {
          borderWidth: '2px',
          backgroundColor: 'rgba(106, 13, 173, 0.05)',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(106, 13, 173, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6A0DAD',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6A0DAD',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #8A2BE2 0%, #40A9FF 100%)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(106, 13, 173, 0.1)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
          boxShadow: '0 4px 20px rgba(106, 13, 173, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8A2BE2 0%, #40A9FF 100%)',
            transform: 'scale(1.05)',
            boxShadow: '0 6px 25px rgba(106, 13, 173, 0.4)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(106, 13, 173, 0.1)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#6A0DAD',
          },
        },
      },
    },
  },
});

// Adicionar cores customizadas ao tema
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}

export default theme;

