module.exports = function(admin, app) {
    app.get('/reset', (request, response) => {
        response.status(200).render('reset');
    });
}