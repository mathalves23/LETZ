import React from 'react';
import { Button, ButtonProps, CircularProgress, Box } from '@mui/material';
import { useModernTheme } from '../contexts/ModernThemeContext';
import { alpha } from '@mui/material/styles';

interface ModernButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'glass' | 'gradient';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  glow?: boolean;
  pulse?: boolean;
  rounded?: boolean;
}

const ModernButton: React.FC<ModernButtonProps> = ({
  variant = 'primary',
  loading = false,
  icon,
  iconPosition = 'start',
  glow = false,
  pulse = false,
  rounded = false,
  children,
  disabled,
  sx,
  ...props
}) => {
  const { theme } = useModernTheme();
  const isDark = theme.palette.mode === 'dark';

  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: rounded ? '50px' : '12px',
      textTransform: 'none' as const,
      fontWeight: 600,
      padding: '12px 24px',
      fontSize: '0.875rem',
      boxShadow: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: glow ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}` : '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
      ...(pulse && {
        animation: 'pulse 2s infinite',
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      }),
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            ...baseStyles['&:hover'],
            filter: 'brightness(1.1)',
          },
          '&:disabled': {
            background: alpha(theme.palette.action.disabled, 0.5),
            color: theme.palette.text.disabled,
          },
        };

      case 'secondary':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: theme.palette.secondary.contrastText,
          '&:hover': {
            ...baseStyles['&:hover'],
            filter: 'brightness(1.1)',
          },
        };

      case 'success':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
          color: 'white',
          '&:hover': {
            ...baseStyles['&:hover'],
            filter: 'brightness(1.1)',
          },
        };

      case 'warning':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
          color: 'white',
          '&:hover': {
            ...baseStyles['&:hover'],
            filter: 'brightness(1.1)',
          },
        };

      case 'error':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
          color: 'white',
          '&:hover': {
            ...baseStyles['&:hover'],
            filter: 'brightness(1.1)',
          },
        };

      case 'ghost':
        return {
          ...baseStyles,
          background: 'transparent',
          color: theme.palette.primary.main,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          '&:hover': {
            ...baseStyles['&:hover'],
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderColor: theme.palette.primary.main,
          },
        };

      case 'glass':
        return {
          ...baseStyles,
          background: isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          color: theme.palette.text.primary,
          '&:hover': {
            ...baseStyles['&:hover'],
            background: isDark 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(255, 255, 255, 0.4)',
          },
        };

      case 'gradient':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          '&:hover': {
            ...baseStyles['&:hover'],
            filter: 'brightness(1.1)',
          },
        };

      default:
        return baseStyles;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress 
            size={16} 
            sx={{ 
              color: variant === 'ghost' ? theme.palette.primary.main : 'white' 
            }} 
          />
          {children}
        </Box>
      );
    }

    if (icon) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {iconPosition === 'start' && icon}
          {children}
          {iconPosition === 'end' && icon}
        </Box>
      );
    }

    return children;
  };

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      sx={{
        ...getVariantStyles(),
        ...sx,
      }}
    >
      {renderContent()}
    </Button>
  );
};

export default ModernButton; 