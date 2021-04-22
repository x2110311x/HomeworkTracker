module.exports = 
/**
 * @description Renders the week picker. If they're not signed in, redirects to the homepage
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function pickWeek(admin, app) {
    app.get('/pickWeek', (request, response) => {
        if (request.signedin) {     
                    response.status(200).render('pickWeek');
        } else {
            response.redirect('/');
        }
    });
};