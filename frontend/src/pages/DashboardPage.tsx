import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Fab,
  Paper,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  EventNote as EventIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Celebration as CelebrationIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUpcomingEvents } from '../store/slices/eventSlice';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { upcomingEvents, isLoading } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchUpcomingEvents());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: any } = {
      CHURRASCO: 'success',
      FESTA: 'primary',
      JANTAR: 'secondary',
      REUNIAO: 'info',
      ANIVERSARIO: 'warning',
    };
    return colors[type] || 'default';
  };

  const getEventTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      CHURRASCO: '🥩 Churrasco',
      FESTA: '🎉 Festa',
      JANTAR: '🍽️ Jantar',
      REUNIAO: '👥 Reunião',
      ANIVERSARIO: '🎂 Aniversário',
    };
    return labels[type] || type;
  };

  const getEventTypeEmoji = (type: string) => {
    const emojis: { [key: string]: string } = {
      CHURRASCO: '🥩',
      FESTA: '🎉',
      JANTAR: '🍽️',
      REUNIAO: '👥',
      ANIVERSARIO: '🎂',
    };
    return emojis[type] || '📅';
  };

  const userLevel = Math.floor((user?.points || 0) / 100) + 1;
  const pointsToNextLevel = 100 - ((user?.points || 0) % 100);
  const progressToNextLevel = ((user?.points || 0) % 100) / 100 * 100;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(106, 13, 173, 0.05) 0%, rgba(0, 123, 255, 0.05) 50%, rgba(0, 196, 180, 0.05) 100%)',
        pb: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Header com boas-vindas */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                mr: 2,
                background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                fontSize: '1.5rem',
              }}
            >
              {user?.firstName?.charAt(0) || '👤'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                Olá, {user?.firstName}! 👋
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Bem-vindo de volta ao LETZ. O que vamos organizar hoje?
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#6A0DAD' }}>
                Level {userLevel}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <TrophyIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  {pointsToNextLevel} pts para o próximo nível
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressToNextLevel}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(106, 13, 173, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Cards de Estatísticas */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(106, 13, 173, 0.1) 0%, rgba(0, 123, 255, 0.1) 100%)',
                border: '1px solid rgba(106, 13, 173, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(106, 13, 173, 0.15)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 500 }}>
                      Eventos Criados
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#6A0DAD' }}>
                      {user?.eventsCreated || 0}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                      width: 56,
                      height: 56,
                    }}
                  >
                    <EventIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(0, 196, 180, 0.1) 0%, rgba(127, 255, 0, 0.1) 100%)',
                border: '1px solid rgba(0, 196, 180, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0, 196, 180, 0.15)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 500 }}>
                      Amigos
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#00C4B4' }}>
                      {user?.totalFriends || 0}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      background: 'linear-gradient(135deg, #00C4B4 0%, #7FFF00 100%)',
                      width: 56,
                      height: 56,
                    }}
                  >
                    <PeopleIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(255, 215, 0, 0.15)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 500 }}>
                      Pontos
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFD700' }}>
                      {user?.points || 0}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      background: 'linear-gradient(135deg, #FFD700 0%, #FF69B4 100%)',
                      width: 56,
                      height: 56,
                    }}
                  >
                    <StarIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.1) 0%, rgba(106, 13, 173, 0.1) 100%)',
                border: '1px solid rgba(255, 105, 180, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(255, 105, 180, 0.15)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 500 }}>
                      Rank
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF69B4' }}>
                      #1
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      background: 'linear-gradient(135deg, #FF69B4 0%, #6A0DAD 100%)',
                      width: 56,
                      height: 56,
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Próximos Eventos */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#333333' }}>
                    🗓️ Próximos Eventos
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/events')}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderColor: '#6A0DAD',
                      color: '#6A0DAD',
                      '&:hover': {
                        borderColor: '#6A0DAD',
                        backgroundColor: 'rgba(106, 13, 173, 0.05)',
                      },
                    }}
                  >
                    Ver Todos
                  </Button>
                </Box>

                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <LinearProgress sx={{ width: '50%' }} />
                  </Box>
                ) : upcomingEvents.length === 0 ? (
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(106, 13, 173, 0.05) 0%, rgba(0, 123, 255, 0.05) 100%)',
                      border: '1px solid rgba(106, 13, 173, 0.1)',
                      borderRadius: 3,
                    }}
                  >
                    <CelebrationIcon sx={{ fontSize: 64, color: '#6A0DAD', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Nenhum evento próximo
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Que tal criar seu primeiro evento e começar a diversão?
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/events/create')}
                      sx={{
                        background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #8A2BE2 0%, #40A9FF 100%)',
                        },
                      }}
                    >
                      Criar Primeiro Evento
                    </Button>
                  </Paper>
                ) : (
                  <List sx={{ p: 0 }}>
                    {upcomingEvents.slice(0, 5).map((event, index) => (
                      <ListItem
                        key={event.id}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 2,
                          mb: 1,
                          background: 'rgba(255, 255, 255, 0.7)',
                          border: '1px solid rgba(106, 13, 173, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(106, 13, 173, 0.05)',
                            transform: 'translateX(8px)',
                            boxShadow: '0 4px 20px rgba(106, 13, 173, 0.1)',
                          },
                        }}
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                              width: 48,
                              height: 48,
                              fontSize: '1.2rem',
                            }}
                          >
                            {getEventTypeEmoji(event.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333333' }}>
                                {event.title}
                              </Typography>
                              <Chip
                                label={getEventTypeLabel(event.type)}
                                size="small"
                                color={getEventTypeColor(event.type)}
                                sx={{
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ScheduleIcon sx={{ fontSize: 16, color: '#666666' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(event.startDateTime)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationIcon sx={{ fontSize: 16, color: '#666666' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {event.location}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        <IconButton
                          sx={{
                            color: '#6A0DAD',
                            '&:hover': {
                              backgroundColor: 'rgba(106, 13, 173, 0.1)',
                            },
                          }}
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Ações Rápidas */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#333333', mb: 3 }}>
                  ⚡ Ações Rápidas
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/events/create')}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #8A2BE2 0%, #40A9FF 100%)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Criar Evento
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/friends')}
                    sx={{
                      py: 1.5,
                      borderColor: '#00C4B4',
                      color: '#00C4B4',
                      '&:hover': {
                        borderColor: '#00C4B4',
                        backgroundColor: 'rgba(0, 196, 180, 0.05)',
                      },
                    }}
                  >
                    Gerenciar Amigos
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/events')}
                    sx={{
                      py: 1.5,
                      borderColor: '#FF69B4',
                      color: '#FF69B4',
                      '&:hover': {
                        borderColor: '#FF69B4',
                        backgroundColor: 'rgba(255, 105, 180, 0.05)',
                      },
                    }}
                  >
                    Meus Eventos
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/profile')}
                    sx={{
                      py: 1.5,
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '&:hover': {
                        borderColor: '#FFD700',
                        backgroundColor: 'rgba(255, 215, 0, 0.05)',
                      },
                    }}
                  >
                    Editar Perfil
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FAB para criar evento */}
        <Fab
          color="primary"
          aria-label="Criar evento"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
            boxShadow: '0 8px 30px rgba(106, 13, 173, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #8A2BE2 0%, #40A9FF 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 40px rgba(106, 13, 173, 0.4)',
            },
          }}
          onClick={() => navigate('/events/create')}
        >
          <AddIcon sx={{ fontSize: 32 }} />
        </Fab>
      </Container>
    </Box>
  );
};

export default DashboardPage;

