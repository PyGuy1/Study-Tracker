const STATIC_CACHE = "study-tracker-v3";
const OFFLINE_URL = "./index.html";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./Study-tracker.png",
  "./Study-tracker-png.png",
  "./Study-Tracker-poster.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).catch(() => caches.match(OFFLINE_URL))
      );
    })
  );
});
