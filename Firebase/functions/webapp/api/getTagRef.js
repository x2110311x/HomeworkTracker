module.exports = function (admin, router) {
    router.get('/getTagRef', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    var tag_name = request.query.full_name;
                    return admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tags')
                    .where('full_name', '==', tag_name).get()
                        .then((snapshot) => {
                        if (snapshot.empty) {
                            return response.send('No matching tags');
                        } else {
                            return response.send(`/${snapshot.docs[0].ref.path}`);
                        }
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