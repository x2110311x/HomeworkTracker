function addKentTag() {
    document.getElementById("alertbox").hidden = true;
    document.getElementById("alertbox").classList.remove("alert-danger");
    document.getElementById("alertbox").classList.remove("alert-success");

    var data = {
        color: document.getElementById("KSU_color").value,
        full_name: document.getElementById("course_name").value,
        short_name: "",
    };





    // Questionable portion
    fetch('getCourseNamed', {
        method: "GET",
        headers: {
            'full_name': data.full_name,
        }
    }).then(response => response.text().then((text) => {
        data.short_name = response.short_name;
        document.getElementById("alertbox").hidden = false;
        document.getElementById("alertbox").classList.add("alert-success");
        document.getElementById("alertbox").innerHTML = text;
    })).catch((error) => {
        document.getElementById("alertbox").hidden = false;
        document.getElementById("alertbox").classList.add("alert-danger");
        document.getElementById("alertbox").innerHTML = error.message;
    });






    fetch('/api/addCustTag', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.text().then((text) => {
        document.getElementById("alertbox").hidden = false;
        document.getElementById("alertbox").classList.add("alert-success");
        document.getElementById("alertbox").innerHTML = text;
    })).catch((error) => {
        document.getElementById("alertbox").hidden = false;
        document.getElementById("alertbox").classList.add("alert-danger");
        document.getElementById("alertbox").innerHTML = error.message;
    });
}