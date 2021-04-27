function editFullName(){
    clearMessageBox();

    tagID = document.getElementById("tagID").innerHTML;
    tagName = document.getElementById("fullName").value;

    var data = {
        tagId: tagID,
        full_name: tagName
    }
    fetch('/api/editTag', {
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

function editShortName(){
    clearMessageBox();

    tagID = document.getElementById("tagID").innerHTML;
    shortName = document.getElementById("shortName").value;

    var data = {
        tagId: tagID,
        short_name: shortName
    }
    fetch('/api/editTag', {
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

function editColor(){
    clearMessageBox();

    tagID = document.getElementById("tagID").innerHTML;
    color = document.getElementById("color").value;

    var data = {
        tagId: tagID,
        color: color
    }
    fetch('/api/editTag', {
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

    tagID = document.getElementById("tagID").innerHTML;
    tagName = document.getElementById("fullName").value;
    shortName = document.getElementById("shortName").value;
    color = document.getElementById("color").value;

    var data = {
        tagId: tagID
    }
    if(tagName != undefined){
        data['full_name'] = tagName;
    }
    if (shortName != undefined){
        data['short_name'] = shortName;
    }
    if (color != undefined){
        data['color'] = color;
    }
    fetch('/api/editTag', {
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

function loadTagEdit(){
    var tag = document.getElementById('tagSelect').value;
    if (tag != undefined){
        fetch(`/api/getTagRef?full_name=${tag}`, {
            method: "GET"
        }).then(response => response.text().then((tagRef) => {
            var path = tagRef.split("/");
            var editTagUrl = `/editTag?id=${path[4]}`;
            console.log(editTagUrl);
            window.location.href = editTagUrl;
        }));
    }
}