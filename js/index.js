let ActivePassangersId = getCookie("ActivePassangersId"),
  passangersStatus = "Initial";
//- passangersStatus is used for manage (Searching. please wait ..) button and get truck button.
// -it is requestingToGetDriver when driver is looking for truck and enables to hide get truck btn but to show searching info div
let connectedDriver = getCookie("connectedDriver");
// check if
function checkIfPassangerAskedDriver() {
  //To check if passanger asked drivers , get saved active driver from cookies, where connectedDriver is saved in cookies
  // return;
  let driver = getCookie("connectedDriver");
  console.log(driver);
  if (driver == "noData") {
    return driver;
  }
  let connectedDriver = JSON.parse(driver);
  // console.log("connectedDriver = " + connectedDriver);
  let savedDriverName = connectedDriver.driversName,
    savedDriversPhoneNumber = connectedDriver.driversPhoneNumber,
    savedPlateNumber = connectedDriver.plateNumber;
  // console.log(savedDriverName, savedDriversPhoneNumber, savedPlateNumber);
  if (savedDriverName != undefined) {
    showDriversInformation(
      savedDriverName,
      savedDriversPhoneNumber,
      savedPlateNumber
    );
    window.location.href = "#getTruck";
  } else {
    window.location.href = "#getTruck";
  }
  // else searchTruck();
  return savedDriverName;
}
function searchTruck() {
  console.log(Lat, Lan);
  $("#CancelRequest").show();
  var fromAdress = $("#from-adress").val(),
    toAddress = $("#to-address").val(),
    phoneNumber = $("#phone-number").val(),
    selectCraType = $("#select-cra-type").val();
  if (selectCraType == "default") {
    $("#select-cra-type").css("border", "1px solid red ");
    alert("please choose car type first");
  }
  if (phoneNumber == undefined || phoneNumber == "") {
    alert("phoneNumber is mandatory");
    $("#phone-number").css("border", "1px solid red ");
    return;
  }
  $("#find-truck-load-btn").show();
  $("#get-truck").hide();
  //ask driver and then ,if driver respond , then show driver name in f/n showDriversInformation it will be done via request to data base by ajax/fetch or other communication meanse

  fetch("http://localhost:1010/getOnlineDrivers", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fromAdress: fromAdress,
      toAddress: toAddress,
      phoneNumber: phoneNumber,
      selectCraType: selectCraType,
      passangersId: ActivePassangersId,
      Location: { Lat: Lat, Lan: Lan },
    }),
  })
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then((datas) => {
      console.log(datas);
      if (datas.length == 0) {
        passangersStatus = "requestingToGetDriver";
        setTimeout(() => {
          searchTruck();
        }, 3000);
        return;
      } else {
        passangersStatus = "Initial";
      }
    });
}

function showDriversInformation(driversName, driversPhoneNumber, plateNumber) {
  $("#driver-name-now").html("Driver Name:" + driversName);
  $("#driver-phone-number-now").html(
    "Phone Number :  <a href='tel:" +
      driversPhoneNumber +
      "'>" +
      driversPhoneNumber +
      "</a>"
  );
  $("#driver-plate-number-now").html("Plate Number:  " + plateNumber);
  // $("#driver-car-type-now").html(
  //   "car type : white color 35 kuintal loading capacity "
  // );
}

window.onhashchange = function () {
  passangersHashManager();
};
// let ask = checkIfPassangerAskedDriver();
// console.log(ask);
passangersHashManager();

function passangersHashManager() {
  $(".mynavclass").removeClass("activeClass");
  //activeClass  mynavScerviceId,mynavCallId,mynavBookId,mynavHomeId
  let myHash = location.hash;
  console.log("myhash", myHash);
  $("section").hide();
  if (myHash == "#getTruck") {
    $(".communication-part").show();
  } else if (myHash == "#banner-section") {
    console.log("#banner-section");
    // $("#banner-section").show();
    // alert(ActivePassangersId)
    if (ActivePassangersId == "noData") {
      console.log(ActivePassangersId);
      $("#goto-log-in")[0].click();
    } else {
      $("#book-section").show();
    }
  } else if (myHash == "#book-section") {
    // $("#mynavBookId").addClass("activeClass");
    console.log("it is book hash managger");
    if (ActivePassangersId == "noData") {
      console.log(ActivePassangersId);
      $("#goto-log-in")[0].click();
    } else {
      $("#book-section").show();
    }
  } else if (myHash == "#scervices-section-id") {
    $("#mynavScerviceId").addClass("activeClass");
    $("#scervices-section-id").show();
    console.log("it is #scervices-section-id hash managger");
  } else if (myHash == "#call-section-id") {
    $("#mynavCallId").addClass("activeClass");
    $("#call-section-id").show();
  } else if (myHash == "") {
    if (ActivePassangersId == "noData") {
      // if there is no ActivePassangersId sign up and sign in  has to be show and booking has to be hidden

      $(".Book-now").hide();
      $(".goto-sign-up").show();
      $(".goto-log-in").show();
    } else {
      // if there is ActivePassangersId sign up and sign in  has to be hide and booking has to be open
      $(".goto-sign-up").hide();
      $(".goto-log-in").hide();
      $(".Book-now").show();
    }
    $("#mynavHomeId").addClass("activeClass");
    $(".banner-section").show();
  }
}

