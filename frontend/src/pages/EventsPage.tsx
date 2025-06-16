import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  Tabs,
  Tab,
  Fab,
  CardActions,
  TextField,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchMyEvents, fetchParticipatingEvents, fetchUpcomingEvents } from '../store/slices/eventSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`events-tabpanel-${index}`}
      aria-labelledby={`events-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { myEvents, participatingEvents, upcomingEvents, isLoading } = useAppSelector((state) => state.events);
  
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchMyEvents());
    dispatch(fetchParticipatingEvents());
    dispatch(fetchUpcomingEvents());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
      CHURRASCO: 'Churrasco',
      FESTA: 'Festa',
      JANTAR: 'Jantar',
      REUNIAO: 'Reunião',
      ANIVERSARIO: 'Aniversário',
    };
    return labels[type] || type;
  };

  const EventCard = ({ event }: { event: any }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {event.title}
          </Typography>
          <Chip
            label={getEventTypeLabel(event.type)}
            size="small"
            color={getEventTypeColor(event.type)}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.description || 'Sem descrição'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ScheduleIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(event.startDateTime)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {event.totalParticipants} participante{event.totalParticipants !== 1 ? 's' : ''}
            {event.maxParticipants && ` / ${event.maxParticipants}`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={event.organizer?.profilePicture}
            sx={{ width: 24, height: 24 }}
          >
            {event.organizer?.firstName?.[0]}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            Organizado por {event.organizer?.firstName} {event.organizer?.lastName}
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          Ver Detalhes
        </Button>
        <Button
          size="small"
          color="primary"
        >
          Participar
        </Button>
      </CardActions>
    </Card>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {message}
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate('/events/create')}
        sx={{ mt: 2 }}
      >
        Criar Primeiro Evento
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Meus Eventos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/events/create')}
        >
          Criar Evento
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Abas de eventos">
          <Tab label={`Meus Eventos (${myEvents.length})`} />
          <Tab label={`Participando (${participatingEvents.length})`} />
          <Tab label={`Próximos (${upcomingEvents.length})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {isLoading ? (
          <Typography>Carregando...</Typography>
        ) : myEvents.length === 0 ? (
          <EmptyState message="Você ainda não criou nenhum evento" />
        ) : (
          <Grid container spacing={3}>
            {myEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {isLoading ? (
          <Typography>Carregando...</Typography>
        ) : participatingEvents.length === 0 ? (
          <EmptyState message="Você não está participando de nenhum evento ainda" />
        ) : (
          <Grid container spacing={3}>
            {participatingEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {isLoading ? (
          <Typography>Carregando...</Typography>
        ) : upcomingEvents.length === 0 ? (
          <EmptyState message="Nenhum evento próximo encontrado" />
        ) : (
          <Grid container spacing={3}>
            {upcomingEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* FAB para criar evento */}
      <Fab
        color="primary"
        aria-label="Criar evento"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => navigate('/events/create')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default EventsPage; 