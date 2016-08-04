'use strict';
var wapi = require('../bootstrap/wechat-api');
var notifyAdminWhenSign = '有新的报修单，请立即处理！';
var notifyCreatorWhenSign = '订单提交成功，工作人员会迅速联系您，请耐心等待！';

module.exports = {
    notify_sign(openid, url, orderId, target){
        var templateId = 'j4j18Eq7T5pWNe6n28jmDGe4GUzuZfRM7Lsmcemrrxk';
        var data = {
            "first": {
                "value": target == 'admin' ? notifyAdminWhenSign : notifyCreatorWhenSign,
                "color": "#ff0000"
            },
            "name": {
                "value": "报修单",
                "color": "#173177"
            },
            "expDate": {
                "value": "（截止时间）",
                "color": "#173177"
            },
            "remark": {
                "value": "测试而已！订单号:" + orderId,
                "color": "#ff00ff"
            }
        };
        return new Promise(function (resolve) {
            wapi.sendTemplate(openid, templateId, url, data, function (err, result) {
                console.log(err)
                resolve();
            });
        })
    },
    notify_quotation(openid, url, orderId){
        var templateId = 'j4j18Eq7T5pWNe6n28jmDGe4GUzuZfRM7Lsmcemrrxk';
        var data = {
            "first": {
                "value": '修理厂已对您的订单报价',
                "color": "#ff0000"
            },
            "name": {
                "value": "",
                "color": "#173177"
            },
            "expDate": {
                "value": "",
                "color": "#173177"
            },
            "remark": {
                "value": "点击查看订单详情，订单号" + orderId,
                "color": "#ff00ff"
            }
        };
        return new Promise(function (resolve) {
            wapi.sendTemplate(openid, templateId, url, data, function (err, result) {
                resolve();
            });
        })
    },
    notify_confirm(openid, url, orderId){
        var templateId = 'j4j18Eq7T5pWNe6n28jmDGe4GUzuZfRM7Lsmcemrrxk';
        var data = {
            "first": {
                "value": '客户已确认下单，请尽快处理',
                "color": "#ff0000"
            },
            "name": {
                "value": "",
                "color": "#173177"
            },
            "expDate": {
                "value": "",
                "color": "#173177"
            },
            "remark": {
                "value": "点击查看订单详情，订单号" + orderId,
                "color": "#ff00ff"
            }
        };
        return new Promise(function (resolve) {
            wapi.sendTemplate(openid, templateId, url, data, function (err, result) {
                resolve();
            });
        })
    }
}