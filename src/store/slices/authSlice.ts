import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber?: string;
  bio?: string;
  profilePicture?: string;
  birthDate?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  eventsCreated: number;
  eventsAttended: number;
  totalFriends: number;
  points: number;
  level?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Usuários demo para teste
const demoUsers = [
  {
    id: 1,
    email: 'admin@letz.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'LETZ',
    username: 'admin',
    phoneNumber: '+55 11 99999-9999',
    bio: 'Administrador da plataforma LETZ',
    isActive: true,
    isEmailVerified: true,
    eventsCreated: 15,
    eventsAttended: 25,
    totalFriends: 50,
    points: 1500,
    level: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-08T00:00:00Z',
  },
  {
    id: 2,
    email: 'demo@letz.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    username: 'demo',
    phoneNumber: '+55 11 88888-8888',
    bio: 'Usuário demo para testes da plataforma',
    isActive: true,
    isEmailVerified: true,
    eventsCreated: 5,
    eventsAttended: 12,
    totalFriends: 20,
    points: 750,
    level: 3,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-06-08T00:00:00Z',
  },
  {
    id: 3,
    email: 'joao@exemplo.com',
    password: 'admin123',
    firstName: 'João',
    lastName: 'Silva',
    username: 'joao',
    phoneNumber: '+55 11 77777-7777',
    bio: 'Usuário de exemplo João',
    isActive: true,
    isEmailVerified: true,
    eventsCreated: 8,
    eventsAttended: 15,
    totalFriends: 30,
    points: 900,
    level: 4,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-08T00:00:00Z',
  },
  {
    id: 4,
    email: 'maria@exemplo.com',
    password: 'admin123',
    firstName: 'Maria',
    lastName: 'Santos',
    username: 'maria',
    phoneNumber: '+55 11 66666-6666',
    bio: 'Usuária de exemplo Maria',
    isActive: true,
    isEmailVerified: true,
    eventsCreated: 12,
    eventsAttended: 18,
    totalFriends: 40,
    points: 1200,
    level: 4,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-06-08T00:00:00Z',
  },
];

// Função para simular autenticação demo
const authenticateDemo = (email: string, password: string) => {
  return new Promise<{ user: User; token: string }>((resolve, reject) => {
    setTimeout(() => {
      const user = demoUsers.find(u => u.email === email && u.password === password);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        resolve({
          user: userWithoutPassword as User,
          token: `demo_token_${user.id}_${Date.now()}`,
        });
      } else {
        reject(new Error('Email ou senha incorretos'));
      }
    }, 1000); // Simula delay de rede
  });
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Usar apenas autenticação demo para evitar erros de CORS
      const response = await authenticateDemo(credentials.email, credentials.password);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Email ou senha incorretos');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    phoneNumber?: string;
    bio?: string;
    birthDate?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao registrar');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer; 