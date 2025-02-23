const CACHE_NAME = 'hackwith-me-v1';
const URLS_TO_CACHE = [
  '/',
  '/main/index.html',
  '/blog-content/blog.html',
  '/blog-content/about.html',
  '/shared/css/style.css',
  '/shared/js/main.js',
  '/shared/404.html',
  '/shared/500.html',
  // Add other important assets here
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});
