const express         = require('express');
const path            = require('path');
const cors            = require('cors');
const engines         = require('consolidate');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');

const api = require("./api");
const views = require("./views");


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

// Setup Express
const web = express();

// Setup Middleware
web.use(express.json());
web.use(cors({ origin: true }));
web.use(bodyParser.json()); // support json encoded bodies
web.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
web.use(cookieParser());
web.use(parseSessionCookie);
