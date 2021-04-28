module.exports = 
/**
 * @description Post request to add addFreetime to the database. If they're not signed in, returns "Unauthorized"
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} router - Our router instance of Express.js
 */
function addFreetime(admin, router) {
    router.post("/addFreetime", (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;

            var newSlotDay = request.body.day;
            var newSlotStart = request.body.startTime;
            var newSlotEnd = request.body.endTime;
            var newSlotWeek = request.body.week;

            admin.firestore().collection('Users').doc(user.uid).collection('freetime').doc(newSlotWeek).get()
                .then((snap) =>{
                    var data = snap.data();
                    if (data == undefined){
                        data = {};
                    }
                    if (data[newSlotDay] == undefined){
                        data[newSlotDay] = [];
                    }
                    data[newSlotDay].push({
                        start: newSlotStart,
                        end: newSlotEnd
                    });
                    admin.firestore().collection('Users').doc(user.uid).collection('freetime').doc(newSlotWeek).set(data).then(() =>{
                        response.status(200).send("Freetime Slot Added");
                    }).catch((error) => {
                        response.status(500).send(`Error adding Freetime slot: ${error}`);
                        console.error(`Error adding Freetime slot: ${error}`);
                    });
                });
        } else {
            response.status(403).send("Unauthorized");
        }
    });
}