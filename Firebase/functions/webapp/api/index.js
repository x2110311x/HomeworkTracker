var express = require('express')
var router = express.Router()

router.get('*', function (req, res) {
    res.send("You've reached the API");
});

module.exports = router