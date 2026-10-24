/* Service worker: guarda el sitio para usarlo sin internet después de la primera visita.
   Cambiá VERSION en cada deploy para que los equipos bajen la versión nueva. */
const VERSION = "repaso3-2026-10-24-1";
const SHELL = ["./", "index.html", "app.js", "styles.css", "banco.json", "manifest.webmanifest", "fonts/fonts.css",
  "fonts/baloo2-latin.woff2", "fonts/baloo2-latin-ext.woff2", "fonts/baloo2-vietnamese.woff2",
  "fonts/nunito-latin.woff2", "fonts/nunito-latin-ext.woff2", "fonts/nunito-vietnamese.woff2",
  "padres.html", "icons/icon.svg", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-512-maskable.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Código y preguntas: primero la red (para recibir correcciones), si no hay, lo guardado.
   Fuentes e íconos: primero lo guardado. */
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  const cacheFirst = /\/(fonts|icons)\//.test(url.pathname);
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    if (cacheFirst) { const hit = await cache.match(e.request); if (hit) return hit; }
    try {
      const res = await fetch(e.request);
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    } catch {
      return (await cache.match(e.request, { ignoreSearch: true })) || (e.request.mode === "navigate" ? cache.match("index.html") : Response.error());
    }
  })());
});
