module.exports = function (admin, router) {
    router.get('/getTag', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    var tagid = request.query.tagid;
                    return admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tags').doc(tagid).get()
                    .then(snapshot => {
                        return response.send(snapshot.data());
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