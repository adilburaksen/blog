const CACHE_NAME = 'hack-with-me-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/shared/404.html',
  '/shared/500.html',
  '/shared/favicon/android-chrome-192x192.png',
  '/shared/favicon/android-chrome-512x512.png',
  '/shared/favicon/favicon.ico',
  '/shared/favicon/favicon-32x32.png',
  '/shared/favicon/favicon-16x16.png',
  '/blog-content/blog.html',
  '/blog-content/about.html',
  '/blog-content/tags.html',
  '/manifest.json'
];

// Install service worker and cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
