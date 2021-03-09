const functions       = require('firebase-functions');
const admin           = require('firebase-admin');

var serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homeworktracker-b9805-default-rtdb.firebaseio.com"
});

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