import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  Info as InfoIcon,
  InstallMobile as InstallIcon,
  CloudOff as OfflineIcon,
  Wifi as OnlineIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { usePWA } from '../hooks/usePWA';

export default function SettingsPageSimple() {
  const {
    isOnline,
    isInstallable,
    isInstalled,
    notificationPermission,
    installApp,
    requestNotificationPermission,
    clearCache,
    shareContent,
    isSupported
  } = usePWA();

  const [clearCacheDialog, setClearCacheDialog] = useState(false);
  const [aboutDialog, setAboutDialog] = useState(false);
  const [cacheSize, setCacheSize] = useState('Calculando...');

  useEffect(() => {
    calculateCacheSize();
  }, []);

  const calculateCacheSize = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const usedMB = ((estimate.usage || 0) / 1024 / 1024).toFixed(1);
        setCacheSize(`${usedMB} MB`);
      } catch (error) {
        setCacheSize('Não disponível');
      }
    } else {
      setCacheSize('Não suportado');
    }
  };

  const handleShareApp = () => {
    shareContent({
      title: 'LETZ - Organizador de Eventos',
      text: 'Conheça o LETZ! O melhor app para organizar eventos sociais com amigos.',
      url: window.location.origin
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ⚙️ Configurações
      </Typography>

      {/* Status PWA */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              📱
            </Avatar>
            <Box>
              <Typography variant="h6">Status PWA</Typography>
              <Typography variant="body2" color="text.secondary">
                {isInstalled ? 'App instalado e funcionando' : 'App executando no navegador'}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip 
              label={`Service Worker: ${isSupported.serviceWorker ? 'Suportado' : 'Não suportado'}`}
              color={isSupported.serviceWorker ? 'success' : 'error'}
              size="small"
            />
            <Chip 
              label={`Notificações: ${isSupported.notifications ? 'Suportado' : 'Não suportado'}`}
              color={isSupported.notifications ? 'success' : 'error'}
              size="small"
            />
            <Chip 
              label={`Compartilhamento: ${isSupported.share ? 'Suportado' : 'Não suportado'}`}
              color={isSupported.share ? 'success' : 'error'}
              size="small"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Configurações PWA */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Aplicativo PWA
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <InstallIcon />
              </ListItemIcon>
              <ListItemText
                primary={isInstalled ? 'App Instalado' : 'Instalar App'}
                secondary={isInstalled ? 'O LETZ está instalado em seu dispositivo' : 'Instale para acesso rápido e uso offline'}
              />
              <ListItemSecondaryAction>
                {!isInstalled && isInstallable && (
                  <Button onClick={installApp} variant="contained" size="small">
                    Instalar
                  </Button>
                )}
                {isInstalled && (
                  <Chip label="Instalado" color="success" size="small" />
                )}
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                {isOnline ? <OnlineIcon /> : <OfflineIcon />}
              </ListItemIcon>
              <ListItemText
                primary={isOnline ? 'Online' : 'Offline'}
                secondary={isOnline ? 'Conectado à internet' : 'Funcionando no modo offline'}
              />
              <ListItemSecondaryAction>
                <Chip 
                  label={isOnline ? 'Online' : 'Offline'} 
                  color={isOnline ? 'success' : 'warning'} 
                  size="small" 
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Notificações Push"
                secondary={notificationPermission === 'granted' ? 'Notificações ativadas' : 'Receber notificações de eventos e mensagens'}
              />
              <ListItemSecondaryAction>
                {notificationPermission === 'granted' ? (
                  <Chip label="Ativadas" color="success" size="small" />
                ) : (
                  <Button onClick={requestNotificationPermission} variant="outlined" size="small">
                    Ativar
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Armazenamento */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Armazenamento
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText
                primary="Cache do App"
                secondary={`Dados armazenados: ${cacheSize}`}
              />
              <ListItemSecondaryAction>
                <Button 
                  onClick={() => setClearCacheDialog(true)}
                  color="error"
                  size="small"
                >
                  Limpar
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Informações */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Informações
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText
                primary="Compartilhar App"
                secondary="Indicar o LETZ para amigos"
              />
              <ListItemSecondaryAction>
                <IconButton onClick={handleShareApp}>
                  <ShareIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText
                primary="Sobre o LETZ"
                secondary="Versão 1.0.0 - Build PWA"
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => setAboutDialog(true)}>
                  <InfoIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Dialog para limpar cache */}
      <Dialog open={clearCacheDialog} onClose={() => setClearCacheDialog(false)}>
        <DialogTitle>🗑️ Limpar Cache</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta ação irá remover todos os dados armazenados localmente e recarregar o aplicativo.
          </Alert>
          <Typography>
            Cache atual: <strong>{cacheSize}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearCacheDialog(false)}>Cancelar</Button>
          <Button onClick={() => { clearCache(); setClearCacheDialog(false); }} color="error">
            Limpar Cache
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Sobre */}
      <Dialog open={aboutDialog} onClose={() => setAboutDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>📱 Sobre o LETZ</DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={2}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}>
              🎉
            </Avatar>
            <Typography variant="h5" gutterBottom>
              LETZ
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Organizador de Eventos Sociais
            </Typography>
            
            <Box mt={3} mb={2}>
              <Chip label="Versão 1.0.0" variant="outlined" sx={{ mr: 1 }} />
              <Chip label="PWA" color="primary" sx={{ mr: 1 }} />
              <Chip label="React 18" color="secondary" />
            </Box>

            <Typography variant="body2" paragraph>
              Conecte-se com amigos e organize eventos incríveis! O LETZ é seu companheiro 
              para churrascos, festas e encontros inesquecíveis.
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Desenvolvido com ❤️ para trazer pessoas juntas
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAboutDialog(false)}>Fechar</Button>
          <Button onClick={handleShareApp} variant="contained" startIcon={<ShareIcon />}>
            Compartilhar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 