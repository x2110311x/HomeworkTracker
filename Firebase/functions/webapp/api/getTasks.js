module.exports = function (admin, router) {
    router.get('/getTasks', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    let responseData = [];
                    return admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tasks').get()
                    .then(snapshot => {
                        snapshot.forEach((item) => {
                            responseData.push(item.data());
                        });
                        return response.status(200).send(responseData);
                    });
                } catch (error) {
                    console.error("Error retrieving tasks: ", error);
                    response.status(500).send("Error retrieving tasks: ", error.message);
                }
            }
            else{
                response.status(403).send("Unauthorized");
            }
        })();
    });
}