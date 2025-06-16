import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar funcionalidades PWA
 * Oferece controle completo sobre service worker, notificações, 
 * cache, estado offline e instalação
 */
export const usePWA = () => {
  // Estados
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(
    Notification?.permission || 'default'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [cacheStatus, setCacheStatus] = useState('idle');

  // ============================================
  // DETECÇÃO DE CONEXÃO
  // ============================================
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🟢 LETZ PWA: Conexão restaurada');
      
      // Sincronizar dados pendentes
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('🔴 LETZ PWA: Conexão perdida');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ============================================
  // SERVICE WORKER
  // ============================================
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      setSwRegistration(registration);
      console.log('✅ LETZ PWA: Service Worker registrado');

      // Ouvir atualizações do SW
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 LETZ PWA: Nova versão disponível');
            // Notificar usuário sobre atualização
            showUpdateNotification();
          }
        });
      });

      // Ouvir mensagens do SW
      navigator.serviceWorker.addEventListener('message', handleSWMessage);

    } catch (error) {
      console.error('❌ LETZ PWA: Erro ao registrar Service Worker:', error);
    }
  };

  const handleSWMessage = (event) => {
    const { type, data } = event.data;

    switch (type) {
      case 'CACHE_UPDATED':
        setCacheStatus('updated');
        console.log('📦 LETZ PWA: Cache atualizado');
        break;
      
      case 'OFFLINE_READY':
        setCacheStatus('ready');
        console.log('📱 LETZ PWA: App pronto para uso offline');
        break;
      
      case 'SHARED_CONTENT':
        handleSharedContent(data);
        break;
      
      default:
        console.log('📨 LETZ PWA: Mensagem do SW:', event.data);
    }
  };

  // ============================================
  // INSTALAÇÃO PWA
  // ============================================
  useEffect(() => {
    // Detectar se o app já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Ouvir evento de instalação
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('📲 LETZ PWA: App pode ser instalado');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('✅ LETZ PWA: App instalado com sucesso');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    setIsLoading(true);
    
    try {
      // Mostrar prompt de instalação
      deferredPrompt.prompt();
      
      // Aguardar resposta do usuário
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('🎉 LETZ PWA: Usuário aceitou instalar');
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('❌ LETZ PWA: Usuário recusou instalar');
        return false;
      }
    } catch (error) {
      console.error('❌ LETZ PWA: Erro na instalação:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // NOTIFICAÇÕES
  // ============================================
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('⚠️ LETZ PWA: Notificações não suportadas');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      console.log('🔔 LETZ PWA: Permissão de notificação concedida');
      
      // Configurar push notifications se SW disponível
      if (swRegistration) {
        await subscribeToPushNotifications();
      }
      
      return true;
    }

    console.log('❌ LETZ PWA: Permissão de notificação negada');
    return false;
  };

  const subscribeToPushNotifications = async () => {
    if (!swRegistration) return;

    try {
      // Chave pública VAPID seria obtida do backend
      const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY || 
        'BEl62iUYgUivxIkv69yViEuiBIa40HI2eaa7ufLdqgKGRbCWJcYYoXYgSz5nWJD_qFOEm_T4vVP3pTWWMM7DqSM';

      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      console.log('📲 LETZ PWA: Inscrito em push notifications');
      
      // Enviar subscription para o backend
      await sendSubscriptionToServer(subscription);
      
    } catch (error) {
      console.error('❌ LETZ PWA: Erro ao inscrever em push notifications:', error);
    }
  };

  const showNotification = (title, options = {}) => {
    if (Notification.permission !== 'granted') return;

    const defaultOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: { timestamp: Date.now() }
    };

    if (swRegistration) {
      // Usar SW para notificações
      swRegistration.showNotification(title, {
        ...defaultOptions,
        ...options
      });
    } else {
      // Fallback para notificação direta
      new Notification(title, {
        ...defaultOptions,
        ...options
      });
    }
  };

  // ============================================
  // CACHE E SINCRONIZAÇÃO
  // ============================================
  const clearCache = async () => {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      setCacheStatus('cleared');
      console.log('🗑️ LETZ PWA: Cache limpo');
      
      // Recarregar para obter versão fresca
      window.location.reload();
    } catch (error) {
      console.error('❌ LETZ PWA: Erro ao limpar cache:', error);
    }
  };

  const updateApp = async () => {
    if (!swRegistration) return;

    try {
      await swRegistration.update();
      console.log('🔄 LETZ PWA: Verificando atualizações...');
    } catch (error) {
      console.error('❌ LETZ PWA: Erro ao atualizar:', error);
    }
  };

  const syncPendingData = useCallback(async () => {
    if (!swRegistration || !isOnline) return;

    try {
      // Disparar background sync para diferentes tipos de dados
      await swRegistration.sync.register('sync-events');
      await swRegistration.sync.register('send-messages');
      
      console.log('🔄 LETZ PWA: Sincronização iniciada');
    } catch (error) {
      console.error('❌ LETZ PWA: Erro na sincronização:', error);
    }
  }, [swRegistration, isOnline]);

  // ============================================
  // COMPARTILHAMENTO
  // ============================================
  const shareContent = async (data) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        console.log('📤 LETZ PWA: Conteúdo compartilhado');
        return true;
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('❌ LETZ PWA: Erro ao compartilhar:', error);
        }
        return false;
      }
    } else {
      // Fallback para navegadores sem Web Share API
      copyToClipboard(data.url || data.text);
      return true;
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('LETZ', {
        body: 'Link copiado para a área de transferência!',
        tag: 'clipboard'
      });
    } catch (error) {
      console.error('❌ LETZ PWA: Erro ao copiar:', error);
    }
  };

  // ============================================
  // FUNÇÕES AUXILIARES
  // ============================================
  const handleSharedContent = (sharedData) => {
    console.log('📤 LETZ PWA: Conteúdo compartilhado recebido:', sharedData);
    
    // Dispatch evento personalizado para a aplicação
    window.dispatchEvent(new CustomEvent('sharedcontent', {
      detail: sharedData
    }));
  };

  const showUpdateNotification = () => {
    showNotification('LETZ Atualizado!', {
      body: 'Nova versão disponível. Toque para atualizar.',
      tag: 'app-update',
      requireInteraction: true,
      actions: [
        { action: 'update', title: 'Atualizar', icon: '/icons/action-update.png' },
        { action: 'later', title: 'Depois', icon: '/icons/action-close.png' }
      ]
    });
  };

  const sendSubscriptionToServer = async (subscription) => {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      if (response.ok) {
        console.log('✅ LETZ PWA: Subscription enviada para servidor');
      }
    } catch (error) {
      console.error('❌ LETZ PWA: Erro ao enviar subscription:', error);
    }
  };

  // ============================================
  // RETURN HOOK
  // ============================================
  return {
    // Estados
    isOnline,
    isInstallable,
    isInstalled,
    isLoading,
    notificationPermission,
    cacheStatus,
    swRegistration,

    // Funcões de instalação
    installApp,

    // Funções de notificação
    requestNotificationPermission,
    showNotification,

    // Funções de cache e sincronização
    clearCache,
    updateApp,
    syncPendingData,

    // Funções de compartilhamento
    shareContent,
    copyToClipboard,

    // Utilitários
    isSupported: {
      serviceWorker: 'serviceWorker' in navigator,
      notifications: 'Notification' in window,
      share: 'share' in navigator,
      installPrompt: 'BeforeInstallPromptEvent' in window || window.BeforeInstallPromptEvent,
      push: 'PushManager' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype
    }
  };
}; 