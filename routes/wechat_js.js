'use strict';
var router = require('express').Router();
var wapi = require('../bootstrap/wechat-api')

router.get('/config', function(req, res, next){
	var param = {
		debug: false,
		jsApiList: req.query.api_list,
		url: req.query.url
	};
	wapi.getJsConfig(param, function(err, config){
		if(!err){
			res.send(config);
		}else{
			res.status(500).send({message: 'ªÒ»°sdk≈‰÷√ ß∞‹'});
		}
	});
});

module.exports = router;
