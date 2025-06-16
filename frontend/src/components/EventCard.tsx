import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Box,
  Button,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  bio: string;
  profilePicture: string;
  birthDate: string;
  isActive: boolean;
  isEmailVerified: boolean;
  eventsCreated: number;
  eventsAttended: number;
  totalFriends: number;
  points: number;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  type: 'CHURRASCO' | 'FESTA' | 'REUNIAO' | 'JANTAR' | 'OUTROS';
  isPrivate: boolean;
  maxParticipants: number;
  currentParticipants: number;
  inviteCode: string;
  organizer: User;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

interface EventCardProps {
  event: Event;
  onShare?: (event: Event) => void;
  onFavorite?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onShare, 
  onFavorite 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'CHURRASCO':
        return 'error';
      case 'FESTA':
        return 'secondary';
      case 'REUNIAO':
        return 'primary';
      case 'JANTAR':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'primary';
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        m: 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
        cursor: 'pointer'
      }}
      role="button"
      onClick={handleCardClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {event.title}
            {event.isPrivate && (
              <LockIcon 
                sx={{ ml: 1, fontSize: 16 }} 
                data-testid="lock-icon"
              />
            )}
          </Typography>
          <Chip
            label={event.type}
            size="small"
            color={getEventTypeColor(event.type) as any}
            variant="outlined"
          />
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, height: 40, overflow: 'hidden' }}
        >
          {event.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ScheduleIcon sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="body2">
            {formatEventDate(event.startDateTime)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationIcon sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="body2">
            {event.location}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="body2">
            {event.currentParticipants}/{event.maxParticipants} participantes
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Avatar 
            src={event.organizer.profilePicture} 
            sx={{ width: 24, height: 24, mr: 1 }}
          >
            {event.organizer.firstName[0]}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {event.organizer.firstName} {event.organizer.lastName}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Chip
            label={event.status}
            size="small"
            color={getStatusColor(event.status) as any}
            variant="filled"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button size="small" onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}>
          Ver Detalhes
        </Button>
        
        <Box>
          {onFavorite && (
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(event);
              }}
            >
              <FavoriteIcon />
            </IconButton>
          )}
          
          {onShare && (
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onShare(event);
              }}
            >
              <ShareIcon />
            </IconButton>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default EventCard; 