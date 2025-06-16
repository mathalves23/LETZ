import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  fetchFriends,
  fetchPendingRequests,
  clearError,
} from '../store/slices/friendshipSlice';
import { userAPI } from '../services/api';

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
      id={`friends-tabpanel-${index}`}
      aria-labelledby={`friends-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface SearchUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  points?: number;
}

function FriendsPage() {
  const dispatch = useAppDispatch();
  const {
    friends = [],
    pendingRequests = [],
    sentRequests = [],
    isLoading,
    error,
  } = useAppSelector((state) => state.friendships);

  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'accept' | 'reject';
    friendshipId?: number;
    userName?: string;
  }>({ open: false, action: 'accept' });

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const response = await userAPI.searchUsers(searchQuery);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSendFriendRequest = (userId: number) => {
    dispatch(sendFriendRequest(userId));
  };

  const handleRespondToRequest = (friendshipId: number, accept: boolean) => {
    if (accept) {
      dispatch(acceptFriendRequest(friendshipId));
    } else {
      dispatch(rejectFriendRequest(friendshipId));
    }
    setConfirmDialog({ open: false, action: 'accept' });
  };

  const openConfirmDialog = (
    action: 'accept' | 'reject',
    friendshipId: number,
    userName: string
  ) => {
    setConfirmDialog({ open: true, action, friendshipId, userName });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, action: 'accept' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`.trim();
  };

  const renderSearchResults = () => (
    <List>
      {searchResults.map((user) => (
        <ListItem key={user.id}>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={getFullName(user.firstName, user.lastName)}
            secondary={`${user.email} • @${user.username}`}
          />
          <ListItemSecondaryAction>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={() => handleSendFriendRequest(user.id)}
              disabled={isLoading}
            >
              Adicionar
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      {searchResults.length === 0 && searchQuery && !isSearching && (
        <ListItem>
          <ListItemText
            primary="Nenhum usuário encontrado"
            secondary="Tente buscar por outro nome ou email"
          />
        </ListItem>
      )}
    </List>
  );

  const renderFriends = () => (
    <List>
      {friends.map((friend) => (
        <ListItem key={friend.id}>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={getFullName(friend.firstName, friend.lastName)}
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {friend.email}
                </Typography>
                <Chip
                  label={friend.isOnline ? 'Online' : 'Offline'}
                  size="small"
                  color={friend.isOnline ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <IconButton color="primary" size="small">
              <MessageIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      {friends.length === 0 && (
        <ListItem>
          <ListItemText
            primary="Nenhum amigo ainda"
            secondary="Que tal buscar por alguns amigos?"
          />
        </ListItem>
      )}
    </List>
  );

  const renderPendingRequests = () => (
    <List>
      {pendingRequests.map((request) => (
        <ListItem key={request.id}>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={getFullName(request.requester.firstName, request.requester.lastName)}
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {request.requester.email}
                </Typography>
                <Chip
                  label={request.status}
                  size="small"
                  color={getStatusColor(request.status) as any}
                  variant="outlined"
                />
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color="success"
                size="small"
                onClick={() => openConfirmDialog(
                  'accept', 
                  request.id, 
                  getFullName(request.requester.firstName, request.requester.lastName)
                )}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                color="error"
                size="small"
                onClick={() => openConfirmDialog(
                  'reject', 
                  request.id, 
                  getFullName(request.requester.firstName, request.requester.lastName)
                )}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      {pendingRequests.length === 0 && (
        <ListItem>
          <ListItemText
            primary="Nenhuma solicitação pendente"
            secondary="Você está em dia com suas solicitações de amizade!"
          />
        </ListItem>
      )}
    </List>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        👥 Amigos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="friends tabs">
            <Tab label={`Buscar Amigos`} />
            <Tab label={`Meus Amigos (${friends.length})`} />
            <Tab label={`Solicitações (${pendingRequests.length})`} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Buscar amigos por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                    >
                      {isSearching ? <CircularProgress size={20} /> : 'Buscar'}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {renderSearchResults()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderFriends()}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {renderPendingRequests()}
        </TabPanel>
      </Paper>

      {/* Dialog de Confirmação */}
      <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
        <DialogTitle>
          {confirmDialog.action === 'accept' ? 'Aceitar Solicitação' : 'Rejeitar Solicitação'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === 'accept'
              ? `Deseja aceitar a solicitação de amizade de ${confirmDialog.userName}?`
              : `Deseja rejeitar a solicitação de amizade de ${confirmDialog.userName}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancelar</Button>
          <Button
            onClick={() =>
              handleRespondToRequest(
                confirmDialog.friendshipId!,
                confirmDialog.action === 'accept'
              )
            }
            color={confirmDialog.action === 'accept' ? 'success' : 'error'}
            variant="contained"
          >
            {confirmDialog.action === 'accept' ? 'Aceitar' : 'Rejeitar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default FriendsPage; 