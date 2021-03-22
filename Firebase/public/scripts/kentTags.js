function addKentTag() {
    document.getElementById("alertbox").hidden = true;
    document.getElementById("alertbox").classList.remove("alert-danger");
    document.getElementById("alertbox").classList.remove("alert-success");

    var data = {
        color: document.getElementById("KSU_color").value,
        category: document.getElementById("categories").value,
        full_name: document.getElementById("search_category").value,
    };
    console.log(data);

    // Questionable portion
    fetch(`/api/getCourseByName?full_name=${data.full_name}&category=${data.category}`, {
        method: "GET"
    }).then(response => response.text().then((text) => {
        if (text == 'No matching documents'){
            document.getElementById("alertbox").hidden = false;
            document.getElementById("alertbox").classList.add("alert-danger");
            document.getElementById("alertbox").innerHTML = 'Invalid Course'; 
        } else {
            var courseData = JSON.parse(text);
            data.short_name = courseData.short_name;
            console.log(data);
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
    }));
}