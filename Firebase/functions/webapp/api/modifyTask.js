module.exports = 
/**
 * @description Edit a task in the database. If they're not signed in, returns "Unauthorized"
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} router - Our router instance of Express.js
 */
function modifyTask(admin, router) {
    router.post('/modifyTask', (request, response) => {
        if (request.signedin) {
            var user = request.decodedClaims;
            var taskID = request.body.taskID;
            var tag = request.body.tag;
            var estTime = request.body.estTime;
            var dueDate = request.body.dueDate;
            var description = request.body.description;
            var completed = request.body.completed;
            var priority = request.body.priority;
            var scheduledTimeStart = request.body.scheduledTimeStart;
            var scheduledTimeEnd = request.body.scheduledTimeEnd;
            
            var docPath = `/Users/${user.uid}/tasks/${taskID}`;
            console.log(docPath);
            var data = {};
            if (estTime != undefined){
                data['est_time'] = estTime;
            }
            if (dueDate != undefined){
                data['due_date'] = dueDate;
            }
            if (description != undefined){
                data['description'] = description;
            }
            if (completed != undefined){
                data['completed'] = completed;
            }
            if (priority != undefined){
                data['priority'] = priority;
            }
            if (scheduledTimeStart != undefined){
                data['scheduled_time_start'] = scheduledTimeStart;
            }
            if (scheduledTimeEnd != undefined){
                data['scheduled_time_end'] = scheduledTimeEnd;
            }
            if (tag != undefined){
                data['tag'] = tag;
            }
            console.log(data);
            admin.firestore().doc(docPath).update(data).then(() => {
                        response.status(200).send("Task modified successfully");
            }).catch(error => {
                    console.error(`Error modifying task: ${error}`);
                    response.status(500).send(`Error modifying task: ${error}`);
            });
        } else {
            response.status(403).send("Unauthorized");
        }
    });
}