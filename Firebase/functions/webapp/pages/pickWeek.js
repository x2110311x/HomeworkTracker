module.exports = 
/**
 * @description Renders the week picker. If they're not signed in, redirects to the homepage
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function pickWeek(admin, app) {
    app.get('/pickWeek', (request, response) => {
        if (request.signedin) {
            let user = request.decodedClaims;
            admin.firestore().collection('Users').doc(user.uid).collection('freetime').listDocuments()
                .then((snap) => {
                    var weeks = [];
                    snap.forEach((item) => {
                        var startDate = new Date(item.id);
                        var endDate = new Date(item.id);
                        endDate.setDate(endDate.getDate() + 6);
                        var startDateStr = startDate.getMonth() + '-' + startDate.getDate() + '-' + startDate.getYear()
                        var daterange = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                        weeks.push({
                            weekstart: item.id,
                            daterange: daterange
                        });
                    });
                    response.status(200).render('pickWeek', {week: weeks});
                })
        } else {
            response.redirect('/');
        }
    });
};