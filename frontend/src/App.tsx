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

// Páginas Modernas
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

// Componentes Modernos
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Hook para verificar autenticação
import { useAppSelector } from './hooks/redux';
import { isInDemoMode } from './services/api';

function PWAManager() {
  const {
    isOnline,
    isInstallable,
    isInstalled,
    isLoading,
    notificationPermission,
    installApp,
    requestNotificationPermission,
    showNotification,
    isSupported
  } = usePWA();
  
  const [showInstallPrompt, setShowInstallPrompt] = React.useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = React.useState(false);
  const [showOfflineMessage, setShowOfflineMessage] = React.useState(false);
  const [showDemoAlert, setShowDemoAlert] = React.useState(false);

  // Detectar modo demo
  useEffect(() => {
    if (isInDemoMode()) {
      setShowDemoAlert(true);
    }
  }, []);

  // Auto prompts inteligentes
  useEffect(() => {
    if (!isInstalled && isInstallable && process.env.NODE_ENV === 'production') {
      // Prompt de instalação após 10 segundos
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isInstalled, isInstallable]);

  useEffect(() => {
    if (notificationPermission === 'default' && process.env.NODE_ENV === 'production') {
      // Prompt de notificação após 15 segundos
      const timer = setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [notificationPermission]);

  useEffect(() => {
    setShowOfflineMessage(!isOnline);
  }, [isOnline]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowInstallPrompt(false);
      showNotification('App instalado com sucesso!', {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png'
      });
    }
  };

  const handleNotificationRequest = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShowNotificationPrompt(false);
      showNotification('Notificações ativadas!', {
        icon: '/icons/icon-192x192.png'
      });
    }
  };

  return (
    <>
      {/* Indicador de conexão */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Tooltip title={`Status: ${isOnline ? 'Online' : 'Offline'}`}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: isOnline ? 'success.main' : 'warning.main',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {isOnline ? <OnlineIcon sx={{ mr: 1 }} /> : <OfflineIcon sx={{ mr: 1 }} />}
            {isOnline ? 'Conectado' : 'Offline'}
          </Box>
        </Tooltip>
      </Box>

      {/* FAB de instalação */}
      {isInstallable && !isInstalled && (
        <Tooltip title="Instalar como App">
          <Fab
            color="primary"
            onClick={handleInstall}
            sx={{
              position: 'fixed',
              bottom: 24,
              left: 24,
              zIndex: 1000,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
            disabled={isLoading}
          >
            <InstallIcon />
          </Fab>
        </Tooltip>
      )}

      {/* Snackbar offline */}
      <Snackbar
        open={showOfflineMessage}
        autoHideDuration={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="warning" 
          onClose={() => setShowOfflineMessage(false)}
          action={
            <Button color="inherit" size="small">
              Algumas funcionalidades estão limitadas
            </Button>
          }
        >
          Você está offline
        </Alert>
      </Snackbar>

      {/* Alerta de Modo Demo */}
      <Snackbar
        open={showDemoAlert}
        autoHideDuration={8000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setShowDemoAlert(false)}
      >
        <Alert 
          severity="info"
          onClose={() => setShowDemoAlert(false)}
          sx={{ minWidth: 300 }}
        >
          <Typography variant="subtitle2" gutterBottom>
            🎭 Modo Demo Ativado
          </Typography>
          <Typography variant="body2">
            Backend não disponível. Testando com dados simulados.
          </Typography>
        </Alert>
      </Snackbar>

      {/* Dialog de instalação */}
      <Dialog
        open={showInstallPrompt}
        onClose={() => setShowInstallPrompt(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          📱 Instalar LETZ como App
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Instale o LETZ na sua tela inicial para:
          </Typography>
          <Box component="ul" sx={{ mt: 2 }}>
            <li>Acesso mais rápido</li>
            <li>Funcionar offline</li>
            <li>Receber notificações</li>
            <li>Experiência nativa</li>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInstallPrompt(false)}>
            Talvez depois
          </Button>
          <Button 
            onClick={handleInstall} 
            variant="contained"
            disabled={isLoading}
          >
            Instalar Agora
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de notificações */}
      <Dialog
        open={showNotificationPrompt}
        onClose={() => setShowNotificationPrompt(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          🔔 Ativar Notificações
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Permita notificações para receber:
          </Typography>
          <Box component="ul" sx={{ mt: 2 }}>
            <li>Novos convites para eventos</li>
            <li>Lembretes de eventos próximos</li>
            <li>Mensagens de amigos</li>
            <li>Atualizações importantes</li>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNotificationPrompt(false)}>
            Não, obrigado
          </Button>
          <Button 
            onClick={handleNotificationRequest} 
            variant="contained"
          >
            Ativar Notificações
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function AppContent() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isAuthenticated && <Navbar />}
      
      {/* Gerenciador PWA */}
      <PWAManager />
      
      <Box component="main" sx={{ flexGrow: 1, pt: isAuthenticated ? 8 : 0 }}>
        <Routes>
          {/* Rotas públicas */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} 
          />
          
          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/create"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId"
            element={
              <ProtectedRoute>
                <EventDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <FriendsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/demo"
            element={
              <ProtectedRoute>
                <DemoPage />
              </ProtectedRoute>
            }
          />

          {/* Novas rotas para funcionalidades avançadas */}
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h2>🏆 Conquistas em Desenvolvimento</h2>
                  <p>Sistema de gamificação será implementado em breve!</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h2>📊 Analytics em Desenvolvimento</h2>
                  <p>Dashboard de analytics será implementado em breve!</p>
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Rota padrão */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <Navigate to="/login" />
            } 
          />
          
          {/* Rota 404 */}
          <Route 
            path="*" 
            element={
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>404 - Página não encontrada</h2>
                <p>A página que você está procurando não existe.</p>
              </div>
            } 
          />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ModernThemeProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppContent />
        </Router>
      </ModernThemeProvider>
    </Provider>
  );
}

export default App; 