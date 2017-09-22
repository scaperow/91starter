var keystone = require('keystone');
var request = require('request');
var middleware = require('../middleware');
var jar = request.jar();
var _ = require('lodash');
var uuidv4 = require('uuid/v4');
var utils = require('keystone-utils');
var crypto = require('crypto');
var GET_VALIDATE_CODE_URL = 'http://cmeapp.91huayi.com/UserInfo/GetCode';
var LOGIN_URL = 'http://cmeapp.91huayi.com/UserInfo/Login';

var Account = keystone.list('Account');

function hash(str) {
    // force type
    str = '' + str;
    // get the first half
    str = str.substr(0, Math.round(str.length / 2));
    // hash using sha256
    return crypto
        .createHmac('sha256', keystone.get('cookie secret'))
        .update(str)
        .digest('base64')
        .replace(/\=+$/, '');
}


exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.validationErrors = {};
    locals.formData = req.body || {};
    locals.section = 'learn';
    locals.messages = { success: [], info: [], error: [] };

    view.on('post', function (next) {
        var userNameRegExp = new RegExp('^' + utils.escapeRegExp(req.body.user) + '$', 'i');

        if (req.cookies.cme_tmp) {
            request({
                url: LOGIN_URL,
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
                    Account.model.findOne({ name: userNameRegExp }).exec(function (err, account) {
                        if (account) {
                            req.session.regenerate(function () {
                                req.session.cookieme = (req.cookies.cme_tmp + ';uniqueVisitorId=' + uuidv4());
                                req.session.userme = body.Data;
                                req.session.account = account;
                                req.session.save();
                                res.clearCookie('cme_tmp');
                                req.flash('success', '登录成功');
                                return res.redirect('learn');
                            });
                        } else {
                            req.flash('error', '您尚未注册到本系统');
                            next();
                        }
                    });
                } else {
                    req.flash('error', body.Message || '登录失败');
                    next();
                }
            });
        } else {
            next();
        }
    });

    view.on('get', function (next) {
        request({
            url: GET_VALIDATE_CODE_URL,
            method: 'GET',
            jar: jar
        }, function (error, response, body) {
            req.session.userme = req.session.account = req.cookieme = null;
            res.clearCookie('keystone.uid');
            res.clearCookie('cme');
            res.cookie('cme_tmp', jar.getCookieString(GET_VALIDATE_CODE_URL));

            next();
        });
    });

    view.render('login');
};