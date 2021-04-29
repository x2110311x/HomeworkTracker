function addSlot(day){
    if (day == "Monday"){
        var startTime = document.getElementById('MON_start_time').value;
        var endTime = document.getElementById('MON_end_time').value;
        apiAddSlot(day, startTime, endTime);
    } else if (day == "Tuesday"){
        var startTime = document.getElementById('TUE_start_time').value;
        var endTime = document.getElementById('TUE_end_time').value;
        apiAddSlot(day, startTime, endTime)
    } else if (day == "Wednesday"){
        var startTime = document.getElementById('WED_start_time').value;
        var endTime = document.getElementById('WED_end_time').value;
        apiAddSlot(day, startTime, endTime)
    } else if (day == "Thursday"){
        var startTime = document.getElementById('THUR_start_time').value;
        var endTime = document.getElementById('THUR_end_time').value;
        apiAddSlot(day, startTime, endTime)
    } else if (day == "Friday"){
        var startTime = document.getElementById('FRI_start_time').value;
        var endTime = document.getElementById('FRI_end_time').value;
        apiAddSlot(day, startTime, endTime)
    } else if (day == "Saturday"){
        var startTime = document.getElementById('SAT_start_time').value;
        var endTime = document.getElementById('SAT_end_time').value;
        apiAddSlot(day, startTime, endTime)
    } else if (day == "Sunday"){
        var startTime = document.getElementById('SUN_start_time').value;
        var endTime = document.getElementById('SUN_end_time').value;
        apiAddSlot(day, startTime, endTime)
    }
}

function apiAddSlot(day, startTime, endTime){
    var week = document.getElementById('weekid').innerText;
    clearMessageBox();
    var data = {
        week: week,
        day: day,
        startTime: startTime,
        endTime: endTime
    };
    console.log(data);
    fetch('/api/addFreetime', {
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
