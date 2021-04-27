function fetchTags(){
    fetch('/api/getTags', {
        method: "GET",
    }).then(response => response.text().then((text) => {
        const tagArray = JSON.parse(text);
        var tagSelect = document.getElementById("tag");
        tagArray.forEach(tag => {
            var option = document.createElement("option");
            option.text = tag.full_name;
            tagSelect.add(option);
        });
    }));
}

// I ADDED A HIDDEN ELEMENT TO GET THE TASK ID TO USE WITH THESE FUNCTIONS
// YOU CAN RETREIVE THE ID WITH:
// document.getElementById("taskID").innerHTML
// Using that ID, you can get the task in the databse at path /Users/<user ID>/tasks/<task ID>

function editTag(){
    clearMessageBox();

    taskID = document.getElementById("taskID").innerHTML;
    tag = document.getElementById("tag").value;

    if (tag != undefined){
        fetch(`/api/getTagRef?full_name=${tag}`, {
            method: "GET"
        }).then(response => response.text().then((tagRef) => {
            var data = {
                taskID: taskID,
                tag: tagRef
            }
            console.log(data);
            fetch('/api/modifyTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then(response => response.text().then((text) => {
                setSuccess(text);
            }).catch((error) => {
                setError(error);
            }));
        }));
    }
}

function editDescription(){
    clearMessageBox();
    
    taskID = document.getElementById("taskID").innerHTML;
    description = document.getElementById("description").value;
    if (description != undefined){
        var data = {
            taskID: taskID,
            description: description
        }
        fetch('/api/modifyTask', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => response.text().then((text) => {
            setSuccess(text);
        }).catch((error) => {
            setError(error);
        }));
    }
}

function editWorkingDays(){
    clearMessageBox();

    taskID = document.getElementById("taskID").innerHTML;
    scheduledTimeStart = document.getElementById("scheduledTimeStart").value;
    scheduledTimeEnd = document.getElementById("scheduledTimeEnd").value;
    
    if (scheduledTimeEnd != undefined || scheduledTimeStart != undefined ) {
        var data = {
            taskID: taskID
        }

        if (scheduledTimeStart != undefined){
            data['scheduledTimeStart'] = scheduledTimeStart
        }
        if (scheduledTimeEnd != undefined){
            data['scheduledTimeEnd'] = scheduledTimeEnd
        }
        fetch('/api/modifyTask', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => response.text().then((text) => {
            setSuccess(text);
        }).catch((error) => {
            setError(error);
        }));
    }
}

function editEstTime(){
    clearMessageBox();

    taskID = document.getElementById("taskID").innerHTML;
    estTime = document.getElementById("estTime").value;
    var data = {
        taskID: taskID,
        estTime: estTime
    }
    fetch('/api/modifyTask', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.text().then((text) => {
        setSuccess(text);
    }).catch((error) => {
        setError(error);
    }));
}

function editDueDate(){
    clearMessageBox();

    taskID = document.getElementById("taskID").innerHTML;
    dueDate = document.getElementById("dueDate").value;
    var data = {
        taskID: taskID,
        dueDate: dueDate
    }
    fetch('/api/modifyTask', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.text().then((text) => {
        setSuccess(text);
    }).catch((error) => {
        setError(error);
    }));
}

function editPriority(){
    clearMessageBox();

    taskID = document.getElementById("taskID").innerHTML;
    priority = document.getElementById("priority").value;
    var data = {
        taskID: taskID,
        priority: priority
    }
    fetch('/api/modifyTask', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.text().then((text) => {
        setSuccess(text);
    }).catch((error) => {
        setError(error);
    }));
}

function markComplete(){
    clearMessageBox();

    taskID = document.getElementById("taskID").innerHTML;
    var data = {
        taskID: taskID,
        completed: true
    }
    fetch('/api/modifyTask', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.text().then((text) => {
        setSuccess(text);
    }).catch((error) => {
        setError(error);
    }));
}

function markIncomplete(){
    clearMessageBox();

    taskID = document.getElementById("taskID").innerHTML;
    var data = {
        taskID: taskID,
        completed: false
    }
    fetch('/api/modifyTask', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.text().then((text) => {
        setSuccess(text);
    }).catch((error) => {
        setError(error);
    }));
}

function editAll(){
    clearMessageBox();

    taskID = document.getElementById("taskID").innerHTML;
    tag = document.getElementById("tag").value;
    description = document.getElementById("description").value;
    scheduledTimeStart = document.getElementById("scheduledTimeStart").value;
    scheduledTimeEnd = document.getElementById("scheduledTimeEnd").value; 
    estTime = document.getElementById("estTime").value;
    dueDate = document.getElementById("dueDate").value;
    priority = document.getElementById("priority").value;
    
    if (tag != undefined){
        fetch(`/api/getTagRef?full_name=${tag}`, {
            method: "GET"
        }).then(response => response.text().then((tagRef) => {
            var data = {
                taskID: taskID,
                tag: tagRef
            }
            if (description != undefined){
                data['description'] = description
            }
            if (scheduledTimeStart != undefined){
                data['scheduledTimeStart'] = scheduledTimeStart
            }
            if (scheduledTimeEnd != undefined){
                data['scheduledTimeEnd'] = scheduledTimeEnd
            }
            if (estTime != undefined){
                data['estTime'] = estTime
            }
            if (dueDate != undefined){
                data['dueDate'] = dueDate
            }
            if (priority != undefined){
                data['priority'] = priority
            }
            fetch('/api/modifyTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then(response => response.text().then((text) => {
                setSuccess(text);
            }).catch((error) => {
                setError(error);
            }));
        }));
    } else {
        var data = {
            taskID: taskID,
            tag: tagRef
        }
        if (description != undefined){
            data['description'] = description
        }
        if (scheduledTimeStart != undefined){
            data['scheduledTimeStart'] = scheduledTimeStart
        }
        if (scheduledTimeEnd != undefined){
            data['scheduledTimeEnd'] = scheduledTimeEnd
        }
        if (estTime != undefined){
            data['estTime'] = estTime
        }
        if (dueDate != undefined){
            data['dueDate'] = dueDate
        }
        if (priority != undefined){
            data['priority'] = priority
        }
        fetch('/api/modifyTask', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => response.text().then((text) => {
            setSuccess(text);
        }).catch((error) => {
            setError(error);
        }));
    }
}

function setError(error){
    document.getElementById("alertbox").hidden = false;
    document.getElementById("alertbox").classList.add("alert-danger");
    document.getElementById("alertbox").innerHTML = document.getElementById("alertbox").innerHTML + error.message;
    setTimeout(() => {  window.location.reload(); }, 2500);
}

function setSuccess(text){
    document.getElementById("alertbox").hidden = false;
    document.getElementById("alertbox").classList.add("alert-success");
    document.getElementById("alertbox").innerHTML = document.getElementById("alertbox").innerHTML + text;
    setTimeout(() => {  window.location.reload(); }, 2500);
}

function clearMessageBox(){
    document.getElementById("alertbox").hidden = true;
    document.getElementById("alertbox").classList.remove("alert-danger");
    document.getElementById("alertbox").classList.remove("alert-success");
    document.getElementById("alertbox").innerHTML = document.getElementById("alertbox").innerHTML = 
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\
        <span aria-hidden=\"true\">&times;</span>\
        </button>"
}