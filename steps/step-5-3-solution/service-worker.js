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
    self.clients.claim()
  );
});

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  const catImage = 'img/cat.jpg';

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
        return response || fetch(event.request);
      })
    );
  }

});
