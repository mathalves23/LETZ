import axios from 'axios';

// Configuração base do axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';
const DEMO_MODE = process.env.NODE_ENV === 'production' && process.env.REACT_APP_API_URL?.includes('netlify');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 segundos timeout
});

// Mock data para modo demo
const mockUsers = [
  { id: 1, firstName: 'João', lastName: 'Silva', email: 'joao@exemplo.com', username: 'joao123' },
  { id: 2, firstName: 'Maria', lastName: 'Santos', email: 'maria@exemplo.com', username: 'maria456' },
  { id: 3, firstName: 'Pedro', lastName: 'Oliveira', email: 'pedro@exemplo.com', username: 'pedro789' },
];

const mockEvents = [
  {
    id: 1,
    title: 'Churrasco de Final de Ano',
    description: 'Vamos celebrar o ano que passou!',
    type: 'social',
    startDateTime: '2024-12-31T18:00:00',
    location: 'Casa do João',
    maxParticipants: 20,
    participants: 15,
    isPrivate: false,
  },
  {
    id: 2,
    title: 'Festa de Aniversário',
    description: 'Aniversário da Maria - 25 anos!',
    type: 'birthday',
    startDateTime: '2024-07-15T19:00:00',
    location: 'Salão de Festas',
    maxParticipants: 50,
    participants: 32,
    isPrivate: false,
  },
];

// Função para simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para detectar se estamos em modo demo
const isDemoMode = () => {
  return DEMO_MODE || localStorage.getItem('demoMode') === 'true';
};

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e fallback para modo demo
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se é erro de rede e não estamos em desenvolvimento, ativa modo demo
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.response?.status === 503) {
      if (process.env.NODE_ENV === 'production') {
        localStorage.setItem('demoMode', 'true');
        console.log('🎭 Modo demo ativado - Backend não disponível');
        return Promise.reject(new Error('DEMO_MODE_ACTIVATED'));
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!isDemoMode()) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Tipos para as requisições
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber?: string;
  bio?: string;
  birthDate?: string;
}

export interface EventRequest {
  title: string;
  description?: string;
  type: string;
  startDateTime: string;
  endDateTime?: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  maxParticipants?: number;
  isPrivate: boolean;
  requiresApproval: boolean;
  totalCost?: number;
  hasCostSharing: boolean;
}

// APIs de autenticação com fallback para demo
export const authAPI = {
  login: async (data: LoginRequest): Promise<any> => {
    if (isDemoMode()) {
      await delay(1000);
      const demoToken = 'demo-jwt-token-12345';
      localStorage.setItem('token', demoToken);
      return {
        data: {
          token: demoToken,
          user: mockUsers[0],
          message: 'Login realizado com sucesso! (Modo Demo)'
        }
      };
    }
    
    try {
      return await api.post('/auth/login', data);
    } catch (error: any) {
      if (error.message === 'DEMO_MODE_ACTIVATED') {
        return authAPI.login(data); // Retry in demo mode
      }
      throw error;
    }
  },
  
  register: async (data: RegisterRequest): Promise<any> => {
    if (isDemoMode()) {
      await delay(1000);
      const newUser = { ...data, id: Date.now() };
      const demoToken = 'demo-jwt-token-12345';
      localStorage.setItem('token', demoToken);
      return {
        data: {
          token: demoToken,
          user: newUser,
          message: 'Registro realizado com sucesso! (Modo Demo)'
        }
      };
    }
    
    try {
      return await api.post('/auth/register', data);
    } catch (error: any) {
      if (error.message === 'DEMO_MODE_ACTIVATED') {
        return authAPI.register(data);
      }
      throw error;
    }
  },
};

// APIs de usuários com fallback para demo
export const userAPI = {
  getProfile: async (): Promise<any> => {
    if (isDemoMode()) {
      await delay(500);
      return { data: mockUsers[0] };
    }
    
    try {
      return await api.get('/users/me');
    } catch (error: any) {
      if (error.message === 'DEMO_MODE_ACTIVATED') {
        return userAPI.getProfile();
      }
      throw error;
    }
  },
  
  updateProfile: async (data: Partial<RegisterRequest>) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { ...mockUsers[0], ...data } };
    }
    return api.put('/users/me', data);
  },
  
  searchUsers: async (searchTerm: string) => {
    if (isDemoMode()) {
      await delay(500);
      const filtered = mockUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { data: filtered };
    }
    return api.get(`/users/search?q=${searchTerm}`);
  },
  
  getRanking: async () => {
    if (isDemoMode()) {
      await delay(500);
      return { data: mockUsers.map((user, index) => ({ ...user, points: 1000 - index * 100 })) };
    }
    return api.get('/users/ranking');
  },
  
  getUserById: async (id: number) => {
    if (isDemoMode()) {
      await delay(500);
      const user = mockUsers.find(u => u.id === id) || mockUsers[0];
      return { data: user };
    }
    return api.get(`/users/${id}`);
  },
};

