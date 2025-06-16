import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  IconButton,
  Fab,
  Paper,
  LinearProgress,
  Divider,
  Stack,
  Badge,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  PlayArrow as PlayArrowIcon,
  Explore as ExploreIcon,
  LocalFireDepartment as FireIcon,
  EmojiEvents as TrophyIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useModernTheme } from '../contexts/ModernThemeContext';
import { alpha } from '@mui/material/styles';

// 🎨 Componente Hero Section
const HeroSection: React.FC = () => {
  const { colors, isDark } = useModernTheme();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: 'Conecte-se através de eventos incríveis',
      subtitle: 'Descubra, crie e participe dos melhores eventos da sua cidade',
      image: '/api/placeholder/800/400',
      cta: 'Explorar Eventos',
      action: () => navigate('/events'),
    },
    {
      title: 'Crie memórias inesquecíveis',
      subtitle: 'Organize eventos únicos e reúna pessoas especiais',
      image: '/api/placeholder/800/400',
      cta: 'Criar Evento',
      action: () => navigate('/create-event'),
    },
    {
      title: 'Sua comunidade te espera',
      subtitle: 'Faça novos amigos e fortaleça conexões reais',
      image: '/api/placeholder/800/400',
      cta: 'Encontrar Amigos',
      action: () => navigate('/friends'),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: isDark
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1a2a 100%)'
          : 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 50%, #f0f4ff 100%)',
        overflow: 'hidden',
      }}
    >
      {/* 🌟 Elementos decorativos animados */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: colors.gradients.primary,
          opacity: 0.1,
          animation: 'floating 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: colors.gradients.secondary,
          opacity: 0.1,
          animation: 'floating 4s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box className="animate-fadeInUp">
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 3,
                  background: colors.gradients.primary,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                  animation: 'gradient 3s ease infinite',
                }}
              >
                {heroSlides[currentSlide].title}
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: isDark ? colors.neutral[300] : colors.neutral[600],
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: '500px',
                }}
              >
                {heroSlides[currentSlide].subtitle}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={heroSlides[currentSlide].action}
                  sx={{
                    borderRadius: '16px',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: colors.gradients.primary,
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5)',
                    },
                  }}
                >
                  {heroSlides[currentSlide].cta}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    borderRadius: '16px',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    borderColor: alpha(colors.primary[500], 0.3),
                    color: colors.primary[600],
                    '&:hover': {
                      borderColor: colors.primary[500],
                      backgroundColor: alpha(colors.primary[50], 0.5),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Ver Demo
                </Button>
              </Stack>

              {/* 📊 Estatísticas */}
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: colors.gradients.success,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      10K+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Eventos Criados
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: colors.gradients.warning,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      50K+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Usuários Ativos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: colors.gradients.secondary,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      100K+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Conexões Feitas
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              className="animate-slideInRight"
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* 🎨 Mockup de celular moderno */}
              <Box
                sx={{
                  width: { xs: 280, md: 320 },
                  height: { xs: 560, md: 640 },
                  background: isDark
                    ? 'linear-gradient(145deg, #1a1a1a, #2a2a2a)'
                    : 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                  borderRadius: '40px',
                  padding: '20px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${alpha(colors.neutral[300], 0.2)}`,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '4px',
                    backgroundColor: colors.neutral[400],
                    borderRadius: '2px',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '30px',
                    background: colors.gradients.sunset,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      textAlign: 'center',
                    }}
                  >
                    LETZ
                    <br />
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Conectando pessoas
                    </Typography>
                  </Typography>

                  {/* 🎯 Elementos flutuantes */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '20%',
                      right: '10%',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'floating 3s ease-in-out infinite',
                    }}
                  >
                    <EventIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '30%',
                      left: '15%',
                      width: 35,
                      height: 35,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'floating 4s ease-in-out infinite reverse',
                    }}
                  >
                    <PeopleIcon sx={{ color: 'white', fontSize: 18 }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* 🎯 Indicadores de slide */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {heroSlides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: currentSlide === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: currentSlide === index
                  ? colors.gradients.primary
                  : alpha(colors.neutral[400], 0.3),
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

// 🔥 Seção de Eventos em Destaque
const FeaturedEventsSection: React.FC = () => {
  const { colors, isDark } = useModernTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const featuredEvents = [
    {
      id: 1,
      title: 'Festival de Música Eletrônica',
      description: 'Uma noite épica com os melhores DJs da cidade',
      image: '/api/placeholder/400/250',
      date: '2024-07-15',
      location: 'São Paulo, SP',
      attendees: 1250,
      price: 'R$ 80',
      category: 'Música',
      rating: 4.8,
      isHot: true,
    },
    {
      id: 2,
      title: 'Workshop de Culinária Italiana',
      description: 'Aprenda a fazer massas autênticas com chef renomado',
      image: '/api/placeholder/400/250',
      date: '2024-07-20',
      location: 'Rio de Janeiro, RJ',
      attendees: 45,
      price: 'R$ 120',
      category: 'Gastronomia',
      rating: 4.9,
      isHot: false,
    },
    {
      id: 3,
      title: 'Meetup de Tecnologia',
      description: 'Networking e palestras sobre as últimas tendências tech',
      image: '/api/placeholder/400/250',
      date: '2024-07-18',
      location: 'Belo Horizonte, MG',
      attendees: 200,
      price: 'Gratuito',
      category: 'Tecnologia',
      rating: 4.7,
      isHot: true,
    },
  ];

  const EventCard: React.FC<{ event: typeof featuredEvents[0] }> = ({ event }) => (
    <Card
      className="hover-lift"
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
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={() => navigate(`/events/${event.id}`)}
    >
      {event.isHot && (
        <Chip
          icon={<FireIcon />}
          label="Em Alta"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            background: colors.gradients.warning,
            color: 'white',
            fontWeight: 600,
          }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        {loading ? (
          <Skeleton variant="rectangular" height={200} />
        ) : (
          <CardMedia
            component="img"
            height="200"
            image={event.image}
            alt={event.title}
            sx={{
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        )}

        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <FavoriteIcon sx={{ color: colors.error[500] }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Chip
            label={event.category}
            size="small"
            sx={{
              background: colors.gradients.secondary,
              color: 'white',
              fontWeight: 500,
              mr: 1,
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <StarIcon sx={{ color: colors.warning[500], fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2" fontWeight={600}>
              {event.rating}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: colors.primary[500] }} />
            <Typography variant="body2">
              {new Date(event.date).toLocaleDateString('pt-BR')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: colors.secondary[500] }} />
            <Typography variant="body2">{event.location}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ fontSize: 16, mr: 0.5, color: colors.success[500] }} />
            <Typography variant="body2">{event.attendees} participantes</Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.primary[600],
            }}
          >
            {event.price}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ py: 8, background: isDark ? 'transparent' : alpha(colors.neutral[50], 0.5) }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: colors.gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Eventos em Destaque
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
          >
            Descubra os eventos mais populares e emocionantes acontecendo agora
          </Typography>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ExploreIcon />}
            onClick={() => navigate('/events')}
            sx={{
              borderRadius: '12px',
              px: 4,
              borderWidth: 2,
              borderColor: alpha(colors.primary[500], 0.3),
              color: colors.primary[600],
              '&:hover': {
                borderColor: colors.primary[500],
                backgroundColor: alpha(colors.primary[50], 0.5),
                transform: 'translateY(-2px)',
              },
            }}
          >
            Ver Todos os Eventos
          </Button>
        </Box>

        <Grid container spacing={4}>
          {featuredEvents.map((event) => (
            <Grid item xs={12} md={6} lg={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// 🏆 Seção de Gamificação
const GamificationSection: React.FC = () => {
  const { colors, isDark } = useModernTheme();

  const achievements = [
    { icon: <TrophyIcon />, title: 'Organizador Expert', progress: 75 },
    { icon: <GroupIcon />, title: 'Conectador Social', progress: 60 },
    { icon: <StarIcon />, title: 'Avaliador Top', progress: 90 },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                background: colors.gradients.success,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Conquiste e Evolua
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Participe de eventos, faça conexões e desbloqueie conquistas incríveis
            </Typography>

            <Stack spacing={3}>
              {achievements.map((achievement, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: colors.gradients.warning,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      {React.cloneElement(achievement.icon, { sx: { color: 'white' } })}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {achievement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.progress}% concluído
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={achievement.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(colors.neutral[300], 0.3),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: colors.gradients.success,
                      },
                    }}
                  />
                </Paper>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {/* 🎯 Círculo de progresso animado */}
              <Box
                sx={{
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: colors.gradients.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  animation: 'pulse 3s infinite',
                }}
              >
                <Box
                  sx={{
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    background: isDark ? '#1a1a1a' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: colors.gradients.primary,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Nível 12
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Organizador Expert
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, color: colors.warning[500] }}>
                    2,450 XP
                  </Typography>
                </Box>

                {/* 🏆 Badges flutuantes */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '10%',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: colors.gradients.success,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'floating 4s ease-in-out infinite',
                  }}
                >
                  <TrophyIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '5%',
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: colors.gradients.warning,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'floating 3s ease-in-out infinite reverse',
                  }}
                >
                  <StarIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// 🎉 Componente principal da HomePage
const ModernHomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <HeroSection />
      <FeaturedEventsSection />
      <GamificationSection />
      
      {/* 🚀 FAB para criar evento */}
      <Fab
        color="primary"
        aria-label="criar evento"
        onClick={() => navigate('/create-event')}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5)',
          },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ModernHomePage; 