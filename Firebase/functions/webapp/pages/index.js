const express         = require('express');
const admin     	  = require('firebase-admin');

module.exports = function(app){
    app.get('/', (request, response) => {
        if (request.signedin) {
            admin.auth().getUser(request.decodedClaims.uid).then((user) => {
                if (user.name == null){
                    var uname = user.displayName;
                } else {
                    var uname = user.name;
                }
                response.render('loggedin', {name: uname});
            });
        } else {
            response.render('loggedout');
        }
    });

    require("./account.js")(admin, app);
    require("./addTag.js")(admin, app);
    require("./addTask.js")(admin, app);
    require("./login.js")(admin, app);
    require("./logout.js")(admin, app);
    require("./sessionLogin.js")(admin, app);
    require("./delete-account.js")(admin, app);
    require("./viewTasks.js")(admin, app);
    require("./register.js")(admin, app);
    require("./reset.js")(admin, app);

    // API METHODS THAT WILL NEED MOVED
    app.get('/tasks', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    let responseData = [];
                    return admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tasks').get()
                    .then(snapshot => {
                        snapshot.forEach((item) => {
                            responseData.push(item.data());
                        });
                        return response.send(responseData);
                    });
                } catch (error) {
                    console.error("Error retrieving tasks: ", error);
                    response.send(500).send("Error retrieving tasks: ", error.message);
                }
            }
            else{
                response.status(403).send("Unauthorized");
            }
        })();
    });

    app.post("/addTask", (request, response) => {
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
                response.send(500).send("Error writing document: ", error.message);
            });
        } else {
            response.status(403).send("Unauthorized");
        }
    });

    app.post("/addCustTag", (request, response) => {
        if (request.signedin) {
            var full_name = request.body.full_name;
            var short_name = request.body.short_name;
            var color = request.body.color;
            var date_created = admin.firestore.Timestamp.now();

            const data = {
                full_name: full_name,
                short_name: short_name,
                color: color,
                date_created: date_created,
            };

            // Add a new tag
            const writeResult = admin.firestore().collection('Users')
                .doc(request.decodedClaims.uid).collection('tags').add(data)
                .then(() => {
                    response.status(200).send("Tag successfully added");
                    console.log("Tag has been added,", writeResult.id);
                }).catch((error) => {
                    console.error("Error writing document: ", error);
                    response.send(500).send("Error writing document: ", error.message);
                });
        } else {
            response.status(403).send("Unauthorized");
        }
    });

    app.get('*', function (request, response) { // THIS MUST STAY LAST. HANDLES 404s
        response.status(404).render('404');
    });
};