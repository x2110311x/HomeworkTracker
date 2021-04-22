module.exports = 
/**
 * @description Renders the password reset page
  * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function reset(admin, app) {
    app.get('/reset', (request, response) => {
        response.status(200).render('reset');
    });
}