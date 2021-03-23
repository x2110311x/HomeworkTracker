module.exports = function (admin, router) {
    router.post("/addTask", (request, response) => {
        if (request.signedin) {
            var name = request.body.name;
            var estTime = request.body.estTime;
            var dueDate = request.body.dueDate;
            var description = request.body.description;
            var priority = request.body.priority;
            var scheduledTimeStart = request.body.scheduledTimeStart;
            var scheduledTimeEnd = request.body.scheduledTimeEnd;
            
            const data = {
                name: name,
                est_time: estTime,
                due_date: dueDate,
                description: description,
                completed: false,
                priority: priority,
                scheduled_time_start: scheduledTimeStart,
                scheduled_time_end: scheduledTimeEnd,
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