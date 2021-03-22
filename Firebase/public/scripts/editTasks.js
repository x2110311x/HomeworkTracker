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
    alert("NOT IMPLEMENTED");
}

function editDescription(){
    alert("NOT IMPLEMENTED");
}

function editWorkingDays(){
    alert("NOT IMPLEMENTED");
}

function editEstTime(){
    alert("NOT IMPLEMENTED");
}

function editDueDate(){
    alert("NOT IMPLEMENTED");
}

function editPriority(){
    alert("NOT IMPLEMENTED");
}

function markComplete(){
    alert("NOT IMPLEMENTED");
}

function editAll(){
    alert("NOT IMPLEMENTED");
}