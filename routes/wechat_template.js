'use strict';
var router = require('express').Router();
var wapi = require('../bootstrap/wechat-api');
var notifyAdminWhenSign = '有新的报修单，请立即处理！';
var notifyCreatorWhenSign = '订单提交成功，工作人员会迅速联系您，请耐心等待！';

//host
var hostname = '1ehesmbxkn.proxy.qqbrowser.cc';
//var hostname = 'ajosvckglb.proxy.qqbrowser.cc';

router.post('/industry', function(req, res, next){
	var industry_id1 = req.body.id1;
	var industry_id2 = req.body.id2;
	var industryIds = {
		"industry_id1": industry_id1,
		"industry_id2": industry_id2
	}
	wapi.setIndustry(industryIds, function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
});

router.get('/industry', function(req, res, next){
	wapi.getIndustry(function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
});

router.post('/template', function(req, res, next){
	var templateIdShort = req.body.id;
	wapi.addTemplate(templateIdShort, function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
});

router.get('/all_template', function(req, res, next){
	wapi.getAllPrivateTemplate(function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
});

router.post('/notify_sign', function(req, res, next){
	var templateId =  'j4j18Eq7T5pWNe6n28jmDGe4GUzuZfRM7Lsmcemrrxk';
	var url = req.body.url;
	var openid = req.body.openid;
	var target = req.body.target;

	var data = {
		"first": {
			"value":target == 'admin' ? notifyAdminWhenSign : notifyCreatorWhenSign,
			"color":"#ff0000"
		},
		"name":{
			"value":"报修单",
			"color":"#173177"
		},
		"expDate": {
			"value":"（截止时间）",
			"color":"#173177"
		},
		"remark":{
			"value":"测试而已！订单号:" + req.body.orderId,
			"color":"#ff00ff"
		}
	};
	wapi.sendTemplate(openid, templateId, url, data, function(err, result){
		if(!err){
			res.send(result)
		}else{
			res.send(err)
		}
	});
});

module.exports = router;
