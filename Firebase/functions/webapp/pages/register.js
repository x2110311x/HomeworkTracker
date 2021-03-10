module.exports = function (admin, app) {
    app.get('/register', (request, response) => {
        if (request.signedin) {
            response.redirect('/');
        } else {
            response.render('register');
        }
    });
}