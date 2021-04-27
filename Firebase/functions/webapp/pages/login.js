module.exports = 
/**
 * @description Renders the login page If they're signed in, redirects to the homepage
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function login(admin, app) {
    app.get('/login', (request, response) => {
        if (request.signedin) {
            response.redirect('/');
        } else {
            response.status(200).render('login');
        }
    });
}