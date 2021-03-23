const fetch = require('node-fetch');

module.exports = function (admin, router) {
    router.post('/addTagToTask', (request, response) => {
        if (request.signedin) {
            var tagname = request.body.tag_name;
            var taskname = request.body.task_name;
            var url = "https://homeworktracker-b9805.web.app";
            //var url = `http://localhost:5000`;
            fetch(`${url}/api/getTagRef?full_name=${tagname}`, {
                method: 'GET',
                headers: {
                    'cookie': `__session=${request.cookies.__session}`
                }
            }).then((resp) => {
                resp.text().then((tagref) => {
                    admin.firestore().collection('Users')
                        .doc(request.decodedClaims.uid).collection('tasks')
                        .where('name', '==', taskname).limit(1).get().then((snap) => {
                            snap.docs[0].ref.update({ tag: tagref }).then(() => {
                                response.status(200).send("Tag added successfully");
                            });
                        }).catch(error => {
                            console.error(`Error retrieving task: ${error}`);
                            response.status(500).send(`Error retrieving task: ${error}`);
                        });
                })
            }).catch(error => {
                console.error(`Error retrieving tag: ${error}`);
                response.status(500).send(`Error retrieving tag: ${error}`);
            });
        } else {
            response.status(403).send("Unauthorized");
        }
    });
}