module.exports = 
/**
 * @description Renders the registration page. If they're signed in, redirects to the homepage
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function register(admin, app) {
    app.get('/register', (request, response) => {
        if (request.signedin) {
            response.redirect('/');
        } else {
            response.status(200).render('register');
        }
    });
}