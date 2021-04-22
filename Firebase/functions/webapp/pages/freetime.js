
module.exports = 
/**
 * @description Renders the freetime page. If they're not signed in, redirects to the homepage
  * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function freetime(admin, app) {
    app.get('/freetime', (request, response) => {
        if (request.signedin) {     
                    response.status(200).render('freetime');
        } else {
            response.redirect('/');
        }
    });
};