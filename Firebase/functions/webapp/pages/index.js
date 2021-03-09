const express         = require('express');
const admin     	  = require('firebase-admin');

var pagehandler = function(app){
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

    app.get('/account', (request, response) => {
        if (request.signedin) {
            admin.auth().getUser(request.decodedClaims.uid).then((user) => {
                if (user.name == null){
                    var uname = user.displayName;
                } else{
                    var uname = user.name;
                }
                response.render('acctDetails', {name: uname});
            });
        } else {
            response.redirect('/');
        }
    });

    app.get('/addTag', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            response.render('addTag');
        } else {
            response.redirect('/');
        }
    });
    
    app.get('/addTask', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            response.render('addTask');
        } else {
            response.redirect('/');
        }
    });

    app.get('/login', (request, response) => {
        if (request.signedin) {
            response.redirect('/');
        } else {
            response.render('login');
        }
    });

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

    app.get('/logout', (request, response) => {
        response.clearCookie('__session');
        response.redirect('/');
    });
    
    app.get('/sessionLogin', (req, res) => {
        idToken = req.query.idToken
        // Set session expiration to 5 days.
        // Create the session cookie. This will also verify the ID token in the process.
        // The session cookie will have the same claims as the ID token.
        
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        admin.auth().createSessionCookie(idToken, {expiresIn}).then((sessionCookie) => {
            
            // Set cookie policy for session cookie and set in response.
            const options = {maxAge: expiresIn, httpOnly: true, secure: true};
            res.cookie('__session', sessionCookie, options);
            
            admin.auth().verifyIdToken(idToken).then(function(decodedClaims) {
                res.redirect('/');
            });
                
        }, error => {
            res.status(401).send('UNAUTHORIZED REQUEST!');
        });	
      });
    
    app.get('/delete-account', (request, response) => {
        if (request.signedin){
            let user = request.decodedClaims;
            admin.auth().deleteUser(user.uid).then(() => {
                response.redirect('/logout');
            }).catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                response.status(200).send(errorMessage);
            });
        } else {
            response.redirect('/');
        }
    });
    
    
    
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
    
    app.get('/register', (request, response) => {
        if (request.signedin) {
            response.redirect('/');
        } else {
            response.render('register');
        }
    });
    
    app.get('/reset', (request, response) => {
        if (request.signedin){
            response.redirect('/');
        } else {
            response.render('reset');
        }
    });

    app.get('*', function (request, response) { // THIS MUST STAY LAST
        response.status(404).render('404');
    });
};
module.exports = pagehandler