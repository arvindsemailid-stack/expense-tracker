const CACHE = "expense-tracker-v1";
const ASSETS = [
  "/expense-tracker/",
  "/expense-tracker/index.html",
  "/expense-tracker/manifest.json",
  "/expense-tracker/icon-192.png",
  "/expense-tracker/icon-512.png",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", e => {
  // Always go network-first for API calls
  if (e.request.url.includes("firestore") ||
      e.request.url.includes("anthropic") ||
      e.request.url.includes("workers.dev")) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
