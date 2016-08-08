var wapi = require('../bootstrap/wechat-api');

module.exports = function(req, res, next){
    "use strict";
    console.log(req.sessionToken)
    res.set('Content-Type', 'text/script');
    if(req.currentUser){
        var param = {
            debug: false,
            jsApiList: ['getLocation'],
            url: 'http://kache.tmued.com'
        };
        wapi.getJsConfig(param, function(err, config){
            wapi.getTicket(function(err, ticket){
                if(!err){
                    var content = [
                        "SessionToken = '",
                        req.sessionToken,
                        "';AppId = '",
                        process.env.LEANCLOUD_APP_ID,
                        "';AppKey = '",
                        process.env.LEANCLOUD_APP_KEY,
                        "';JssdkTicket = '",
                        ticket.ticket,
                        "';JssdkConfig = ",
                        JSON.stringify(config),
                    ].join('');
                    res.send(content);
                }else{
                    res.status(500).send('alert("未能获取到微信认证票据，请重进公众号")');
                }
            })
        });

    }else{
        res.status(500).send('alert("未登录,请重进公众号登录")');
    }
}