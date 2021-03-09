const functions = require('firebase-functions');

module.exports = function (admin) {
    functions.auth.user().onCreate((user) => {
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
    })
};