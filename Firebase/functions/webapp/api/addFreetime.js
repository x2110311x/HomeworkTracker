

require("./addFreetime.js")(admin, router);
// Start of week function received from the following source: https://www.w3resource.com/javascript-exercises/javascript-date-exercise-50.php
function startOfWeek() {
    var today = new Date();

    var diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)

    var startOfWeek = new Date(date.setDate(diff));
    var day = String(startOfWeek.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = String(today.getFullYear());

    startOfWeek = month + '-' + day + '-' + year;
    return startOfWeek;
}

module.exports = function (admin, router) {
    router.post("/addFreetime", (request, response) => {
        if (request.signedin) {

            // Need to discuss input method for free time selection
            // var weekStart = startOfWeek();

            var monday = [];
            var tuesday = [];
            var wednesday = [];
            var thursday = [];
            var friday = [];
            var saturday = [];
            var sunday = [];


            const data = {
                monday: monday,
                tuesday: tuesday,
                wednesday: wednesday,
                thursday: thursday,
                friday: friday,
                saturday: saturday,
                sunday: sunday,
            };
            
            // Update Free time document for this week
            // Can modify function above for specified weeks if that kind of functionality is desired
            const writeResult = admin.firestore().collection('Users')
                .doc(request.decodedClaims.uid).collection('freetime').doc(weekStart).set(data)
            .then(() => {
                response.status(200).send("Task successfully added");
                console.log("Task has been added,", writeResult.id);
            }).catch((error) => {
                console.error("Error writing document: ", error);
                response.status(500).send("Error writing document: ", error.message);
            });
        } else {
            response.status(403).send("Unauthorized");
        }
    });
}