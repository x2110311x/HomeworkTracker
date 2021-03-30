const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./config/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homeworktracker-b9805-default-rtdb.firebaseio.com"
}, "addUser");

module.exports = functions.auth.user().onCreate((user) => {
    var uname = user.providerData.displayName;
    if (uname == null) {
        var data = {
            uid: user.uid,
            email: user.email,
            creationDate: admin.firestore.Timestamp.now()
        };
    } else {
        var data = {
            uid: user.uid,
            email: user.email,
            name: uname,
            creationDate: admin.firestore.Timestamp.now()
        };
    }
    return admin.firestore().collection('Users').doc(user.uid).set(data).then(() => {
        console.log('User Add succeeded!');
      });
});