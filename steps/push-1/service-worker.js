console.log('Service worker ok =D');

var cacheAppShellStatic = [
  "/",
  "mocks/notification.json",
  "mocks/people.json",
  "manifest/manifest.json",
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
  "/angularjs/app.module.js",
  "/angularjs/app.config.js",
  "/angularjs/home/home.module.js",
  "/angularjs/home/home.controller.js",
  "/angularjs/components/components.module.js",
  "/angularjs/components/services/people.service.js",
  "/angularjs/components/directives/people-card/people-card.js",
  "/angularjs/components/filters/capitalize.js",
  "/offline.html"
];

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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
    self.clients.claim().then(function() {
      caches.delete('cache-dynamic')
    })
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

self.addEventListener('push', function(event) {

  // exercice 8-1: add your code here

});
