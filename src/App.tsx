import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Snackbar, Alert, Fab, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ModernThemeProvider } from './contexts/ModernThemeContext';
import { usePWA } from './hooks/usePWA';
import { 
  InstallMobile as InstallIcon,
  CloudOff as OfflineIcon,
  Wifi as OnlineIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

// Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import FriendsPage from './pages/FriendsPage';
import ProfilePage from './pages/ProfilePage';
import EventDetailsPage from './pages/EventDetailsPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';
import DemoPage from './pages/DemoPage';

// Componentes
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Hook para verificar autenticação
import { useAppSelector } from './hooks/redux';

// ... existing code ... 