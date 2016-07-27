'use strict';
var config
if(!process.env.LEANCLOUD_APP_ENV || process.env.LEANCLOUD_APP_ENV === 'development'){
    config = {
        appId: 'wxa196eef9e5f0511c',
        appSecret: '7dd22b99478c601a19dc3fdf6bcce955'
    }
}

module.exports =  config;
