module.exports = 
/**
 * @description Deletes the session cookie and redirects the user to the homepage
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function logout(admin, app){
    app.get('/logout', (request, response) => {
        response.clearCookie('__session');
        response.redirect('/');
    });
}