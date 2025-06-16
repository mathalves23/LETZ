import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { friendshipAPI } from '../../services/api';

export interface Friend {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture?: string;
  isOnline: boolean;
}

export interface FriendRequest {
  id: number;
  requester: Friend;
  requested: Friend;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
}

export interface FriendshipState {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FriendshipState = {
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchFriends = createAsyncThunk(
  'friendships/fetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await friendshipAPI.getFriends();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar amigos');
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  'friendships/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await friendshipAPI.getPendingRequests();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar solicitações');
    }
  }
);

export const fetchSentRequests = createAsyncThunk(
  'friendships/fetchSent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await friendshipAPI.getSentRequests();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar solicitações enviadas');
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  'friendships/sendRequest',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await friendshipAPI.sendFriendRequest(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao enviar solicitação');
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friendships/acceptRequest',
  async (friendshipId: number, { rejectWithValue }) => {
    try {
      const response = await friendshipAPI.acceptFriendRequest(friendshipId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao aceitar solicitação');
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  'friendships/rejectRequest',
  async (friendshipId: number, { rejectWithValue }) => {
    try {
      await friendshipAPI.rejectFriendRequest(friendshipId);
      return friendshipId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao rejeitar solicitação');
    }
  }
);

export const removeFriend = createAsyncThunk(
  'friendships/removeFriend',
  async (friendshipId: number, { rejectWithValue }) => {
    try {
      await friendshipAPI.removeFriend(friendshipId);
      return friendshipId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao remover amigo');
    }
  }
);

const friendshipSlice = createSlice({
  name: 'friendships',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Friends
      .addCase(fetchFriends.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action.payload;
        state.error = null;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Pending Requests
      .addCase(fetchPendingRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingRequests = action.payload;
        state.error = null;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Sent Requests
      .addCase(fetchSentRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sentRequests = action.payload;
        state.error = null;
      })
      .addCase(fetchSentRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Send Friend Request
      .addCase(sendFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sentRequests.push(action.payload);
        state.error = null;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Accept Friend Request
      .addCase(acceptFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const friendship = action.payload;
        
        // Remover das solicitações pendentes
        state.pendingRequests = state.pendingRequests.filter(
          req => req.id !== friendship.id
        );
        
        // Adicionar aos amigos
        state.friends.push(friendship);
        state.error = null;
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Reject Friend Request
      .addCase(rejectFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const friendshipId = action.payload;
        
        // Remover das solicitações pendentes
        state.pendingRequests = state.pendingRequests.filter(
          req => req.id !== friendshipId
        );
        state.error = null;
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Remove Friend
      .addCase(removeFriend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.isLoading = false;
        const friendshipId = action.payload;
        
        // Remover dos amigos
        state.friends = state.friends.filter(
          friend => friend.id !== friendshipId
        );
        state.error = null;
      })
      .addCase(removeFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = friendshipSlice.actions;
export default friendshipSlice.reducer; 