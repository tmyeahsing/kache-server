var config = require('../config/wechat_config')
var AV = require('leanengine');
var Cache = AV.Object.extend('Cache');
var api = require('wechat-api');
var wapi = global.wapi = new api(config.appId, config.appSecret, function(cb){
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
    cache.save().then(function(result){
        cb(null, result);
    }).catch(function(err){
        cb(err)
    });
});

wapi.registerTicketHandle(getTicketToken, saveTicketToken);

// getTicketToken
function getTicketToken(type, cb) {
    "use strict";
    var query = new AV.Query(Cache);
    query.equalTo('key', 'wechat_jssdk_ticket');
    query.find().then(function (results) {
        if(results[0] && results[0].get('value')){
            cb(null, results[0].get('value'));
        }else{
            cb(null, '');
        }
    }).catch(function(err){
        return cb(err);
    })
}
// saveTicketToken
function saveTicketToken(type, token, cb) {
    "use strict";
    var cache = AV.Object.createWithoutData('Cache', '57a86d911532bc0060d73762');
    cache.set('value', token.ticket);
    cache.save().then(function(result){
        cb(null);
    }).catch(function(err){
        return cb(err);
    });
}

module.exports = wapi;
