console.log('Je suis le service worker !');

var filesToCache = [
  '/offline.html',
  '/img/offline.jpg'
];

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      return response || fetch(event.request).then(function(responseFetch){
        return caches.open('dynamic-cache').then(function(cache){
          cache.put(event.request, responseFetch.clone());
          return responseFetch;
        });
      });
    }).catch(function(){
      return caches.match('/offline.html');
    })
  );
});

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open('offline-cache').then(function(cache){
      cache.addAll(filesToCache);
    })
  )
});
