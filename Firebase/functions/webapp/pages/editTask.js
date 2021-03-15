module.exports = function (admin, app) {
    app.get('/editTask', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            response.render('editTask');
        } else {
            response.redirect('/');
        }
    });
}