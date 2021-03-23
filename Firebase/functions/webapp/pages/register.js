module.exports = function (admin, app) {
    app.get('/register', (request, response) => {
        if (request.signedin) {
            response.redirect('/');
        } else {
            response.status(200).render('register');
        }
    });
}