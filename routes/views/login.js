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
        var setSession = function (req, account, cookie) {
            req.session.cookieme = (req.cookies.cme_tmp + ';uniqueVisitorId=' + uuidv4());
            req.session.userme = cookie;
            req.session.account = account;
            req.session.save();
            res.clearCookie('cme_tmp');
            req.flash('success', '登录成功');
            return res.redirect('learn');
        };

        if (req.cookies.cme_tmp) {
            request({
                url: middleware.Url.LOGIN_URL,
                method: 'POST',
                jar: jar,
                headers: {
                    'Cookie': req.cookies.cme_tmp
                },
                json: true,
                form: {
                    userName: req.body.user,
                    userPwd: req.body.password,
                    weixinId: null,
                    code: req.body.validateCode,
                    isBind: true,
                }
            }, function (error, response, body) {
                if (body && body.Success && body.Data) {
                    if (req.user) {
                        return setSession(req, null, body.Data);
                    } else {
                        Account.model.findOne({ name: userNameRegExp }).exec(function (err, account) {
                            if (account) {
                                req.session.regenerate(setSession(req, account, body.Data));
                            } else {
                                req.flash('error', '您尚未注册到本系统');
                                next();
                            }
                        });
                    }
                } else {
                    req.flash('error', body.Message || '登录失败');
                    next();
                }
            });
        } else {
            req.flash('error', body.Message || '验证码异常，请刷新页面');
            next();
        }
    });

    view.on('get', function (next) {
        request({
            url: middleware.Url.GET_VALIDATE_CODE_URL,
            method: 'GET',
            jar: jar
        }, function (error, response, body) {
            // remove keystone.js account
            req.session.userme = req.session.account = req.cookieme = null;
            res.clearCookie('keystone.uid');
            res.clearCookie('cme');
            // and set the tmp cookie for cme
            res.cookie('cme_tmp', jar.getCookieString(middleware.Url.GET_VALIDATE_CODE_URL));

            next();
        });
    });

    view.render('login');
};
