const fetch = require('node-fetch');

module.exports = function (admin, router) {
    router.get('/getTag', (request, response) => {
        if (request.signedin) {
            var tagid = request.query.tagid;
            //var url = `https://${request.hostname}`;
            var url = `http://localhost:5000`;
            fetch(`${url}/api/getTagRef?full_name=${tagid}`, {
                method: 'GET',
                headers: {
                    'cookie': `__session=${request.cookies.__session}`
                }
            }).then((tagpath) => {
                tagpath.text().then((path) => {
                    if (path == "No matching tags"){
                        response.status(404).send(path);
                    } else {
                        console.log(path);
                        admin.firestore().doc(path).get().then(snapshot => {
                            response.send(snapshot.data());
                        }).catch((error) => {
                            console.error("Error retrieving tags: ", error);
                            response.status(500).send("Error retrieving tags: ", error.message);
                        });
                    }
                })
            }).catch((error) => {
                console.error("Error retrieving tags: ", error);
                response.status(500).send("Error retrieving tags: ", error.message);
            });
        }
        else{
            response.status(403).send("Unauthorized");
        }
    });
}