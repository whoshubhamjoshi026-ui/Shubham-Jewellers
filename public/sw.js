const CACHE_NAME = 'shubham-jewellers-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.png'
]; // <-- Ye array close karna missing tha

// Service Worker Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
}); // <-- Ye event listener close karna missing tha

// Service Worker Activation & Old Cache Clean-up
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
}); // <-- Ye event listener close karna missing tha

// Fetch Interception Strategy: Stale-While-Revalidate for app shell & static files, Network-first for API requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Bypass API requests to ensure fresh live data when online
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'You are currently offline. Please reconnect to access live data.',
            offline: true,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  } // <-- Ye if block close karna missing tha

  // Handle static page / assets caching
  // Network-first: always try to get the LATEST file from the server first
  // (so new banners, icons, JS/CSS bundles show up immediately after an update).
  // Only fall back to the cached copy if the network request fails (offline).
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline fallback: serve whatever we have cached
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // Fallback for navigation requests when offline and nothing cached
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
        });
      })
  );
});