let Lat = "",
  Lan = "";
function showLatAndLaong(Position) {
  Lat = Position.coords.latitude;
  Lan = Position.coords.longitude;
  console.log(Lat, Lan);
}
navigator.geolocation.getCurrentPosition(showLatAndLaong);

let passangerInfo = "";
let myIdInCookies = getCookie("ActiveDriverId");
let DriversAction = getCookie("DriversAction");
console.log("myIdInCookies = ", myIdInCookies);
console.log("DriversAction = " + DriversAction);
function sendUpdateForDriversAnswer() {
  fetch("http://localhost:1010/driverAnsweredCalls", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      driverId: myIdInCookies,
      // requestedByPassangers
      // send my id to server , get my id from kookies ,set kookies in log in as driver part
    }),
  })
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then((data) => {
      console.log(data);
    });
}
function answerToCustomer(actionInDatabase) {
  console.log("it is driver console");
  $("#wait-to-customers-request").hide();
  $(".customer-witing-wrapper").show();
  if (actionInDatabase == "GiveAnswerToPassangers") {
    // if driver is answering for first time
    sendUpdateForDriversAnswer();
  }
  let info =
    "Destination : - " +
    passangerInfo.passangersDestination +
    " <br>Passanger Name : - " +
    passangerInfo.FullName +
    "<br/> Tele :- <a href='Tel:" +
    passangerInfo.PhoneNumber +
    "'>" +
    passangerInfo.PhoneNumber +
    "</a>";
  $(".customers-info").html(info);
  $(".answer-decline ").hide();
  $(".decline-call").show();
  setCookie("DriversAction", "answeredToCall", 2);
}
function rejectCustomerCall() {
  let verify = confirm("Do you want to cancel this customers request?");
  if (verify) {
    clearInterval(requestInterval);
    fetch("http://localhost:1010/Driver/rejected/passangerRequest", {
      method: "POST",
      headers: {
        Accept: "application/JSON",
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify({ driverId: myIdInCookies }),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      });
  }
  console.log("call is rejected");
  //send reject responce to server use ajax or other connectivity methoodes
}
function addCustomer() {
  console.log("customer will be added here. ");
  $("#customer-adder-section").show();
}
console.log("myIdInCookies = ", myIdInCookies);
let requestInterval = setInterval(function () {
  // console.log("it is marew ");
  // checkCustomers();
  // return;
  if (myIdInCookies != "noData") checkCustomers();
  else {
    // console.log("i am not loged in Guzoway so i have to go back to  driverLogin.js/html file" );
    window.location.href = "driverLogin.html";
  }
  //send request to server to check request ..........
  //if responce is yes answer a call .........
}, 3000);

function checkCustomers() {
  fetch("http://localhost:1010/checkPassangerRequestToDrivers", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      driverId: myIdInCookies,
      Location: { Lat: Lat, Lan: Lan },
    }),
  })
    .then((data) => {
      // console.log(data);
      return data.json();
    })
    .then((data) => {
      console.log(data);
      if (data.length == 0) {
        // deleteCookies("ActiveDriverId");
        myIdInCookies = getCookie("ActiveDriverId");
        console.log(data);
        console.log("myIdInCookies", myIdInCookies);
        // let TaxiCallerSound = document.getElementById("TaxiCallerSound");
        // clearInterval(requestInterval);
        // $("#wait-to-customers-request").show();
        // $(".customer-witing-wrapper").hide();
        $(".answer-decline").hide();
        $(".add-cusomer").show();
      } else {
        passangerInfo = data[0];
        console.log(passangerInfo);
        if(passangerInfo==undefined)
        return;
        // Status: "requestedByPassangers";
        // $("#TaxiCallerSound").get(0).play();
        if (passangerInfo.Status == "Active") {
          $(".customers-info").html("");
          $(".answer-decline").hide();
          $(".add-cusomer").show();
        } else if (passangerInfo.Status == "requestedByPassangers") {
          $(".add-cusomer").hide();
          $(".answer-decline").show();
          // clearInterval(requestInterval);
          // console.log(" ", passangerInfo.Status);
          // console.log("DriversAction", DriversAction);
        } else if (passangerInfo.Status == "answeredToPassangers") {
          answerToCustomer('alreadyAnswered');
        }
      }
    });
}
// deleteCookies("DriversAction");
function onDriversWindowClosed() {
  rejectCustomerCall();
  alert("Closed");
}
