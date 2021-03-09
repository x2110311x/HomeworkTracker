module.exports = function (admin, app){
    app.get('/logout', (request, response) => {
        response.clearCookie('__session');
        response.redirect('/');
    });
}