module.exports = function (admin, router) {
    router.get('/getTags', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    let responseData = [];
                    return admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tags').get(request.tag_id)
                    .then(snapshot => {
                        snapshot.forEach((item) => {
                            responseData.push(item.data());
                        });
                        return response.send(responseData);
                    });
                } catch (error) {
                    console.error("Error retrieving tags: ", error);
                    response.send(500).send("Error retrieving tags: ", error.message);
                }
            }
            else{
                response.status(403).send("Unauthorized");
            }
        })();
    });
}