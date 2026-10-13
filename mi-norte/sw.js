// Mi Norte · funciona como app: guarda la página y los íconos para abrir rápido (solo dentro de /mi-norte/)
const CACHE = 'minorte-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'icono-192.png', 'icono-512.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('minorte-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put('./', copia)); return r; }).catch(() => caches.match('./')));
    return;
  }
  if (u.origin === location.origin || u.host.endsWith('fonts.gstatic.com') || u.host.endsWith('fonts.googleapis.com')) {
    e.respondWith(caches.match(e.request).then(enCache => enCache || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); } return r; })));
  }
});
