module.exports = function(req, res, next){
    "use strict";
    if(req.SessionToken){
        console.log(req.SessionToken)
    }else{
        res.redirect('/api/wechat/login');
    }
}
