const FILES_TO_CACHE = [
    "/", "/index.html", "index.js", "/db.js", "/style.css"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// installation
self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
// fetching cache data
self.addEventListener("fetch", evt => {
    if (evt.request.url.includes("/api/")) {
        console.log("[Service Worker]", fetch(data), evt.request.url);
    }
    evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
            return fetch(evt.request).then(response => {
                if (response.status === 200) {
                    cache.put(evt.request.url, response.clone());
                }
                return response;
            })
                .catch(err => {
                    return cache.match(evt.request);
                });
        })

    )
    return;

})