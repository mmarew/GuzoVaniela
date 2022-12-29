function logInAsAdmin() {
  var inputUsername = $("#input-username").val(),
    adminPassword = $("#password-admin").val();
  console.log(inputUsername, adminPassword);
  if (inputUsername != undefined && adminPassword !== undefined) {
    $("#sucsess-on-log-in").show();
    window.location.href = "admin.html";
  } else {
    $("#admin-login-error-teller").show();
  }
}
