module.exports = 
/**
 * @description Completes the sign-in after Firebase auth grants a login token
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function sessionLogin(admin, app) {
    app.get('/sessionLogin', (req, res) => {
        idToken = req.query.idToken
        // Set session expiration to 5 days.
        // Create the session cookie. This will also verify the ID token in the process.
        // The session cookie will have the same claims as the ID token.
        
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        admin.auth().createSessionCookie(idToken, {expiresIn}).then((sessionCookie) => {
            
            // Set cookie policy for session cookie and set in response.
            const options = {maxAge: expiresIn, httpOnly: true, secure: true};
            res.cookie('__session', sessionCookie, options);
            
            admin.auth().verifyIdToken(idToken).then(function(decodedClaims) {
                res.redirect('/');
            });
                
        }, error => {
            res.status(401).send('UNAUTHORIZED REQUEST!');
        });	
    });
}