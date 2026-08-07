// NIJA KURAL - Service Worker
// App-shell cache-first strategy so the tool works fully offline after first load.
// Video files chosen by the user are never fetched over network (local File API only),
// so no video caching logic is needed here.

const CACHE_VERSION = 'nija-kural-v4';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Google Fonts (cross-origin). We cache these too so Tamil/Latin fonts still
// render offline. Font responses are 'cors'/'opaque' — both are cacheable.
const FONT_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Hind+Madurai:wght@600;700&family=Montserrat:wght@600;800;900&family=Orbitron:wght@700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      await cache.addAll(CORE_ASSETS);
      // Best-effort: don't fail install if font CDN is unreachable at install time.
      await Promise.all(
        FONT_ASSETS.map((url) =>
          fetch(url, { mode: 'cors' })
            .then((res) => cache.put(url, res))
            .catch(() => {})
        )
      );
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isFontAsset =
    url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

  if (isFontAsset) {
    // Stale-while-revalidate for fonts: serve cache instantly, refresh in background.
    event.respondWith(
      caches.open(CACHE_VERSION).then(async (cache) => {
        const cached = await cache.match(req);
        const networkFetch = fetch(req, { mode: 'cors' })
          .then((res) => {
            // Accept both 'basic'/'cors' and opaque cross-origin responses.
            if (res && (res.ok || res.type === 'opaque')) {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    // Cache-first for the app shell itself.
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const resClone = res.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
            }
            return res;
          })
          .catch(() => caches.match('./index.html'));
      })
    );
  }
});
