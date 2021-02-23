const functions = require("firebase-functions");
const express = require('express');
const path = require('path');
const cors = require('cors');
const engines = require('consolidate');

var bodyParser = require('body-parser');
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");


const firebaseConfig = {
    apiKey: "AIzaSyC2IAgV5O3rg7GtmsnM3oCEwKrhng0DFKI",
    authDomain: "homeworktracker-b9805.firebaseapp.com",
    databaseURL: "https://homeworktracker-b9805-default-rtdb.firebaseio.com",
    projectId: "homeworktracker-b9805",
    storageBucket: "homeworktracker-b9805.appspot.com",
    messagingSenderId: "346231056217",
    appId: "1:346231056217:web:bb8d74795e12b65eba0e48",
    measurementId: "G-DDVP2Z4XL4"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = express();

app.use(express.json());
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.use(cors({ origin: true }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var auth = firebase.auth();

app.post('/auth-login', (request, response) => {
    if (request.method == "POST") {
        var email = request.body.email;
        var password = request.body.password;
        auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            response.redirect('/'); 
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            response.render('login', {error: errorMessage});
        });
    } else{
        response.redirect('/');
    }
});

app.post('/auth-register', (request, response) => {
    if (request.method == "POST") {
        var email = request.body.email;
        var password = request.body.password;
        var name = request.body.name;
        auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            const user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: name,
            }).then(function() {
                response.redirect('/');
            }, function(error) {
                response.render('register', {error: errorMessage});
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            response.render('register', {error: errorMessage});
        });
    } else{
        response.redirect('/');
    }
});

app.get('/logout', (request, response) => {
    var user = firebase.auth();
    user.signOut().then(() => {
        response.redirect('/');
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        response.status(200).send(errorMessage);
    });
});

app.get('/delete-account', (request, response) => {
    var user = firebase.auth().currentUser;
    user.delete().then(() => {
        response.redirect('/');
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        response.status(200).send(errorMessage);
    });
});


app.get('/', (request, response) => {
    var user = auth.currentUser;
    if (user) {
        response.render('loggedin', {name: user.displayName});
    } else {
        response.render('loggedout');
    }
});

app.get('/account', (request, response) => {
    var user = auth.currentUser;
    if (user) {
        response.render('acctDetails', {name: user.displayName});
    } else {
        response.redirect('/');
    }
});

app.get('/login', (request, response) => {
    var user = auth.currentUser;
    if (user) {
        response.redirect('/');
    } else {
        response.render('login');
    }
});

app.get('/register', (request, response) => {
    var user = auth.currentUser;
    if (user) {
        response.redirect('/');
    } else {
        response.render('register');
    }
});

app.get('/reset', (request, response) => {
    var user = auth.currentUser;
    if (user) {
        response.redirect('/');
    } else {
        response.render('reset');
    }
});

app.get('*', (request, response) => {
    response.status(404).render('404');
});

exports.auth = functions.https.onRequest(app);