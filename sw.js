const CACHE = "sw-cache";
var fileList = [
  "./",
  "./assets/css/small.css",
  "./assets/css/style.css",
  "./assets/images/empty.png",
  "./assets/images/logo-192.png",
  "./assets/images/logo-512.png",
  "./assets/images/logo.svg",
  "./assets/images/maskable-192.png",
  "./assets/images/maskable-512.png",
  "./assets/images/screenshots/main-large-dark.png",
  "./assets/images/screenshots/main-large-light.png",
  "./assets/images/screenshots/main-small-dark.png",
  "./assets/images/screenshots/tags-larg-dark.png",
  "./assets/js/helpers.js",
  "./assets/js/idb.js",
  "./assets/js/script.js",
  "./assets/lsf",
  "./assets/manifest.json",
  "./favicon.ico",
  "./files.json",
  "./index.html",
  "./LICENSE",
  "./README.md",
  "./sw.js"
]
;

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
