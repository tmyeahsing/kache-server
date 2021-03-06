'use strict';
var router = require('express').Router();
var wapi = require('../bootstrap/wechat-api')

//host
var hostname = '1ehesmbxkn.proxy.qqbrowser.cc';
var hostname = 'kache.tmued.com';


router.post('/custom', function(req, res, next){
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

router.get('/',  function(req, res, next){
	wapi.getMenu(function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
})

router.get('/config',  function(req, res, next){
	wapi.getMenuConfig(function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
})

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

//删除所有菜单
router.delete('/', function(req, res, next){
	wapi.removeMenu(function(err, result){
		console.log(result)
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
})

//删除所有个性化菜单
router.delete('/custom', function(req, res, next){
	var menu_id = req.body.id;
	wapi.removeCustomMenu(menu_id, function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
})

module.exports = router;
