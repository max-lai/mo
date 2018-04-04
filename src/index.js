#!/usr/bin/env node
/**
 * Created by laiyq@txtws.com on 2017/6/3.
 */

var fs = require("fs");
var path = require("path");
var express = require('express');
var app = express();
//全局暴露数据构造器
global.gener = require('./gener');
//命令参数
var argv = require('minimist')(process.argv.slice(2));

//服务端口号
var __port = argv['port'] || 8000;


var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
//parse multipart/form-data
var upload = require('multer')();
app.use(upload.array());

app.all('/*', function (req, res) {
    var url = req.url.split('?')[0];

    //读取数据响应map
    var i = 0;
    var filePathTail = url.replace(/\//g, function () {
        return ++i > 2 ? "-" : "/";
    });
    var filePath = path.join(process.cwd(), '.' + filePathTail + '.js');

    res.setHeader('Access-Control-Allow-Origin', req.headers['origin'] || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept,Token');
    if(req.method.toLowerCase() == 'options') {
        res.end();
    }

    //判断文件是否存在
    if (!fs.existsSync(filePath)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html;charset=UTF-8');
        res.send(fs.readFileSync(path.join(__dirname, 'readme.html'), 'utf-8'));
        return;
    }

    //加载入口文件
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');
    require(filePath)(res, req);
});

if (argv['https'] === undefined) {
    //http
    app.listen(__port, function () {
        console.log('HTTP Server is running at: http://127.0.0.1:%s', __port);
    });
    //打开链接
    require('child_process').exec('start ' + "http://127.0.0.1:" + __port);
} else {
    //https
    var httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, './keys/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, './keys/cert.pem'))
    };
    var https = require('https');
    var httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(__port, function () {
        console.log('HTTPS Server is running at: https://127.0.0.1:%s', __port);
    });
}

//允许资源热加载
// 热加载支持
var __fileModifyTimeIndex = {};
//根据文件的修改时间进行缓存清理
function cleanCache(modulePath) {
    var module = require.cache[modulePath];
    var needClean = false;
    if (module) {
        var modifyTime = fs.statSync(modulePath)['mtime'].getTime();
        //判断当前模块是否有更新-有则清除缓存
        if (!__fileModifyTimeIndex[modulePath] || modifyTime > __fileModifyTimeIndex[modulePath]) {
            __fileModifyTimeIndex[modulePath] = modifyTime;
            needClean = true;
        }
        //子节点是否有更新
        for (var i = 0; i < module.children.length; i++) {
            if (cleanCache(module.children[i]['filename'])) {
                needClean = true;
            }
        }
        if (needClean) {
            //父节点及其子节点也要清理，否则再次加载时children为空（nodejs bug,maybe）
            for (var i = 0; i < module.children.length; i++) {
                if (require.cache[module.children[i]['filename']]) {
                    delete require.cache[module.children[i]['filename']];
                }
            }
            delete require.cache[modulePath];
            if (module.parent) {
                module.parent.children.splice(module.parent.children.indexOf(module), 1);
            }
        }
    } else if (!__fileModifyTimeIndex[modulePath]) {
        __fileModifyTimeIndex[modulePath] = fs.statSync(modulePath)['mtime'].getTime();
    }
    return needClean;
};
//require函数重载
var requireOrigin = require;
require = function (moduleId) {
    var modulePath = require.resolve(moduleId);
    cleanCache(modulePath);
    var _export = requireOrigin.apply(this, arguments);
    return _export;
};
for (var i in requireOrigin) {
    require[i] = requireOrigin[i];
}