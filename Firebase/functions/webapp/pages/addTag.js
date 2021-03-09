module.exports = function (admin, app) {
    app.get('/addTag', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            response.render('addTag');
        } else {
            response.redirect('/');
        }
    });
};