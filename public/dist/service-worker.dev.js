"use strict";

var FILES_TO_CACHE = ["/", "/index.html", "index.js", "manifest.webmanifest"];
var CACHE_NAME = "static-cache-v2";
var DATA_CACHE_NAME = "data-cache-v1"; // INSTALL

self.addEventListener("install", function (evt) {
  evt.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    console.log("Your files were pre-cached successfully!");
    return cache.addAll(FILES_TO_CACHE);
  }));
  self.skipWaiting();
}); // ACTIVATE

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
}); // FETCH

self.addEventListener("fetch", function (evt) {
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(caches.open(DATA_CACHE_NAME).then(function (cache) {
      return fetch(evt.request).then(function (response) {
        // IF THE RESPONSE WAS GOOD, CLONE IT AND STORE IT IN THE CACHE
        if (response.status === 200) {
          cache.put(evt.request.url, response.clone());
        }

        return response;
      })["catch"](function (err) {
        // NETWORK REQUEST FAILED, TRY TO GET IT FROM THE CACHE
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