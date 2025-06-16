import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Button,
  IconButton,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

interface Notification {
  id: number;
  type: 'EVENT_INVITE' | 'FRIEND_REQUEST' | 'EVENT_UPDATE' | 'MESSAGE' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    eventId?: number;
    userId?: number;
    friendshipId?: number;
    messageId?: number;
  };
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
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      // Aqui você faria a chamada para a API de notificações
      // Por enquanto, vamos usar dados mockados
      const mockNotifications: Notification[] = [
        {
          id: 1,
          type: 'EVENT_INVITE',
          title: 'Convite para evento',
          message: 'João Silva te convidou para "Churrasco de Final de Semana"',
          isRead: false,
          createdAt: '2024-01-15T10:30:00Z',
          data: { eventId: 1, userId: 2 },
        },
        {
          id: 2,
          type: 'FRIEND_REQUEST',
          title: 'Solicitação de amizade',
          message: 'Maria Santos enviou uma solicitação de amizade',
          isRead: false,
          createdAt: '2024-01-14T15:45:00Z',
          data: { userId: 3, friendshipId: 5 },
        },
        {
          id: 3,
          type: 'EVENT_UPDATE',
          title: 'Evento atualizado',
          message: 'O evento "Festa de Aniversário" foi atualizado',
          isRead: true,
          createdAt: '2024-01-13T09:15:00Z',
          data: { eventId: 2 },
        },
        {
          id: 4,
          type: 'MESSAGE',
          title: 'Nova mensagem',
          message: 'Pedro Costa enviou uma mensagem',
          isRead: false,
          createdAt: '2024-01-12T18:20:00Z',
          data: { userId: 4, messageId: 10 },
        },
        {
          id: 5,
          type: 'SYSTEM',
          title: 'Nova conquista!',
          message: 'Você ganhou o badge "Organizador" por criar seu primeiro evento!',
          isRead: true,
          createdAt: '2024-01-11T12:00:00Z',
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setError('Erro ao carregar notificações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleDeleteNotification = (notificationId: number) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleAcceptInvite = (notificationId: number, eventId: number) => {
    // Aqui você faria a chamada para aceitar o convite
    console.log('Aceitar convite para evento:', eventId);
    handleMarkAsRead(notificationId);
  };

  const handleDeclineInvite = (notificationId: number, eventId: number) => {
    // Aqui você faria a chamada para recusar o convite
    console.log('Recusar convite para evento:', eventId);
    handleDeleteNotification(notificationId);
  };

  const handleAcceptFriendRequest = (notificationId: number, friendshipId: number) => {
    // Aqui você faria a chamada para aceitar a solicitação de amizade
    console.log('Aceitar solicitação de amizade:', friendshipId);
    handleDeleteNotification(notificationId);
  };

  const handleDeclineFriendRequest = (notificationId: number, friendshipId: number) => {
    // Aqui você faria a chamada para recusar a solicitação de amizade
    console.log('Recusar solicitação de amizade:', friendshipId);
    handleDeleteNotification(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'EVENT_INVITE':
      case 'EVENT_UPDATE':
        return <EventIcon />;
      case 'FRIEND_REQUEST':
        return <PersonIcon />;
      case 'MESSAGE':
        return <MessageIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'EVENT_INVITE':
        return 'primary';
      case 'FRIEND_REQUEST':
        return 'success';
      case 'EVENT_UPDATE':
        return 'info';
      case 'MESSAGE':
        return 'warning';
      case 'SYSTEM':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const renderNotificationActions = (notification: Notification) => {
    const actions = [];

    if (notification.type === 'EVENT_INVITE' && notification.data?.eventId) {
      actions.push(
        <Button
          key="accept"
          size="small"
          color="success"
          onClick={() => handleAcceptInvite(notification.id, notification.data!.eventId!)}
        >
          Aceitar
        </Button>,
        <Button
          key="decline"
          size="small"
          color="error"
          onClick={() => handleDeclineInvite(notification.id, notification.data!.eventId!)}
        >
          Recusar
        </Button>
      );
    }

    if (notification.type === 'FRIEND_REQUEST' && notification.data?.friendshipId) {
      actions.push(
        <IconButton
          key="accept-friend"
          size="small"
          color="success"
          onClick={() => handleAcceptFriendRequest(notification.id, notification.data!.friendshipId!)}
        >
          <CheckIcon />
        </IconButton>,
        <IconButton
          key="decline-friend"
          size="small"
          color="error"
          onClick={() => handleDeclineFriendRequest(notification.id, notification.data!.friendshipId!)}
        >
          <CloseIcon />
        </IconButton>
      );
    }

    if (!notification.isRead) {
      actions.push(
        <IconButton
          key="mark-read"
          size="small"
          onClick={() => handleMarkAsRead(notification.id)}
        >
          <MarkReadIcon />
        </IconButton>
      );
    }

    actions.push(
      <IconButton
        key="delete"
        size="small"
        color="error"
        onClick={() => handleDeleteNotification(notification.id)}
      >
        <DeleteIcon />
      </IconButton>
    );

    return actions;
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          🔔 Notificações
        </Typography>
        
        {unreadNotifications.length > 0 && (
          <Button
            variant="outlined"
            onClick={handleMarkAllAsRead}
          >
            Marcar todas como lidas
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Não lidas
                  {unreadNotifications.length > 0 && (
                    <Badge badgeContent={unreadNotifications.length} color="error" />
                  )}
                </Box>
              }
            />
            <Tab label={`Lidas (${readNotifications.length})`} />
            <Tab label={`Todas (${notifications.length})`} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <List>
            {unreadNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: 'action.hover',
                    borderLeft: 3,
                    borderColor: `${getNotificationColor(notification.type)}.main`,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar color={getNotificationColor(notification.type) as any}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString('pt-BR')}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {renderNotificationActions(notification)}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < unreadNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {unreadNotifications.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="Nenhuma notificação não lida"
                  secondary="Você está em dia com suas notificações!"
                />
              </ListItem>
            )}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            {readNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar color={getNotificationColor(notification.type) as any}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString('pt-BR')}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < readNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {readNotifications.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="Nenhuma notificação lida"
                  secondary="As notificações lidas aparecerão aqui"
                />
              </ListItem>
            )}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                    borderLeft: notification.isRead ? 0 : 3,
                    borderColor: `${getNotificationColor(notification.type)}.main`,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar color={getNotificationColor(notification.type) as any}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {notification.title}
                        </Typography>
                        {!notification.isRead && (
                          <Chip label="Nova" size="small" color="error" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString('pt-BR')}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {renderNotificationActions(notification)}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default NotificationsPage; 