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
            return res.render('detect-result');
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
                    return setSession(req, null, body.Data);
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
    
    view.render('detect-result', {
        title: '华医网账号检测系统'
    });
};