module.exports = function (admin, app) {
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
