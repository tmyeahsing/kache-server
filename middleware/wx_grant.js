var AV = require('leanengine')
module.exports = function(req, res, next){
    "use strict";
    if(req.currentUser){
        next();
    }else{
        res.redirect('/api/wechat/login');
    }
}
