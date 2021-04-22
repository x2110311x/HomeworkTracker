module.exports = 
/**
 * @description Retrieves the data for a task and renders the page for a user to edit a task. If task ID is not specified in the query, redirects to the view tasks page. If they're not signed in, redirects to the homepage
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function editTask(admin, app) {
    app.get('/editTask', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            var taskID = request.query.id;
            if (taskID != undefined) {
                admin.firestore().collection('Users').doc(user.uid).collection('tasks').doc(taskID).get()
                .then((snap) => {
                    var data = snap.data();
                    var task = {
                        name: data.name,
                        id: taskID,
                        scheduled_time_start: data.scheduled_time_start.replace("-","/").replace("-","/"),
                        scheduled_time_end: data.scheduled_time_end.replace("-","/").replace("-","/"),
                        description: data.description,
                        estTime: data.est_time,
                        dueDate: data.due_date,
                        priority: data.priority
                    }
                    if (data.completed == true){
                        task['completed'] = true;
                    }
                    admin.firestore().doc(data.tag).get().then(snapshot2 => {
                        let tagData = snapshot2.data();
                        task.tag = tagData.full_name;
                        console.log(task);
                        response.status(200).render('editTask', {task: task});
                    });
                })
            } else {
                response.redirect('/viewTasks');
            }
        } else {
            response.redirect('/');
        }
    });
}