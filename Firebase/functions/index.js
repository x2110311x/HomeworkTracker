const functions       = require("firebase-functions");
const express         = require('express');
const path            = require('path');
const cors            = require('cors');
const engines         = require('consolidate');
const cookieParser    = require('cookie-parser');
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
            response.redirect('/logout');
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
        admin.auth().getUser(request.decodedClaims.uid).then((user) => {
            console.log(user);
            if (user.name == null){
                var uname = user.displayName;
            } else {
                var uname = user.name;
            }
            response.render('loggedin', {name: uname});
        });
    } else {
        response.render('loggedout');
    }
});

app.get('/account', checkCookieMiddleware, (request, response) => {
    if (request.signedin) {
        admin.auth().getUser(request.decodedClaims.uid).then((user) => {
            if (user.name == null){
                var uname = user.displayName;
            } else{
                var uname = user.name;
            }
            response.render('acctDetails', {name: uname});
        });
    } else {
        response.redirect('/');
    }
});

app.get('/addTask', checkCookieMiddleware, (request, response) => {
    if (request.signedin) {
        let user = request.decodedClaims;
        response.render('addTask');
    } else {
        response.redirect('/');
    }
});

app.get('/addTag', checkCookieMiddleware, (request, response) => {
    if (request.signedin) {
        let user = request.decodedClaims;
        response.render('addTag');
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

app.post("/addTask", checkCookieMiddleware, (request, response) => {
    if (request.signedin) {
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
        const writeResult = admin.firestore().collection('Users')
        .doc(request.decodedClaims.uid).collection('tasks').add(data)
        .then(() => {
            response.status(200).send("Task successfully added");
            console.log("Task has been added,", writeResult.id);
        }).catch((error) => {
            console.error("Error writing document: ", error);
            response.send(500).send("Error writing document: ", error.message);
        });
    } else {
        response.status(403).send("Unauthorized");
    }
});

app.get('/tasks', checkCookieMiddleware, (request, response) => {
    (async () => {
        if (request.signedin) {
            try {
                let responseData = [];
                return admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tasks').get()
                .then(snapshot => {
                    snapshot.forEach((item) => {
                        responseData.push(item.data());
                    });
                    return response.send(responseData);
                });
            } catch (error) {
                console.error("Error retrieving tasks: ", error);
                response.send(500).send("Error retrieving tasks: ", error.message);
            }
        }
        else{
            response.status(403).send("Unauthorized");
        }
    })();
    });

app.get('*', (request, response) => {
    response.status(404).render('404');
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

async function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);
  
    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();
  
    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }
  
    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  
    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
    });
} // from https://firebase.google.com/docs/firestore/manage-data/delete-data?authuser=0#collections

exports.addUser = functions.auth.user().onCreate((user) => {
    if (user.name == null){
        var uname = user.displayName
    } else{
        var uname = user.name
    }
    return addUser(user.uid, user.email, uname);
});

exports.webapp = functions.https.onRequest(app);

exports.deleteUser = functions.auth.user().onDelete((user) => {
    console.log('Deleting user ${user}');
    const db = admin.firestore();
    var taskCol = '/Users/${user.uid}/tasks';
    var tagCol = '/Users/${user.uid}/tags';
    var coursesCol = '/Users/${user.uid}/courses';
    var freetimeCol = '/Users/${user.uid}/freetime';

    deleteCollection(db, taskCol, 5000).then((result) => {
        console.log(result);
        console.log('tasks deleted');
    }).catch((error) => {
        console.log(error);
    });

    deleteCollection(db, tagCol, 500).then((result) => {
        console.log(result);
        console.log('tags deleted');
    }).catch((error) => {
        console.log(error);
    });

    deleteCollection(db, coursesCol, 50).then((result) => {
        console.log(result);
        console.log('course tags deleted');
    }).catch((error) => {
        console.log(error);
    });

    deleteCollection(db, freetimeCol, 5000).then((result) => {
        console.log(result);
        console.log('free time deleted');
    }).catch((error) => {
        console.log(error);
    });

    db.collection('Users').doc(user.uid).delete();
    console.log('User ${user} deleted');
});