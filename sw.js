'use strict';
/* Keeps a copy of the calculator so it opens with no network. Bump VERSION on each release. */
const VERSION = 'freight-v14';
const SHELL = [
  './', 'index.html', 'settings.json', 'manifest.webmanifest',
  'icons/omi-logo.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'fonts/eb-garamond-latin-400-normal.woff2', 'fonts/eb-garamond-latin-700-normal.woff2', 'fonts/eb-garamond-latin-400-italic.woff2',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first, so new rates in settings.json show at once; the cache takes over offline.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' })
    .then((res) => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); } return res; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html'))));
});
