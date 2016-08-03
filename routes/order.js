'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var request = require('request');
var notice = require('../service/wechat_notice');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Order = AV.Object.extend('Order');
var Quotation = AV.Object.extend('Quotation');

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
          value  => P.resolve(callback()).then(() => value),
          reason => P.resolve(callback()).then(() => { throw reason })
  );
};

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
      var url = req.protocol + '://' + req.hostname + '/order_detail.html?id=' +　result.id;
      var url_a = req.protocol + '://' + req.hostname + '/order_detail_admin.html?id=' +　result.id;

      var adminNotifyP = notice.notify_sign('oKGD_vnz-JnTTBKbxj6aolZ0IFGc', url_a, data.orderId, 'admin');
      var adminNotifyP1 = notice.notify_sign('oKGD_vsUGIsc0BEoPYj-eCqeglZM', url_a, data.orderId, 'admin');
      var creatorNotifyP = req.currentUser.fetch().then(function(user){
        return notice.notify_sign(user.get('info').weixin.openid, url, data.orderId, 'creator')
      }).catch();

      Promise.all([adminNotifyP, adminNotifyP1, creatorNotifyP]).finally(function(){
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
  Promise.all([order.fetch(), roleQuery.find()]).then(function(results){
    var roles = results[1].map(function(ele, i){
      return ele.get('name')
    })

    if(roles.indexOf('appAdmin') == -1){
      throw {message: '您无权报价'};
    }
    if(results[0].get('status') != 0){
      throw {message: '发生错误，订单已被处理'};
    }
    if((new Date(results[0].get('createdAt')) - new Date()) > 30 * 60 * 1000){
      throw {message: '订单已超时'};
    }

    var data = {};
    var quotation = new Quotation();
    data.dropInFee = parseFloat(req.body.drop_in_fee) || 0;
    data.manHours = parseFloat(req.body.man_hours) || 0;
    data.manUnitPrice = parseFloat(req.body.man_unit_price) || 0;
    data.partsTotal = parseFloat(req.body.parts_total) || 0;
    data.partsDesc = req.body.parts_desc;

    quotation.save(data).then(function(qt){
      order.set('quotation', qt);
      order.save().then(function(result){
        //通知报修人
        result.get('createdBy').fetch().then(function(creator){
          var url = req.protocol + '://' + req.hostname + '/order_detail.html?id=' +　result.id;
          return notice.notify_quotation(creator.get('info').weixin.openid, url, result.get('orderId'));
        }).finally(function(){
          res.send({
            success: true,
            data: {
              order: result,
              quotation: qt
            }
          });
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
});

//报修人确认下单
router.put('/confirm', function (req, res, next) {
  var orderObjectId = req.body.order_object_id;
  var orderData = AV.Object.createWithoutData('Order', orderObjectId);
  orderData.fetch().then(function(order){
    if(order.get('status') != 0){
      throw {message: '发生错误，订单已被处理'}
    }
    if(!order.get('quotation')){
      throw {message: '发生错误，未对订单报价'}
    }

    orderData.set('status', 1);
    orderData.save().then(function(order){
      var url =  req.protocol + '://' + req.hostname + '/order_detail_admin.html?id=' +　order.id;
      var p1 = notice.notify_confirm('oKGD_vnz-JnTTBKbxj6aolZ0IFGc', url, order.get('orderId'));
      var p2 = notice.notify_confirm('oKGD_vsUGIsc0BEoPYj-eCqeglZM', url, order.get('orderId'));
      Promise.all([p1, p2]).finally(function(){
        res.send({
          success: true,
          data: order
        })
      })
    }).catch(function(err){
      res.status(502).send(err);
    })
  })
})

module.exports = router;
