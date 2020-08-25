"use strict";

var db; // create a new db request for a "budget" database.

var request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  // create object store called "pending" and set autoIncrement to true
  var db = event.target.result;
  db.createObjectStore("pending", {
    autoIncrement: true
  });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.error.message);
};

function saveRecord(record) {
  var db = request.result; // create a transaction on the pending db with readwrite access

  var transaction = db.transaction(["pending"], "readwrite"); // access your pending object store

  var store = transaction.objectStore("pending"); // add record to your store with add method.

  store.add(record);
}

function checkDatabase() {
  var db = request.result; // open a transaction on your pending db

  var transaction = db.transaction(["pending"], "readwrite"); // access your pending object store

  var store = transaction.objectStore("pending"); // get all records from store and set to a variable

  var getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      }).then(function (response) {
        return response.json();
      }).then(function () {
        // if successful, open a transaction on your pending db
        var db = request.result;
        var transaction = db.transaction(["pending"], "readwrite"); // access your pending object store

        var store = transaction.objectStore("pending"); // clear all items in your store

        store.clear();
      });
    }
  };
} // listen for app coming back online


window.addEventListener("online", checkDatabase);