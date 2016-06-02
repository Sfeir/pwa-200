console.log('Salut, je suis le service worker ! ');

var filesCached = [
  //'/offline.html',
  //'/img/offline.jpg'
  '/',
  '/index.html'
];

self.addEventListener('fetch', function(event){
  var url = new URL(event.request.url);

  /*if(url.pathname.indexOf('.jpg') > -1 && url.pathname.indexOf('offline.jpg') === -1){
      return fetch('img/cat.jpg');
  }*/

  event.respondWith(
    caches.open('app-cache').then(function(cache){
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          if(event.request.method === 'GET'){
            cache.put(event.request, response.clone());
            return response;
          } else {
            return response;
          }

        });
      });
    })
  );

  /*event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
      .catch(function(err){
        if(event.request.mode === 'navigate'){
          return caches.match('/offline.html');
        }
        else {
          throw new Error(err);
        }
    })
  );*/
});

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open('offline-cache').then(function(cache){
      console.log('On ajoute des fichiers au cache');
      return cache.addAll(filesCached);
    }, function(err){
      console.log('Error cache');
    })
  );
});

self.addEventListener('activate', function(e) {
    console.log('Update cache');
    self.clients.claim();
    e.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(cacheNames.map(function(key) {
                    if (key !== 'offline-cache') {
                        return caches.delete(key);
                    }
                }))
            })
            .catch(function(err) {
                console.log('ACTIVATE ERROR ', err);
            })
    )
});
