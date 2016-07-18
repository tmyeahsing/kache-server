'use strict';
var router = require('express').Router();

// 查询 Todo 列表
router.get('/', function (req, res, next) {
    res.send(req.query.echostr);
});

router.post('/', function (req, res, next) {
    console.log(req)
    console.log(req.body)
    res.send(req.query.echostr);
});

module.exports = router;
