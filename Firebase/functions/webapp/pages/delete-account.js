module.exports = function (admin, app) {
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