module.exports = function (admin, app) {
    app.get('/viewTasks', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            var task1 = {taskName: "Task1", tag:"MATHs", color:"#014d74", description:"Homework1", date:"05/10/21", priority: 3, estTime:900};
            var task2 = {taskName: "Task2", tag:"CS2", color:"#3389b5", description:"Homework2 is testing testing testing testing testingtesting testing testing testing testingtestingtestingtestingtesting testing testing", date:"05/12/21", priority: 2, estTime:60};
            
            var firstSectionTasks = [task1, task2];

            var task3 = {taskName: "Task3", tag:"HIST", color:"#014d74", description:"Homework3", date:"05/10/21", priority: 7, estTime:5};
            var secondSectionTasks = [task3];

            var section1 = {title: "Due Today", completionPercent: 20, task: firstSectionTasks};
            var section2 = {title: "Later This Week", completionPercent: 10, task: secondSectionTasks};
            
    
            var sections = [section1, section2];

            response.render('viewTasks', {section:sections});
        } else {
            response.redirect('/');
        }
    });
}