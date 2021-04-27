const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./config/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homeworktracker-b9805-default-rtdb.firebaseio.com"
}, "addUserInfo");

module.exports = 
/**
 * @name addUserInfo
 * @description Cloud function that handles adding extra user info to an account after it's created
 */
functions.firestore.document("Users/{uid}").onCreate((snap, context) => {
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