// This file stores the pure Firebase Cloud Functions that appears in the Firebase Console
const functions = require('firebase-functions');

const backtasks = require("./backtasks")
const webapp = require("./webapp")

// Webapp is the function that handles all web requests that aren't static files
exports.webapp = functions.https.onRequest(webapp);

// deleteUser is the function called when a user account is deleted from Firebase Auth.
// It deletes all data for that user in the database
exports.deleteUser = backtasks.deleteUser;

// AddUser adds a new user document in the database when an account is created in Firebase Auth
exports.addUser = backtasks.addUser;

// AddUserInfo gets called after the user document is created in Firestore
// This grabs the user's profile displayname and stores it in the database
exports.addUserInfo = backtasks.addUserInfo;