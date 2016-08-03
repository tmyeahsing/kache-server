'use strict';
var router = require('express').Router();
var wapi = require('../bootstrap/wechat-api');

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

module.exports = router;
