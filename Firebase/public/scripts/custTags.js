function addCustTag() {
    document.getElementById("alertbox").hidden = true;
    document.getElementById("alertbox").classList.remove("alert-danger");
    document.getElementById("alertbox").classList.remove("alert-success");

    var data = {
        color: document.getElementById("color").value,
        full_name: document.getElementById("tag_title").value,
        short_name: document.getElementById("nickname").value,
    };

    fetch('/api/addCustTag', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.text().then((text) => {
        document.getElementById("alertbox").hidden = false;
        document.getElementById("alertbox").classList.add("alert-success");
        document.getElementById("alertbox").innerHTML = document.getElementById("alertbox").innerHTML + text;
    })).catch((error) => {
        document.getElementById("alertbox").hidden = false;
        document.getElementById("alertbox").classList.add("alert-danger");
        document.getElementById("alertbox").innerHTML = document.getElementById("alertbox").innerHTML + error.message;
    });
}