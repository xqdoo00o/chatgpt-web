const cacheName = "caches-v0.9.2";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(["./", "./index.html", "./icon.png"]))
  )
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(r => {
      if (r) return r;
      return fetch(e.request).then(response => {
        // only cache css & js
        if (/(\.css|\.js)$/.test(e.request.url)) {
          const cloned = response.clone();
          caches.open(cacheName).then(cache => {
            cache.put(e.request, cloned);
          })
        };
        return response;
      })
    })
  )
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      )
    })
  )
});