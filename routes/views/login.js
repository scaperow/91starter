var keystone = require('keystone');
var request = require('request');
var middleware = require('../middleware');
var jar = request.jar();

var GET_VALIDATE_CODE_URL = 'http://cmeapp.91huayi.com/UserInfo/GetCode';
var LOGIN_URL = 'http://cmeapp.91huayi.com/UserInfo/Login';



exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.validationErrors = {};
    locals.formData = req.body || {};
    locals.section = 'learn';
    locals.messages = { success: [], info: [], error: [] };

    view.on('post', function (next) {
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
                    req.flash('success', '登录成功');
                    res.cookie('cme', req.cookies.cme_tmp);
                    res.clearCookie('cme_tmp');
                    res.redirect('learn');
                } else {
                    req.flash('error', body.Message || '登录失败');
                }

                next();
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
            res.clearCookie('cme');
            res.cookie('cme_tmp', jar.getCookieString(GET_VALIDATE_CODE_URL));

            next();
        });
    });


    view.render('login');
};