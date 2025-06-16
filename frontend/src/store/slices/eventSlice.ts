import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventAPI } from '../../services/api';

export interface Event {
  id: number;
  title: string;
  description?: string;
  type: string;
  startDateTime: string;
  endDateTime?: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  organizer: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  };
  maxParticipants?: number;
  isPrivate: boolean;
  requiresApproval: boolean;
  totalCost?: number;
  hasCostSharing: boolean;
  inviteCode: string;
  status: string;
  totalParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
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

export interface EventState {
  events: Event[];
  myEvents: Event[];
  participatingEvents: Event[];
  upcomingEvents: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  myEvents: [],
  participatingEvents: [],
  upcomingEvents: [],
  currentEvent: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData: CreateEventData, { rejectWithValue }) => {
    try {
      const response = await eventAPI.createEvent(eventData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao criar evento');
    }
  }
);

export const fetchMyEvents = createAsyncThunk(
  'events/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getMyEvents();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar eventos');
    }
  }
);

export const fetchParticipatingEvents = createAsyncThunk(
  'events/fetchParticipating',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getMyEvents(); // Ajustar quando tiver endpoint específico
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar eventos');
    }
  }
);

export const fetchUpcomingEvents = createAsyncThunk(
  'events/fetchUpcoming',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getUpcomingEvents();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar eventos');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchById',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getEventById(eventId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar evento');
    }
  }
);

export const fetchEventByInviteCode = createAsyncThunk(
  'events/fetchByInviteCode',
  async (inviteCode: string, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getEventByInviteCode(inviteCode);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Convite inválido');
    }
  }
);

export const joinEvent = createAsyncThunk(
  'events/join',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const response = await eventAPI.joinEvent(eventId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao participar do evento');
    }
  }
);

export const leaveEvent = createAsyncThunk(
  'events/leave',
  async (eventId: number, { rejectWithValue }) => {
    try {
      await eventAPI.leaveEvent(eventId);
      return eventId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao sair do evento');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ eventId, eventData }: { eventId: number; eventData: Partial<CreateEventData> }, { rejectWithValue }) => {
    try {
      const response = await eventAPI.updateEvent(eventId, eventData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao atualizar evento');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (eventId: number, { rejectWithValue }) => {
    try {
      await eventAPI.deleteEvent(eventId);
      return eventId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao deletar evento');
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    setCurrentEvent: (state, action: PayloadAction<Event>) => {
      state.currentEvent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myEvents.unshift(action.payload);
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch My Events
      .addCase(fetchMyEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myEvents = action.payload;
        state.error = null;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Participating Events
      .addCase(fetchParticipatingEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchParticipatingEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.participatingEvents = action.payload;
        state.error = null;
      })
      .addCase(fetchParticipatingEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Upcoming Events
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingEvents = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Event By ID
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
        state.error = null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Event By Invite Code
      .addCase(fetchEventByInviteCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventByInviteCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
        state.error = null;
      })
      .addCase(fetchEventByInviteCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Join Event
      .addCase(joinEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
        // Adicionar aos eventos participando se não estiver lá
        if (!state.participatingEvents.find(e => e.id === action.payload.id)) {
          state.participatingEvents.push(action.payload);
        }
        state.error = null;
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Leave Event
      .addCase(leaveEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(leaveEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remover dos eventos participando
        state.participatingEvents = state.participatingEvents.filter(e => e.id !== action.payload);
        state.error = null;
      })
      .addCase(leaveEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedEvent = action.payload;
        
        // Atualizar nos meus eventos
        const myEventIndex = state.myEvents.findIndex(e => e.id === updatedEvent.id);
        if (myEventIndex !== -1) {
          state.myEvents[myEventIndex] = updatedEvent;
        }
        
        // Atualizar evento atual
        if (state.currentEvent?.id === updatedEvent.id) {
          state.currentEvent = updatedEvent;
        }
        
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const eventId = action.payload;
        
        // Remover dos meus eventos
        state.myEvents = state.myEvents.filter(e => e.id !== eventId);
        
        // Limpar evento atual se for o mesmo
        if (state.currentEvent?.id === eventId) {
          state.currentEvent = null;
        }
        
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentEvent, setCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer; 