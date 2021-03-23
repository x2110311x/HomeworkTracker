module.exports = function (admin, app) {
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