module.exports = 
/**
 * @description Retrieves data and renders page to edit a tag. If not signed in, redirects to the homepage.
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} app - Our instance of Express.js
 */
function editTag(admin, app) {
    app.get('/editTag', (request, response) => {
        if (request.signedin) {
          //  let user = request.decodedClaims;
          //  var taskID = request.query.id;
         //   admin.firestore().collection('Users').doc(user.uid).collection('tasks').doc(taskID).get()
        //    .then((snap) => {
          //      var data = snap.data();
                var tag = {
                    full_name: "FullName",
                    short_name: "ShortName",
                    color: "#565555"
                }
        
                    response.status(200).render('editTag', {tag: tag});
            }
            else {
                response.redirect('/');
            }
        });
        } 
