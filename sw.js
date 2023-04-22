const CACHE = "sw-cache";
var fileList = [
  "./",
  "./assets/css/small.css",
  "./assets/css/style.css",
  "./assets/images/empty.png",
  "./assets/images/logo.svg",
  "./assets/js/helpers.js",
  "./assets/js/idb.js",
  "./assets/js/script.js",
  "./assets/manifest.json",
  "./favicon.ico",
  "./index.html",
  "./sw.js"
];

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
