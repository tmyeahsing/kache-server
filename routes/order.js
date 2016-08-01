'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var parseArray = require('../utils/parse-body-array');
var request = require('request')

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Order = AV.Object.extend('Order');
var Quotation = AV.Object.extend('Quotation');

// 查询 Order 列表
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

//查询

// 根据状态码查询订单计数
router.get('/count', function(req, res, next) {
  var statusArray = req.query.status;
  var oPromises = [];
  statusArray.forEach(function (ele, i) {
    var query = new AV.Query('Order');
    query.equalTo('status', parseInt(ele));
    oPromises.push(query.count());
  });
  Promise.all(oPromises).then(function (results) {
    var ret = {};
    results.forEach(function (ele, i) {
      ret[statusArray[i]] = ele;
    });
    res.send({
      success: true,
      data: ret
    });
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

// 新增 Order
router.post('/', function(req, res, next) {
  if(req.currentUser) {
    var order = new Order();
    var data = {};
    data.type = 0;
    data.status = 0;
    data.desc = req.body.desc;
    data.images = typeof req.body['images[]'] === 'string' ? new Array(req.body['images[]']) : req.body['images[]'];
    data.thumbnails = typeof req.body['thumbnails[]'] === 'string' ? new Array(req.body['thumbnails[]']) : req.body['thumbnails[]'];
    data.createdBy = req.currentUser;
    data.orderId = '' + (+new Date())

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
      var adminNotifyP = new Promise(function(resolve){
        request.post({
          url: req.protocol + '://' + req.hostname + '/api/wechat_template/notify_sign',
          form: {
            target: 'admin',
            openid: 'oKGD_vnz-JnTTBKbxj6aolZ0IFGc',
            orderId: data.orderId,
            url: req.protocol + '://' + req.hostname + '/order_detail_admin.html?id=' +　result.id
          }
        }, function(){
          resolve();
        })
      });
      var adminNotifyP1 = new Promise(function(resolve){
        request.post({
          url: req.protocol + '://' + req.hostname + '/api/wechat_template/notify_sign',
          form: {
            target: 'admin',
            openid: 'oKGD_vsUGIsc0BEoPYj-eCqeglZM',
            orderId: data.orderId,
            url: req.protocol + '://' + req.hostname + '/order_detail_admin.html?id=' +　result.id
          }
        }, function(){
          resolve();
        })
      });
      var creatorNotyfyP = new Promise(function(resolve){
        req.currentUser.fetch().then(function(user){
          request.post({
            url: req.protocol + '://' + req.hostname + '/api/wechat_template/notify_sign',
            form: {
              target: 'creator',
              openid: user.get('info').weixin.openid,
              orderId: data.orderId,
              url: req.protocol + '://' + req.hostname + '/order_detail.html?id=' +　result.id
            }
          }, function(){
            resolve();
          })
        }).catch(function(){
          resolve();
        });
      });

      Promise.all([adminNotifyP, adminNotifyP1, creatorNotyfyP]).then(function(){
        res.send({
          success: true,
          data: result
        });
      })
    }).catch(function(err){
      res.send(err);
    });
  }else{
    res.loginAndRedirectBack();
  }
});

//接单（附报价）
router.put('/take', function (req, res, next) {
  var orderObjectId = req.body.order_object_id;
  var order = AV.Object.createWithoutData('Order', orderObjectId);
  var roleQuery = new AV.Query(AV.Role);
  roleQuery.equalTo('users', req.currentUser);
  Promise.all([order.fetch(), AV.Cloud.getServerDate()], roleQuery.find()).then(function(results){
    console.log(results[2])
    if(results[0].get('status') != 0){
      throw {message: '发生错误，订单已被处理'};
    }
    if((new Date(results[0].get('createdAt')) - new Date(results[1])) > 30 * 60 * 1000){
      throw {message: '订单已超时'};
    }

    var data = {};
    var quotation = new Quotation();
    data.dropInFee = parseFloat(req.body.drop_in_fee);
    data.manHours = parseFloat(req.body.man_hours);
    data.manUnitPrice = parseFloat(req.body.man_unit_price);
    data.partsTotal = parseFloat(req.body.parts_total);
    data.partsDesc = req.body.parts_desc;

    quotation.save(data).then(function(qt){
      order.set('quotation', qt);
      order.set('status', 1);
      order.save().then(function(result){
        res.send({
          success: true,
          data: result
        });
      }).catch(function (err) {
        res.status(502).send(err);
      });
    }).catch(function (err) {
      res.status(502).send(err);
    });
  }).catch(function(err){
    res.status(502).send(err);
  })
})

module.exports = router;
