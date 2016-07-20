'use strict';
var url = require('url')

module.exports = function(req, res, next) {
	res.loginAndRedirectBack = function() {
		req.session.login_redir = req.originalUrl
		res.redirect('/wechat/login')
	}
	res.redirAfterLogin = function() {
		var redir = req.session.login_redir || '/'
		req.session.login_redir = null // clear redir cookie
		res.redirect(redir)
	}
	req.getPathWithHostName = function(path) {
		return url.format({
			protocol: req.protocol,
			host: req.hostname,
			pathname: req.baseUrl + path
		})
	}
	res.redirWithHostName = function(path) {
		req.redirect(res.getPathWithHostName(path))
	}
	next();
}