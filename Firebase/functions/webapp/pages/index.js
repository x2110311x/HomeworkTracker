const express         = require('express');
const admin     	  = require('firebase-admin');

module.exports = function(app){
    app.get('/', (request, response) => {
        if (request.signedin) {
            admin.auth().getUser(request.decodedClaims.uid).then((user) => {
                if (user.name == null){
                    var uname = user.displayName;
                } else {
                    var uname = user.name;
                }
                response.render('loggedin', {name: uname});
            });
        } else {
            response.render('loggedout');
        }
    });

    require("./account.js")(admin, app);
    require("./addTag.js")(admin, app);
    require("./addTask.js")(admin, app);
    require("./login.js")(admin, app);
    require("./logout.js")(admin, app);
    require("./sessionLogin.js")(admin, app);
    require("./delete-account.js")(admin, app);
    require("./viewTasks.js")(admin, app);
    require("./register.js")(admin, app);
    require("./reset.js")(admin, app);

    app.get('*', function (request, response) { // THIS MUST STAY LAST. HANDLES 404s
        response.status(404).render('404');
    });
};