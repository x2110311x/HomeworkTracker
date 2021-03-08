

/* ADOPTED FROM W3 Schools https://www.w3schools.com/howto/howto_js_mobile_navbar.asp */
function navToggle() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}