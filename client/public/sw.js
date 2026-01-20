/**
 * Service Worker for caching static assets
 * Improves loading performance by caching JS/CSS chunks and assets
 */

// Use timestamp for cache versioning to ensure cache invalidation on deploy
const CACHE_NAME = `devops-roadmap-${Date.now()}`;
const STATIC_CACHE_NAME = `devops-roadmap-static-${Date.now()}`;

// Assets to cache immediately
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json"];

// Cache strategies
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete caches that don't match the current version
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only cache GET requests
  if (request.method !== "GET") return;

  // Cache strategy for JS/CSS chunks and assets
  if (
    url.pathname.match(
      /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/,
    ) ||
    url.pathname.includes("/assets/") ||
    url.pathname.startsWith("/src/")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Don't cache if not a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      }),
    );
  }
});
