var config = require('../config/wechat_config')
var AV = require('leanengine');
var Cache = AV.Object.extend('Cache');
var api = require('wechat-api');
var wapi = new api(config.appId, config.appSecret, function(cb){
    "use strict";
    var query = new AV.Query(Cache);
    query.equalTo('key', 'wechat_api_token');
    query.find().then(function (results) {
        if(results[0] && results[0].get('value')){
            cb(null, JSON.parse(results[0].get('value')));
        }else{
            cb(null, {"access_token": "ACCESS_TOKEN","expires_in": 7200});
        }
    }).catch(function(err){
        return cb(err);
    })
}, function(token, cb){
    "use strict";
    var cache = AV.Object.createWithoutData('Cache', '5798a0e51532bc0060f06240');
    cache.set('value', JSON.stringify(token));
    cache.save().then(cb);
});
module.exports = wapi;
