import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Divider,
  Badge,
  Grid,
  Chip,
  Card,
  CardContent,
  Button,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  VideoCall as VideoCallIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Chat {
  id: number;
  participantId: number;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
  eventId?: number;
  eventName?: string;
}

const MessagesPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Chats mockados para demonstração
  const mockChats: Chat[] = [
    {
      id: 1,
      participantId: 2,
      participantName: 'João Silva',
      participantAvatar: '/avatars/joao.jpg',
      lastMessage: 'Vamos confirmar o churrasco para sábado?',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      eventId: 1,
      eventName: 'Churrasco de Fim de Semana'
    },
    {
      id: 2,
      participantId: 3,
      participantName: 'Maria Santos',
      participantAvatar: '/avatars/maria.jpg',
      lastMessage: 'Preciso confirmar quantas pessoas vão...',
      lastMessageTime: new Date(Date.now() - 20 * 60 * 1000),
      unreadCount: 0,
      isOnline: true
    },
    {
      id: 3,
      participantId: 4,
      participantName: 'Pedro Costa',
      participantAvatar: '/avatars/pedro.jpg',
      lastMessage: 'A festa foi incrível! Obrigado pela organização 🎉',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false
    }
  ];

  const mockMessages: Message[] = [
    {
      id: 1,
      senderId: 2,
      senderName: 'João Silva',
      content: 'Oi! Como está o planejamento do churrasco?',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: true
    },
    {
      id: 2,
      senderId: user?.id || 1,
      senderName: user?.firstName || 'Você',
      content: 'Oi João! Está indo bem. Já confirmaram 15 pessoas.',
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      isRead: true
    },
    {
      id: 3,
      senderId: 2,
      senderName: 'João Silva',
      content: 'Perfeito! Vou levar a churrasqueira portátil e o carvão.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true
    },
    {
      id: 4,
      senderId: 2,
      senderName: 'João Silva',
      content: 'Vamos confirmar o churrasco para sábado?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false
    }
  ];

  useEffect(() => {
    setChats(mockChats);
    if (mockChats.length > 0) {
      setSelectedChat(mockChats[0]);
      setMessages(mockMessages);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}min`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: messages.length + 1,
      senderId: user?.id || 1,
      senderName: user?.firstName || 'Você',
      content: message,
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simular resposta automática para demonstração
    setTimeout(() => {
      const responseMessage: Message = {
        id: messages.length + 2,
        senderId: selectedChat.participantId,
        senderName: selectedChat.participantName,
        content: 'Mensagem recebida! 👍',
        timestamp: new Date(),
        isRead: false
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.eventName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        💬 Mensagens
      </Typography>

      <Grid container spacing={2} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Lista de Chats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header de Pesquisa */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Lista de Conversas */}
            <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
              {filteredChats.map((chat) => (
                <ListItem
                  key={chat.id}
                  button
                  selected={selectedChat?.id === chat.id}
                  onClick={() => {
                    setSelectedChat(chat);
                    setMessages(mockMessages);
                  }}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={!chat.isOnline}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      <Avatar src={chat.participantAvatar}>
                        {chat.participantName.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" noWrap>
                          {chat.participantName}
                        </Typography>
                        {chat.lastMessageTime && (
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(chat.lastMessageTime)}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        {chat.eventName && (
                          <Chip
                            size="small"
                            label={chat.eventName}
                            color="primary"
                            variant="outlined"
                            sx={{ mb: 0.5, maxWidth: '100%' }}
                          />
                        )}
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {chat.lastMessage}
                        </Typography>
                      </Box>
                    }
                  />
                  {chat.unreadCount > 0 && (
                    <Badge badgeContent={chat.unreadCount} color="error" />
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Área de Chat */}
        <Grid item xs={12} md={8}>
          {selectedChat ? (
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header do Chat */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={!selectedChat.isOnline}
                    >
                      <Avatar src={selectedChat.participantAvatar}>
                        {selectedChat.participantName.charAt(0)}
                      </Avatar>
                    </Badge>
                    <Box>
                      <Typography variant="h6">{selectedChat.participantName}</Typography>
                      {selectedChat.eventName && (
                        <Chip
                          size="small"
                          label={selectedChat.eventName}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {selectedChat.isOnline ? 'Online' : 'Offline'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton>
                      <PhoneIcon />
                    </IconButton>
                    <IconButton>
                      <VideoCallIcon />
                    </IconButton>
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Mensagens */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.senderId === user?.id ? 'flex-end' : 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        backgroundColor: msg.senderId === user?.id ? 'primary.main' : 'grey.100',
                        color: msg.senderId === user?.id ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2">{msg.content}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                        }}
                      >
                        {msg.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                                 {typing && (
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                     <Avatar src={selectedChat.participantAvatar} sx={{ width: 24, height: 24 }}>
                       {selectedChat.participantName.charAt(0)}
                     </Avatar>
                    <Paper sx={{ p: 1, backgroundColor: 'grey.100' }}>
                      <CircularProgress size={12} />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        Digitando...
                      </Typography>
                    </Paper>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input de Mensagem */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Digite sua mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="primary"
                          onClick={handleSendMessage}
                          disabled={!message.trim()}
                        >
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Selecione uma conversa
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Escolha uma conversa da lista para começar a trocar mensagens
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessagesPage; 