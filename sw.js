"use strict";
console.log("WORKER: executing.");
var version = "v1::",
  tiffanyWhiteResume = ["/", "/css/resume.min.css", "/js/resume.min.js"];
self.addEventListener("install", function (e) {
  console.log("WORKER: install event in progress."),
    e.waitUntil(
      caches
        .open(version + "fundamentals")
        .then(function (e) {
          return e.addAll(tiffanyWhiteResume);
        })
        .then(function () {
          console.log("WORKER: install completed");
        })
    );
}),
  self.addEventListener("fetch", function (e) {
    return (
      console.log("WORKER: fetch event in progress."),
      "GET" !== e.request.method
        ? void console.log(
            "WORKER: fetch event ignored.",
            e.request.method,
            e.request.url
          )
        : void e.respondWith(
            caches.match(e.request).then(function (n) {
              function t(n) {
                var t = n.clone();
                return (
                  console.log(
                    "WORKER: fetch response from network.",
                    e.request.url
                  ),
                  caches
                    .open(version + "pages")
                    .then(function (n) {
                      n.put(e.request, t);
                    })
                    .then(function () {
                      console.log(
                        "WORKER: fetch response stored in cache.",
                        e.request.url
                      );
                    }),
                  n
                );
              }
              function o() {
                return (
                  console.log(
                    "WORKER: fetch request failed in both cache and network."
                  ),
                  new Response("<h1>Service Unavailable</h1>", {
                    status: 503,
                    statusText: "Service Unavailable",
                    headers: new Headers({ "Content-Type": "text/html" }),
                  })
                );
              }
              var s = fetch(e.request).then(t, o)["catch"](o);
              return (
                console.log(
                  "WORKER: fetch event",
                  n ? "(cached)" : "(network)",
                  e.request.url
                ),
                n || s
              );
            })
          )
    );
  }),
  self.addEventListener("activate", function (e) {
    console.log("WORKER: activate event in progress."),
      e.waitUntil(
        caches
          .keys()
          .then(function (e) {
            return Promise.all(
              e
                .filter(function (e) {
                  return !e.startsWith(version);
                })
                .map(function (e) {
                  return caches["delete"](e);
                })
            );
          })
          .then(function () {
            console.log("WORKER: activate completed.");
          })
      );
  });
