'use strict';
var url = require('url');
var OAuth = require('wechat-oauth');
var router = require('express').Router();
var config = require('../config/wechat_config');
var client = new OAuth(config.appId, config.appSecret);
var AV = require('leanengine');

router.get('/login', function(req, res, next) {
	var redir_url = req.getPathWithHostName('/redir_code')
	var we_redirect_url = client.getAuthorizeURL(redir_url, '', 'snsapi_userinfo');
	res.redirect(we_redirect_url);
})

router.get('/login_pc', function(req, res, next) {
	var redir_url = req.getPathWithHostName('/redir_code')
	var we_redirect_url = client.getAuthorizeURLForWebsite(redir_url, '');
	res.redirect(we_redirect_url)
})

router.get('/redir_code', function(req, res, next) {
	if(req.query.code) {
		client.getAccessToken(req.query.code, function (err, result) {
		  if(err) {
		  	return next(err)
		  }
		  AV.User._logInWith('weixin', {authData: result.data})
		  	.then(function(user) {
		  		res.saveCurrentUser(user);
		  		res.redirAfterLogin();
		  		return user
		  	}, function(error) {
		  		next(error)
		  	})
		  	.then(function(user) { // 异步操作，保存用户微信信息（头像、昵称等）
		  		client.getUser(result.data.openid, function (err, result) {
		  		  var userInfo = result;
		  		  user.set('info', {weixin: result})
		  		  user.save()
		  		});
		  	})
		});
	} else {
		next('no code query')
	}
})

module.exports = router;
