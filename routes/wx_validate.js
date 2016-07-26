'use strict';
var router = require('express').Router();

router.get('/', function (req, res, next) {
    res.send(req.query.echostr);
});

module.exports = router;
