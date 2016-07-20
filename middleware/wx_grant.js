module.exports = function(req, res, next){
    "use strict";
    if(req.sessionToken){
        next();
    }else{
        res.redirect('/api/wechat/login');
    }
}
