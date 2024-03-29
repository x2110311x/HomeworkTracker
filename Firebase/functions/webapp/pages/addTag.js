const fetch = require('node-fetch');

module.exports =
/**
 * @description Retrieves the course categories and renders the page for a user to add a tag. If not signed in, redirects to the homepage.
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
 function addTag(admin, app) {
    app.get('/addTag', (request, response) => {
        if (request.signedin) {
            var url = "https://homeworktracker-b9805.web.app";
            //var url = `http://localhost:5000`;
            fetch(`${url}/api/getCategories`, {
                method: 'GET',
                headers: {
                    'cookie': `__session=${request.cookies.__session}`
                }
            }).then((categoriesResp) => {
                categoriesResp.text().then((rawjson) => {
                    var categories = JSON.parse(rawjson);
                    response.status(200).render('addTag', {category: categories});
                })
            }).catch((error) => {
                console.error(`Error retrieving categories: ${error}`);
                response.status(500).send(`Error retrieving categories: ${error}`);
            });
        } else {
            response.redirect('/');
        }
    });
};