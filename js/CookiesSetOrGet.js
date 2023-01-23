function setCookie(cname, cvalue, exdays) {
  // console.log(cname, cvalue, exdays);
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;";
}
function getCookie(cname) {
  // console.log(cname);
  let i = 0;
  let name = cname + "=";
  // console.log(document.cookie);
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  // console.log(ca);
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    // console.log("i is = " + i, "c is = " + c);
    // console.log('"' + c.charAt(0) + '"');
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    // console.log("'" + c + "'", name);
    if (c.indexOf(name) == 0) {
      // console.log(c.substring(name.length, c.length));
      return c.substring(name.length, c.length);
    }
  }
  return "noData";
}
function deleteCookies(cookiesNAme) {
  document.cookie = `${cookiesNAme}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${cookiesNAme}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  return "noData";
}
