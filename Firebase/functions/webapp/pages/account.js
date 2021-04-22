module.exports = 
/**
 * @description Renders the account page. If the user is signed in, it'll render the page. Otherwise, it'll redirect to the homepage
  * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function account(admin, app) {
    app.get('/account', (request, response) => {
        if (request.signedin) {
            admin.auth().getUser(request.decodedClaims.uid).then((user) => {
                if (user.name == null){
                    var uname = user.displayName;
                } else{
                    var uname = user.name;
                }
                response.status(200).render('acctDetails', {name: uname});
            });
        } else {
            response.redirect('/');
        }
    });
};