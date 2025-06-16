import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { eventAPI, eventItemAPI } from '../services/api';

interface EventDetails {
  id: number;
  title: string;
  description: string;
  type: string;
  startDateTime: string;
  endDateTime?: string;
  location: string;
  address?: string;
  maxParticipants?: number;
  isPrivate: boolean;
  requiresApproval: boolean;
  totalCost?: number;
  hasCostSharing: boolean;
  inviteCode: string;
  creator: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  participants: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: 'CONFIRMED' | 'PENDING' | 'DECLINED';
  }>;
  items: Array<{
    id: number;
    name: string;
    description?: string;
    quantity: number;
    category?: string;
    isRequired: boolean;
    isMonetary: boolean;
    estimatedCost?: number;
    assignedTo?: {
      id: number;
      firstName: string;
      lastName: string;
    };
    isCompleted: boolean;
  }>;
}

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
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 1,
    category: '',
    isRequired: false,
    isMonetary: false,
    estimatedCost: 0,
  });

  useEffect(() => {
    if (eventId) {
      loadEventDetails();
    }
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      setIsLoading(true);
      const response = await eventAPI.getEventById(Number(eventId));
      setEvent(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao carregar detalhes do evento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    try {
      if (!event) return;
      await eventAPI.joinEvent(event.id);
      await loadEventDetails(); // Recarregar para atualizar participantes
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao participar do evento');
    }
  };

  const handleLeaveEvent = async () => {
    try {
      if (!event) return;
      await eventAPI.leaveEvent(event.id);
      await loadEventDetails(); // Recarregar para atualizar participantes
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao sair do evento');
    }
  };

  const handleAddItem = async () => {
    try {
      if (!event) return;
      await eventItemAPI.createEventItem(event.id, newItem);
      setItemDialogOpen(false);
      setNewItem({
        name: '',
        description: '',
        quantity: 1,
        category: '',
        isRequired: false,
        isMonetary: false,
        estimatedCost: 0,
      });
      await loadEventDetails(); // Recarregar para atualizar itens
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao adicionar item');
    }
  };

  const handleAssignItem = async (itemId: number, userId: number) => {
    try {
      if (!event) return;
      await eventItemAPI.assignItem(event.id, itemId, userId);
      await loadEventDetails(); // Recarregar para atualizar itens
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao atribuir item');
    }
  };

  const handleCompleteItem = async (itemId: number) => {
    try {
      if (!event) return;
      await eventItemAPI.completeItem(event.id, itemId);
      await loadEventDetails(); // Recarregar para atualizar itens
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao marcar item como concluído');
    }
  };

  const copyInviteLink = () => {
    if (event) {
      const inviteUrl = `${window.location.origin}/invite/${event.inviteCode}`;
      navigator.clipboard.writeText(inviteUrl);
      // Aqui você poderia mostrar uma notificação de sucesso
    }
  };

  const isParticipant = event?.participants.some(p => p.id === user?.id);
  const isCreator = event?.creator.id === user?.id;
  const canEdit = isCreator;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Evento não encontrado'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header do Evento */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {event.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {event.description}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                icon={<CalendarIcon />}
                label={new Date(event.startDateTime).toLocaleString('pt-BR')}
                variant="outlined"
              />
              <Chip
                icon={<LocationIcon />}
                label={event.location}
                variant="outlined"
              />
              <Chip
                icon={<PeopleIcon />}
                label={`${event.participants.length}${event.maxParticipants ? `/${event.maxParticipants}` : ''} participantes`}
                variant="outlined"
              />
              {event.hasCostSharing && event.totalCost && (
                <Chip
                  icon={<MoneyIcon />}
                  label={`R$ ${event.totalCost.toFixed(2)}`}
                  variant="outlined"
                  color="warning"
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={() => setShareDialogOpen(true)}
            >
              Compartilhar
            </Button>
            
            {canEdit && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/events/${event.id}/edit`)}
                >
                  Editar
                </Button>
                <IconButton color="error">
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        {/* Ações do Usuário */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isParticipant && !isCreator && (
            <Button
              variant="contained"
              onClick={handleJoinEvent}
              size="large"
            >
              Participar do Evento
            </Button>
          )}
          
          {isParticipant && !isCreator && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleLeaveEvent}
            >
              Sair do Evento
            </Button>
          )}
          
          {isCreator && (
            <Typography variant="body2" color="primary" sx={{ alignSelf: 'center' }}>
              Você é o organizador deste evento
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`Participantes (${event.participants.length})`} />
            <Tab label={`Itens (${event.items.length})`} />
            <Tab label="Informações" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <List>
            {event.participants.map((participant) => (
              <ListItem key={participant.id}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${participant.firstName} ${participant.lastName}`}
                  secondary={participant.email}
                />
                <ListItemSecondaryAction>
                  <Chip
                    label={participant.status}
                    color={participant.status === 'CONFIRMED' ? 'success' : 'warning'}
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Lista de Itens</Typography>
            {(isCreator || isParticipant) && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setItemDialogOpen(true)}
              >
                Adicionar Item
              </Button>
            )}
          </Box>
          
          <List>
            {event.items.map((item) => (
              <ListItem key={item.id}>
                <ListItemAvatar>
                  <Avatar>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {item.name} ({item.quantity})
                      </Typography>
                      {item.isRequired && (
                        <Chip label="Obrigatório" size="small" color="error" />
                      )}
                      {item.isCompleted && (
                        <Chip label="Concluído" size="small" color="success" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      {item.description && (
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      )}
                      {item.assignedTo && (
                        <Typography variant="body2" color="primary">
                          Atribuído a: {item.assignedTo.firstName} {item.assignedTo.lastName}
                        </Typography>
                      )}
                      {item.isMonetary && item.estimatedCost && (
                        <Typography variant="body2" color="warning.main">
                          Custo estimado: R$ {item.estimatedCost.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!item.assignedTo && (isCreator || isParticipant) && (
                      <Button
                        size="small"
                        onClick={() => handleAssignItem(item.id, user!.id)}
                      >
                        Assumir
                      </Button>
                    )}
                    {item.assignedTo?.id === user?.id && !item.isCompleted && (
                      <IconButton
                        color="success"
                        onClick={() => handleCompleteItem(item.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {event.items.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="Nenhum item adicionado ainda"
                  secondary="Adicione itens necessários para o evento"
                />
              </ListItem>
            )}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Detalhes do Evento
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Tipo"
                    secondary={event.type}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Data/Hora de Início"
                    secondary={new Date(event.startDateTime).toLocaleString('pt-BR')}
                  />
                </ListItem>
                {event.endDateTime && (
                  <ListItem>
                    <ListItemText
                      primary="Data/Hora de Término"
                      secondary={new Date(event.endDateTime).toLocaleString('pt-BR')}
                    />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemText
                    primary="Local"
                    secondary={event.address || event.location}
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Organizador
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${event.creator.firstName} ${event.creator.lastName}`}
                    secondary={event.creator.email}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Dialog de Compartilhamento */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Compartilhar Evento</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Compartilhe este link para convidar pessoas para o evento:
          </Typography>
          <TextField
            fullWidth
            value={`${window.location.origin}/invite/${event.inviteCode}`}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Fechar</Button>
          <Button onClick={copyInviteLink} variant="contained">
            Copiar Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Adicionar Item */}
      <Dialog open={itemDialogOpen} onClose={() => setItemDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Item</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome do Item"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Descrição"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            
            <TextField
              label="Quantidade"
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              fullWidth
              inputProps={{ min: 1 }}
            />
            
            <TextField
              label="Categoria"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              fullWidth
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={newItem.isRequired}
                  onChange={(e) => setNewItem({ ...newItem, isRequired: e.target.checked })}
                />
              }
              label="Item obrigatório"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={newItem.isMonetary}
                  onChange={(e) => setNewItem({ ...newItem, isMonetary: e.target.checked })}
                />
              }
              label="Item monetário"
            />
            
            {newItem.isMonetary && (
              <TextField
                label="Custo Estimado (R$)"
                type="number"
                value={newItem.estimatedCost}
                onChange={(e) => setNewItem({ ...newItem, estimatedCost: Number(e.target.value) })}
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddItem} variant="contained" disabled={!newItem.name}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EventDetailsPage; 