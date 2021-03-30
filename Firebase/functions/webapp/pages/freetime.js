const fetch = require('node-fetch');

module.exports = function (admin, app) {
    app.get('/freetime', (request, response) => {
        if (request.signedin) {     
                    response.status(200).render('freetime');
        } else {
            response.redirect('/');
        }
    });
};