module.exports = function (admin, router) {
    router.get('/getCourses', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    let responseData = [];
                    return admin.firestore().collection('Courses').get()
                    .then((snapshot) => {
                        snapshot.forEach((item) => {
                            responseData.push(item.data());
                        });
                        return response.send(responseData);
                    });
                } catch (error) {
                    console.error("Error retrieving courses: ", error);
                    response.send(500).send("Error retrieving courses: ", error.message);
                }
            }
            else {
                response.status(403).send("Unauthorized");
            }
        })();
    });
}