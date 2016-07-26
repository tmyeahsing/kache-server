'use strict';
var router = require('express').Router();
var AV = require('leanengine');

// 上传文件
router.post('/', function (req, res, next) {
    var base64data = [];
    if (req.busboy) {
        req.busboy.on('file', function (fieldname, file, fileName, encoding, mimeType) {
            console.log(file)
            var buffer = '';
            file.setEncoding('base64');
            file.on('data', function (data) {
                buffer += data;
                console.log(buffer.length)
            }).on('end', function () {
                base64data.push({
                    data: buffer,
                    name: fileName
                });
            });
        }).on('finish', function () {
            var fPromises = [];
            console.log(base64data.length)
            base64data.forEach(function (ele, i) {
                var f = new AV.File(base64data[i].name, {
                    base64: base64data[i].data
                });
                fPromises.push(f.save());
            });
            Promise.all(fPromises).then(function (fileObjs) {
                var ret = [];
                fileObjs.forEach(function (ele, i) {
                    ret.push({
                        fileId: ele.id,
                        fileName: ele.name(),
                        mimeType: ele.metaData().mime_type,
                        fileUrl: ele.url(),
                        filethumbnailUrl: ele.thumbnailURL(120, 120)
                    });
                });
                res.send({
                    success: true,
                    data: ret
                });
            }).catch(function (err) {
                console.log('uploadFile - ' + err);
                res.status(502);
            });
        });
        req.pipe(req.busboy);
    } else {
        console.log('uploadFile - busboy undefined.');
        res.status(502);
    }
});

module.exports = router;
