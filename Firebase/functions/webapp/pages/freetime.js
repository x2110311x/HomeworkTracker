
module.exports = 
/**
 * @description Renders the freetime page. If they're not signed in, redirects to the homepage
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function freetime(admin, app) {
    app.get('/freetime', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            var week = request.query.week;

            admin.firestore().collection('Users').doc(user.uid).collection('freetime').doc(week).get()
                .then((snapshot) => {
                    var day = snapshot.data();
                    response.status(200).render('freetime', { week: week, days: day });
                }).catch((error) => {
                console.error(`Error retrieving freetime`);
                response.status(500).send(error);
            });
        } else {
            response.redirect('/');
        }
    });
};