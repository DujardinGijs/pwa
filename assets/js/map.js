// key = AIzaSyABsbvSyR-8KORLB6jMcPYMBOUyTRJoIX4
let map = undefined;
let marker = false;
let laden = false;
function initMap(lat,lon) {
    lat = (typeof lat === 'undefined') ? 51.203268 : lat;
    lon = (typeof lon === 'undefined') ? 3.226300 : lon;
    let centerOfMap = new google.maps.LatLng(lat,lon );
    let options = {
        center: centerOfMap,
        zoom: 15
    };
    map = new google.maps.Map(document.getElementById('map'), options);
    google.maps.event.addListener(map, 'click', function(event) {
        let clickedLocation = event.latLng;
        if(marker === false){
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                draggable: true,
                label:" "
            });
            console.log(clickedLocation);
            google.maps.event.addListener(marker, 'dragend', function(event){
                markerLocation();
            });
        } else{
            marker.setPosition(clickedLocation);
        }
        markerLocation();
    });
    if (laden){
        puntenLaden();
        laden = false;
    }
}
function markerLocation(){
    let currentLocation = marker.getPosition();
    punt.lat = currentLocation.lat();
    punt.lon = currentLocation.lng();
}
function addMarker(lat,lon,naam) {
    const icon = {
        url: "./assets/media/marker.png",
        scaledSize: new google.maps.Size(100, 40)
    };
    let newMarker = new google.maps.Marker({
        position: {lat: lat, lng: lon},
        map: map,
        label: naam,
        icon: icon,
        opacity: 0.7
    })
}
