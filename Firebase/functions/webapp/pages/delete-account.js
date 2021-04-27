module.exports = 
/**
 * @alias delete-account
 * @description Deletes a user's account If not signed in, redirects to the homepage.
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function deleteaccount(admin, app) {
    app.get('/delete-account', (request, response) => {
        if (request.signedin){
            let user = request.decodedClaims;
            admin.auth().deleteUser(user.uid).then(() => {
                response.redirect('/logout');
            }).catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                response.status(200).send(errorMessage);
            });
        } else {
            response.redirect('/');
        }
    });
}