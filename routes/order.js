'use strict';
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Order = AV.Object.extend('Order');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
  var query = new AV.Query(Order);
  query.descending('createdAt');
  query.find().then(results => {
    res.send(results)
  }).catch(next);
});

// 新增 Todo 项目
router.post('/', function(req, res, next) {
  var order = new Order();
  var data = {};
  data.type = parseInt(req.body.type);
  data.status = parseInt(req.body.status);
  data.desc = req.body.desc;
  data.images = typeof req.body['images[]'] === 'string' ? new Array(req.body['images[]']) : req.body['images[]'];
  data.thumbnails = typeof req.body['thumbnails[]'] === 'string' ? new Array(req.body['thumbnails[]']) : req.body['thumbnails[]'];
  order.save(data).then(function(result){
    res.send({
      success: true,
      data: result
    });
  }).catch(err => res.send(err));
});

module.exports = router;
