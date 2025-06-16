class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;

  async init() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado:', this.registration);
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.error('Service Worker não registrado');
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.REACT_APP_VAPID_PUBLIC_KEY || ''
        ),
      });

      // Enviar subscription para o servidor
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Erro ao se inscrever para push notifications:', error);
      return null;
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error('Erro ao enviar subscription para o servidor:', error);
    }
  }

  showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo192.png',
        badge: '/logo192.png',
        ...options,
      });
    }
  }

  showEventNotification(eventTitle: string, message: string) {
    this.showNotification(`LETZ - ${eventTitle}`, {
      body: message,
      icon: '/logo192.png',
      tag: 'event-notification',
      actions: [
        {
          action: 'view',
          title: 'Ver Evento',
        },
        {
          action: 'dismiss',
          title: 'Dispensar',
        },
      ],
    });
  }

  showFriendRequestNotification(senderName: string) {
    this.showNotification('Nova Solicitação de Amizade', {
      body: `${senderName} enviou uma solicitação de amizade`,
      icon: '/logo192.png',
      tag: 'friend-request',
      actions: [
        {
          action: 'accept',
          title: 'Aceitar',
        },
        {
          action: 'decline',
          title: 'Recusar',
        },
      ],
    });
  }

  showMessageNotification(senderName: string, message: string) {
    this.showNotification(`Mensagem de ${senderName}`, {
      body: message,
      icon: '/logo192.png',
      tag: 'message',
      actions: [
        {
          action: 'reply',
          title: 'Responder',
        },
      ],
    });
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const notificationService = new NotificationService(); 