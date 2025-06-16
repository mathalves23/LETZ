import React from 'react';
import { Box, Typography, CircularProgress, Skeleton, Card, CardContent } from '@mui/material';
import { useModernTheme } from '../contexts/ModernThemeContext';
import { alpha } from '@mui/material/styles';

interface ModernLoadingProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'wave' | 'dots';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

// 🌊 Loading com ondas
const WaveLoading: React.FC<{ size: string; colors: any }> = ({ size, colors }) => {
  const waveSize = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <Box
          key={index}
          sx={{
            width: 8,
            height: waveSize,
            background: colors.gradients.primary,
            borderRadius: '4px',
            animation: `wave 1.2s ease-in-out infinite`,
            animationDelay: `${index * 0.1}s`,
            '@keyframes wave': {
              '0%, 40%, 100%': {
                transform: 'scaleY(0.4)',
              },
              '20%': {
                transform: 'scaleY(1)',
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

// 🔵 Loading com pontos
const DotsLoading: React.FC<{ size: string; colors: any }> = ({ size, colors }) => {
  const dotSize = size === 'small' ? 8 : size === 'medium' ? 12 : 16;
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: colors.gradients.secondary,
            animation: `bounce 1.4s ease-in-out infinite both`,
            animationDelay: `${index * 0.16}s`,
            '@keyframes bounce': {
              '0%, 80%, 100%': {
                transform: 'scale(0)',
              },
              '40%': {
                transform: 'scale(1)',
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

// 💫 Loading com pulso
const PulseLoading: React.FC<{ size: string; colors: any }> = ({ size, colors }) => {
  const pulseSize = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: pulseSize,
        height: pulseSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: alpha(colors.primary[500], 0.3),
            animation: `pulse 2s ease-in-out infinite`,
            animationDelay: `${index * 0.4}s`,
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 0,
              },
            },
          }}
        />
      ))}
      <Box
        sx={{
          width: pulseSize / 2,
          height: pulseSize / 2,
          borderRadius: '50%',
          background: colors.gradients.primary,
          zIndex: 1,
        }}
      />
    </Box>
  );
};

// 🦴 Skeleton moderno
const ModernSkeleton: React.FC<{ type: string }> = ({ type }) => {
  const { colors, isDark } = useModernTheme();
  
  const skeletonColor = isDark 
    ? alpha(colors.neutral[700], 0.3)
    : alpha(colors.neutral[200], 0.6);
    
  const highlightColor = isDark
    ? alpha(colors.neutral[600], 0.5)
    : alpha(colors.neutral[100], 0.8);

  if (type === 'card') {
    return (
      <Card
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          background: isDark
            ? 'rgba(26, 26, 26, 0.8)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(
            isDark ? colors.neutral[700] : colors.neutral[200],
            0.3
          )}`,
        }}
      >
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{
            backgroundColor: skeletonColor,
            '&::after': {
              background: `linear-gradient(90deg, transparent, ${highlightColor}, transparent)`,
            },
          }}
        />
        <CardContent>
          <Skeleton
            variant="text"
            height={32}
            sx={{
              backgroundColor: skeletonColor,
              borderRadius: '8px',
              mb: 1,
            }}
          />
          <Skeleton
            variant="text"
            height={20}
            width="80%"
            sx={{
              backgroundColor: skeletonColor,
              borderRadius: '6px',
              mb: 2,
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Skeleton
              variant="rectangular"
              width={60}
              height={24}
              sx={{
                backgroundColor: skeletonColor,
                borderRadius: '12px',
              }}
            />
            <Skeleton
              variant="rectangular"
              width={80}
              height={24}
              sx={{
                backgroundColor: skeletonColor,
                borderRadius: '12px',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton
              variant="text"
              width={100}
              height={20}
              sx={{
                backgroundColor: skeletonColor,
                borderRadius: '6px',
              }}
            />
            <Skeleton
              variant="text"
              width={60}
              height={24}
              sx={{
                backgroundColor: skeletonColor,
                borderRadius: '6px',
              }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Skeleton
        variant="text"
        height={40}
        sx={{
          backgroundColor: skeletonColor,
          borderRadius: '8px',
          mb: 2,
        }}
      />
      <Skeleton
        variant="text"
        height={20}
        width="60%"
        sx={{
          backgroundColor: skeletonColor,
          borderRadius: '6px',
          mb: 1,
        }}
      />
      <Skeleton
        variant="text"
        height={20}
        width="80%"
        sx={{
          backgroundColor: skeletonColor,
          borderRadius: '6px',
        }}
      />
    </Box>
  );
};

const ModernLoading: React.FC<ModernLoadingProps> = ({
  type = 'spinner',
  size = 'medium',
  text,
  fullScreen = false,
}) => {
  const { colors, isDark } = useModernTheme();

  const renderLoading = () => {
    switch (type) {
      case 'wave':
        return <WaveLoading size={size} colors={colors} />;
      case 'dots':
        return <DotsLoading size={size} colors={colors} />;
      case 'pulse':
        return <PulseLoading size={size} colors={colors} />;
      case 'skeleton':
        return <ModernSkeleton type="card" />;
      default:
        return (
          <CircularProgress
            size={size === 'small' ? 24 : size === 'medium' ? 40 : 56}
            thickness={4}
            sx={{
              color: colors.primary[500],
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
        );
    }
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'rgba(10, 10, 10, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          zIndex: 9999,
        }),
      }}
    >
      {renderLoading()}
      
      {text && (
        <Typography
          variant={size === 'small' ? 'body2' : 'body1'}
          sx={{
            color: isDark ? colors.neutral[300] : colors.neutral[600],
            fontWeight: 500,
            textAlign: 'center',
            animation: 'fadeInOut 2s ease-in-out infinite',
            '@keyframes fadeInOut': {
              '0%, 100%': {
                opacity: 0.6,
              },
              '50%': {
                opacity: 1,
              },
            },
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );

  return content;
};

// 🎯 Hook para loading states
export const useModernLoading = () => {
  const [loading, setLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('');

  const showLoading = (text?: string) => {
    setLoadingText(text || '');
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
    setLoadingText('');
  };

  return {
    loading,
    loadingText,
    showLoading,
    hideLoading,
  };
};

export default ModernLoading; 