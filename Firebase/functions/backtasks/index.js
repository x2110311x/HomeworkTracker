const deleteUser = require('./deleteuser');
const newuser = require('./newuser');

// deleteUser is the function called when a user account is deleted from Firebase Auth.
// It deletes all data for that user in the database
exports.deleteUser = deleteUser.deleteUser;

// AddUser adds a new user document in the database when an account is created in Firebase Auth
exports.addUser = newuser.addUser;

// AddUserInfo gets called after the user document is created in Firestore
// This grabs the user's profile displayname and stores it in the database
exports.addUserInfo = newuser.addUserInfo;