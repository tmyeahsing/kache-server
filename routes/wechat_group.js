'use strict';
var router = require('express').Router();
var config = require('../config/wechat_config')
var api = require('wechat-api');
var wapi = new api(config.appId, config.appSecret)

router.post('/', function(req, res, next) {
	var name = req.body.group_name;
	wapi.createGroup(name, function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
});

router.post('/move_user_to', function(req, res, next){
	var openid = req.body.openid;
	var groupId = parseInt(req.body.group_id);
	wapi.moveUserToGroup(openid, groupId, function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
})

module.exports = router;
