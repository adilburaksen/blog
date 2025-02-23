const CACHE_NAME = 'hackwith-me-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

const STATIC_ASSETS = [
  '/',
  '/main/index.html',
  '/shared/css/style.css',
  '/shared/js/main.js',
  '/shared/404.html',
  '/shared/500.html',
];

const BLOG_CACHE_CONFIG = {
  maxItems: 50, // Maximum number of blog posts to cache
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// Cache static assets during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Helper function to clean old blog posts from cache
async function cleanOldBlogPosts() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();
  const blogPosts = requests.filter(req => req.url.includes('/blog-content/'));
  
  if (blogPosts.length > BLOG_CACHE_CONFIG.maxItems) {
    const itemsToRemove = blogPosts.slice(0, blogPosts.length - BLOG_CACHE_CONFIG.maxItems);
    await Promise.all(itemsToRemove.map(request => cache.delete(request)));
  }
}

// Advanced fetch handler with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy for static assets: Cache First
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    );
    return;
  }

  // Strategy for blog content: Stale While Revalidate
  if (url.pathname.startsWith('/blog-content/')) {
    event.respondWith(
      caches.match(request)
        .then(async (response) => {
          const fetchPromise = fetch(request)
            .then(async (networkResponse) => {
              if (networkResponse.ok) {
                const cache = await caches.open(DYNAMIC_CACHE);
                await cache.put(request, networkResponse.clone());
                await cleanOldBlogPosts();
              }
              return networkResponse;
            });

          return response || fetchPromise;
        })
    );
    return;
  }

  // Default strategy: Network First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then(async (response) => {
        if (response.ok) {
          const cache = await caches.open(DYNAMIC_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
