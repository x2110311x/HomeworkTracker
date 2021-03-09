const admin = require('firebase-admin');

var serviceAccount = require("../config/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homeworktracker-b9805-default-rtdb.firebaseio.com"
}, "backgroundtasks");

const deleteUser = require('./deleteuser')(admin);
const addUser = require('./addUser')(admin);
const addUserInfo = require('./addUserInfo')(admin);

// deleteUser is the function called when a user account is deleted from Firebase Auth.
// It deletes all data for that user in the database
exports.deleteUser = deleteUser;

// AddUser adds a new user document in the database when an account is created in Firebase Auth
exports.addUser = addUser;

// AddUserInfo gets called after the user document is created in Firestore
// This grabs the user's profile displayname and stores it in the database
exports.addUserInfo = addUserInfo;