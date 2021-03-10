module.exports = function(admin, app) {
    app.get('/reset', (request, response) => {
        response.render('reset');
    });
}