import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  IconButton,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Event as EventIcon,
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
  PhotoCamera as PhotoIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Activity {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  targetUser?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  event?: {
    id: number;
    title: string;
    imageUrl?: string;
  };
  activityType: string;
  title: string;
  description?: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  createdAt: string;
}

interface ActivityFeedProps {
  userId?: number;
  eventId?: number;
  limit?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  userId, 
  eventId, 
  limit = 20 
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [userId, eventId]);

  const loadActivities = async (pageNum = 0) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pageNum.toString(),
        size: limit.toString(),
      });
      
      if (userId) params.append('userId', userId.toString());
      if (eventId) params.append('eventId', eventId.toString());
      
      const response = await fetch(`/api/activities/feed?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar atividades');
      }
      
      const data = await response.json();
      
      if (pageNum === 0) {
        setActivities(data.content);
      } else {
        setActivities(prev => [...prev, ...data.content]);
      }
      
      setHasMore(!data.last);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (activityId: number) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        setActivities(prev => prev.map(activity => 
          activity.id === activityId
            ? {
                ...activity,
                isLiked: !activity.isLiked,
                likesCount: activity.isLiked 
                  ? activity.likesCount - 1 
                  : activity.likesCount + 1
              }
            : activity
        ));
      }
    } catch (error) {
      console.error('Erro ao curtir atividade:', error);
    }
  };

  const handleShare = async (activityId: number) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        setActivities(prev => prev.map(activity => 
          activity.id === activityId
            ? { ...activity, sharesCount: activity.sharesCount + 1 }
            : activity
        ));
      }
    } catch (error) {
      console.error('Erro ao compartilhar atividade:', error);
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'EVENT_CREATED':
      case 'EVENT_JOINED':
      case 'EVENT_COMPLETED':
        return <EventIcon color="primary" />;
      case 'FRIEND_ADDED':
      case 'FRIEND_REQUEST_ACCEPTED':
        return <PersonIcon color="secondary" />;
      case 'ACHIEVEMENT_UNLOCKED':
      case 'LEVEL_UP':
      case 'BADGE_EARNED':
        return <TrophyIcon color="warning" />;
      case 'PHOTO_UPLOADED':
        return <PhotoIcon color="info" />;
      default:
        return <EventIcon />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'EVENT_CREATED':
        return 'success';
      case 'EVENT_JOINED':
        return 'primary';
      case 'FRIEND_ADDED':
        return 'secondary';
      case 'ACHIEVEMENT_UNLOCKED':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading && activities.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (activities.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography variant="h6" color="text.secondary">
          Nenhuma atividade encontrada
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comece a interagir para ver atividades aqui!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <List disablePadding>
        {activities.map((activity, index) => (
          <ListItem key={activity.id} disablePadding>
            <Card sx={{ width: '100%', mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={activity.user.profilePicture}
                    sx={{ mr: 2 }}
                  >
                    {activity.user.firstName[0]}
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getActivityIcon(activity.activityType)}
                      <Typography variant="body1">
                        <strong>{activity.user.firstName} {activity.user.lastName}</strong>
                        {' '}{activity.title}
                        {activity.targetUser && (
                          <span> <strong>{activity.targetUser.firstName}</strong></span>
                        )}
                        {activity.event && (
                          <span> "{activity.event.title}"</span>
                        )}
                      </Typography>
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={activity.activityType.replace('_', ' ')}
                    size="small"
                    color={getActivityColor(activity.activityType) as any}
                    variant="outlined"
                  />
                </Box>

                {activity.description && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {activity.description}
                  </Typography>
                )}

                {activity.imageUrl && (
                  <Box
                    component="img"
                    src={activity.imageUrl}
                    alt="Atividade"
                    sx={{
                      width: '100%',
                      maxHeight: 300,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                )}

                {activity.event?.imageUrl && (
                  <Box
                    component="img"
                    src={activity.event.imageUrl}
                    alt={activity.event.title}
                    sx={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                )}
              </CardContent>

              <Divider />

              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => handleLike(activity.id)}
                    color={activity.isLiked ? 'error' : 'default'}
                    size="small"
                  >
                    {activity.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography variant="body2" sx={{ pt: 1 }}>
                    {activity.likesCount}
                  </Typography>

                  <IconButton size="small">
                    <CommentIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ pt: 1 }}>
                    {activity.commentsCount}
                  </Typography>

                  <IconButton
                    onClick={() => handleShare(activity.id)}
                    size="small"
                  >
                    <ShareIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ pt: 1 }}>
                    {activity.sharesCount}
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>

      {hasMore && (
        <Box textAlign="center" p={2}>
          <Button
            variant="outlined"
            onClick={() => loadActivities(page + 1)}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Carregando...' : 'Carregar mais'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ActivityFeed; 