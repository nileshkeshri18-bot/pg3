// pg3/service-worker.js
const CACHE = "pg3-cache-v11";

const ASSETS = [
  "/pg3/",
  "/pg3/index.html",
  "/pg3/app.webmanifest",
  "/pg3/icons/icon-192.PNG"  // your existing icon (case sensitive)
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
  // ✅ Never intercept POST/PUT/DELETE (submit is POST)
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  // Only handle same-origin GET requests
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