// APIs de eventos com fallback para demo
export const eventAPI = {
  createEvent: async (data: EventRequest) => {
    if (isDemoMode()) {
      await delay(1000);
      const newEvent = {
        ...data,
        id: Date.now(),
        participants: 1,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      };
      return { data: newEvent };
    }
    return api.post('/events', data);
  },
  
  getMyEvents: async () => {
    if (isDemoMode()) {
      await delay(500);
      return { data: mockEvents };
    }
    return api.get('/events/my');
  },
  
  getEventById: async (id: number) => {
    if (isDemoMode()) {
      await delay(500);
      const event = mockEvents.find(e => e.id === id) || mockEvents[0];
      return { data: event };
    }
    return api.get(`/events/${id}`);
  },
  
  updateEvent: async (id: number, data: Partial<EventRequest>) => {
    if (isDemoMode()) {
      await delay(500);
      const event = mockEvents.find(e => e.id === id) || mockEvents[0];
      return { data: { ...event, ...data } };
    }
    return api.put(`/events/${id}`, data);
  },
  
  deleteEvent: async (id: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { message: 'Evento excluído com sucesso!' } };
    }
    return api.delete(`/events/${id}`);
  },
  
  getUpcomingEvents: async () => {
    if (isDemoMode()) {
      await delay(500);
      return { data: mockEvents };
    }
    return api.get('/events/upcoming');
  },
  
  joinEvent: async (eventId: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { message: 'Participação confirmada!' } };
    }
    return api.post(`/events/${eventId}/join`);
  },
  
  leaveEvent: async (eventId: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { message: 'Participação cancelada!' } };
    }
    return api.delete(`/events/${eventId}/leave`);
  },
  
  getEventByInviteCode: async (inviteCode: string) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { ...mockEvents[0], inviteCode } };
    }
    return api.get(`/invite/${inviteCode}`);
  },
};

// APIs de amizades com fallback para demo
export const friendshipAPI = {
  sendFriendRequest: async (userId: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { message: 'Solicitação de amizade enviada!' } };
    }
    return api.post(`/friendships/request/${userId}`);
  },
  
  acceptFriendRequest: async (friendshipId: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { message: 'Solicitação aceita!' } };
    }
    return api.put(`/friendships/${friendshipId}/accept`);
  },
  
  rejectFriendRequest: async (friendshipId: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { message: 'Solicitação rejeitada!' } };
    }
    return api.put(`/friendships/${friendshipId}/reject`);
  },
  
  removeFriend: async (friendshipId: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { message: 'Amizade removida!' } };
    }
    return api.delete(`/friendships/${friendshipId}`);
  },
  
  getFriends: async () => {
    if (isDemoMode()) {
      await delay(500);
      return { data: mockUsers.slice(1) };
    }
    return api.get('/friendships/friends');
  },
  
  getPendingRequests: async () => {
    if (isDemoMode()) {
      await delay(500);
      return { data: [] };
    }
    return api.get('/friendships/pending');
  },
  
  getSentRequests: async () => {
    if (isDemoMode()) {
      await delay(500);
      return { data: [] };
    }
    return api.get('/friendships/sent');
  },
};

// APIs de mensagens com fallback para demo
export const messageAPI = {
  sendMessage: async (data: { receiverId: number; content: string; eventId?: number }) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { id: Date.now(), ...data, timestamp: new Date().toISOString() } };
    }
    return api.post('/messages', data);
  },
  
  getConversation: async (userId: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: [
        { id: 1, content: 'Oi! Como vai?', senderId: userId, receiverId: 1, timestamp: new Date().toISOString() },
        { id: 2, content: 'Tudo bem! E você?', senderId: 1, receiverId: userId, timestamp: new Date().toISOString() },
      ] };
    }
    return api.get(`/messages/conversation/${userId}`);
  },
  
  getConversations: async () => {
    if (isDemoMode()) {
      await delay(500);
      return { data: mockUsers.slice(1).map(user => ({
        user,
        lastMessage: { content: 'Olá! Como vai?', timestamp: new Date().toISOString() },
        unreadCount: Math.floor(Math.random() * 3),
      })) };
    }
    return api.get('/messages/conversations');
  },
  
  markAsRead: async (messageId: number) => {
    if (isDemoMode()) {
      await delay(300);
      return { data: { message: 'Mensagem marcada como lida!' } };
    }
    return api.put(`/messages/${messageId}/read`);
  },
};

// APIs de itens de evento com fallback para demo
export const eventItemAPI = {
  getEventItems: async (eventId: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: [
        { id: 1, name: 'Refrigerante', quantity: 2, category: 'Bebidas', isRequired: true },
        { id: 2, name: 'Carne', quantity: 5, category: 'Comida', isRequired: true },
        { id: 3, name: 'Carvão', quantity: 1, category: 'Utensílios', isRequired: false },
      ] };
    }
    return api.get(`/events/${eventId}/items`);
  },
  
  createEventItem: async (eventId: number, data: {
    name: string;
    description?: string;
    quantity: number;
    category?: string;
    isRequired: boolean;
    isMonetary: boolean;
    estimatedCost?: number;
  }) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { id: Date.now(), ...data } };
    }
    return api.post(`/events/${eventId}/items`, data);
  },
  
  assignItem: async (eventId: number, itemId: number, userId: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { message: 'Item atribuído com sucesso!' } };
    }
    return api.put(`/events/${eventId}/items/${itemId}/assign/${userId}`);
  },
  
  completeItem: async (eventId: number, itemId: number) => {
    if (isDemoMode()) {
      await delay(500);
      return { data: { message: 'Item marcado como completo!' } };
    }
    return api.put(`/events/${eventId}/items/${itemId}/complete`);
  },
};

// Função para verificar se está em modo demo
export const isInDemoMode = isDemoMode;

export default api; 