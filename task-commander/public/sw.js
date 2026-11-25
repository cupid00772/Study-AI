const CACHE_NAME = 'task-commander-pwa-v2';
const APP_SHELL = ['./manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Supabase REST / Auth / Realtime 永遠走網路，避免快取舊資料
  if (url.hostname.endsWith('.supabase.co')) {
    if (url.pathname.includes('/storage/v1/object/public/')) {
      // 雲端教材檔：Network-first + 離線快取備援
      event.respondWith(
        fetch(request)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => caches.match(request).then((m) => m || Response.error()))
      );
    }
    return;
  }

  // 同源靜態資源：HTML 強制走最新網路版本（避免指向舊版 hashed chunk）
  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
      event.respondWith(
        fetch(request, { cache: 'no-cache' })
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() =>
            caches
              .match(request)
              .then((m) => m || caches.match('./index.html'))
              .then((m) => m || Response.error())
          )
      );
      return;
    }

    // Hashed assets（/assets/*）：命中快取直接回傳，未命中則走網路並僅快取 200 OK
    if (url.pathname.includes('/assets/')) {
      event.respondWith(
        caches.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request)
            .then((res) => {
              if (res && res.ok) {
                const copy = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
              }
              return res;
            })
            .catch(() => Response.error());
        })
      );
      return;
    }

    // 其他同源靜態檔（icon、manifest 等）：Stale-while-revalidate，永不回傳 undefined
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetched = fetch(request)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => cached || Response.error());
        return cached || fetched;
      })
    );
  }
});
