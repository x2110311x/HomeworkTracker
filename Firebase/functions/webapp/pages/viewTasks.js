const fetch = require('node-fetch');
/**
 * @description Retrieves the edit link for a task based on its name
 * @param {firebase-admin} admin - Firebase admin instance
 * @param {string} name - name of the Task
 * @param {string} uid - The user's ID
 * @returns 
 */
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
        }, 950);
      });
}

/**
 * @description Sorts the tasks into arrays based on tag name
 * @param {*} tasks 
 * @param {*} currentTags 
 * @returns 
 */
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

/**
 * @description Sorts the tasks into arrays based on priority
 * @param {*} tasks 
 * @param {*} currentTags 
 * @returns 
 */
function getPriorityList(tasks, currentTags) {
    for (i = 0; i < tasks.length; i++)
        if (!currentTags.hasOwnProperty(tasks[i].priority   ))
            currentTags[tasks[i].priority] = [tasks[i]];
        else
            currentTags[tasks[i].priority].push(tasks[i]);

    return currentTags
}

/**
 * @description Retreives the user's tasks from Firestore Cloud Database
 * @param {firebase-admin} admin - Firebase admin instance
 * @param {*} uid 
 * @param {*} sortColumn 
 * @returns 
 */
function retrieveTasks(admin, uid, sortColumn) {
    if (sortColumn == "tag") {
        return admin.firestore().collection('Users').doc(uid).collection('tasks').get()
    }
    return admin.firestore().collection('Users').doc(uid).collection('tasks').orderBy(sortColumn).get()
}

/**
 * @description Retrieves tasks and sorts by due date
 * @param {firebase-admin} admin - Firebase admin instance
 * @param {*} uid 
 * @param {*} sortColumn 
 * @returns 
 */
async function getTaskByGeneric(admin, uid, sortColumn) {
    var curDay = new Date();
    curDay.setHours(0,0,0,0);

    sortColumn = sortColumn.toLowerCase();
    sortColumn = sortColumn.replace(" ", "_");

    var today = Date.parse(curDay);
    var upcomingDays = today + 604800000;
    console.log(today);
    console.log(upcomingDays);

    let overDueTasks = [];
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
                            if (!task.completed){
                                let due_date = new Date(task.due_date);
                                due_date.setHours(0,0,0,0);
                                let timestamp = Date.parse(due_date);
                                if (timestamp == today) {
                                    let dateStr = new Date(task.due_date);
                                    task.due_date = dateStr.toLocaleDateString();
                                    todayTasks.push(task);
                                } else if (timestamp > today && Date.parse(Date(task.due_date)) < upcomingDays ) {
                                    let dateStr = new Date(task.due_date);
                                    task.due_date = dateStr.toLocaleDateString();
                                    laterTasks.push(task);
                                } else if (timestamp < today){
                                    let dateStr = new Date(task.due_date);
                                    task.due_date = dateStr.toLocaleDateString();
                                    overDueTasks.push(task);
                                }
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
            resolve([todayTasks, laterTasks, overDueTasks]);
        }, 2500);
    });
}


module.exports = 
/**
 * @description Renders the view tasks page. Query parameter specifies the sort type. If they're not signed in, redirects to the homepage
 * @param {firebase-admin} admin 
 * @param {express} app - Our instance of Express.js
 */
function viewTasks(admin, app) {
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
                    var overDueTasks = data[2];
                    var tags = {};


                    if (todayTasks.length > 0)
                        getTagList(todayTasks, tags);
                    if (laterTasks.length > 0)
                        getTagList(laterTasks, tags);
                    if (overDueTasks.length > 0)
                        getTagList(overDueTasks, tags);

                    if (Object.keys(tags).length !== 0)
                        for (var tag in tags) {
                            let section = { title: tag, completionPercent: 0, task: tags[tag] };
                            sections.push(section);
                        }

                    response.status(200).render('viewTasks', { section: sections, sort: chosenSort });
                });
            } else if (chosenSort == "Due Date") {
                var sections = [];
                getTaskByGeneric(admin, user.uid, chosenSort, request).then((data) => {
                    var todayTasks = data[0];
                    var laterTasks = data[1];
                    var overDueTasks = data[2];
                    if (todayTasks.length > 0) {
                        let section = { title: "Due Today", completionPercent: 0, task: todayTasks };
                        sections.push(section);
                    }
                    if (laterTasks.length > 0) {
                        let section = { title: "Upcoming Tasks", completionPercent: 0, task: laterTasks };
                        sections.push(section);
                    }
                    if (overDueTasks.length > 0) {
                        let section = { title: "Overdue Tasks", completionPercent: 0, task: overDueTasks };
                        sections.push(section);
                    }
                    response.status(200).render('viewTasks', { section: sections, sort: chosenSort });
                });
            } else if (chosenSort == "Priority") {
                var sections = [];
                getTaskByGeneric(admin, user.uid, chosenSort, request).then((data) => {
                    var todayTasks = data[0];
                    var laterTasks = data[1];
                    var overDueTasks = data[2];
                    var priorities = {}
                    if (todayTasks.length > 0) {
                        getPriorityList(todayTasks, priorities);
                    }
                    if (laterTasks.length > 0) {
                        getPriorityList(laterTasks, priorities);
                    }
                    if (laterTasks.length > 0) {
                        getPriorityList(overDueTasks, priorities);
                    }
                    


                    if (Object.keys(priorities).length !== 0)
                        for (var priority in priorities) {
                            let section = { title: `Priority ${priority}`, completionPercent: 0, task: priorities[priority] };
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