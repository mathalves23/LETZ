import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  AvatarGroup,
  Button,
  Tooltip,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useModernTheme } from '../contexts/ModernThemeContext';
import { alpha } from '@mui/material/styles';

interface ModernEventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    image: string;
    date: string;
    location: string;
    attendees: number;
    maxAttendees?: number;
    price: string;
    category: string;
    rating?: number;
    isHot?: boolean;
    isTrending?: boolean;
    isVerified?: boolean;
    organizer: {
      name: string;
      avatar?: string;
      isVerified?: boolean;
    };
    attendeeAvatars?: string[];
  };
  onLike?: (eventId: number) => void;
  onShare?: (eventId: number) => void;
  onClick?: (eventId: number) => void;
  isLiked?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const ModernEventCard: React.FC<ModernEventCardProps> = ({
  event,
  onLike,
  onShare,
  onClick,
  isLiked = false,
  variant = 'default',
}) => {
  const { colors, isDark } = useModernTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(isLiked);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    onLike?.(event.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(event.id);
  };

  const handleClick = () => {
    onClick?.(event.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('pt-BR', { month: 'short' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getAttendancePercentage = () => {
    if (!event.maxAttendees) return 0;
    return (event.attendees / event.maxAttendees) * 100;
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'Música': colors.gradients.secondary,
      'Gastronomia': colors.gradients.warning,
      'Tecnologia': colors.gradients.primary,
      'Esportes': colors.gradients.success,
      'Arte': colors.gradients.sunset,
      'Negócios': colors.gradients.ocean,
    };
    return categoryColors[category] || colors.gradients.primary;
  };

  const dateInfo = formatDate(event.date);
  const attendancePercentage = getAttendancePercentage();

  if (variant === 'compact') {
    return (
      <Card
        onClick={handleClick}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          background: isDark
            ? 'rgba(26, 26, 26, 0.8)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(
            isDark ? colors.neutral[700] : colors.neutral[200],
            0.3
          )}`,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${alpha(colors.primary[500], 0.3)}`,
          },
          height: 120,
          display: 'flex',
        }}
      >
        <Box sx={{ position: 'relative', width: 120, flexShrink: 0 }}>
          <CardMedia
            component="img"
            height="120"
            image={event.image}
            alt={event.title}
            onLoad={() => setImageLoaded(true)}
            sx={{
              transition: 'transform 0.3s ease',
              filter: imageLoaded ? 'none' : 'blur(5px)',
            }}
          />
          {event.isHot && (
            <Chip
              icon={<FireIcon />}
              label="Hot"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: colors.gradients.warning,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            <CalendarIcon sx={{ fontSize: 14, color: colors.primary[500] }} />
            <Typography variant="body2" color="text.secondary">
              {dateInfo.day} {dateInfo.month}
            </Typography>
            <LocationIcon sx={{ fontSize: 14, color: colors.secondary[500], ml: 1 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {event.location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary[600] }}>
              {event.price}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton size="small" onClick={handleLike}>
                {liked ? (
                  <FavoriteIcon sx={{ color: colors.error[500], fontSize: 18 }} />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
              <IconButton size="small" onClick={handleShare}>
                <ShareIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={handleClick}
      sx={{
        borderRadius: variant === 'featured' ? '24px' : '20px',
        overflow: 'hidden',
        background: isDark
          ? 'rgba(26, 26, 26, 0.8)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(
          isDark ? colors.neutral[700] : colors.neutral[200],
          0.3
        )}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: variant === 'featured' 
            ? '0 20px 60px rgba(0, 0, 0, 0.2)'
            : '0 12px 40px rgba(0, 0, 0, 0.15)',
          border: `1px solid ${alpha(colors.primary[500], 0.3)}`,
          '& .event-image': {
            transform: 'scale(1.05)',
          },
        },
        ...(variant === 'featured' && {
          background: `linear-gradient(135deg, ${alpha(colors.primary[50], 0.8)} 0%, ${alpha(colors.secondary[50], 0.8)} 100%)`,
          border: `2px solid ${alpha(colors.primary[300], 0.3)}`,
        }),
      }}
    >
      {/* 🏷️ Badges */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', gap: 1 }}>
        {event.isHot && (
          <Chip
            icon={<FireIcon />}
            label="Em Alta"
            size="small"
            sx={{
              background: colors.gradients.warning,
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
            }}
          />
        )}
        {event.isTrending && (
          <Chip
            icon={<TrendingIcon />}
            label="Trending"
            size="small"
            sx={{
              background: colors.gradients.success,
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
            }}
          />
        )}
      </Box>

      {/* 🎯 Ações */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, display: 'flex', gap: 1 }}>
        <Tooltip title={liked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
          <IconButton
            size="small"
            onClick={handleLike}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
              },
            }}
          >
            {liked ? (
              <FavoriteIcon sx={{ color: colors.error[500] }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Compartilhar">
          <IconButton
            size="small"
            onClick={handleShare}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 📅 Data destacada */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '8px 12px',
          textAlign: 'center',
          border: `1px solid ${alpha(colors.neutral[200], 0.5)}`,
          display: variant === 'featured' ? 'block' : 'none',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: colors.primary[600], lineHeight: 1 }}>
          {dateInfo.day}
        </Typography>
        <Typography variant="caption" sx={{ color: colors.neutral[600], textTransform: 'uppercase' }}>
          {dateInfo.month}
        </Typography>
      </Box>

      {/* 🖼️ Imagem */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={variant === 'featured' ? 280 : 200}
          image={event.image}
          alt={event.title}
          className="event-image"
          onLoad={() => setImageLoaded(true)}
          sx={{
            transition: 'all 0.3s ease',
            filter: imageLoaded ? 'none' : 'blur(5px)',
          }}
        />
        
        {/* 📊 Barra de ocupação */}
        {event.maxAttendees && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              p: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                {event.attendees}/{event.maxAttendees} participantes
              </Typography>
              <Typography variant="caption" sx={{ color: 'white' }}>
                {Math.round(attendancePercentage)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={attendancePercentage}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: alpha('#ffffff', 0.3),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                  background: attendancePercentage > 80 
                    ? colors.gradients.warning 
                    : attendancePercentage > 50 
                    ? colors.gradients.success 
                    : colors.gradients.primary,
                },
              }}
            />
          </Box>
        )}
      </Box>

      <CardContent sx={{ p: variant === 'featured' ? 3 : 2.5 }}>
        {/* 🏷️ Categoria e Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Chip
            label={event.category}
            size="small"
            sx={{
              background: getCategoryColor(event.category),
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
          {event.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ color: colors.warning[500], fontSize: 16 }} />
              <Typography variant="body2" fontWeight={600}>
                {event.rating}
              </Typography>
            </Box>
          )}
        </Box>

        {/* 📝 Título */}
        <Typography
          variant={variant === 'featured' ? 'h5' : 'h6'}
          sx={{
            fontWeight: 700,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
          }}
        >
          {event.title}
        </Typography>

        {/* 📄 Descrição */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: variant === 'featured' ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {event.description}
        </Typography>

        {/* 📍 Informações do evento */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ fontSize: 16, color: colors.primary[500] }} />
            <Typography variant="body2">
              {dateInfo.day} de {dateInfo.month} às {dateInfo.time}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon sx={{ fontSize: 16, color: colors.secondary[500] }} />
            <Typography variant="body2" noWrap>
              {event.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ fontSize: 16, color: colors.success[500] }} />
            <Typography variant="body2">
              {event.attendees} participantes
            </Typography>
          </Box>
        </Box>

        {/* 👥 Organizador e participantes */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={event.organizer.avatar}
              sx={{
                width: 32,
                height: 32,
                background: colors.gradients.sunset,
              }}
            >
              {event.organizer.name[0]}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  {event.organizer.name}
                </Typography>
                {event.organizer.isVerified && (
                  <VerifiedIcon sx={{ fontSize: 14, color: colors.primary[500] }} />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Organizador
              </Typography>
            </Box>
          </Box>

          {event.attendeeAvatars && event.attendeeAvatars.length > 0 && (
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
              {event.attendeeAvatars.map((avatar, index) => (
                <Avatar key={index} src={avatar} />
              ))}
            </AvatarGroup>
          )}
        </Box>

        {/* 💰 Preço e ação */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant={variant === 'featured' ? 'h5' : 'h6'}
            sx={{
              fontWeight: 800,
              background: colors.gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {event.price}
          </Typography>
          
          <Button
            variant="contained"
            size={variant === 'featured' ? 'large' : 'medium'}
            sx={{
              borderRadius: '12px',
              background: colors.gradients.primary,
              px: variant === 'featured' ? 4 : 3,
              fontWeight: 600,
              '&:hover': {
                background: colors.gradients.primary,
                filter: 'brightness(1.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Participar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ModernEventCard; 