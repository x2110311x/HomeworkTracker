const fetch = require('node-fetch');

module.exports = 
/**
 * @description Retrieves data and renders page to edit a tag. If not signed in, redirects to the homepage.
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function editTag(admin, app) {
    app.get('/editTag', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            var tagID = request.query.id;
            if (tagID != undefined){
                admin.firestore().collection('Users').doc(user.uid).collection('tags').doc(tagID).get()
                .then((snap) => {
                    var data = snap.data();
                    var tag = {
                        full_name: data['full_name'],
                        short_name: data['short_name'],
                        color: data['color'],
                        id: tagID
                    };
                    response.status(200).render('editTag', {tag: tag});
                });
            } else{
                var url = "https://homeworktracker-b9805.web.app";
                fetch(`${url}/api/getTags`, {
                    method: 'GET',
                    headers: {
                        'cookie': `__session=${request.cookies.__session}`
                    }
                }).then((tagResp) => {
                    tagResp.text().then((rawjson) => {
                        var tags = JSON.parse(rawjson);
                        response.status(200).render('editTag', {tags: tags});
                    })
                }).catch((error) => {
                    console.error(`Error retrieving categories: ${error}`);
                    response.status(500).send(`Error retrieving categories: ${error}`);
                });
            }
        } else {
            response.redirect('/');
        }
    });
}
