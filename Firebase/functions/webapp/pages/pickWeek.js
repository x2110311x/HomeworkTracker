const fetch = require('node-fetch');

module.exports = function (admin, app) {
    app.get('/pickWeek', (request, response) => {
        if (request.signedin) {     
                    response.status(200).render('pickWeek');
        } else {
            response.redirect('/');
        }
    });
};