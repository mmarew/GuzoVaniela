let Lat = "",
  guzoCenter = "",
  Lan = "",
  driversGuzoMarker = "",
  guzoMarker = "",
  guzoMap = "",
  driverCenter = "";
driversLat = Lat;
drivarsLan = Lan;

function navigtionTaller() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLatAndLaong);
  } else {
    console.log("geolocation is not supported here");
  }
}
function showLatAndLaong(Position) {
  Lat = Position.coords.latitude;
  Lan = Position.coords.longitude;

  console.log(Lat, Lan);
  // if navigation is not finding lat and lng call to callGuzoMap() becuse it wait 1 seconds and check results
  if (Lat == "" || Lan == "") {
    callGuzoMap();
  } else {
    showGuzoMap("well");
  }
}
function callGuzoMap() {
  // delay up to showLatAndLaong loads
  setTimeout(() => {
    if (Lat == "" || Lan == "") {
      navigtionTaller();
    } else {
      showGuzoMap("well");
    }
  }, 1000);
}
function showGuzoMap(callFrom) {
  console.log(google);
  console.log(google.maps);
  guzoCenter = new google.maps.LatLng(Lat, Lan);

  let mapDisplayerDiv = document.getElementById("mapDisplayerId");

  let mapProp = {
    center: guzoCenter,
    zoom: 17,
    mapTypeId: "satellite",
  };
  guzoMap = new google.maps.Map(
    document.getElementById("mapDisplayerId"),
    mapProp
  );

  driversLat = Lat + 0.0009;
  drivarsLan = Lan + 0.0009;
  console.log(
    "distance between tow line ",
    distance(Lat, Lan, driversLat, drivarsLan, "K")
  );
  callToAll();
}
function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
}
navigtionTaller();
let TimeCounter = 0;
function callToAll() {
  TimeCounter++;
  // change after 6 second to minimize eye view consistancy if it was in 2 or 1 second drop pin ball may be not seen as good
  if (TimeCounter % 3 == 0) {
    if (guzoMarker != "") {
      guzoMarker.setMap(null);
    }
    if (driversGuzoMarker != "") {
      driversGuzoMarker.setMap(null);
    }
    driverCenter = new google.maps.LatLng(driversLat, drivarsLan);
    guzoMarker = new google.maps.Marker({
      Position: guzoCenter,
      animation: google.maps.Animation.BOUNCE,
    });
    driversGuzoMarker = new google.maps.Marker({
      Position: driverCenter,
      animation: google.maps.Animation.BOUNCE,
    });
    driversGuzoMarker.setMap(guzoMap);
    guzoMarker.setMap(guzoMap);
    // var infowindow = new google.maps.InfoWindow({
    //   content: "you are here!",
    // });

    // infowindow.open(guzoMap, guzoMarker);

    // var infowindow = new google.maps.InfoWindow({
    //   content: "Driver is here!",
    // });

    // infowindow.open(guzoMap, driversGuzoMarker);
    // var myTrip = [
    //   // Lat, Lan
    //   { lat: Lat, lng: Lan },
    //   { lat: driversLat, lng: drivarsLan },
    // ];
    // var flightPath = new google.maps.Polyline({
    //   path: myTrip,
    //   strokeColor: "red",
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    // });
    // flightPath.setMap(guzoMap);
  }
}