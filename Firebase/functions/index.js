const functions     = require("firebase-functions");
const express       = require('express');
const path          = require('path');
const cors          = require('cors');
const engines       = require('consolidate');
const cookieParser  = require('cookie-parser');
const admin           = require('firebase-admin');
const bodyParser      = require('body-parser');
const firebase        = require("firebase/app");

require("firebase/auth");
require("firebase/firestore");

// Initialize Firebase
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
firebase.initializeApp(firebaseConfig);

var serviceAccount = require("./config/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homeworktracker-b9805-default-rtdb.firebaseio.com"
});

// Setup Express
const app = express();

app.use(express.json());
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.use(cors({ origin: true }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());

var auth = firebase.auth();

function checkCookieMiddleware(req, res, next) {
    const sessionCookie = req.cookies.__session || '';
    admin.auth().verifySessionCookie(
		sessionCookie, true).then((decodedClaims) => {
			req.decodedClaims = decodedClaims;
            req.signedin = true;
			next();
		})
		.catch(error => {
			req.signedin = false;
            next();
		});
}

app.get('/logout', (request, response) => {
    response.clearCookie('__session');
    response.redirect('/');
});

app.get('/sessionLogin', (req, res) => {
    idToken = req.query.idToken
	// Set session expiration to 5 days.
	// Create the session cookie. This will also verify the ID token in the process.
	// The session cookie will have the same claims as the ID token.
	
	const expiresIn = 60 * 60 * 24 * 5 * 1000;
	admin.auth().createSessionCookie(idToken, {expiresIn}).then((sessionCookie) => {
		
		// Set cookie policy for session cookie and set in response.
		const options = {maxAge: expiresIn, httpOnly: true, secure: true};
		res.cookie('__session', sessionCookie, options);
		
		admin.auth().verifyIdToken(idToken).then(function(decodedClaims) {
			res.redirect('/');
		});
			
	}, error => {
		res.status(401).send('UNAUTHORIZED REQUEST!');
	});	
  });

app.get('/delete-account', checkCookieMiddleware, (request, response) => {
    if (request.signedin){
        let user = request.decodedClaims;
        admin.auth().deleteUser(user.uid).then(() => {
            response.redirect('/');
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            response.status(200).send(errorMessage);
        });
    } else {
        response.redirect('/');
    }
});

app.get('/', checkCookieMiddleware, (request, response) => {
    if (request.signedin) {
        let user = request.decodedClaims;
        response.render('loggedin', {name: user.name});
    } else {
        response.render('loggedout');
    }
});

app.get('/account', checkCookieMiddleware, (request, response) => {
    if (request.signedin) {
        let user = request.decodedClaims;
        response.render('acctDetails', {name: user.name});
    } else {
        response.redirect('/');
    }
});

app.get('/login', checkCookieMiddleware, (request, response) => {
    if (request.signedin) {
        response.redirect('/');
    } else {
        response.render('login');
    }
});

app.get('/register', checkCookieMiddleware, (request, response) => {
    if (request.signedin) {
        response.redirect('/');
    } else {
        response.render('register');
    }
});

app.get('/reset', checkCookieMiddleware, (request, response) => {
    if (request.signedin){
        response.redirect('/');
    } else {
        response.render('reset');
    }
});

app.get('*', (request, response) => {
    response.status(404).render('404');
});

app.post("/task", checkCookieMiddleware, (request, response) => {
  if (request.method == "POST" && request.signedin) {
    var name = request.body.name;
    var estTime = request.body.estTime;
    var dueDate = request.body.dueDate;
    var description = request.body.description;
    var priority = request.body.priority;
    var scheduledTimeStart = request.body.scheduledTimeStart;
    var scheduledTimeEnd = request.body.scheduledTimeEnd;

    const data = {
      name: name,
      est_time: estTime,
      due_date: dueDate,
      description: description,
      completed: false,
      priority: priority,
      scheduled_time_start: scheduledTimeStart,
      scheduled_time_end: scheduledTimeEnd,
    };

    // Add a new task
    const writeResult = admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tasks').set(data);
    console.log("Task has been added,", writeResult.id);
  } else {
    response.redirect("/");
  }
});

async function addUser(uid, email, displayName){
    const data = {
        uid: uid,
        email: email,
        name: displayName,
        creationDate: admin.firestore.Timestamp.now()
    };
    const writeResult = await admin.firestore().collection('Users').doc(uid).set(data);
    console.log("User has been added,", writeResult.id);
}

exports.addUser = functions.auth.user().onCreate((user) => {
    return addUser(user.uid, user.email, user.displayName);
});
exports.auth = functions.https.onRequest(app);