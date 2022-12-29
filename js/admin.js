function searchDriversOrPassangersInformation() {
  var searchInputValues = $("#search-driver-passanger").val();
  console.log("searchInputValues = " + searchInputValues);
}
function updateDriversInformation() {
  // update-plate-number
  var updatePlatePumber = $(".update-plate-number").val(),
    updateDriverName = $(".update-driver-name").val(),
    updateLicenceNumber = $(".update-licence-number").val(),
    updatePhoneLumber = $(".update-phone-number").val(),
    updateDriversLicencePicture = $(".update-drivers-licence-picture").prop(
      "files"
    )[0],
    errorOnDriversUpdate = $("#error-on-drivers-update").val(),
    updateSuccessOnDriver = $("#update-success-on-driver").val();
  console.log(
    "updatePlatePumber=" + updatePlatePumber,
    "updateDriverName=" + updateDriverName,
    "updateLicenceNumber=" + updateLicenceNumber,
    "updatePhoneLumber=" + updatePhoneLumber,
    "updateDriversLicencePicture=" + updateDriversLicencePicture,
    "errorOnDriversUpdate=" + errorOnDriversUpdate,
    "updateSuccessOnDriver=" + updateSuccessOnDriver
  );
}
window.onhashchange = function () {
  hashManager();
};

function hashManager() {
  var myHash = location.hash;
  console.log(myHash);
  $("section").hide();
  if (myHash == "#view-informations") {
    $(".view-informations").show();
  } else if (myHash == "#section-register-drivers") {
    $(".section-register-drivers").show();
  } else if (myHash == "#updateDriversInfo") {
    $(".section-update-drivers").show();
  } else {
  }
}

function registerDriversInGW() {
  var registerPlateNumber = $(".register-plate-number").val(),
    registerDriverName = $(".register-driver-name").val(),
    registerLicenceNumber = $(".register-licence-number").val(),
    registerPhoneNumber = $(".register-phone-number").val(),
    registerDriversLicencePicture = $(
      ".register-drivers-licence-picture"
    ).val(),
    errorOnDriversRegister = $("#rerror-on-drivers-register").val(),
    registerSuccessOnDriver = $("#register-success-on-driver").val(),
    btnRegisterDriver = $("#btn-register-driver").val();

  console.log(
    "registerPlateNumber=" + registerPlateNumber,
    "registerDriverName=" + registerDriverName,
    "registerLicenceNumber=" + registerLicenceNumber,
    "registerPhoneNumber=" + registerPhoneNumber,
    "registerDriversLicencePicture=" + registerDriversLicencePicture,
    "errorOnDriversRegister" + errorOnDriversRegister,
    "registerSuccessOnDriver=" + registerSuccessOnDriver,
    "btnRegisterDriver=" + btnRegisterDriver
    /* register-plate-number,register-driver-name,register-licence-number,
     register-phone-number,#register-drivers-licence-picture,#error-on-drivers-register ,
   # register-success-on-driver#,btn-register-driver  */
  );
}
function setDriversInformationOnUpdateForm(
  driverNameId,
  plateNumberId,
  licenceNumberId,
  phoneNumberId,
  licencePictureId
) {
  // update-plate-number,
  //update-driver-name,update-licence-number,
  //update-phone-number,update-drivers-licence-picture
  console.log("connected", "driverName = " + $("#" + driverNameId).text());

  var driverName = $("#" + driverNameId).text(),
    plateNumber = $("#" + plateNumberId).text(),
    licenceNumber = $("#" + licenceNumberId).text(),
    phoneNumber = $("#" + phoneNumberId).text(),
    licencePicture = $("#" + licencePictureId).text();

  $(".section-update-drivers").show();
  $(".update-driver-name").val(driverName);
  $(".update-plate-number").val(plateNumber);
  $(".update-licence-number").val(licenceNumber);
  $(".update-phone-number").val(phoneNumber);
  $(".update-drivers-licence-picture").val(licencePicture);
}
function adminNavManager(navLi, navLiItem) {
  $("." + navLi).removeClass("active");
  $("." + navLiItem).addClass(" active");
  console.log("navLiItem = " + navLiItem);
}
hashManager();
function updatePassangersInfo() {
  console.log("update drivers information");
}
