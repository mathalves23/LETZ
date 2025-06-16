import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import eventSlice from './slices/eventSlice';
import friendshipSlice from './slices/friendshipSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    events: eventSlice,
    friendships: friendshipSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 