// sw.js – Tavupeli (offline app-shell Safari/iPad yhteensopiva)
const CACHE_PREFIX = 'tavupeli-';
const CACHE_VERSION = 'v3';
const CACHE = `${CACHE_PREFIX}${CACHE_VERSION}`;

// Jos /<repo>/ -polku (GitHub Pages), laita tähän sama polku kuin manifestin start_url/scope
const SCOPE = '/kakuro/'; // tai esim. '/tavupeli/'

const ASSETS = [
  `${SCOPE}`,
  `${SCOPE}index.html`,
  `${SCOPE}manifest.webmanifest`, // nimeä vastaamaan omaasi
  `${SCOPE}app.js`,              // lisää JS
  `${SCOPE}styles.css`,          // lisää CSS
  `${SCOPE}pwa_icon_180.png`,
  `${SCOPE}pwa_icon-192.png`,
  `${SCOPE}pwa_icon-512.png`
];

// --- Install: precacheaa app-shell ---
self.addEventListener('install', (event) => {
  // iOS/Safari: cache:'reload' varmistaa tuoreen index.html:n
  const toCache = ASSETS.map(u =>
    new Request(u, { cache: 'reload' })
  );
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(toCache)).then(() => self.skipWaiting())
  );
});

// --- Activate: siivoa vanhat välimuistit ja claim ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE)
        .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// --- Fetch: 
// 1) Navigaatiot -> palauta index.html offline-fallbackina
// 2) Samasta originista tulevat GETit -> cache-first (stale-while-revalidate light)
// 3) Muut -> anna verkon yrittää, offline-tilassa ei tehdä mitään erikoista
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Vain GETiä käsitellään
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1) App-shell navigaatiot
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Online -> hae verkosta ja päivitä cache
          const net = await fetch(req);
          const cache = await caches.open(CACHE);
          cache.put(`${SCOPE}index.html`, net.clone());
          return net;
        } catch (_e) {
          // Offline -> palauta precachetettu index.html
          const cached = await caches.match(`${SCOPE}index.html`);
          return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
        }
      })()
    );
    return;
  }

  // 2) Samasta originista tulevat staattiset GET-pyynnöt: cache-first
  if (url.origin === location.origin) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) {
          // Päivitä taustalla (stale-while-revalidate kevyt malli)
          fetch(req).then(resp => {
            caches.open(CACHE).then(c => c.put(req, resp));
          }).catch(()=>{});
          return cached;
        }
        try {
          const net = await fetch(req);
          // Älä tallenna ei-ok/opaque jos ei tarvetta
          if (net.ok) {
            const copy = net.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return net;
        } catch (_e) {
          // Offline eikä välimuistissa
          // Yritä palauttaa index app-shellinä jos pyydettiin polkua
          if (req.destination === 'document') {
            const shell = await caches.match(`${SCOPE}index.html`);
            if (shell) return shell;
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        }
      })()
    );
  }
});
