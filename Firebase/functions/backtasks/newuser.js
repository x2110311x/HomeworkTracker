const functions       = require('firebase-functions');
const admin           = require('firebase-admin');

var serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homeworktracker-b9805-default-rtdb.firebaseio.com"
});

exports.addUser = functions.auth.user().onCreate((user) => {
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

exports.addUserInfo = functions.firestore.document("Users/{uid}").onCreate((snap, context) => {
    const db = admin.firestore();
    const userData = snap.data();
    const userID = userData.uid;
    const docPath = db.collection("Users").doc(userID);
    return admin.auth().getUser(userID).then((user) => {
        var userName = user.providerData.displayName;
        if (userName == null){
            userName = user.name;
        }
        if (userName == null){
            userName = user.displayName;
        }
        if (userName != null){
            docPath.update({name:userName}).then(() => {
                console.log('Name update succeeded!');
              });
        } else{
            console.log("User name is null!!!!");
        }
    }).then(() => {
        console.log("Success");
    });
});