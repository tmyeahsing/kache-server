var AV = require('leanengine')
module.exports = function(req, res, next){
    "use strict";
    console.log(req.sessionToken)
    if(req.currentUser){
        next();
    }else{
        res.redirect('/api/wechat/login');
    }
}
