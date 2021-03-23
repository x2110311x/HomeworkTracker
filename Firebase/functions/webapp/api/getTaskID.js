module.exports = function (admin, router) {
    router.get('/getTaskID', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    var task_name = request.query.name;
                    return admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tasks')
                    .where('name', '==', task_name).get()
                        .then((snapshot) => {
                        if (snapshot.empty) {
                            return response.status(404).send('No matching tasks');
                        } else {
                            var path = snapshot.docs[0].ref.path.split("/");
                            return response.status(200).send(path[3]);
                        }
                    });
                } catch (error) {
                    console.error(`Error retrieving task: ${error}`);
                    response.status(500).send(`Error retrieving task: ${error}`);
                }
            }
            else{
                response.status(403).send("Unauthorized");
            }
        })();
    });
}