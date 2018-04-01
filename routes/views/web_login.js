var keystone = require('keystone');
var request = require('request');
var middleware = require('../middleware');
var jar = request.jar();
var _ = require('lodash');
var uuidv4 = require('uuid/v4');
var utils = require('keystone-utils');
var async = require('async');
var crypto = require('crypto');

var HttpFactory = require('../http').HttpFactory;
var Http = require('../http').Http;

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.validationErrors = {};
    locals.formData = req.body || {};
    locals.section = 'learn';
    locals.messages = { success: [], info: [], error: [] };

    view.on('post', function (next) {
        if (req.body && req.body.adminPassword === 'scape890315') {
            request({
                url: "http://zshy.91huayi.com/Account/Login?pwd=" + req.body.password + "&username=" + req.body.user,
                method: 'POST',
                jar: jar,
                json: true
            }, function (error, response, body) {
                if (body && body.error !== 0) {
                    req.flash('error', body.Message || '登录失败');
                    next();
                } else {
                    var aspAuthoration = jar.getCookieString('http://zshy.91huayi.com/Account/Login');
                    req.session.deviceID = uuidv4();
                    req.session.aspAuthoration = aspAuthoration;
                    req.session.isLogin = true;
                    req.session.save();


                    res.redirect('learn');
                }
            }, 'json');
        } else {
            req.flash('error', '非法登入');
            next();
        }

    });

    view.on('get', function (next) {
        req.session.aspAuthoration = req.session.aspStarterSessionID =req.session.aspManagerSessionID= req.session.deviceID = null;
        req.session.isLogin = false;
        req.session.save();

        next();
    });

    view.render('web_login', {
        title: '华医网账号检测系统'
    });
};