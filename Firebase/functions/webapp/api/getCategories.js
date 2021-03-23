module.exports = function (admin, router) {
    router.get('/getCategories', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    let responseData = [];
                    return admin.firestore().collection('Courses').get()
                    .then((snapshot) => {
                        snapshot.forEach((item) => {
                            responseData.push(item.data());
                        });
                        return response.status(200).send(responseData);
                    });
                } catch (error) {
                    console.error("Error retrieving courses: ", error);
                    response.status(500).send("Error retrieving courses: ", error.message);
                }
            }
            else {
                response.status(403).send("Unauthorized");
            }
        })();
    });
}