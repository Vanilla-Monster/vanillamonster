// Service Worker for cache control
const CACHE_NAME = 'vanilla-monster-cache-v1';

// Install event - cache basic assets
self.addEventListener('install', event => {
  self.skipWaiting(); // Force activation
  console.log('Service Worker installed');
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  console.log('Service Worker activated');
});

// Fetch event - network first, then cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Open the cache and store the new response
        caches.open(CACHE_NAME)
          .then(cache => {
            // Don't cache if it's an HTML file (always fetch fresh HTML)
            if (!event.request.url.endsWith('.html') && !event.request.url.endsWith('/')) {
              cache.put(event.request, responseToCache);
            }
          });

        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request);
      })
  );
}); 