"use strict";

var FILES_TO_CACHE = ["/", "/index.html", "/styles.css", "/index.js", "/manifest.webmanifest", "/icons/icon-192x192.png", "/icons/icon-512x512.png"];
var CACHE_NAME = "static-cache-v2";
var DATA_CACHE_NAME = "data-cache-v1"; //when we install, opens static cache and puts all files in array there in cache

self.addEventListener("install", function (evt) {
  evt.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    console.log("Your files were pre-cached successfully!");
    return cache.addAll(FILES_TO_CACHE);
  }));
  self.skipWaiting();
}); //deleting old cache data
//change cache version name to the next version/refresh the cache

self.addEventListener("activate", function (evt) {
  evt.waitUntil(caches.keys().then(function (keyList) {
    return Promise.all(keyList.map(function (key) {
      if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
        console.log("Removing old cache data", key);
        return caches["delete"](key);
      }
    }));
  }));
  self.clients.claim();
}); //if api included in url request, the data will be stored to cache

self.addEventListener("fetch", function (evt) {
  // cache successful requests to the API
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(caches.open(DATA_CACHE_NAME).then(function (cache) {
      return fetch(evt.request).then(function (response) {
        // If the response was good, clone it and store it in the cache.
        if (response.status === 200) {
          cache.put(evt.request.url, response.clone());
        }

        return response;
      })["catch"](function (err) {
        // Network request failed, try to get it from the cache.
        return cache.match(evt.request);
      });
    })["catch"](function (err) {
      return console.log(err);
    }));
    return;
  }

  evt.respondWith(caches.match(evt.request).then(function (response) {
    return response || fetch(evt.request);
  }));
});