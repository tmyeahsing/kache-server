'use strict';
var router = require('express').Router();
var wapi = require('../bootstrap/wechat-api');
var request = require('request');
var xmljson = require('xmljson');
var to_json = xmljson.to_json;
var to_xml = xmljson.to_xml;

router.post('/unifiedorder', function(req, res, next){
	var param = {
		debug: false
	};
	to_xml(JSON.stringify(param), function(err, xml){
		console.log(err)
		console.log(xml)
	});
});

module.exports = router;
