'use strict';
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Order = AV.Object.extend('Order');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
  if(req.currentUser) {
    var query = new AV.Query(Order);
    query.descending('createdAt');
    query.find().then(results => {
      res.send(results)
    }).catch(next);
  }else{
    res.loginAndRedirectBack();
  }
});

// 新增 Todo 项目
router.post('/', function(req, res, next) {
  if(req.currentUser) {
    var order = new Order();
    var data = {};
    data.type = parseInt(req.body.type);
    data.status = parseInt(req.body.status);
    data.desc = req.body.desc;
    data.images = typeof req.body['images[]'] === 'string' ? new Array(req.body['images[]']) : req.body['images[]'];
    data.thumbnails = typeof req.body['thumbnails[]'] === 'string' ? new Array(req.body['thumbnails[]']) : req.body['thumbnails[]'];
    data.createdBy = req.currentUser;

    //权限控制
    var appAdminRole = new AV.Role("appAdmin");
    var acl = new AV.ACL();
    acl.setRoleReadAccess(appAdminRole, true);
    acl.setReadAccess(req.currentUser, true);
    acl.setRoleWriteAccess(appAdminRole,true);
    acl.setWriteAccess(req.currentUser, true);
    order.setACL(acl);

    //保存
    order.save(data).then(function(result){
      res.send({
        success: true,
        data: result
      });
    }).catch(function(err){
      res.send(err);
    });
  }else{
    res.loginAndRedirectBack();
  }
});

module.exports = router;
