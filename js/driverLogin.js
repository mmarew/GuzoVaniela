let Lat = "",
  Lan = "";
function showLatAndLaong(Position) {
  Lat = Position.coords.latitude;
  Lan = Position.coords.longitude;
  console.log(Lat, Lan);
}
navigator.geolocation.getCurrentPosition(showLatAndLaong);

$("#driverLoginForm").on("submit", loginDriver);
// program to validate the phone number
function validatePhone(num) {
  // regex pattern for phone number
  const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/g;
  // check if the phone number is valid
  let result = num.match(re);
  if (result) {
    console.log("The number is valid.");
  } else {
    // let num = prompt("Enter number in XXX-XXX-XXXX format:");
    // validatePhone(num);
    alert("Invalid phone number format ");
    return "Invalid";
  }
}
function loginDriver(e) {
  e.preventDefault();

  let driversTelNumber = $("#drivers-tel-number").val();
  let validation = validatePhone(driversTelNumber);
  if (validation == "Invalid") return;
  fetch("http://localhost:1010/driverLogin", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      driversTelNumber: driversTelNumber,
      Location: { Lat: Lat, Lan: Lan },
    }),
  })
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then((data) => {
      console.log(data);
      console.log(typeof data);
      // return;
      let filteredData = "";
      // return;
      // if client/driver is not registered in guzoway
      // data.length is zero
      if (data.length == 0) {
        // alert("please register first ");
        let registerFirst = ` your are not registered as a driver in guwzoway transport company. so please <a href="/html/driverRegister.html"> click here </a> and register first. Thank you.`;
        $("#error-on-driver-login").show();
        $("#error-on-driver-login").html(registerFirst);
        return;
      } else {
        filteredData = data[0];
      }
      // driversPhoneNumber = filteredData.driversPhoneNumber;
      console.log(filteredData);
      console.log(filteredData.driversId);
      // set driver id in cookies to stop  repeatedly login request. This help to check if driver is logged in before any load to recive phone number
      setCookie("ActiveDriverId", filteredData.driversId, 365 * 2);
      // if (driversPhoneNumber == driversTelNumber)
      window.location.href = "/html/driver.html";
    });
}
let ActiveDriverId = getCookie("ActiveDriverId");
console.log("ActiveDriverId = ", ActiveDriverId);
// if driver is registered in guzoway simply transfer to driver html to get passangers
if (ActiveDriverId != "noData") {
  window.location.href = "/html/driver.html";
}
// deleteCookies("ActiveDriverId");
