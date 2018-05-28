//map.js
// key = AIzaSyABsbvSyR-8KORLB6jMcPYMBOUyTRJoIX4
//Set up some of our variables.
var map = undefined; //Will contain map object.
var marker = false; ////Has the user plotted their location marker?
var laden = false;
//Function called to initialize / create the map.
//This is called when the page has loaded.
function initMap(lat,lon) {

    lat = (typeof lat === 'undefined') ? 51.203268 : lat;
    lon = (typeof lon === 'undefined') ? 3.226300 : lon;
    //The center location of our map.
    var centerOfMap = new google.maps.LatLng(lat,lon );

    //Map options.
    var options = {
        center: centerOfMap, //Set center.
        zoom: 15 //The zoom value.
    };

    //Create the map object.
    map = new google.maps.Map(document.getElementById('map'), options);

    //Listen for any clicks on the map.
    google.maps.event.addListener(map, 'click', function(event) {
        //Get the location that the user clicked.
        let clickedLocation = event.latLng;

            //If the marker hasn't been added.
        if(marker === false){
            //Create the marker.
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                draggable: true,
                label:" "
            });
            console.log(clickedLocation);
            //Listen for drag events!
            google.maps.event.addListener(marker, 'dragend', function(event){
                markerLocation();
            });
        } else{
            //Marker has already been added, so just change its location.
            marker.setPosition(clickedLocation);
        }
        //Get the marker's location.
        markerLocation();

    });
    if (laden){
        puntenLaden();
        laden = false;
    }
}

//This function will get the marker's current location and then add the lat/long
//values to our textfields so that we can save the location.
function markerLocation(){
    let currentLocation = marker.getPosition();
    punt.lat = currentLocation.lat();
    punt.lon = currentLocation.lng();
}

function addMarker(lat,lon,naam) {

    const icon = {

        url: "http://clipartist.net/social/clipartist.net/A/auto_car_black_white_line_art-555px.png", // url
        scaledSize: new google.maps.Size(100, 40)
    };

    let newMarker = new google.maps.Marker({
        position: {lat: lat, lng: lon},
        map: map,
        label: naam,
        icon: icon
    })
}

//Load the map when the page has finished loading.
