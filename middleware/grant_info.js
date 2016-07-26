module.exports = function(req, res, next){
    "use strict";
    if(req.currentUser){
        var content = [
            "SessionToken = '",
            req.sessionToken,
            "';AppId = '",
            process.env.LEANCLOUD_APP_ID,
            "';AppKey = '",
            process.env.LEANCLOUD_APP_MASTER_KEY,
            "'"
        ].join('');
        res.set('Content-Type', 'text/script');
        res.send(content);
    }else{
        res.status(500).send({ error: 'Î´µÇÂ¼' });
    }
}