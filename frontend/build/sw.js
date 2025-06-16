// LETZ PWA Service Worker
const CACHE_NAME = 'letz-v1.0.0';
const STATIC_CACHE = 'letz-static-v1';
const DYNAMIC_CACHE = 'letz-dynamic-v1';
const API_CACHE = 'letz-api-v1';

// Assets críticos para cache imediato
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Padrões de URLs para cache dinâmico
const CACHE_PATTERNS = {
  IMAGES: /\.(png|jpg|jpeg|gif|svg|webp)$/,
  FONTS: /\.(woff|woff2|ttf|eot)$/,
  API: /^\/api\//,
  STATIC: /^\/static\//
};

// Estratégias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Configuração de cache por tipo
const CACHE_CONFIG = {
  images: { strategy: CACHE_STRATEGIES.CACHE_FIRST, maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 dias
  api: { strategy: CACHE_STRATEGIES.NETWORK_FIRST, maxAge: 5 * 60 * 1000 }, // 5 minutos
  static: { strategy: CACHE_STRATEGIES.CACHE_FIRST, maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 dias
  pages: { strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE, maxAge: 24 * 60 * 60 * 1000 } // 1 dia
};

// ============================================
// INSTALAÇÃO DO SERVICE WORKER
// ============================================
self.addEventListener('install', event => {
  console.log('🚀 LETZ SW: Instalando...');
  
  event.waitUntil(
    Promise.all([
      // Cache de assets estáticos
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 LETZ SW: Cachando assets estáticos');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Configurações iniciais
      initializeNotifications(),
      initializeBackgroundSync()
    ]).then(() => {
      console.log('✅ LETZ SW: Instalação concluída');
      return self.skipWaiting();
    })
  );
});

// ============================================
// ATIVAÇÃO DO SERVICE WORKER
// ============================================
self.addEventListener('activate', event => {
  console.log('🔄 LETZ SW: Ativando...');
  
  event.waitUntil(
    Promise.all([
      // Limpeza de caches antigos
      cleanOldCaches(),
      
      // Reivindicar controle de todos os clientes
      self.clients.claim()
    ]).then(() => {
      console.log('✅ LETZ SW: Ativação concluída');
    })
  );
});

// ============================================
// INTERCEPTAÇÃO DE REQUISIÇÕES
// ============================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-HTTP
  if (!request.url.startsWith('http')) return;
  
  // Estratégia por tipo de recurso
  if (CACHE_PATTERNS.API.test(url.pathname)) {
    event.respondWith(handleApiRequest(request));
  } else if (CACHE_PATTERNS.IMAGES.test(url.pathname)) {
    event.respondWith(handleImageRequest(request));
  } else if (CACHE_PATTERNS.STATIC.test(url.pathname)) {
    event.respondWith(handleStaticRequest(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// ============================================
// NOTIFICAÇÕES PUSH
// ============================================
self.addEventListener('push', event => {
  console.log('📬 LETZ SW: Notificação push recebida');
  
  const options = {
    body: 'Você tem uma nova notificação do LETZ!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore', 
        title: 'Ver detalhes',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close', 
        title: 'Fechar',
        icon: '/images/xmark.png'
      },
    ]
  };

  let title = 'LETZ - Organizador de Eventos';
  let body = 'Você tem uma nova notificação!';

  if (event.data) {
    const data = event.data.json();
    title = data.title || title;
    body = data.body || body;
    
    if (data.type) {
      switch (data.type) {
        case 'new_event':
          options.body = `Novo evento: ${data.eventTitle}`;
          options.icon = '/icons/event.png';
          break;
        case 'friend_request':
          options.body = `${data.userName} enviou uma solicitação de amizade`;
          options.icon = '/icons/friend.png';
          break;
        case 'event_invite':
          options.body = `Você foi convidado para: ${data.eventTitle}`;
          options.icon = '/icons/invite.png';
          break;
        case 'event_reminder':
          options.body = `Lembrete: ${data.eventTitle} em ${data.timeUntil}`;
          options.icon = '/icons/reminder.png';
          break;
        default:
          options.body = body;
      }
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ============================================
// CLIQUES EM NOTIFICAÇÕES
// ============================================
self.addEventListener('notificationclick', event => {
  console.log('👆 LETZ SW: Clique em notificação');
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'close') {
    return;
  }
  
  // URL de destino baseada no tipo de notificação
  let targetUrl = '/';
  
  if (data) {
    switch (data.type) {
      case 'event_invite':
        targetUrl = `/events/${data.eventId}`;
        break;
      case 'friend_request':
        targetUrl = '/friends';
        break;
      case 'message':
        targetUrl = '/messages';
        break;
      case 'event_reminder':
        targetUrl = `/events/${data.eventId}`;
        break;
      default:
        targetUrl = data.url || '/';
    }
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Tentar focar em uma janela existente
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Abrir nova janela se não encontrou
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ============================================
// BACKGROUND SYNC
// ============================================
self.addEventListener('sync', event => {
  console.log('🔄 LETZ SW: Background sync');
  
  if (event.tag === 'send-messages') {
    event.waitUntil(sendPendingMessages());
  } else if (event.tag === 'sync-events') {
    event.waitUntil(syncEvents());
  } else if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// ============================================
// SHARE TARGET
// ============================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHARE_TARGET') {
    console.log('📤 LETZ SW: Share target recebido', event.data);
    
    // Processar dados compartilhados
    const sharedData = event.data.data;
    
    // Redirecionar para página de criação de evento com dados
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clients => {
        if (clients.length > 0) {
          clients[0].postMessage({
            type: 'SHARED_CONTENT',
            data: sharedData
          });
          return clients[0].focus();
        }
        return self.registration.clients.openWindow('/events/create?shared=true');
      })
    );
  }
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Estratégia para requisições de API
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 LETZ SW: API offline, tentando cache', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Resposta offline para APIs críticas
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Você está offline. Esta funcionalidade ficará disponível quando voltar online.'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Estratégia para imagens
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Imagem placeholder para offline
    return caches.match('/icons/offline-image.png');
  }
}

// Estratégia para recursos estáticos
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Estratégia para páginas
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Página offline
    return caches.match('/offline.html');
  }
}

// Limpeza de caches antigos
async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];
  
  return Promise.all(
    cacheNames
      .filter(cacheName => !validCaches.includes(cacheName))
      .map(cacheName => caches.delete(cacheName))
  );
}

// Inicialização de notificações
async function initializeNotifications() {
  // Configurações de notificação podem ser implementadas aqui
  console.log('🔔 LETZ SW: Notificações inicializadas');
}

// Inicialização de background sync
async function initializeBackgroundSync() {
  console.log('🔄 LETZ SW: Background sync inicializado');
}

// Envio de mensagens pendentes
async function sendPendingMessages() {
  // Implementar sincronização de mensagens offline
  console.log('📨 LETZ SW: Enviando mensagens pendentes');
}

// Sincronização de eventos
async function syncEvents() {
  // Implementar sincronização de eventos
  console.log('📅 LETZ SW: Sincronizando eventos');
}

function doBackgroundSync() {
  return fetch('/api/sync')
    .then(response => {
      console.log('Background sync successful');
      return response.json();
    })
    .catch(error => {
      console.error('Background sync failed:', error);
    });
} 