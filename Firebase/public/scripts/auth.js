
// Initialize Firebase
var config = {
  apiKey: "AIzaSyC2IAgV5O3rg7GtmsnM3oCEwKrhng0DFKI",
  authDomain: "homeworktracker-b9805.firebaseapp.com",
  databaseURL: "https://homeworktracker-b9805-default-rtdb.firebaseio.com",
  projectId: "homeworktracker-b9805",
  storageBucket: "homeworktracker-b9805.appspot.com",
  messagingSenderId: "346231056217",
  appId: "1:346231056217:web:bb8d74795e12b65eba0e48",
  measurementId: "G-DDVP2Z4XL4"

};
firebase.initializeApp(config);
var auth = firebase.auth();

function signInWithEmailAndPassword() {
    document.getElementById("alertbox").hidden = true;
    var email = document.getElementById("usr").value;
    var password =  document.getElementById("pwd").value;
    auth.signInWithEmailAndPassword(email, password).then(user => {
        // Get the user's ID token as it is needed to exchange for a session cookie.
        return user.getIdToken().then(idToken => {
          window.location.href = '/sessionLogin?idToken=' + idToken;
        });
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById("alertbox").innerHTML = errorMessage;
        document.getElementById("alertbox").hidden = false;
      });
}

function signUpWithEmailPassword() {
    document.getElementById("alertbox").hidden = true;
    var email = document.getElementById("usr").value;
    var password =  document.getElementById("pwd").value;
    var name = document.getElementById("name").value;
    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      
        var user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: name,
        });
        return userCredential.getIdToken().then(idToken => {
          window.location.href = '/sessionLogin?idToken=' + idToken;
        });
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById("alertbox").innerHTML = errorMessage;
        document.getElementById("alertbox").hidden = false;
    });
}

function signInWithGoogle(){
  document.getElementById("alertbox").hidden = true;
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  firebase.auth()
  .signInWithPopup(provider)
  .then((user) => {
    console.log(user);
    return user.user.getIdToken().then(idToken => {
      window.location.href = '/sessionLogin?idToken=' + idToken;
    });
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    document.getElementById("alertbox").innerHTML = errorMessage;
    document.getElementById("alertbox").hidden = false;
  });
}

function SendPasswordReset(){
  document.getElementById("alertbox").hidden = true;
  document.getElementById("successbox").hidden = true;
  var email = document.getElementById("usr").value;
  firebase.auth().sendPasswordResetEmail(email).then(()=>{
    document.getElementById("successbox").hidden = false;
  }).catch((error) => {
    document.getElementById("alertbox").innerHTML = error.message;
    document.getElementById("alertbox").hidden = false;
  });
}