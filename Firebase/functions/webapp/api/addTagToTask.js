module.exports = function (admin, router) {
    router.get('/addTagToTask', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    var tagname = request.query.tag_name;
                    var taskname = request.query.task_name;

                    var tagref = ''
                    try {
                        request.get('/getTagRef', function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                tagref = body;
                            }
                        });
                    } catch (error) {
                        console.error("Error retrieving courses: ", error);
                        response.send(500).send("Error retrieving courses: ", error.message);
                    }

                    const data = {
                        tag: tagref
                    }

                    return admin.firestore().collection('Users')
                    .doc(request.decodedClaims.uid).collection('tasks')
                        .where('name', '==', taskname).set(data, { merge: true })
                } catch (error) {
                    console.error("Error retrieving courses: ", error);
                    response.send(500).send("Error retrieving courses: ", error.message);
                }
            }
            else{
                response.status(403).send("Unauthorized");
            }
        })();
    });
}