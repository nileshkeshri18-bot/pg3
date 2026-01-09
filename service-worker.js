// pg3/service-worker.js
const CACHE = "pg3-cache-v5";

const ASSETS = [
  "/pg3/",
  "/pg3/index.html",
  "/pg3/app.webmanifest",
  "/pg3/icons/icon-192.PNG"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // ✅ CRITICAL: do not touch POST/PUT/DELETE (your submit is POST)
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // ✅ Only handle same-origin GET requests (your GitHub pages files)
  if (url.origin !== self.location.origin) return;

  // ✅ For page navigation, prefer fresh HTML (Network-first)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // ✅ For assets, Cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
