module.exports = 
/**
 * @description Post request to add a task to the database. If they're not signed in, returns "Unauthorized"
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} router - Our router instance of Express.js
 */
function addTaskAPI(admin, router) {
    router.post("/addTask", (request, response) => {
        if (request.signedin) {
            var name = request.body.name;
            var estTime = request.body.estTime;
            var dueDate = request.body.dueDate;
            var description = request.body.description;
            var priority = request.body.priority;
            var scheduledTimeStart = request.body.scheduledTimeStart;
            var scheduledTimeEnd = request.body.scheduledTimeEnd;
            var tag = request.body.tag;
            
            const data = {
                name: name,
                est_time: estTime,
                due_date: dueDate,
                description: description,
                completed: false,
                priority: priority,
                scheduled_time_start: scheduledTimeStart,
                scheduled_time_end: scheduledTimeEnd,
                tag: tag
            };
            
            // Add a new task
            const writeResult = admin.firestore().collection('Users')
            .doc(request.decodedClaims.uid).collection('tasks').add(data)
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