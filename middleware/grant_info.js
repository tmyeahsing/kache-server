var wapi = require('../bootstrap/wechat-api');

module.exports = function(req, res, next){
    "use strict";
    console.log(req.sessionToken)
    res.set('Content-Type', 'text/script');
    if(req.currentUser) {
        var content = [
            "SessionToken = '",
            req.sessionToken,
            "';AppId = '",
            process.env.LEANCLOUD_APP_ID,
            "';AppKey = '",
            process.env.LEANCLOUD_APP_KEY,
            "'",
        ].join('');
        res.send(content);
    }else{
        res.status(500).send('alert("Î´µÇÂ¼,ÇëÖØ½ø¹«ÖÚºÅµÇÂ¼")');
    }
}