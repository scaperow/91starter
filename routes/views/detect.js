var keystone = require('keystone');
var request = require('request');
var middleware = require('../middleware');
var jar = request.jar();
var _ = require('lodash');
var uuidv4 = require('uuid/v4');
var utils = require('keystone-utils');
var async = require('async');
var crypto = require('crypto');
var Account = keystone.list('Account');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    var generatorCookie = function () {
        return req.session.cookieasp + ";" + req.session.cookieapp;
    };

    locals.validationErrors = {};
    locals.formData = req.body || {};
    locals.section = 'learn';
    locals.messages = { success: [], info: [], error: [] };

    view.on('post', function (next) {
        var userNameRegExp = new RegExp('^' + utils.escapeRegExp(req.body.user) + '$', 'i');

        var requestTokenUrl = function (callback) {
            request({
                url: 'http://zshy.91huayi.com/Project/GoProject',
                method: 'POST',
                form: {
                    id: "7b163987-de4e-4bae-a054-2b12c8bf0d84"
                },
                headers: {
                    'Cookie': generatorCookie()
                },
                jar: jar
            }, function (error, response, body) {
                var responseBody = JSON.parse(body);
                if (responseBody && responseBody.error === 0) {
                    var cookieasp = jar.getCookieString('http://zshy.91huayi.com/Project/GoProject');
                    req.session.cookieasp = cookieasp;
                    req.session.save();

                    callback(null, responseBody.url);
                } else {
                    callback('发生了一点错误，请重新登录');
                }
            });
        };


        var directTokenUrl = function (tokenUrl, callback) {
            request({
                url: tokenUrl,
                method: 'GET',
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate",
                    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Host": "app.kjpt.91huayi.com",
                    "Proxy-Connection": "keep-alive",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36"
                },
                jar: jar
            }, function (error, response, body) {
                var cookieapp = jar.getCookieString(tokenUrl);
                req.session.cookieapp = cookieapp;
                req.session.save();

                callback(null, tokenUrl);
            });
        }

        var loginToApp = function (tokenUrl, callback) {
            var loginUrl = "http://app.kjpt.91huayi.com/handler/appuserlogin.ashx?para=" + tokenUrl.split('?para=')[1];
            request({
                url: loginUrl,
                method: 'GET',
                headers: {
                    'Cookie': generatorCookie()
                },
                jar: jar
            }, function (error, response, body) {
                var cookieapp = jar.getCookieString(tokenUrl);
                req.session.cookieapp = cookieapp;
                req.session.save();

                callback();
            });
        }

        /*
        request({
            url: 'http://zshy.91huayi.com/Project/GoProject',
            method: 'POST',
            form: {
                id: "7b163987-de4e-4bae-a054-2b12c8bf0d84"
            },
            headers: {
                'Cookie': generatorCookie()
            },
            jar: jar
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (responseBody && responseBody.error === 0) {
                var tokenUrl = responseBody.url;
                request({
                    url: tokenUrl,
                    method: 'GET',
                    jar: jar
                }, function (error, response, body) {
                    request({
                        url: 'http://app.kjpt.91huayi.com/GetAppId.aspx',
                        method: 'GET',
                        headers: {
                            'Cookie': req.session.cookieasp + ";" + jar.getCookieString('http://app.kjpt.91huayi.com/GetAppId.aspx')
                        },
                        jar: jar
                    }, function (error, response, body) {
                        req.session.cookieapp = jar.getCookieString(tokenUrl);
                        req.session.save();
                        req.flash('success', '登录成功');
                    });


                    return res.redirect('detect-result');
                });
            } else {
                req.flash('error', '发生了一点错误，请重新登录');
                return res.redirect('detect');
            }
        });
        */


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
                var cookieasp = jar.getCookieString('http://zshy.91huayi.com/Account/Login');
                req.session.cookieasp = cookieasp;
                req.session.save();

                async.waterfall([requestTokenUrl, directTokenUrl, loginToApp], function (error, results) {
                    if (error) {
                        req.flash('error', error.message || '发生了一点错误');
                        next();
                    } else {
                        req.flash('success', '登录成功');
                        return res.redirect('detect-result');
                    }
                });
            }
        }, 'json');
    });


    view.on('get', function (next) {
        req.session.cookieasp = req.session.cookieapp = null;
        next();
    });

    view.render('detect', {
        title: '华医网账号检测系统'
    });
};