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
                    res.status(500).send('alert("δ�ܻ�ȡ��΢����֤Ʊ�ݣ����ؽ����ں�")');
                }
            })
        });

    }else{
        res.status(500).send('alert("δ��¼,���ؽ����ںŵ�¼")');
    }
}