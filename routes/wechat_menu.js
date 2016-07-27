'use strict';
var router = require('express').Router();
var config = require('../config/wechat_config')
var api = require('wechat-api');
var wapi = new api(config.appId, config.appSecret)

//host
var hostname = '1ehesmbxkn.proxy.qqbrowser.cc';
var hostname = 'ajosvckglb.proxy.qqbrowser.cc';

router.put('/', function(req, res, next) {
	wapi.createMenu({
		button: [
			{
				"type": 'view',
				"name":'我要报修',
				"url":'http://'+ hostname +'/fast_sign.html'
			},
			{
				"type": 'view',
				"name":'我的订单',
				"url":'http://'+ hostname +'/order_list.html'
			}
		]
	}, function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
});

router.put('/custom', function(req, res, next){
	wapi.createCustomMenu({
		button: [
			{
				"type": 'view',
				"name":'订单管理',
				"url":'http://'+ hostname +'/order_list_admin.html'
			}
		],
		matchrule: {
			"group_id":"100"
	   	}
	}, function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
})

module.exports = router;
