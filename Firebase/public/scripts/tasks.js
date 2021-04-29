    function addTask(){
        document.getElementById("alertbox").hidden = true;
        document.getElementById("alertbox").classList.remove("alert-danger");
        document.getElementById("alertbox").classList.remove("alert-success");

        var tag = document.getElementById('tagSelect');
        var tag_name= tag.value;
        var data = {
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            dueDate: Date.parse(document.getElementById("dueDate").value) + 14400000,
            priority: document.getElementById("priority").value,
            estTime: document.getElementById("estTime").value,
            scheduledTimeStart: Date.parse(document.getElementById("scheduledTimeStart").value) + 14400000,
            scheduledTimeEnd: Date.parse(document.getElementById("scheduledTimeEnd").value) + 14400000
        };

        fetch(`/api/getTagRef?full_name=${tag_name}`, {
            method: "GET"
        }).then(response => response.text().then((text) => {
            data.tag = text;
            var body = JSON.stringify(data);
            console.log(body);
            fetch('/api/addTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            }).then(response => response.text().then((text) => {
                document.getElementById("alertbox").hidden = false;
                document.getElementById("alertbox").classList.add("alert-success");
                document.getElementById("alertbox").innerHTML = document.getElementById("alertbox").innerHTML + text;
            })).catch((error) =>{
                document.getElementById("alertbox").hidden = false;
                document.getElementById("alertbox").classList.add("alert-danger");
                document.getElementById("alertbox").innerHTML = document.getElementById("alertbox").innerHTML + error.message;
            });
        }))
    }