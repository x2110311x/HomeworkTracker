var express = require('express')
var router = express.Router()
const admin = require('firebase-admin');

require("./addCustTag.js")(admin, router);
require("./addTask.js")(admin, router);
require("./addTagToTask.js")(admin, router);
require("./getTasks.js")(admin, router);
require("./getTags.js")(admin, router);
require("./getTag.js")(admin, router);
require("./getCourseByName.js")(admin, router);
require("./getCategories.js")(admin, router);
require("./getTagRef.js")(admin, router);

router.get('*', function (req, res) {
    res.send("Unknown request");
});

module.exports = router