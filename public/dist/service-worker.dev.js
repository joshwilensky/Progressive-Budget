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
});