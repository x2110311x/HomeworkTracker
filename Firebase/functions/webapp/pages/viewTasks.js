module.exports = function (admin, app) {
    app.get('/viewTasks', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;

            var curDay = new Date();
            var day = String(curDay.getDate()).padStart(2, '0');
            var month = String(curDay.getMonth() + 1).padStart(2, '0');
            var year = curDay.getFullYear();

            var today = year + '-' + month + '-' + day;
            var upcomingDays = [];
            for(i = 0; i < 7; i++){
                let newDay = year + '-' + month + '-' + String(curDay.getDate() + i).padStart(2, '0');
                upcomingDays.push(newDay);
            }
            let todayTasks = [];
            let laterTasks = [];
            admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tasks').get()
            .then(snapshot => {
                snapshot.forEach((item) => {
                    let data = item.data();
                    data.color = "#014d74";
                    data.tag = "Tag Placeholder";
                    if (data.due_date == today){
                        todayTasks.push(data);
                    } else if (upcomingDays.includes(data.due_date)) {
                        laterTasks.push(data);
                    }
                });
                var sections = [];
                if(todayTasks.length > 0){
                    let section = {title: "Due Today", completionPercent: 20, task: todayTasks};
                    sections.push(section);
                }
                if (laterTasks.length > 0 ){
                    let section = {title: "Upcoming Tasks", completionPercent: 20, task: laterTasks};
                    sections.push(section);
                }
                response.render('viewTasks', {section:sections});
            }).catch((error) => {
                response.status(500).send("Internal Server Error");
            });
        } else {
            response.redirect('/');
        }
    });
}