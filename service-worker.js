
const CACHE = "lingogo-v3";
const ASSETS = [
  "./index.html",
  "./css/main.css",
  "./js/app.js",
  "./data/japan.json",
  "./data/korea.json",
  "./manifest.json",
  "./assets/icons/icon-192.svg",
  "./assets/icons/icon-512.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k.startsWith("lingogo-") && k !== CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  // Ignore non-GET and cross-origin requests
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  if (req.destination === "document") {
    // Navigation: network-first, fall back to cached index.html
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
  } else {
    // Static assets and JSON: cache-first, network fallback
    e.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        });
        // No catch: non-navigation failures propagate normally
      })
    );
  }
});
