module.exports = function (admin, router) {
    router.post('/modifyTask', (request, response) => {
        if (request.signedin) {
            var taskname = request.body.task_name;
            var estTime = request.body.estTime;
            var dueDate = request.body.dueDate;
            var description = request.body.description;
            var completed = request.body.completed;
            var priority = request.body.priority;
            var scheduledTimeStart = request.body.scheduledTimeStart;
            var scheduledTimeEnd = request.body.scheduledTimeEnd;
            
            admin.firestore().collection('Users')
                .doc(request.decodedClaims.uid).collection('tasks')
                .where('name', '==', taskname).limit(1).get().then((snap) => {
                    snap.docs[0].ref.update({
                        est_time: estTime,
                        due_date: dueDate,
                        description: description,
                        completed: completed,
                        priority: priority,
                        scheduled_time_start: scheduledTimeStart,
                        scheduled_time_end: scheduledTimeEnd,
                    }).then(() => {
                        response.status(200).send("Task modified successfully");
                    });
                }).catch(error => {
                    console.error(`Error modifying task: ${error}`);
                    response.status(500).send(`Error modifying task: ${error}`);
                });
        } else {
            response.status(403).send("Unauthorized");
        }
    });
}