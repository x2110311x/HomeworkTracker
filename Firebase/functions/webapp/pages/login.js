module.exports = function (admin, app) {
    app.get('/login', (request, response) => {
        if (request.signedin) {
            response.redirect('/');
        } else {
            response.render('login');
        }
    });
}