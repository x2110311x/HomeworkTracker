module.exports = function (admin, app) {
    app.get('/editTask', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            var taskID = request.query.id;
            console.log(taskID);
            admin.firestore().collection('Users').doc(user.uid).collection('tasks').doc(taskID).get()
            .then((snap) => {
                var data = snap.data();
                var task = {
                    id: taskID,
                    scheduled_time_start: data.scheduled_time_start.replace("-","/").replace("-","/"),
                    scheduled_time_end: data.scheduled_time_end.replace("-","/").replace("-","/"),
                    description: data.description,
                    estTime: data.est_time,
                    dueDate: data.due_date,
                    priority: data.priority
                }
                admin.firestore().doc(data.tag).get().then(snapshot2 => {
                    let tagData = snapshot2.data();
                    task.tag = tagData.full_name;
                    response.render('editTask', {task, task});
                });
            })
        } else {
            response.redirect('/');
        }
    });
}