let driversLat,
  passangersGuzoMarker = "",
  driversCenter='',
  DriversLan='',
  passangersCenter='',
  driversGuzoMap='',
  DriversInfowindow='',
  DriversGuzoMarker = "";
let getMyPosition = async (Position) => {
  driversLat = await Position.coords.latitude;
  DriversLan = await Position.coords.longitude;
  showMapInDrivers();
};
function callGuzoMapInDriver() {
  navigator.geolocation.getCurrentPosition(getMyPosition, showErrorInDrivers);
}
let showMapInDrivers = () => {
  console.log(driversLat, DriversLan);
  driversCenter = new google.maps.LatLng(Lat, Lan);
  //   guzoCenter = new google.maps.LatLng(Lat, Lan);
  //   console.log("guzoCenter is " + guzoCenter);
  let mapDisplayerDiv = document.getElementById("drivers-map");
  let mapProp = {
    center: driversCenter,
    zoom: 17,
    mapTypeId: "satellite",
  };
  driversGuzoMap = new google.maps.Map(mapDisplayerDiv, mapProp);
  DriversGuzoMarker = new google.maps.Marker({
    Position: driversCenter,
    animation: google.maps.Animation.BOUNCE,
  });
  DriversGuzoMarker.setMap(driversGuzoMap);
  DriversInfowindow = new google.maps.InfoWindow({
    content: "you are here!",
  });
  DriversInfowindow.open(driversGuzoMap, DriversGuzoMarker);
};
// DriversInfowindow,DriversGuzoMarker,
let TimeCounter = 0;
function showDriversAndPassangersInMap(passangersLan, passangersLat) {
  console.log(
    "showDriversAndPassangersInMap = " + passangersLan,
    passangersLat,
    driversLat,
    DriversLan
  );
  {
    // console.log("lat = " + Lat, " lan=" + Lan);
    // Lat = Number(Lat);
    // Lan = Number(Lan);
    TimeCounter++;
    // change after 6 second to minimize eye view consistancy if it was in 2 or 1 second drop pin ball may be not seen as good
    if (TimeCounter % 4 == 0) {
      if (passangersGuzoMarker != "") {
        passangersGuzoMarker.setMap(null);
      }
      if (DriversGuzoMarker != "") {
        DriversGuzoMarker.setMap(null);
      }
      DriversGuzoMarker = new google.maps.Marker({
        Position: driversCenter,
        animation: google.maps.Animation.BOUNCE,
      });
      DriversGuzoMarker.setMap(driversGuzoMap);
      if (passangersLan != "" && passangersLat != "") {
        (passangersLat = passangersLat + 0.001),
          (passangersLan = passangersLan + 0.001);
        passangersCenter = new google.maps.LatLng(passangersLat, passangersLan);
        passangersGuzoMarker = new google.maps.Marker({
          Position: passangersCenter,
          animation: google.maps.Animation.BOUNCE,
        });
        passangersGuzoMarker.setMap(driversGuzoMap);
      }
      infowindow = new google.maps.InfoWindow({
        content: "you are here!",
      });

      infowindow.open(driversGuzoMap, DriversGuzoMarker);

      infowindow = new google.maps.InfoWindow({
        content: "Passenger is here!",
      });

      infowindow.open(driversGuzoMap, passangersGuzoMarker);
      if (
        driversLat != "" &&
        DriversLan != "" &&
        passangersLan != "" &&
        passangersLat != ""
      ) {
        var myTrip = [
          // carton 33 usd, package 22 usd , pice 1.6
          // Lat, Lan
          { lat: driversLat, lng: DriversLan },
          { lat: passangersLat, lng: passangersLan },
        ];
        var flightPath = new google.maps.Polyline({
          path: myTrip,
          strokeColor: "blue",
          strokeOpacity: 0.8,
          strokeWeight: 4,
        });
        flightPath.setMap(driversGuzoMap);
      }
    }
  }
}

function showErrorInDrivers(error) {
  console.log(error);
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("please turn on your device location first");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}
