module.exports = function (admin, app) {
    app.get('/addTask', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            response.render('addTask');
        } else {
            response.redirect('/');
        }
    });
}