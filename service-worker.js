// pg3/service-worker.js

const CACHE = "pg3-cache-v2"; // change version whenever you update files
const ASSETS = [
  "/pg3/",
  "/pg3/index.html",
  "/pg3/app.webmanifest",
  "/pg3/icons/icon-192.PNG",
  "/pg3/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
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
  // ✅ IMPORTANT: Do NOT intercept POST/PUT/DELETE etc (your Google
