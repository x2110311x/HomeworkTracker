
module.exports = 
/**
 * @description Renders the freetime page. If they're not signed in, redirects to the homepage
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function freetime(admin, app) {
    app.get('/freetime', (request, response) => {
        if (request.signedin) {
            try {
            let user = request.decodedClaims;
            /*
            var searchWeek = request.week_info.text;
            searchWeek = searchWeek.split('{')[1];
            searchWeek = searchWeek.split('-')[0];
            searchWeek = searchWeek + ", 2020";
            var searchDate = new Date(searchWeek);
            var searchString = (searchDate.getMonth() < 10 ? '0' + searchDate.getMonth() : searchDate.getMonth());
            searchString += (searchDate.getDay() < 10 ? '0' + searchDate.getDay() : searchDate.getDay());
            // need a way to retrieve year
            searchString += "2021";
            */
            var dateTmp = "04-05-2021"
            var day = {
                Monday:
                    [
                        { start: "9:00", end: "10:00" },
                        { start: "12:00", end: "1:00" },
                        { start: "3:00", end: "4:00" },
                        { start: "4:00", end: "5:00" },
                        { start: "6:00", end: "7:00" },
                        { start: "9:00", end: "10:00" }
                    ],
                Tuesday:
                    [
                        { start: "9:00", end: "10:00" }
                    ],
                Thursday:
                    [
                        { start: "6:00", end: "7:00" },
                        { start: "9:00", end: "10:00" }
                    ]
                };

            return admin.firestore().collection('Users').doc(user.uid).collection('freetime').doc(dateTmp).get()
                .then(snapshot => {
                    /*
                     foreach((item) => {
                        const data = item.data();
                        day = data;

                    });
                    */
                    response.status(200).render('freetime', { days: day });
                })
            } catch (error) {
                console.error(`Error retrieving freetime`);
                response.status(500).send(error);
            }
        } else {
            response.redirect('/');
        }
    });
};