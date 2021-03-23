const fetch = require('node-fetch');

module.exports = function (admin, app) {
    app.get('/addTask', (request, response) => {
        if (request.signedin) {
            var url = `https://${request.hostname}`;
            //var url = `http://localhost:5000`;
            fetch(`${url}/api/getTags`, {
                method: 'GET',
                headers: {
                    'cookie': `__session=${request.cookies.__session}`
                }
            }).then((tagResp) => {
                tagResp.text().then((rawjson) => {
                    var tags = JSON.parse(rawjson);
                    response.render('addTask', {tag: tags});
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