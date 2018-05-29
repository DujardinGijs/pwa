let punt = {naam: "", lat: 0.0, lon: 0.0};
const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
let db;
let online = true;

function initDb() {
    const request = indexedDB.open("carRepo", 1);
    request.onsuccess = function () {
        db = request.result;
    };
    request.onerror = function (evt) {
        console.log("IndexedDB error: " + evt.target.errorCode);
    };
    request.onupgradeneeded = function (evt) {
        let objectStore = evt.currentTarget.result.createObjectStore(
            "cars", {keyPath: "id", autoIncrement: true});
        let puntee = [
            {naam: "jan", lat: 51.203268, lon: 3.229300},
            {naam: "piet", lat: 51.206268, lon: 3.224300},
            {naam: "joris", lat: 51.205268, lon: 3.226300}
        ];
        for (i in puntee) {
            objectStore.add(puntee[i]);
            console.log("e")
        }
    };
}
function serviceworker() {
    if (!('serviceWorker' in navigator)) {
        console.log('Service Worker not supported');
        return;
    }
    navigator.serviceWorker.register('service-worker.js', {scope: ''})
        .then(function (swRegistration) {
            let serviceWorker;
            if (swRegistration.installing) {
                console.log('Resolved at installing: ', swRegistration);
                serviceWorker = swRegistration.installing;
            } else if (swRegistration.waiting) {
                console.log('Resolved at installed/waiting: ', swRegistration);
                serviceWorker = swRegistration.waiting;
            } else if (swRegistration.active) {
                console.log('Resolved at activated: ', swRegistration);
                serviceWorker = swRegistration.active;
            }
            if (serviceWorker) {
                serviceWorker.addEventListener('statechange', function (e) {
                    console.log(e.target.state);
                });
            }
        });
}
function terug() {
    $("nav").show();
    $("main").hide();
}
function puntenLaden() {
    let transaction = db.transaction("cars", "readonly");
    let objectStore = transaction.objectStore("cars");
    let request = objectStore.openCursor();
    request.onsuccess = function (evt) {
        let cursor = evt.target.result;
        if (cursor) {
            maakPunt(cursor.value);
            cursor.continue();
        }
    };
    request.onerror = function (e) {
        console.log("failed loading "+e);
    };
}
function zoek() {
    laden = true;
    reloadMap();
    gaNaarKaart();
    $("#autos").show();
    $("#punten").empty();
}
function maakPunt(item) {
    console.log("item :" + item);
    addMarker(item.lat, item.lon, item.naam);
}
function gaNaarKaart() {
    $("nav").hide();
    $("main").show();
    $('#nieuwPunt').hide();
    $("#autos").hide();
    $('#selecteer').hide();
}
function reloadMap() {
    marker = false;
    const geoSuccess = function (position) {
        const startPos = position;
        let lat = startPos.coords.latitude;
        let lon = startPos.coords.longitude;
        initMap(lat, lon);
    };
    const geoError = function () {
        initMap();
    };
    if(online){
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    }else {
        laden?puntenLaden():"";
    }
}
function handleConnectionChange(event){
    if(event.type == "offline"){
        online = false;
        $("#off").show();
    }
    if(event.type == "online"){
        online = true;
        $("#off").hide();
    }
}
function selecteer(e) {
    e.preventDefault();
    map === undefined ? reloadMap() : "";
    gaNaarKaart();
    $('#selecteer').show();
}
function nieuwPunt(e) {
    e.preventDefault();
    if (punt.lon !== 0 && punt.lat !== 0) {
        $('#selecteer').hide();
        $('#nieuwPunt').show();
    }
}
function slaOp(e) {
    e.preventDefault();
    if ($('#naam').val() !== "") {
        punt.naam = $('#naam').val();
        var transaction = db.transaction("cars", "readwrite");
        var objectStore = transaction.objectStore("cars");
        var request = objectStore.add(punt);
        request.onsuccess = function (evt) {
            zoek()
        };
        request.onerror = function (e) {
            console.log("failed saving" + e);
        }
    }
}
function verwijder() {
    var transaction = db.transaction("cars", "readwrite");
    var objectStore = transaction.objectStore("cars");
    var request = objectStore.clear();
    console.log("dv");
    request.onsuccess = function (evt) {
        console.log("d " + evt);
        zoek()
    };
    request.onerror = function (e) {
        console.log("fail " + e);
    };
}
let deferredPrompt;
function homescreen(e) {
    e.preventDefault();
    deferredPrompt = e;
    $("#home").show();
    $("#home").on('click', (e) => {
        $("#off").hide();
        deferredPrompt.prompt();
    });
}
function show(e) {
    e.preventDefault();
    e.target.closest('form').scrollIntoView();
    window.scrollTo(0,0);
}
function init(e) {
    $("#off").hide();
    $("#home").hide();
    serviceworker();
    initDb();
    terug();
    window.addEventListener('offline', handleConnectionChange);
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('beforeinstallprompt',homescreen);
    $("#nieuw").on('click', selecteer);
    $('#selecteer').on('submit', nieuwPunt);
    $('#naam').on('click',show);
    $('#nieuwPunt').on('submit', slaOp);
    $("#zoek").on('click', zoek);
    $("#terug").on('click', terug);
    $("#autos").on('submit', selecteer);
    $("#verwijder").on('click', verwijder);
}
init();


