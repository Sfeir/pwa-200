console.log('Service worker ok =D');

var cacheAppShellStatic = [
  "/",
  "/index.html",
  "/bootstrap/dist/css/bootstrap.min.css",
  "/angular-material/angular-material.min.css",
  "/css/app.css",
  "/img/bg_left.png",
  "/img/bg_right.png",
  "/img/cat.jpg",
  "/img/logo-sfeir.svg",
  "/img/offline.jpg",
  "/img/search.svg",
  "/angular/angular.min.js",
  "/angular-route/angular-route.min.js",
  "/angular-animate/angular-animate.min.js",
  "/angular-material/angular-material.min.js",
  "/angular-aria/angular-aria.min.js",
  "/js/app.module.js",
  "/js/app.config.js",
  "/js/home/home.module.js",
  "/js/home/home.controller.js",
  "/js/components/components.module.js",
  "/js/components/services/people.service.js",
  "/js/components/directives/people-card/people-card.js",
  "/js/components/filters/capitalize.js",
  "/offline.html"
];

self.addEventListener('install', function (event) {
  console.log('event install');
  event.waitUntil(
    caches.open('cache-static').then(function (cache) {
      return cache.addAll(cacheAppShellStatic);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('event activate');
  event.waitUntil(

    // exercice 5-5: update this section and add your code here
    self.clients.claim()
  );
});

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  const catImage = 'img/cat.jpg';
  const offlineFile = 'offline.html';

  if(url.pathname.includes('socket.io')
      || url.origin.startsWith('chrome-extension')){
    return false;
  }
  else {
    if (url.pathname.endsWith('jpg')) {
      event.respondWith(caches.match(new Request(catImage)));
      return false;
    }

    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(responseFetch) {
          return caches.open('cache-dynamic').then(function (cache) {
            cache.put(event.request, responseFetch.clone());
            return responseFetch;
          });
        }).catch(function() {
          return event.respondWith(caches.match(new Request(offlineFile)));
        });
      })
    );
  }

});
