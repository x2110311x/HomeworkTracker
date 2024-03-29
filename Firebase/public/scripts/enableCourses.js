function enableCourses() {
    document.getElementById("search_category").disabled = false;   
    document.getElementById("search_category").placeholder = "Search courses";   
    var category = document.getElementById('categories').value;
    fetch(`/api/getCoursesByCategory?shortName=${category}`, {
        method: "GET",
    }).then(response => response.text().then((text) => {
        const courseArray = JSON.parse(text);
        var courses = [];
        courseArray.forEach(course => {
            courses.push(`${course.full_name}`)
        });
        autocomplete(document.getElementById("search_category"), courses);
    }));
}