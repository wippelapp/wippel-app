const CACHE_NAME = 'wippel-app-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/b926537c-4ac1-40b9-90f2-a4a516b8859a.png',
  'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1068efad-9fa4-4819-a205-9feef69d4a31.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sync data when back online
  return Promise.resolve();
}

// Push notifications support
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Wippel App',
    icon: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/b926537c-4ac1-40b9-90f2-a4a516b8859a.png',
    badge: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/b926537c-4ac1-40b9-90f2-a4a516b8859a.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Wippel App', options)
  );
});