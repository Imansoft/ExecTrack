const CACHE_NAME = 'exectrack-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './planner.html',
  './todo.html',
  './manifest.json',
  './storage.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  // Add your CSS, JS, and icon files here
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});