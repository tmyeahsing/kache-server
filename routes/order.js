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
  console.log(req.params)
  /*var filePromises = [];
  var self = this;
  this.$refs.uploader.uploadFiles.forEach(function (ele, i) {
    filePromises.push((new AV.File('order', ele.file).save()));
  });
  Promise.all(filePromises).then(function (savedFiles) {
    savedFiles.map(function(ele){
      return ele.attributes.url;
    })
    orderObject.save({
      desc: self.typeMap[self.type],
      images:savedFiles,
      type: 1,
      status: 0
    }).then(function(order){
      console.log(order);
    })
  });*/
});

module.exports = router;
