const fetch = require('node-fetch');

module.exports = function (admin, router) {
    router.get('/getTag', (request, response) => {
        if (request.signedin) {
            var tagid = request.query.tagid;
            fetch(`https://${request.hostname}/api/getTagRef?full_name=${full_name}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'cookie': req.cookies.__session
                }
            }).then((tagid) => {
                admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tags').doc(tagid).get()
                .then(snapshot => {
                    return response.send(snapshot.data());
                })
            }).catch((error) => {
                console.error("Error retrieving tags: ", error);
                response.send(500).send("Error retrieving tags: ", error.message);
            });
        }
        else{
            response.status(403).send("Unauthorized");
        }
    });
}