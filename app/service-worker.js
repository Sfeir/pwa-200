var cacheAppShell = [
  '/',
  '/index.html',
  'css/app.css',
  'bootstrap/dist/css/bootstrap.min.css',
  'angular-material/angular-material.min.css',
  'img/logo-sfeir.svg',
  'offline.html',
  'angular/angular.min.js',
  'angular-route/angular-route.min.js',
  'angular-animate/angular-animate.min.js',
  'angular-material/angular-material.min.js',
  'angular-aria/angular-aria.min.js',
  'js/app.module.js',
  'js/app.config.js',
  'js/home/home.module.js',
  'js/home/home.controller.js',
  'js/components/components.module.js',
  'js/components/services/people.service.js',
  'js/components/directives/people-card/people-card.js',
  'js/components/filters/capitalize.js'
];

console.log('Service worker ok =D');

self.addEventListener('install', function (event) {
  console.log('event install');
  event.waitUntil(
    caches.open('cache-static').then(function (cache) {
      return cache.addAll(cacheAppShell);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('event activate');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith('jpg')) {
    event.respondWith(fetch('img/cat.jpg'));
  }
  else {
    if(url.pathname.includes('socket.io')){
      return false;
    }
    event.respondWith(
      caches.match(event.request).then(function (response) {
        //console.log(event.request.url, !!response);
        return response || fetch(event.request).then(function (responseFetch) {
            return caches.open('dynamic-cache').then(function (cache) {
              cache.put(event.request, responseFetch.clone());
              return responseFetch;
            })
          });
      })/*.catch(function () {
       return caches.match('offline.html');
       })*/
    );
  }
});

self.addEventListener('push', function(event) {
  event.waitUntil(
    function() {
      self.registration.showNotification('Coucou !', {
        body: 'Je suis un chat !',
        icon: 'img/cat.jpg',
        tag: 'tag'
      });
    });
});

