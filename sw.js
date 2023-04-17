const CACHE = "sw-cache";
var fileList = ["./", "./index.html", "./favicon.ico"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(fileList);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  e.respondWith((async () => {
    return fetch(e.request).catch(async () => await caches.match(e.request));
  })());
});
