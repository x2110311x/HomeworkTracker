const express         = require('express');
const path            = require('path');
const cors            = require('cors');
const engines         = require('consolidate');
const cookieParser    = require('cookie-parser');
const admin           = require('firebase-admin');
const bodyParser      = require('body-parser');

var serviceAccount = require("../config/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homeworktracker-b9805-default-rtdb.firebaseio.com"
});

// Setup Express
const web = express();

function parseSessionCookie(req, res, next) {
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

// Setup render engine
web.engine('hbs', engines.handlebars);
web.set('views', './webapp/pages/views');
web.set('view engine', 'hbs');

// Setup Middleware
web.use(express.json());
web.use(cors({ origin: true }));
web.use(bodyParser.json()); // support json encoded bodies
web.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
web.use(cookieParser());
web.use(parseSessionCookie);

// Handle routers
const api = require("./api");

web.use("/api", api);

const pages = require("./pages")(web);

module.exports = web