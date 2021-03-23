module.exports = function (admin, router) {
    router.get('/getCoursesByCategory', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    let shortName = request.query.shortName;
                    let responseData = [];
                    return admin.firestore().collection('Courses').doc(shortName).collection('courses').get()
                    .then(snapshot => {
                        snapshot.forEach((item) => {
                            responseData.push(item.data());
                        });
                        return response.status(200).send(responseData);
                    });
                } catch (error) {
                    console.error("Error retrieving tags: ", error);
                    response.status(500).send("Error retrieving tags: ", error.message);
                }
            }
            else{
                response.status(403).send("Unauthorized");
            }
        })();
    });
}