function cancelCallToDriver() {
  let Verify = confirm("Are you sure to cancel this call ");
  if (Verify) {
    fetch("http://localhost:1010/cancellCallToDriver", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ActivePassangersId: ActivePassangersId,
      }),
    })
      .then((data) => {
        console.log(data);
        return data.json();
      })
      .then((data) => {
        console.log(data);
        deleteCookies("connectedDriver");
        // window.location.href = "/";
        if (driversGuzoMarker != "") {
          driversGuzoMarker.setMap(null);
        }
      });
  }
}
let setIntervalToDriversDecision = "";
let timeIntervalCounter = () => {};
setIntervalToDriversDecision = setInterval(() => {
  checkDriversDecision();
}, 2000);

let refCounter = true;
function checkDriversDecision() {
  // -it is managed by setinterval to check drivers decision because driver may answer,
  // reject,arrive on destination etc
  // -it is from passangers view to follow drivers decision in databases
  // -it check decision by sending passangers id and search from online list
  // -if gettruck function can not get passangers checkdriver recheck it
  // - it check if drivers may changed his decision arrived on destination
  fetch("http://localhost:1010/checkDriversDecision", {
    method: "POST",
    headers: {
      Accept: "Application/json",
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({
      ActivePassangersId: ActivePassangersId,
    }),
  })
    .then((data) => {
      // console.log(data);
      return data.json();
    })
    .then((object) => {
      // console.log(object);
      let datas = object[0];
      // if passanger dosen't have data (no driver online ) object.length  is 0 so re request truck has to be done in if if (object.length == 0) {}
      // console.log("connectedDriver = " + getCookie("connectedDriver"));
      if (object.length == 0) {
        console.log(refCounter);
        // clearInterval(setIntervalToDriversDecision);
        deleteCookies("connectedDriver");
        if (refCounter) {
          window.location.href = "#";
          refCounter = false;
        }
        console.log(location.hash);
        if (location.hash == "#getTruck") {
          window.location.href = "#";
          $("#get-truck").show();
          // $("#get-truck").show();
          $("#find-truck-load-btn").hide();
        }
        console.log("passangersStatus =", passangersStatus);
        if (passangersStatus == "requestingToGetDriver") {
          console.log("passangersStatus", passangersStatus);
          $("#get-truck").hide();
          $("#find-truck-load-btn").show();
        } else {
          $("#get-truck").show();
          $("#find-truck-load-btn").hide();
        }
        // window.location.href = "#book-section";
        checkIfPassangerAskedDriver();
      } else {
        let driversName = datas.driversName,
          driversPhoneNumber = datas.driversPhoneNumber,
          plateNumber = datas.plateNumber;
        let driversLocation = JSON.parse(datas.driversLocation);
        // console.log(driversLocation);
        driversLat = driversLocation.Lat + 0.001;
        drivarsLan = driversLocation.Lan + 0.001;
        callToAll();
        // console.log(
        //   " driversLat = ",
        //   driversLat,
        //   " drivarsLan = ",
        //   drivarsLan,
        //   " Lat = " + Lat,
        //   " Lan = " + Lan
        // );

        let SavedDriverNAme = connectedDriver;
        if (connectedDriver != "noData")
          SavedDriverNAme = JSON.parse(connectedDriver).driversName;
        // console.log(SavedDriverNAme);
        // set connected driver information
        // if (SavedDriverNAme != driversName)
        {
          setCookie(
            "connectedDriver",
            JSON.stringify({
              driversName: driversName,
              driversPhoneNumber: driversPhoneNumber,
              plateNumber: plateNumber,
            }),
            2 * 2
          );
        }
        let Status = object[0].Status;
        // based on status decision will be done here
        if (Status == "requestedByPassangers") {
          // console.log("requested By Passangers");
          $("#get-truck").hide();
          $("#find-truck-load-btn").show();
        } else if (Status == "answeredToPassangers") {
          // console.log("answered To Passangers");
          checkIfPassangerAskedDriver();
          $("#cancelCallToPassanger").show();
        } else if (Status == "Active") {
          // console.log("Active");
        }
      }
    });
}
function cancelPassangersRequest() {
  connectedDriver = getCookie("connectedDriver");
  console.log(connectedDriver);
  console.log("ActivePassangersId = " + ActivePassangersId);
  let myCancel = confirm("Do you want to cancel this call?");

  if (myCancel) {
    if (connectedDriver == "noData") {
      window.location.reload();
    }
    fetch("http://localhost:1010/cancelRequestByPassangers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        passangersId: ActivePassangersId,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
      });
  }
}
// cancelPassangersRequest();
