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
  Switch,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Avatar,
  Badge
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
  InstallMobile as InstallIcon,
  Sync as SyncIcon,
  Delete as DeleteIcon,
  CloudOff as OfflineIcon,
  Wifi as OnlineIcon,
  Update as UpdateIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { usePWA } from '../hooks/usePWA';

interface SettingsSection {
  title: string;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  type: 'switch' | 'action' | 'select' | 'info';
  value?: boolean | string;
  options?: { value: string; label: string }[];
  action?: () => void;
}

export default function SettingsPage() {
  const {
    isOnline,
    isInstallable,
    isInstalled,
    notificationPermission,
    cacheStatus,
    swRegistration,
    isSupported,
    installApp,
    requestNotificationPermission,
    clearCache,
    updateApp,
    shareContent
  } = usePWA();

  // Estados locais
  const [settings, setSettings] = useState({
    darkMode: localStorage.getItem('letz-dark-mode') === 'true',
    notifications: notificationPermission === 'granted',
    locationServices: localStorage.getItem('letz-location-enabled') === 'true',
    autoSync: localStorage.getItem('letz-auto-sync') !== 'false',
    language: localStorage.getItem('letz-language') || 'pt-BR',
    theme: localStorage.getItem('letz-theme') || 'default'
  });

  const [clearCacheDialog, setClearCacheDialog] = useState(false);
  const [aboutDialog, setAboutDialog] = useState(false);
  const [cacheSize, setCacheSize] = useState('Calculando...');
  const [isUpdating, setIsUpdating] = useState(false);

  // Calcular tamanho do cache
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

  const handleSettingChange = (settingId: string, value: boolean | string) => {
    const newSettings = { ...settings, [settingId]: value };
    setSettings(newSettings);

    // Salvar no localStorage
    switch (settingId) {
      case 'darkMode':
        localStorage.setItem('letz-dark-mode', value.toString());
        // Aplicar tema (seria integrado com ThemeContext)
        break;
      case 'locationServices':
        localStorage.setItem('letz-location-enabled', value.toString());
        break;
      case 'autoSync':
        localStorage.setItem('letz-auto-sync', value.toString());
        break;
      case 'language':
        localStorage.setItem('letz-language', value.toString());
        break;
      case 'theme':
        localStorage.setItem('letz-theme', value.toString());
        break;
    }
  };

  const handleInstallApp = async () => {
    const success = await installApp();
    if (success) {
      console.log('App instalado com sucesso!');
    }
  };

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      handleSettingChange('notifications', true);
    }
  };

  const handleClearCache = async () => {
    await clearCache();
    await calculateCacheSize();
    setClearCacheDialog(false);
  };

  const handleUpdateApp = async () => {
    setIsUpdating(true);
    await updateApp();
    setTimeout(() => setIsUpdating(false), 2000);
  };

  const handleShareApp = () => {
    shareContent({
      title: 'LETZ - Organizador de Eventos',
      text: 'Conheça o LETZ! O melhor app para organizar eventos sociais com amigos.',
      url: window.location.origin
    });
  };

  // Configurações organizadas por seção
  const settingsSections: SettingsSection[] = [
    {
      title: 'Aplicativo PWA',
      items: [
        {
          id: 'install',
          label: isInstalled ? 'App Instalado' : 'Instalar App',
          description: isInstalled 
            ? 'O LETZ está instalado em seu dispositivo' 
            : 'Instale para acesso rápido e uso offline',
          icon: <InstallIcon />,
          type: 'action',
          action: isInstalled ? undefined : handleInstallApp
        },
        {
          id: 'connection',
          label: isOnline ? 'Online' : 'Offline',
          description: isOnline 
            ? 'Conectado à internet' 
            : 'Funcionando no modo offline',
          icon: isOnline ? <OnlineIcon /> : <OfflineIcon />,
          type: 'info'
        },
        {
          id: 'sync',
          label: 'Sincronização Automática',
          description: 'Sincronizar dados quando voltar online',
          icon: <SyncIcon />,
          type: 'switch',
          value: settings.autoSync
        },
        {
          id: 'update',
          label: 'Verificar Atualizações',
          description: 'Buscar nova versão do app',
          icon: <UpdateIcon />,
          type: 'action',
          action: handleUpdateApp
        }
      ]
    },
    {
      title: 'Notificações',
      items: [
        {
          id: 'notifications',
          label: 'Notificações Push',
          description: notificationPermission === 'granted' 
            ? 'Notificações ativadas' 
            : 'Receber notificações de eventos e mensagens',
          icon: <NotificationsIcon />,
          type: notificationPermission === 'granted' ? 'switch' : 'action',
          value: settings.notifications,
          action: notificationPermission !== 'granted' ? handleRequestNotifications : undefined
        }
      ]
    },
    {
      title: 'Personalização',
      items: [
        {
          id: 'darkMode',
          label: 'Modo Escuro',
          description: 'Usar tema escuro da interface',
          icon: <DarkModeIcon />,
          type: 'switch',
          value: settings.darkMode
        },
        {
          id: 'theme',
          label: 'Tema',
          description: 'Escolher cores do aplicativo',
          icon: <PaletteIcon />,
          type: 'select',
          value: settings.theme,
          options: [
            { value: 'default', label: 'Padrão' },
            { value: 'blue', label: 'Azul' },
            { value: 'green', label: 'Verde' },
            { value: 'purple', label: 'Roxo' }
          ]
        },
        {
          id: 'language',
          label: 'Idioma',
          description: 'Idioma da interface',
          icon: <LanguageIcon />,
          type: 'select',
          value: settings.language,
          options: [
            { value: 'pt-BR', label: 'Português (Brasil)' },
            { value: 'en-US', label: 'English (US)' },
            { value: 'es-ES', label: 'Español' }
          ]
        }
      ]
    },
    {
      title: 'Privacidade',
      items: [
        {
          id: 'locationServices',
          label: 'Serviços de Localização',
          description: 'Permitir acesso à localização para eventos',
          icon: <LocationIcon />,
          type: 'switch',
          value: settings.locationServices
        }
      ]
    },
    {
      title: 'Armazenamento',
      items: [
        {
          id: 'cacheSize',
          label: 'Cache do App',
          description: `Dados armazenados: ${cacheSize}`,
          icon: <StorageIcon />,
          type: 'action',
          action: () => setClearCacheDialog(true)
        }
      ]
    },
    {
      title: 'Informações',
      items: [
        {
          id: 'share',
          label: 'Compartilhar App',
          description: 'Indicar o LETZ para amigos',
          icon: <ShareIcon />,
          type: 'action',
          action: handleShareApp
        },
        {
          id: 'about',
          label: 'Sobre o LETZ',
          description: 'Versão 1.0.0 - Build PWA',
          icon: <InfoIcon />,
          type: 'action',
          action: () => setAboutDialog(true)
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingItem) => {
    const getStatusChip = () => {
      if (item.id === 'install') {
        return isInstalled ? (
          <Chip label="Instalado" color="success" size="small" />
        ) : isInstallable ? (
          <Chip label="Disponível" color="primary" size="small" />
        ) : (
          <Chip label="Não suportado" color="default" size="small" />
        );
      }

      if (item.id === 'connection') {
        return isOnline ? (
          <Chip label="Online" color="success" size="small" />
        ) : (
          <Chip label="Offline" color="warning" size="small" />
        );
      }

      if (item.id === 'notifications') {
        const color = notificationPermission === 'granted' ? 'success' : 
                     notificationPermission === 'denied' ? 'error' : 'default';
        return (
          <Chip 
            label={notificationPermission === 'granted' ? 'Ativadas' : 
                   notificationPermission === 'denied' ? 'Bloqueadas' : 'Pendente'} 
            color={color} 
            size="small" 
          />
        );
      }

      return null;
    };

    const isDisabled = () => {
      if (item.id === 'install' && isInstalled) return true;
      if (item.id === 'notifications' && notificationPermission === 'denied') return true;
      return false;
    };

    return (
      <ListItem key={item.id} disabled={isDisabled()}>
        <ListItemIcon>
          <Badge 
            badgeContent={item.id === 'update' && cacheStatus === 'updated' ? '!' : 0}
            color="error"
          >
            {item.icon}
          </Badge>
        </ListItemIcon>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              {item.label}
              {getStatusChip()}
            </Box>
          }
          secondary={item.description}
        />
        <ListItemSecondaryAction>
          {item.type === 'switch' && (
            <Switch
              checked={item.value as boolean}
              onChange={(e) => handleSettingChange(item.id, e.target.checked)}
              disabled={isDisabled()}
            />
          )}
          {item.type === 'select' && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={item.value}
                onChange={(e) => handleSettingChange(item.id, e.target.value)}
                variant="outlined"
              >
                {item.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {item.type === 'action' && item.action && (
            <IconButton 
              onClick={item.action}
              disabled={isDisabled() || (item.id === 'update' && isUpdating)}
            >
              {item.id === 'update' && isUpdating ? <SyncIcon /> : item.icon}
            </IconButton>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    );
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

          {/* Indicadores de suporte */}
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

      {/* Progresso de atualização */}
      {isUpdating && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Verificando atualizações...
          </Typography>
        </Box>
      )}

      {/* Seções de configurações */}
      {settingsSections.map((section, index) => (
        <Card key={section.title} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {section.title}
            </Typography>
            <List>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={item.id}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}

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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Após limpar o cache, será necessário baixar novamente os dados quando estiver online.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearCacheDialog(false)}>Cancelar</Button>
          <Button onClick={handleClearCache} color="error" startIcon={<DeleteIcon />}>
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