const fetch = require('node-fetch');
async function getEditLink(admin, name, uid){
    var retvar = "#";
    admin.firestore().collection('Users').doc(uid).collection('tasks')
    .where('name', '==', name).get()
        .then((snapshot) => {
        if (snapshot.empty) {
           retvar = "#";
        } else {
            var path = snapshot.docs[0].ref.path.split("/");
            retvar = `/editTask?id=${path[3]}`;
        }
    });
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(retvar);
        }, 750);
      });
}

function getTagList(tasks, currentTags) {
    for (i = 0; i < tasks.length; i++)
    {
        if (tasks[i].tagName === undefined)
            tasks[i].tagName = "Tag Not Found";
        if (!currentTags.hasOwnProperty(tasks[i].tagName))
            currentTags[tasks[i].tagName] = [tasks[i]];
        else
            currentTags[tasks[i].tagName].push(tasks[i]);
    }

    return currentTags
}

function getPriorityList(tasks, currentTags) {
    for (i = 0; i < tasks.length; i++)
        if (!currentTags.hasOwnProperty(tasks[i].tagName))
            currentTags[tasks[i].priority] = [tasks[i]];
        else
            currentTags[tasks[i].priority].push(tasks[i]);

    return currentTags
}

function retrieveTasks(admin, uid, sortColumn) {
    if (sortColumn == "tag") {
        return admin.firestore().collection('Users').doc(uid).collection('tasks').get()
    }
    return admin.firestore().collection('Users').doc(uid).collection('tasks').orderBy(sortColumn).get()
}

async function getTaskByGeneric(admin, uid, sortColumn) {
    var curDay = new Date();
    var day = String(curDay.getDate()).padStart(2, '0');
    var month = String(curDay.getMonth() + 1).padStart(2, '0');
    var year = curDay.getFullYear();
    sortColumn = sortColumn.toLowerCase();
    sortColumn = sortColumn.replace(" ", "_");

    var today = year + '-' + month + '-' + day;
    var upcomingDays = [];
    for (i = 0; i < 7; i++) {
        var newDay = new Date(curDay);
        newDay.setDate(newDay.getDate() + i)
        let newDayStr =  newDay.getFullYear() + '-' + String(newDay.getMonth() + 1).padStart(2, '0') + '-' + String(newDay.getDate()).padStart(2, '0');
        upcomingDays.push(newDay);
    }
    let todayTasks = [];
    let laterTasks = [];
    retrieveTasks(admin, uid, sortColumn)
        .then(snapshot => {
            snapshot.forEach((item) => {
                const data = item.data();
                var task = {
                    description: data.description,
                    due_date: data.due_date,
                    est_time: data.est_time,
                    name: data.name,
                    priority: data.priority,
                    completed: data.completed
                }
                getEditLink(admin, task.name, uid).then((editLink) => {
                    task.editLink = editLink;
                    if (data.tag === undefined) {
                        task.color = "#014d74";
                        task.tagName = "No Tag";
                    } else {
                        admin.firestore().doc(data.tag).get().then(snapshot2 => {
                            let tagData = snapshot2.data();
                            task.color = tagData.color;
                            task.tagName = tagData.full_name;
                        }).then(() => {
                            if (data.due_date == today) {
                                todayTasks.push(task);
                            } else if (upcomingDays.includes(task.due_date)) {
                                laterTasks.push(task);
                            }
                        }).catch((error) => {
                            console.log("Can't find tag");
                            task.color = "#014d74";
                            task.tagName = "No Tag";
                        });
                    }
                })
            });
        });
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([todayTasks, laterTasks]);
        }, 2000);
    });
}


module.exports = function (admin, app) {
    app.get('/viewTasks', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            var chosenSort = request.query.sort;

            if (chosenSort == undefined){
                chosenSort = 'Due Date';
            } else if (chosenSort != "Due Date" && chosenSort != "Priority" && chosenSort != "Tag") {
                chosenSort = 'Due Date';
            }
            
            if (chosenSort == 'Tag') {
                var sections = [];
                getTaskByGeneric(admin, user.uid, chosenSort, request).then((data) => {
                    var todayTasks = data[0];
                    var laterTasks = data[1];
                    var tags = {};


                    if (todayTasks.length > 0)
                        getTagList(todayTasks, tags);
                    if (laterTasks.length > 0)
                        getTagList(laterTasks, tags);

                    if (Object.keys(tags).length !== 0)
                        for (var tag in tags) {
                            let section = { title: tag, completionPercent: 20, task: tags[tag] };
                            sections.push(section);
                        }

                    response.status(200).render('viewTasks', { section: sections, sort: chosenSort });
                });
            } else if (chosenSort == "Due Date") {
                var sections = [];
                getTaskByGeneric(admin, user.uid, chosenSort, request).then((data) => {
                    var todayTasks = data[0];
                    var laterTasks = data[1];
                    if (todayTasks.length > 0) {
                        let section = { title: "Due Today", completionPercent: 20, task: todayTasks };
                        sections.push(section);
                    }
                    if (laterTasks.length > 0) {
                        let section = { title: "Upcoming Tasks", completionPercent: 20, task: laterTasks };
                        sections.push(section);
                    }
                    response.status(200).render('viewTasks', { section: sections, sort: chosenSort });
                });
            } else if (chosenSort == "Priority") {
                var sections = [];
                getTaskByGeneric(admin, user.uid, chosenSort, request).then((data) => {
                    var todayTasks = data[0];
                    var laterTasks = data[1];
                    var priorities = {}
                    if (todayTasks.length > 0) {
                        getPriorityList(todayTasks, priorities);
                    }
                    if (laterTasks.length > 0) {
                        getPriorityList(laterTasks, priorities);
                    }


                    if (Object.keys(priorities).length !== 0)
                        for (var priority in priorities) {
                            let section = { title: priority, completionPercent: 20, task: priorities[priority] };
                            sections.push(section);
                        }


                    response.status(200).render('viewTasks', { section: sections, sort: chosenSort });
                });
            }
        } else {
            response.redirect('/');
        }
    });
}