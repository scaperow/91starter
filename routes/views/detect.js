var keystone = require('keystone');
var request = require('request');
var middleware = require('../middleware');
var jar = request.jar();
var _ = require('lodash');
var uuidv4 = require('uuid/v4');
var utils = require('keystone-utils');
var crypto = require('crypto');
var Account = keystone.list('Account');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.validationErrors = {};
    locals.formData = req.body || {};
    locals.section = 'learn';
    locals.messages = { success: [], info: [], error: [] };

    view.on('post', function (next) {
        var userNameRegExp = new RegExp('^' + utils.escapeRegExp(req.body.user) + '$', 'i');
        var setSession = function (req, cookie) {
            var cookieasp = jar.getCookieString('http://zshy.91huayi.com/Account/Login');
            req.session.cookieasp = cookieasp;

            // 要进行检测，需要先访问下 app 应用页面来获取 sessionID，不让后面的接口会鉴权失败
            request({
                url: 'http://app.kjpt.91huayi.com/GetAppId.aspx',
                method: 'POST',
                headers: {
                    'Cookie': req.session.cookieasp
                },
                jar: jar
            }, function (error, response, body) {
                req.session.cookieapp = jar.getCookieString('http://app.kjpt.91huayi.com/GetAppId.aspx');
                req.session.save();
                req.flash('success', '登录成功');

                return res.redirect('detect-result');
            });
        };

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
                return setSession(req, body.Data);
            }
        },'json');
    });


    view.on('get', function (next) {
        req.session.cookieasp = null;
        res.clearCookie('.ASPXAUTH');
        next();
    });

    view.render('detect', {
        title: '华医网账号检测系统'
    });
};