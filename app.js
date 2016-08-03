'use strict';
var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var AV = require('leanengine');
var fs = require('fs');
var routes = fs.readdirSync('./routes');
var app = express();
var nunjucks = require('nunjucks');
// 服务端需要使用 connect-busboy（通过 npm install 安装）
var busboy = require('connect-busboy');

var request = require('request'); // 用于本地环境反代到vue项目

// 设置模板引擎
nunjucks.configure('templates', {
  autoescape: true,
  express: app
});
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'html');
// 加载云函数定义
require('./cloud');

// 加载 cookieSession 以支持 AV.User 的会话状态， 缓存30天
app.use(AV.Cloud.CookieSession({ secret: 'dakache', fetchUser: false, maxAge: 30*24*60*60*1000 }));
app.use(cookieSession({ secret: 'dakache', maxAge: 30*24*60*60*1000 }));
//微信授权
app.use('/*.html', require('./middleware/wx_grant'));

//工具插件
app.use(require('./middleware/util'));

// 加载云引擎中间件
app.use(AV.express());

// 设置静态文件目录
  //将授权信息以js返回
app.get('/static/grant_info.js', require('./middleware/grant_info.js'));

//开发环境静态文件代理
if(!process.env.LEANCLOUD_APP_ENV || process.env.LEANCLOUD_APP_ENV === 'development'){

  /*app.use(function(req, res, next) { // vue 项目反代
    var r = request({
      url: 'http://127.0.0.1:' + (process.env.VUEPORT || 8080) + '/' + req.originalUrl
    })
    r.on('response', response => {
      if(response.statusCode == 404) {
        response.destroy()
        next()
      } else {
        response.pipe(res)
      }
    })
    r.on('error', () => {
      next()
    })
    req.pipe(r)
  })*/
  app.use('/static', express.static('../kache/dist/static'));
  app.use(express.static('../kache/dist/views'));
}else{
  app.use('/static', express.static('static'));
  app.use(express.static('views'));
}

// 设置默认超时时间
app.use(timeout('15s'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//用busboy上传文件
app.use('/api/upload/', busboy());

app.get('/', function(req, res) {
  res.redirect('/fast_sign.html');
});

// 可以将一类的路由单独保存在一个文件中
routes.forEach(function(ele, i){
  app.use('/api/' + ele.replace(/\.[^\.]+$/, ''), require('./routes/' + ele));
});

app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) { // jshint ignore:line
  var statusCode = err.status || 500;
  if(statusCode === 500) {
    console.error(err.stack || err);
  }
  if(req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {}
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});

module.exports = app;
