let driversLat, DriversLan;

let getMyPosition = async (Position) => {
  driversLat = await Position.coords.latitude;
  DriversLan = await Position.coords.longitude;
  //   console.log(driversLat, DriversLan);
  showMapInDrivers(driversLat, DriversLan);
};
function callGuzoMapInDriver() {
  navigator.geolocation.getCurrentPosition(getMyPosition);
}
let showMapInDrivers = (driversLat, DriversLan) => {
  console.log(driversLat, DriversLan);
  let driversCenter = new google.maps.LatLng(Lat, Lan);
  //   guzoCenter = new google.maps.LatLng(Lat, Lan);
//   console.log("guzoCenter is " + guzoCenter);
  let mapDisplayerDiv = document.getElementById("drivers-map");
  let mapProp = {
    center: driversCenter,
    zoom: 17,
    mapTypeId: "satellite",
  };
guzoMap = new google.maps.Map(mapDisplayerDiv, mapProp);
};
