"use strict";

const url = "https://maps.googleapi.com/js";
const CacheName = 'carcaches';

self.addEventListener('install', function(event){
    console.log('From SW: Install Event', event);
    self.skipWaiting();
    event.waitUntil(
        caches.open(CacheName)
            .then((cache)=>{
                cache.add(url);
            })
    );
});

self.addEventListener('activate', function(event){
    console.log('From SW: Activate State', event);
});

self.addEventListener('fetch', function(event){
    var requestUrl = new URL(event.request.url);
    var requestPath = requestUrl.pathname;
    var fileName = requestPath.substring(requestPath.lastIndexOf('mapfiles/') + 1);

    if(fileName == "service-worker.js"){
        event.respondWith(fetch(event.request));
    } else{
        event.respondWith(cacheFirstStrategy(event.request));
    };
});


function cacheFirstStrategy(request){
    return caches.match("image").then(function(cacheResponse){
        return cacheResponse || fetchRequestAndCache(request);
    });
}

function fetchRequestAndCache(request){
    return fetch(request).then(function(networkResponse){
        caches.open(getCacheName(request)).then(function(cache){
            cache.put(request, networkResponse);
        });
        return networkResponse.clone();
    });
}

function getCacheName(request){
    let requestUrl = new URL(request.url);
    let requestPath = requestUrl.pathname;
        return CacheName;

}



