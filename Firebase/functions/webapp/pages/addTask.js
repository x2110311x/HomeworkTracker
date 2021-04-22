const fetch = require('node-fetch');

module.exports = 
/**
 * @description Retrieves the User's tags and renders the page for a user to add a task. If not signed in, redirects to the homepage.
  * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function addTask(admin, app) {
    app.get('/addTask', (request, response) => {
        if (request.signedin) {
            var url = "https://homeworktracker-b9805.web.app";
            //var url = `http://localhost:5000`;
            fetch(`${url}/api/getTags`, {
                method: 'GET',
                headers: {
                    'cookie': `__session=${request.cookies.__session}`
                }
            }).then((tagResp) => {
                tagResp.text().then((rawjson) => {
                    var tags = JSON.parse(rawjson);
                    response.status(200).render('addTask', {tag: tags});
                })
            }).catch((error) => {
                console.error(`Error retrieving categories: ${error}`);
                response.status(500).send(`Error retrieving categories: ${error}`);
            });
        } else {
            response.redirect('/');
        }
    });
}