self.addEventListener('install', function (event) {
  console.log('event install');
  event.waitUntil(
    caches
    .open('cache-static')
    .then(function (cache) {
      return cache.addAll(['/', '/index.html', '/offline.html']);
    })
    .then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('event activate');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function (error) {
      return caches.open('cache-static').then(function (cache) {
        return cache.match('offline.html');
      })

    })
  )
});
