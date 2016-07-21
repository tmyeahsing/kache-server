'use strict';
var router = require('express').Router();
var AV = require('leanengine');

// 新增 Todo 项目
router.get('/', function(req, res, next) {
  if(req.currentUser) {
    res.send(req.currentUser);
  } else {
    res.loginAndRedirectBack();
  }
});

module.exports = router;
