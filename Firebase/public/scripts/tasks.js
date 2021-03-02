function addTask(){
    document.getElementById("alertbox").hidden = true;
    document.getElementById("alertbox").classList.remove("alert-danger");
    document.getElementById("alertbox").classList.remove("alert-success");

    var data = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        tag: document.getElementById("tag").value,
        dueDate: document.getElementById("dueDate").value,
        priority: document.getElementById("priority").value,
        estTime: document.getElementById("estTime").value,
        scheduledTimeStart: document.getElementById("scheduledTimeStart").value,
        scheduledTimeEnd: document.getElementById("scheduledTimeEnd").value
    };

    fetch('/addTask', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.text().then((text) => {
        document.getElementById("alertbox").hidden = false;
        document.getElementById("alertbox").classList.add("alert-success");
        document.getElementById("alertbox").innerHTML = text;
    })).catch((error) =>{
        document.getElementById("alertbox").hidden = false;
        document.getElementById("alertbox").classList.add("alert-danger");
        document.getElementById("alertbox").innerHTML = error.message;
    });
}