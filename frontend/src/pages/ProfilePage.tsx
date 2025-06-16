import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  EmojiEvents as TrophyIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Star as StarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { userAPI } from '../services/api';

interface UserStats {
  eventsCreated: number;
  eventsAttended: number;
  friendsCount: number;
  totalPoints: number;
  badges: Badge[];
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
}

function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setIsLoading(true);
      // Aqui você faria chamadas para buscar estatísticas do usuário
      // Por enquanto, vamos usar dados mockados
      setStats({
        eventsCreated: 12,
        eventsAttended: 28,
        friendsCount: 45,
        totalPoints: user?.points || 0,
        badges: [
          {
            id: 1,
            name: 'Organizador',
            description: 'Criou seu primeiro evento',
            icon: '🎯',
            color: 'primary',
            earnedAt: '2024-01-15',
          },
          {
            id: 2,
            name: 'Social',
            description: 'Tem mais de 20 amigos',
            icon: '👥',
            color: 'success',
            earnedAt: '2024-02-10',
          },
          {
            id: 3,
            name: 'Participante Ativo',
            description: 'Participou de 25+ eventos',
            icon: '🎪',
            color: 'warning',
            earnedAt: '2024-03-05',
          },
        ],
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setError('Erro ao carregar estatísticas do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await userAPI.updateProfile(editForm);
      
      // Aqui você atualizaria o estado global do usuário
      setEditDialogOpen(false);
      
      // Mostrar mensagem de sucesso
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'primary':
        return 'primary';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading && !stats) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Header do Perfil */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{ width: 120, height: 120 }}
            src={user?.profilePicture}
          >
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              @{user?.username}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {user?.bio || 'Nenhuma biografia adicionada ainda.'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                icon={<StarIcon />}
                label={`${stats?.totalPoints || 0} pontos`}
                color="primary"
                variant="outlined"
              />
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditDialogOpen(true)}
              >
                Editar Perfil
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Estatísticas */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Estatísticas
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Eventos Criados"
                    secondary={stats?.eventsCreated || 0}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <TrophyIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Eventos Participados"
                    secondary={stats?.eventsAttended || 0}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <GroupIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Amigos"
                    secondary={stats?.friendsCount || 0}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Badges */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏆 Conquistas
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {stats?.badges.map((badge) => (
                  <Chip
                    key={badge.id}
                    label={`${badge.icon} ${badge.name}`}
                    color={getBadgeColor(badge.color) as any}
                    variant="outlined"
                    title={badge.description}
                  />
                ))}
                {(!stats?.badges || stats.badges.length === 0) && (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma conquista ainda. Continue participando de eventos!
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Informações de Contato */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📞 Informações de Contato
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={user?.email}
                  />
                </ListItem>
                
                {user?.phoneNumber && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Telefone"
                      secondary={user.phoneNumber}
                    />
                  </ListItem>
                )}
                
                {user?.birthDate && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Data de Nascimento"
                      secondary={new Date(user.birthDate).toLocaleDateString('pt-BR')}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Edição */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome"
              value={editForm.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              fullWidth
            />
            
            <TextField
              label="Sobrenome"
              value={editForm.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              fullWidth
            />
            
            <TextField
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
            />
            
            <TextField
              label="Telefone"
              value={editForm.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              fullWidth
            />
            
            <TextField
              label="Biografia"
              multiline
              rows={3}
              value={editForm.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              fullWidth
              placeholder="Conte um pouco sobre você..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleEditProfile}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProfilePage; 