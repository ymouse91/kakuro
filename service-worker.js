const CACHE_NAME = 'tavupeli-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './pwa_icon_180.png',
  './pwa_icon-192.png',
  './pwa_icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});